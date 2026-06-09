import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { LOTS, type Lot } from './lots'
import { BARRIO_CENTER, GUARDIA, PLANO_IMAGE } from './geo'
import RotatedPlano from './RotatedPlano'
import './App.css'

// Default marker icon (Vite needs explicit URLs for the leaflet images)
const pinIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const TILES = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
  labels: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19,
  },
}

function FlyTo({ target }: { target: { pos: [number, number]; zoom: number } | null }) {
  const map = useMap()
  useMemo(() => {
    if (target) map.flyTo(target.pos, target.zoom, { duration: 1.1 })
  }, [target, map])
  return null
}

const gmapsPin = (lat: number, lng: number) =>
  `https://maps.google.com/?q=${lat},${lng}`
const gmapsNav = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
const wazeNav = (lat: number, lng: number) =>
  `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`

export default function App() {
  const [mz, setMz] = useState('')
  const [lote, setLote] = useState('')
  const [found, setFound] = useState<Lot | null>(null)
  const [missing, setMissing] = useState<{ mz: number; lote: number } | null>(null)
  const [error, setError] = useState('')
  const [target, setTarget] = useState<{ pos: [number, number]; zoom: number } | null>(null)

  const [base, setBase] = useState<'satellite' | 'street'>('satellite')
  const [planoOn, setPlanoOn] = useState(true)
  const [planoOpacity, setPlanoOpacity] = useState(0.55)
  const [showAllDots, setShowAllDots] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  const lotIndex = useMemo(() => {
    const m = new Map<string, Lot>()
    for (const l of LOTS) m.set(`${l.manzana}-${l.lote}`, l)
    return m
  }, [])

  const search = () => {
    setError('')
    setMissing(null)
    const m = parseInt(mz, 10)
    const l = parseInt(lote, 10)
    if (!mz || !lote || isNaN(m) || isNaN(l) || m < 1 || l < 1) {
      setError('Ingresá una manzana y un lote válidos.')
      setFound(null)
      return
    }
    const lot = lotIndex.get(`${m}-${l}`)
    if (!lot) {
      setFound(null)
      setMissing({ mz: m, lote: l })
      return
    }
    setFound(lot)
    setTarget({ pos: [lot.lat, lot.lng], zoom: 19 })
    window.open(gmapsPin(lot.lat, lot.lng), '_blank')
  }

  return (
    <div className="app">
      {/* Map fills the whole screen */}
      <div className="map">
        <MapContainer
          center={BARRIO_CENTER}
          zoom={16}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          {base === 'satellite' ? (
            <>
              <TileLayer url={TILES.satellite.url} attribution={TILES.satellite.attribution} maxZoom={TILES.satellite.maxZoom} />
              <TileLayer url={TILES.labels.url} maxZoom={TILES.labels.maxZoom} opacity={0.85} />
            </>
          ) : (
            <TileLayer url={TILES.street.url} attribution={TILES.street.attribution} maxZoom={TILES.street.maxZoom} />
          )}

          {planoOn && <RotatedPlano url={PLANO_IMAGE} opacity={planoOpacity} visible={planoOn} />}

          {showAllDots &&
            LOTS.map(l => (
              <CircleMarker
                key={`${l.manzana}-${l.lote}`}
                center={[l.lat, l.lng]}
                radius={4}
                pathOptions={{ color: '#fff', weight: 1, fillColor: '#1769e0', fillOpacity: 0.9 }}
              />
            ))}

          {found && (
            <Marker position={[found.lat, found.lng]} icon={pinIcon}>
              <Popup>
                <strong>Mz {found.manzana} · Lote {found.lote}</strong>
              </Popup>
            </Marker>
          )}

          <FlyTo target={target} />
        </MapContainer>

        {/* Floating top bar */}
        <header className="topbar">
          <div className="brand">
            <span className="brand-pin">📍</span>
            <div className="brand-text">
              <h1>Santa María</h1>
              <p>Tigre · Buenos Aires</p>
            </div>
          </div>
          <button
            className="layer-btn"
            onClick={() => setBase(b => (b === 'satellite' ? 'street' : 'satellite'))}
            title={base === 'satellite' ? 'Ver mapa de calles' : 'Ver satélite'}
          >
            {base === 'satellite' ? '🗺️' : '🛰️'}
          </button>
        </header>

        {/* Plano floating control */}
        <div className="plano-fab">
          <button
            className={`pill ${planoOn ? 'pill-on' : ''}`}
            onClick={() => setPlanoOn(v => !v)}
          >
            {planoOn ? '🗒️ Plano' : '🗒️ Plano'}
          </button>
          {planoOn && (
            <input
              className="opacity"
              type="range"
              min={0.15}
              max={0.95}
              step={0.05}
              value={planoOpacity}
              onChange={e => setPlanoOpacity(Number(e.target.value))}
              title="Opacidad del plano"
            />
          )}
        </div>
      </div>

      {/* Bottom search sheet */}
      <section className="sheet">
        <div className="search">
          <div className="field">
            <label htmlFor="mz">Manzana</label>
            <input
              id="mz"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ej. 22"
              value={mz}
              onChange={e => setMz(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
            />
          </div>
          <div className="field">
            <label htmlFor="lote">Lote</label>
            <input
              id="lote"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ej. 7"
              value={lote}
              onChange={e => setLote(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
            />
          </div>
          <button className="go" onClick={search}>Buscar</button>
        </div>

        {error && <p className="error">{error}</p>}

        {found && (
          <div className="result">
            <div className="result-head">
              <span className="dot" />
              <strong>Mz {found.manzana} · Lote {found.lote}</strong>
            </div>
            <div className="result-actions">
              <a className="action primary" href={gmapsPin(found.lat, found.lng)} target="_blank" rel="noreferrer">📌 Pin en Google Maps</a>
              <a className="action" href={gmapsNav(found.lat, found.lng)} target="_blank" rel="noreferrer">🧭 Cómo llegar</a>
              <a className="action waze" href={wazeNav(found.lat, found.lng)} target="_blank" rel="noreferrer">🚗 Waze</a>
            </div>
          </div>
        )}

        {missing && (
          <div className="result result-missing">
            <strong>Mz {missing.mz} · Lote {missing.lote} no está cargado</strong>
            <div className="result-actions">
              <a className="action" href={gmapsPin(GUARDIA[0], GUARDIA[1])} target="_blank" rel="noreferrer">📍 Ir a la Guardia</a>
            </div>
          </div>
        )}

        {!found && !missing && !error && (
          <button className="guardia" onClick={() => window.open(gmapsPin(GUARDIA[0], GUARDIA[1]), '_blank')}>
            📍 Ir a la Guardia (entrada del barrio)
          </button>
        )}

        <button className="more" onClick={() => setShowPanel(v => !v)}>
          {showPanel ? 'Ocultar opciones' : 'Más opciones'} ▾
        </button>
        {showPanel && (
          <div className="extra">
            <label className="toggle">
              <input type="checkbox" checked={showAllDots} onChange={e => setShowAllDots(e.target.checked)} />
              Mostrar todos los lotes en el mapa
            </label>
            <p className="count">{LOTS.length} lotes calibrados</p>
          </div>
        )}
      </section>
    </div>
  )
}
