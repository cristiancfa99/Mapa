import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { PLANO_NW, PLANO_NE, PLANO_SW } from './geo'

/**
 * Renders a rotated/skewed image overlay anchored to three geographic corners
 * (NW, NE, SW). The image is positioned with a CSS `matrix()` transform that is
 * recomputed on every zoom — the same technique used by Leaflet's rotated image
 * overlay plugin, inlined here so we don't depend on a library that reads the
 * `L` global (which breaks under a bundler).
 */
export default function RotatedPlano({
  url,
  opacity,
  visible,
}: {
  url: string
  opacity: number
  visible: boolean
}) {
  const map = useMap()
  const divRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const tl = L.latLng(PLANO_NW[0], PLANO_NW[1])
    const tr = L.latLng(PLANO_NE[0], PLANO_NE[1])
    const bl = L.latLng(PLANO_SW[0], PLANO_SW[1])

    const pane = map.getPanes().overlayPane
    const div = L.DomUtil.create('div', 'leaflet-image-layer leaflet-zoom-animated') as HTMLDivElement
    const img = document.createElement('img')
    img.alt = 'Plano del barrio'
    img.style.maxWidth = 'none'
    img.style.display = 'none' // hidden until the first transform is applied

    const reset = () => {
      const pxTL = map.latLngToLayerPoint(tl)
      const pxTR = map.latLngToLayerPoint(tr)
      const pxBL = map.latLngToLayerPoint(bl)
      const pxBR = pxTR.subtract(pxTL).add(pxBL)

      const bounds = L.bounds([pxTL, pxTR, pxBL, pxBR])
      const min = bounds.min!
      const size = bounds.getSize()
      const tlInDiv = pxTL.subtract(min)

      L.DomUtil.setPosition(div, min)
      div.style.width = `${size.x}px`
      div.style.height = `${size.y}px`

      const w = img.naturalWidth
      const h = img.naturalHeight
      if (!w || !h) return

      const vx = pxTR.subtract(pxTL)
      const vy = pxBL.subtract(pxTL)
      img.style.transformOrigin = '0 0'
      img.style.transform = `matrix(${vx.x / w},${vx.y / w},${vy.x / h},${vy.y / h},${tlInDiv.x},${tlInDiv.y})`
      img.style.display = ''
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
    if (imgRef.current) imgRef.current.style.opacity = String(opacity)
  }, [opacity])

  useEffect(() => {
    if (divRef.current) divRef.current.style.display = visible ? '' : 'none'
  }, [visible])

  return null
}
