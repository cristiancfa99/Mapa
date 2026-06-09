import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import DEFAULT_LOTS from './defaultLots'
// DEFAULT_LOTS contains approximate coords from the plano — available for manual import
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import './App.css'

// Georeferenced corners computed from KMZ LatLonBox + rotation -19.341°
const PLANO_CORNERS = {
  nw: [-34.38862233, -58.64074634] as [number, number],
  ne: [-34.38470938, -58.62723620] as [number, number],
  sw: [-34.40558812, -58.63352961] as [number, number],
}

// Inline rotated image overlay — no library needed.
// Ported from leaflet-imageoverlay-rotated: positions image via CSS matrix().
function RotatedPlano({ url, opacity, visible }: { url: string; opacity: number; visible: boolean }) {
  const map = useMap()
  const divRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const tl = L.latLng(PLANO_CORNERS.nw[0], PLANO_CORNERS.nw[1])
    const tr = L.latLng(PLANO_CORNERS.ne[0], PLANO_CORNERS.ne[1])
    const bl = L.latLng(PLANO_CORNERS.sw[0], PLANO_CORNERS.sw[1])

    const pane = map.getPanes().overlayPane
    const div = L.DomUtil.create('div', 'leaflet-image-layer leaflet-zoom-animated') as HTMLDivElement
    const img = document.createElement('img')
    img.style.maxWidth = 'none'

    const reset = () => {
      const pxTL = map.latLngToLayerPoint(tl)
      const pxTR = map.latLngToLayerPoint(tr)
      const pxBL = map.latLngToLayerPoint(bl)
      const pxBR = pxTR.subtract(pxTL).add(pxBL)

      const bounds = L.bounds([pxTL, pxTR, pxBL, pxBR])
      const min = bounds.min!
      const size = bounds.getSize()
      const pxTLInDiv = pxTL.subtract(min)

      L.DomUtil.setPosition(div, min)
      div.style.width  = size.x + 'px'
      div.style.height = size.y + 'px'

      const W = img.naturalWidth
      const H = img.naturalHeight
      if (!W || !H) return

      const vx = pxTR.subtract(pxTL)
      const vy = pxBL.subtract(pxTL)
      img.style.transformOrigin = '0 0'
      img.style.transform = `matrix(${vx.x/W},${vx.y/W},${vy.x/H},${vy.y/H},${pxTLInDiv.x},${pxTLInDiv.y})`
    }

    img.onload = reset
    img.src = url
    div.appendChild(img)
    pane.appendChild(div)
    divRef.current = div
    imgRef.current = img

    map.on('zoomend resetview', reset)
    reset()

    return () => {
      map.off('zoomend resetview', reset)
      if (pane.contains(div)) pane.removeChild(div)
      divRef.current = null
      imgRef.current = null
    }
  }, [url, map])

  useEffect(() => {
    const img = imgRef.current
    if (img) img.style.opacity = String(opacity)
  }, [opacity])

  useEffect(() => {
    const div = divRef.current
    if (div) div.style.display = visible ? '' : 'none'
  }, [visible])

  return null
}

// Fix leaflet default icon path issue with Vite bundler
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export interface Lot {
  manzana: number
  lote: number
  lat: number
  lng: number
  address?: string
}

type Mode = 'search' | 'admin'
type TileMode = 'map' | 'satellite'

const TILES = {
  map: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics',
    maxZoom: 19,
  },
  satelliteLabels: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    attribution: '',
    maxZoom: 19,
  },
}

const STORAGE_KEY = 'santa-maria-lots'
// Barrio Santa María de Tigre — J926+4H Rincón de Milberg
const DEFAULT_CENTER: [number, number] = [-34.3997, -58.6386]
const DEFAULT_ZOOM = 16

function loadLots(): Lot[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) return JSON.parse(data) as Lot[]
  } catch {
    // ignore
  }
  saveLots(DEFAULT_LOTS)
  return DEFAULT_LOTS
}

function saveLots(lots: Lot[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lots))
}

// Moves the map to a given position — must be rendered inside MapContainer
function FlyController({ target }: { target: { pos: [number, number]; zoom: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) {
      map.flyTo(target.pos, target.zoom, { duration: 1.2 })
    }
  }, [target, map])
  return null
}

// Captures map clicks and changes cursor — must be rendered inside MapContainer
function MapInteraction({
  adminActive,
  onMapClick,
}: {
  adminActive: boolean
  onMapClick: (lat: number, lng: number) => void
}) {
  const map = useMapEvents({
    click(e) {
      if (adminActive) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    },
  })

  useEffect(() => {
    const container = map.getContainer()
    container.style.cursor = adminActive ? 'crosshair' : ''
    return () => {
      container.style.cursor = ''
    }
  }, [adminActive, map])

  return null
}

export default function App() {
  const [lots, setLots] = useState<Lot[]>(loadLots)
  const [mode, setMode] = useState<Mode>('search')

  // Search panel state
  const [searchMz, setSearchMz] = useState('')
  const [searchLote, setSearchLote] = useState('')
  const [foundLot, setFoundLot] = useState<Lot | null>(null)
  const [searchError, setSearchError] = useState('')
  const [notFoundMz, setNotFoundMz] = useState<number | null>(null)
  const [notFoundLote, setNotFoundLote] = useState<number | null>(null)

  // Admin panel state
  const [adminMz, setAdminMz] = useState('')
  const [adminLote, setAdminLote] = useState('')
  const [adminAddress, setAdminAddress] = useState('')
  const [pendingLot, setPendingLot] = useState<{ manzana: number; lote: number; address: string } | null>(null)
  const [adminFeedback, setAdminFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  // Map control
  const [flyTarget, setFlyTarget] = useState<{ pos: [number, number]; zoom: number } | null>(null)
  const [tileLayer, setTileLayer] = useState<TileMode>('satellite')

  // Plano overlay — bundled georeferenced image from KMZ
  const [planoUrl, setPlanoUrl] = useState<string>('./mapa.png')
  const [planoOpacity, setPlanoOpacity] = useState(0.5)
  const [planoVisible, setPlanoVisible] = useState(true)

  const handleSearch = () => {
    setSearchError('')
    setNotFoundMz(null)
    setNotFoundLote(null)
    const mz = parseInt(searchMz, 10)
    const lt = parseInt(searchLote, 10)
    if (!searchMz || !searchLote || isNaN(mz) || isNaN(lt) || mz < 1 || lt < 1) {
      setSearchError('Ingresá manzana y lote válidos')
      return
    }
    const lot = lots.find(l => l.manzana === mz && l.lote === lt)
    if (!lot) {
      setFoundLot(null)
      setNotFoundMz(mz)
      setNotFoundLote(lt)
      return
    }
    setFoundLot(lot)
    setFlyTarget({ pos: [lot.lat, lot.lng], zoom: 19 })
    // Open Google Maps pin immediately
    openGoogleMapsPin(lot)
  }

  const handleAdminPlace = () => {
    const mz = parseInt(adminMz, 10)
    const lt = parseInt(adminLote, 10)
    if (isNaN(mz) || isNaN(lt) || mz < 1 || lt < 1) return
    setPendingLot({ manzana: mz, lote: lt, address: adminAddress.trim() })
    setAdminFeedback(null)
  }

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (!pendingLot) return
      const newLot: Lot = {
        manzana: pendingLot.manzana,
        lote: pendingLot.lote,
        lat,
        lng,
        ...(pendingLot.address ? { address: pendingLot.address } : {}),
      }
      const updated = [
        ...lots.filter(l => !(l.manzana === newLot.manzana && l.lote === newLot.lote)),
        newLot,
      ]
      setLots(updated)
      saveLots(updated)
      setPendingLot(null)
      setAdminMz('')
      setAdminLote('')
      setAdminAddress('')
      setAdminFeedback({ msg: `✓ Mz ${newLot.manzana} - Lote ${newLot.lote} guardado`, ok: true })
      setTimeout(() => setAdminFeedback(null), 3500)
    },
    [pendingLot, lots],
  )

  const handleDeleteLot = (manzana: number, lote: number) => {
    const updated = lots.filter(l => !(l.manzana === manzana && l.lote === lote))
    setLots(updated)
    saveLots(updated)
    if (foundLot?.manzana === manzana && foundLot?.lote === lote) {
      setFoundLot(null)
    }
  }

  const switchMode = () => {
    setMode(m => (m === 'search' ? 'admin' : 'search'))
    setPendingLot(null)
    setAdminFeedback(null)
  }

  // Opens Google Maps with a pin at the lot location (no auto-navigation)
  const openGoogleMapsPin = (lot: Lot) => {
    window.open(`https://maps.google.com/?q=${lot.lat},${lot.lng}`, '_blank')
  }

  // Opens Google Maps navigation (turn-by-turn)
  const openGoogleMapsNav = (lot: Lot) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lot.lat},${lot.lng}&travelmode=driving`,
      '_blank',
    )
  }

  const openWaze = (lot: Lot) => {
    window.open(`https://waze.com/ul?ll=${lot.lat},${lot.lng}&navigate=yes`, '_blank')
  }

  const openGoogleMapsSearch = (mz: number, lote: number) => {
    const q = encodeURIComponent(`Manzana ${mz} Lote ${lote} Santa María de Tigre Tigre Buenos Aires`)
    window.open(`https://www.google.com/maps/search/${q}`, '_blank')
  }

  const openGoogleMapsEntrance = () => {
    window.open(`https://maps.google.com/?q=${DEFAULT_CENTER[0]},${DEFAULT_CENTER[1]}`, '_blank')
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(lots, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'santa-maria-lotes.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Lot[]
        if (Array.isArray(data)) {
          setLots(data)
          saveLots(data)
          setAdminFeedback({ msg: `✓ ${data.length} lotes importados`, ok: true })
          setTimeout(() => setAdminFeedback(null), 3500)
        }
      } catch {
        setAdminFeedback({ msg: 'Error al leer el archivo', ok: false })
        setTimeout(() => setAdminFeedback(null), 3500)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handlePlanoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setPlanoUrl(ev.target?.result as string)
      setPlanoVisible(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const isAdminClickActive = mode === 'admin' && !!pendingLot

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-left">
          <span className="header-pin">📍</span>
          <div>
            <h1 className="header-title">Santa María GPS</h1>
            <p className="header-sub">Tigre, Buenos Aires</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="tile-btn"
            onClick={() => setTileLayer(t => t === 'map' ? 'satellite' : 'map')}
            title={tileLayer === 'map' ? 'Ver satélite' : 'Ver mapa'}
          >
            {tileLayer === 'map' ? '🛰' : '🗺'}
          </button>
          <button
            className={`icon-btn ${mode === 'admin' ? 'icon-btn--active' : ''}`}
            onClick={switchMode}
            title={mode === 'admin' ? 'Cerrar configuración' : 'Configurar lotes'}
          >
            {mode === 'admin' ? '✕' : '⚙'}
          </button>
        </div>
      </header>

      {/* ── Map ── */}
      <div className="map-wrapper">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {tileLayer === 'map' ? (
            <TileLayer
              attribution={TILES.map.attribution}
              url={TILES.map.url}
              maxZoom={TILES.map.maxZoom}
            />
          ) : (
            <>
              <TileLayer
                attribution={TILES.satellite.attribution}
                url={TILES.satellite.url}
                maxZoom={TILES.satellite.maxZoom}
              />
              <TileLayer
                attribution=""
                url={TILES.satelliteLabels.url}
                maxZoom={TILES.satelliteLabels.maxZoom}
                opacity={0.8}
              />
            </>
          )}

          <FlyController target={flyTarget} />
          <MapInteraction adminActive={isAdminClickActive} onMapClick={handleMapClick} />

          {lots.map(lot => {
            const isSelected =
              foundLot?.manzana === lot.manzana && foundLot?.lote === lot.lote
            return (
              <CircleMarker
                key={`${lot.manzana}-${lot.lote}`}
                center={[lot.lat, lot.lng]}
                radius={isSelected ? 14 : 8}
                pathOptions={{
                  fillColor: isSelected ? '#ea4335' : '#1a73e8',
                  fillOpacity: 1,
                  color: 'white',
                  weight: isSelected ? 3 : 2,
                }}
              >
                <Popup>
                  <div className="popup-inner">
                    <strong>
                      Mz {lot.manzana} — Lote {lot.lote}
                    </strong>
                    {lot.address && <p className="popup-address">{lot.address}</p>}
                    {mode === 'admin' && (
                      <button
                        className="popup-delete"
                        onClick={() => handleDeleteLot(lot.manzana, lot.lote)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
          {/* Plano overlay */}
          <RotatedPlano url={planoUrl} opacity={planoOpacity} visible={planoVisible} />
        </MapContainer>

        {/* Crosshair overlay when placing a lot */}
        {isAdminClickActive && (
          <div className="map-overlay">
            <div className="map-overlay-badge">
              📌 Tocá en el mapa — Mz {pendingLot!.manzana} / Lote {pendingLot!.lote}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom panel ── */}
      <div className="panel">
        {mode === 'search' ? (
          /* Search panel */
          <div className="search-panel">
            <div className="row">
              <div className="field">
                <label htmlFor="s-mz">Manzana</label>
                <input
                  id="s-mz"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={searchMz}
                  onChange={e => setSearchMz(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Ej: 5"
                  min="1"
                />
              </div>
              <div className="field">
                <label htmlFor="s-lote">Lote</label>
                <input
                  id="s-lote"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={searchLote}
                  onChange={e => setSearchLote(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Ej: 12"
                  min="1"
                />
              </div>
              <button className="btn btn-blue" onClick={handleSearch}>
                Buscar
              </button>
            </div>

            {searchError && <p className="msg msg-error">{searchError}</p>}

            {foundLot && (
              <div className="result">
                <p className="result-title">
                  📍 Mz {foundLot.manzana} — Lote {foundLot.lote}
                </p>
                {foundLot.address && <p className="result-address">{foundLot.address}</p>}
                <button className="btn btn-blue nav-btn-full" onClick={() => openGoogleMapsPin(foundLot)}>
                  📌 Ver pin en Google Maps
                </button>
                <div className="nav-row" style={{ marginTop: 6 }}>
                  <button className="btn btn-outline nav-btn" onClick={() => openGoogleMapsNav(foundLot)}>
                    🗺 Cómo llegar
                  </button>
                  <button className="btn btn-waze nav-btn" onClick={() => openWaze(foundLot)}>
                    🚗 Waze
                  </button>
                </div>
              </div>
            )}

            {notFoundMz !== null && notFoundLote !== null && (
              <div className="result result--notfound">
                <p className="result-title">
                  Mz {notFoundMz} — Lote {notFoundLote} no está en el mapa
                </p>
                <p className="result-sub">Intentá buscar en Google Maps:</p>
                <div className="nav-row">
                  <button
                    className="btn btn-blue nav-btn"
                    onClick={() => openGoogleMapsSearch(notFoundMz, notFoundLote)}
                  >
                    🗺 Buscar en Google Maps
                  </button>
                </div>
                <p className="result-sub" style={{ marginTop: 6 }}>O navegá a la entrada del barrio:</p>
                <button className="btn btn-outline nav-btn-full" onClick={openGoogleMapsEntrance}>
                  📍 Ir a la GUARDIA
                </button>
              </div>
            )}

            {!foundLot && notFoundMz === null && (
              <div className="hint-box">
                <button className="btn btn-outline nav-btn-full" onClick={openGoogleMapsEntrance}>
                  📍 Ir a la GUARDIA (entrada del barrio)
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Admin panel */
          <div className="admin-panel">
            <p className="panel-title">⚙ Configurar Lotes</p>

            {adminFeedback && (
              <p className={`msg ${adminFeedback.ok ? 'msg-ok' : 'msg-error'}`}>
                {adminFeedback.msg}
              </p>
            )}

            {pendingLot ? (
              <div className="pending-state">
                <p className="pending-msg">
                  Tocá en el mapa para colocar<br />
                  <strong>Mz {pendingLot.manzana} — Lote {pendingLot.lote}</strong>
                </p>
                <button
                  className="btn btn-outline"
                  onClick={() => setPendingLot(null)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <div className="row">
                  <div className="field">
                    <label htmlFor="a-mz">Manzana</label>
                    <input
                      id="a-mz"
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={adminMz}
                      onChange={e => setAdminMz(e.target.value)}
                      placeholder="Ej: 5"
                      min="1"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="a-lote">Lote</label>
                    <input
                      id="a-lote"
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={adminLote}
                      onChange={e => setAdminLote(e.target.value)}
                      placeholder="Ej: 12"
                      min="1"
                    />
                  </div>
                  <button
                    className="btn btn-blue"
                    onClick={handleAdminPlace}
                    disabled={!adminMz || !adminLote}
                  >
                    Colocar
                  </button>
                </div>
                <div className="field field-full">
                  <label htmlFor="a-addr">Dirección (opcional)</label>
                  <input
                    id="a-addr"
                    type="text"
                    value={adminAddress}
                    onChange={e => setAdminAddress(e.target.value)}
                    placeholder="Ej: Calle Los Aromos 123"
                  />
                </div>

                <div className="admin-footer">
                  <span className="lot-count">
                    {lots.length} {lots.length === 1 ? 'lote' : 'lotes'} cargado{lots.length !== 1 ? 's' : ''}
                  </span>
                  <div className="admin-actions">
                    <button className="btn btn-sm btn-outline" onClick={exportData} title="Exportar lotes">
                      ⬇ Exportar
                    </button>
                    <label className="btn btn-sm btn-outline" title="Importar lotes">
                      ⬆ Importar
                      <input
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={importData}
                      />
                    </label>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline"
                  style={{ width: '100%', marginTop: 4 }}
                  onClick={() => {
                    setLots(DEFAULT_LOTS)
                    saveLots(DEFAULT_LOTS)
                    setAdminFeedback({ msg: `✓ ${DEFAULT_LOTS.length} lotes del plano cargados (aprox.)`, ok: true })
                    setTimeout(() => setAdminFeedback(null), 4000)
                  }}
                >
                  📄 Cargar lotes del plano (aproximado)
                </button>

                {/* Plano overlay section */}
                <div className="plano-section">
                  <p className="plano-title">🗒 Plano del barrio</p>
                  <div className="plano-controls">
                    <div className="plano-row">
                      <label className="plano-check">
                        <input
                          type="checkbox"
                          checked={planoVisible}
                          onChange={e => setPlanoVisible(e.target.checked)}
                        />
                        Visible
                      </label>
                      <label className="plano-check">
                        Opacidad
                        <input
                          type="range"
                          min="0.1"
                          max="0.9"
                          step="0.05"
                          value={planoOpacity}
                          onChange={e => setPlanoOpacity(Number(e.target.value))}
                          className="opacity-slider"
                        />
                      </label>
                    </div>
                    <p className="plano-hint">Arrastrá las esquinas de la imagen para ajustar</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      <button
                        className="btn btn-sm btn-outline"
                        style={{ flex: 1 }}
                        onClick={() => setPlanoUrl('./mapa.png')}
                      >
                        ↩ Plano oficial
                      </button>
                      <label className="btn btn-sm btn-outline" style={{ flex: 1 }}>
                        📷 Otra imagen
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handlePlanoUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
