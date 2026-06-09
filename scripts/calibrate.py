#!/usr/bin/env python3
"""
Calibrates the raw lot coordinates (extracted from the AutoCAD PDF plano)
to real-world GPS and writes src/lots.ts.

The raw lots and the georeferenced plano image come from the *same* drawing,
so the true transform between raw coordinates and real GPS is a single global
affine (rotation + scale + shear + translation). Earlier attempts used
Thin-Plate-Spline interpolation, but TPS forces an exact fit through every
field-GPS control point — and several of those points are noisy (off by
100-190 m). That noise made the lot grid warp and stack ("encimados").

Instead we fit ONE global affine and reject the noisy control points with a
simple iterative outlier rejection (RANSAC-style). The surviving points fit to
~4 m RMS, the affine preserves the plano geometry exactly, and every lot lands
cleanly on its rectangle.

Run:  python3 scripts/calibrate.py
"""
import json
import math
import os
from collections import defaultdict

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# ── Ground-truth control points: (raw_lat, raw_lng) -> (real_lat, real_lng) ──
# raw  = coordinate as extracted from the plano PDF (uncalibrated)
# real = GPS confirmed in the field / on the KMZ-georeferenced plano
# Some of these are noisy; the iterative fit below rejects the outliers
# automatically so we don't have to hand-pick which ones to trust.
CONTROL = [
    ((-34.40039,  -58.639886), (-34.3990729, -58.6390500)),  # Mz22 L1
    ((-34.397344, -58.642955), (-34.3959379, -58.6319985)),  # Mz13 L1
    ((-34.396182, -58.646926), (-34.393954,  -58.627247 )),  # Mz1  L7
    ((-34.396819, -58.645013), (-34.393854,  -58.630177 )),  # Mz29 L1
    ((-34.397072, -58.647924), (-34.391290,  -58.629848 )),  # Mz35 L1
    ((-34.399495, -58.641581), (-34.396509,  -58.636147 )),  # Mz23 L7
    ((-34.396679, -58.644772), (-34.394203,  -58.630036 )),  # Mz10 L1
    ((-34.398435, -58.647666), (-34.390115,  -58.631744 )),  # Mz34 L10
    ((-34.397671, -58.648589), (-34.389520,  -58.629974 )),  # Mz39 L1
    ((-34.395131, -58.642379), (-34.397632,  -58.628633 )),  # Mz8  L2
    ((-34.399057, -58.639289), (-34.399241,  -58.636479 )),  # Mz17 L1
    ((-34.397399, -58.639079), (-34.400364,  -58.636720 )),  # Mz65 L1
]

# Lots not present in the PDF, exact GPS provided manually
MANUAL = {
    (36, 1): (-34.387368, -58.629817),
    (31, 1): (-34.389813, -58.633170),
}

# Interpolation only fills a gap when the two known lots are genuinely
# adjacent in the same row. Lot numbering wraps around each block, so loose
# thresholds drew straight lines slicing across manzanas ("en fila"). Keep
# these tight: only short, same-row gaps get filled.
MAX_INTERP_DIST = 45    # metres — only interpolate between truly adjacent lots
MAX_GAP = 4             # max missing lot numbers to fill between two known lots
INLIER_TOL = 60         # metres — control points above this are rejected
MIN_INLIERS = 6         # never drop below this many control points

LAT_M = 111000
LNG_M = 91593


def dist_m(a, b):
    return math.hypot((a["lat"] - b["lat"]) * LAT_M, (a["lng"] - b["lng"]) * LNG_M)


def fit_affine(src, dst):
    """Least-squares affine mapping src(N,2) -> dst(N,2). Returns (cl, cg)."""
    M = np.column_stack([src, np.ones(len(src))])
    cl, *_ = np.linalg.lstsq(M, dst[:, 0], rcond=None)
    cg, *_ = np.linalg.lstsq(M, dst[:, 1], rcond=None)
    return cl, cg


def apply_affine(cl, cg, pts):
    M = np.column_stack([pts, np.ones(len(pts))])
    return M @ cl, M @ cg


def residuals_m(cl, cg, src, dst):
    pl, pg = apply_affine(cl, cg, src)
    return np.hypot((pl - dst[:, 0]) * LAT_M, (pg - dst[:, 1]) * LNG_M)


def main():
    with open(os.path.join(HERE, "lots_raw.json")) as fp:
        raw_lots = json.load(fp)

    src = np.array([c[0] for c in CONTROL])
    dst = np.array([c[1] for c in CONTROL])

    # Iteratively drop the worst control point until all remaining ones agree.
    idx = list(range(len(CONTROL)))
    while len(idx) > MIN_INLIERS:
        cl, cg = fit_affine(src[idx], dst[idx])
        r = residuals_m(cl, cg, src[idx], dst[idx])
        if r.max() < INLIER_TOL:
            break
        worst = idx[int(np.argmax(r))]
        idx.remove(worst)

    cl, cg = fit_affine(src[idx], dst[idx])
    r = residuals_m(cl, cg, src[idx], dst[idx])
    dropped = [i for i in range(len(CONTROL)) if i not in idx]
    print(f"Affine inliers: {len(idx)}/{len(CONTROL)}  "
          f"rms {math.sqrt((r ** 2).mean()):.1f} m  max {r.max():.1f} m")
    print(f"Rejected control points (noisy GPS): {dropped}")

    pts = np.array([[l["lat"], l["lng"]] for l in raw_lots])
    lats, lngs = apply_affine(cl, cg, pts)

    base = []
    for i, l in enumerate(raw_lots):
        key = (l["manzana"], l["lote"])
        if key in MANUAL:
            lat, lng = MANUAL[key]
        else:
            lat, lng = float(lats[i]), float(lngs[i])
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
