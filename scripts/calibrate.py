#!/usr/bin/env python3
"""
Calibrates the raw lot coordinates (extracted from the AutoCAD PDF plano)
to real-world GPS and writes src/lots.ts.

The raw extraction turned out to be a faithful (affine) copy of the plano
geometry, so a single affine transform (rotation + scale + shear + translation)
maps raw -> real-world GPS with a few metres of error. We fit that affine
*robustly*: several of the hand-entered control points are bad (typo / wrong
lot), so a RANSAC pass finds the largest self-consistent subset and ignores the
outliers instead of letting them warp the whole map (which is what the old
Thin-Plate-Spline did).

Because the plano image is georeferenced from the same KMZ, lots calibrated this
way also fall exactly on the plano overlay.

Run:  python3 scripts/calibrate.py
"""
import itertools
import json
import math
import os
from collections import defaultdict

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# ── Ground-truth control points: (raw_lat, raw_lng) -> (real_lat, real_lng) ──
# raw  = coordinate as extracted from the plano PDF (uncalibrated)
# real = GPS confirmed in the field (Silicon Access app / manual lookup)
# Some of these are unreliable; the RANSAC fit below decides which to trust.
CONTROL = [
    ((-34.40039,  -58.639886), (-34.3990729, -58.6390500), "Mz22 L1"),
    ((-34.392942, -58.641393), (-34.3877679, -58.6295901), "Mz4  L1"),
    ((-34.397949, -58.650096), (-34.3954515, -58.6269717), "Mz37 L1"),
    ((-34.397344, -58.642955), (-34.3959379, -58.6319985), "Mz13 L1"),
    ((-34.396182, -58.646926), (-34.393954,  -58.627247 ), "Mz1  L7"),
    ((-34.396819, -58.645013), (-34.393854,  -58.630177 ), "Mz29 L1"),
    ((-34.397072, -58.647924), (-34.391290,  -58.629848 ), "Mz35 L1"),
    ((-34.399495, -58.641581), (-34.396509,  -58.636147 ), "Mz23 L7"),
    ((-34.396679, -58.644772), (-34.394203,  -58.630036 ), "Mz10 L1"),
    ((-34.398435, -58.647666), (-34.390115,  -58.631744 ), "Mz34 L10"),
    ((-34.397671, -58.648589), (-34.389520,  -58.629974 ), "Mz39 L1"),
    ((-34.395131, -58.642379), (-34.397632,  -58.628633 ), "Mz8  L2"),
    ((-34.399057, -58.639289), (-34.399241,  -58.636479 ), "Mz17 L1"),
    ((-34.397399, -58.639079), (-34.400364,  -58.636720 ), "Mz65 L1"),
]

# Lots not present in the PDF, exact GPS provided manually
MANUAL = {
    (36, 1): (-34.387368, -58.629817),
    (31, 1): (-34.389813, -58.633170),
}

INLIER_TOL_M = 60       # metres — control point counts as consistent below this
MAX_INTERP_DIST = 120   # metres — only interpolate between close lots
MAX_GAP = 12            # max missing lot numbers to fill between two known lots

LAT_M = 111000
LNG_M = 91593


def dist_m(a, b):
    return math.hypot((a["lat"] - b["lat"]) * LAT_M, (a["lng"] - b["lng"]) * LNG_M)


def fit_affine(raw, real, idx):
    """Least-squares affine mapping raw[idx] -> real[idx]. Returns (coef_lat, coef_lng)."""
    X = np.column_stack([raw[idx], np.ones(len(idx))])
    a_lat, *_ = np.linalg.lstsq(X, real[idx, 0], rcond=None)
    a_lng, *_ = np.linalg.lstsq(X, real[idx, 1], rcond=None)
    return a_lat, a_lng


def affine_err_m(a_lat, a_lng, raw, real, i):
    x = np.array([raw[i, 0], raw[i, 1], 1.0])
    return math.hypot((a_lat @ x - real[i, 0]) * LAT_M,
                      (a_lng @ x - real[i, 1]) * LNG_M)


def robust_affine(raw, real, names):
    """RANSAC: find the largest subset of control points that share one affine."""
    n = len(raw)
    best = None
    for combo in itertools.combinations(range(n), 3):
        try:
            a_lat, a_lng = fit_affine(raw, real, list(combo))
        except np.linalg.LinAlgError:
            continue
        inliers = [i for i in range(n)
                   if affine_err_m(a_lat, a_lng, raw, real, i) < INLIER_TOL_M]
        if len(inliers) < 3:
            continue
        # Refit on the inlier set and re-evaluate
        a_lat, a_lng = fit_affine(raw, real, inliers)
        inliers = [i for i in range(n)
                   if affine_err_m(a_lat, a_lng, raw, real, i) < INLIER_TOL_M]
        if best is None or len(inliers) > len(best[0]):
            best = (inliers, a_lat, a_lng)

    inliers, a_lat, a_lng = best
    a_lat, a_lng = fit_affine(raw, real, inliers)  # final fit on full inlier set

    print(f"Robust affine: {len(inliers)}/{n} control points used")
    for i in range(n):
        e = affine_err_m(a_lat, a_lng, raw, real, i)
        tag = "keep " if i in inliers else "DROP "
        print(f"  [{tag}] {names[i]:9s}: {e:6.0f} m")
    return a_lat, a_lng


def main():
    with open(os.path.join(HERE, "lots_raw.json")) as fp:
        raw_lots = json.load(fp)

    raw = np.array([[c[0][0], c[0][1]] for c in CONTROL])
    real = np.array([[c[1][0], c[1][1]] for c in CONTROL])
    names = [c[2] for c in CONTROL]

    a_lat, a_lng = robust_affine(raw, real, names)

    def apply(lat, lng):
        x = np.array([lat, lng, 1.0])
        return float(a_lat @ x), float(a_lng @ x)

    base = []
    for l in raw_lots:
        key = (l["manzana"], l["lote"])
        if key in MANUAL:
            lat, lng = MANUAL[key]
        else:
            lat, lng = apply(l["lat"], l["lng"])
        base.append({"manzana": l["manzana"], "lote": l["lote"],
                     "lat": round(lat, 7), "lng": round(lng, 7)})

    # ── Interpolate missing lots within each manzana ──
    by_mz = defaultdict(list)
    for l in base:
        by_mz[l["manzana"]].append(l)

    out = list(base)
    added = 0
    for mz in sorted(by_mz):
        mz_lots = sorted(by_mz[mz], key=lambda x: x["lote"])
        for i in range(len(mz_lots) - 1):
            a, b = mz_lots[i], mz_lots[i + 1]
            gap = b["lote"] - a["lote"]
            if gap <= 1 or gap > MAX_GAP or dist_m(a, b) > MAX_INTERP_DIST:
                continue
            for k in range(1, gap):
                f = k / gap
                out.append({
                    "manzana": mz, "lote": a["lote"] + k,
                    "lat": round(a["lat"] + f * (b["lat"] - a["lat"]), 7),
                    "lng": round(a["lng"] + f * (b["lng"] - a["lng"]), 7),
                })
                added += 1

    for (mz, lt), (lat, lng) in MANUAL.items():
        if not any(l["manzana"] == mz and l["lote"] == lt for l in out):
            out.append({"manzana": mz, "lote": lt, "lat": lat, "lng": lng})

    seen, final = set(), []
    for l in out:
        k = (l["manzana"], l["lote"])
        if k not in seen:
            seen.add(k)
            final.append(l)
    final.sort(key=lambda x: (x["manzana"], x["lote"]))

    print(f"Base: {len(base)}  +interpolated: {added}  total: {len(final)}")

    ts = (
        "// Auto-generated by scripts/calibrate.py — do not edit by hand.\n"
        "export interface Lot {\n"
        "  manzana: number\n"
        "  lote: number\n"
        "  lat: number\n"
        "  lng: number\n"
        "}\n\n"
        "export const LOTS: Lot[] = " + json.dumps(final, separators=(",", ":")) + "\n"
    )
    with open(os.path.join(ROOT, "src", "lots.ts"), "w") as fp:
        fp.write(ts)
    print("Wrote src/lots.ts")


if __name__ == "__main__":
    main()
