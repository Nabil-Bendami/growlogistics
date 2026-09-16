import { t } from '../i18n/index.js'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { LocateFixed, RefreshCw } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import route from '../data/casablanca-route.json'
import './JourneyMap.css'

const points = route.geometry.coordinates.map(([lng, lat]) => L.latLng(lat, lng))
const distances = [0]
for (let index = 1; index < points.length; index++) {
  distances.push(distances[index - 1] + points[index - 1].distanceTo(points[index]))
}
const totalDistance = distances.at(-1)

function travelledRoute(progress) {
  const distance = Math.min(1, Math.max(0, progress)) * totalDistance
  const end = distances.findIndex(value => value >= distance)
  if (end <= 0) return [points[0]]
  const fraction = (distance - distances[end - 1]) / (distances[end] - distances[end - 1])
  const from = points[end - 1]
  const to = points[end]
  return [...points.slice(0, end), L.latLng(from.lat + (to.lat - from.lat) * fraction, from.lng + (to.lng - from.lng) * fraction)]
}

export default function JourneyMap({ ref }) {
  const container = useRef(null)
  const instance = useRef(null)
  const progress = useRef(0)
  const [status, setStatus] = useState('loading')

  useImperativeHandle(ref, () => ({
    setProgress(value) {
      progress.current = value
      instance.current?.draw(value)
    },
  }), [])

  useEffect(() => {
    let map
    let resizeObserver
    let loadTimeout
    let cancelled = false
    const element = container.current
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || map) return
      observer.disconnect()
      map = L.map(element, {
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        touchZoom: false,
        zoomControl: false,
        zoomAnimation: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        fadeAnimation: false,
        minZoom: 10,
        maxZoom: 18,
      })
      map.attributionControl.setPrefix(false)
      L.control.zoom({ position: 'topright', zoomInTitle: t("Zoom avant"), zoomOutTitle: t("Zoom arrière") }).addTo(map)
      const bounds = L.latLngBounds(points)
      const fit = () => map.fitBounds(bounds, { paddingTopLeft: [35, 75], paddingBottomRight: [45, 85], animate: false })
      fit()

      // Browser caching and Referer are left intact. Only visible tiles are requested.
      const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        keepBuffer: 0,
        updateWhenIdle: true,
        attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      })
      const failedTiles = new Set()
      const tileKey = ({ coords }) => `${coords.z}/${coords.x}/${coords.y}`
      const armTimeout = () => {
        window.clearTimeout(loadTimeout)
        loadTimeout = window.setTimeout(() => { if (!cancelled) setStatus('error') }, 12000)
      }
      tiles.on('loading', () => { failedTiles.clear(); armTimeout() })
      tiles.on('tileerror', event => failedTiles.add(tileKey(event)))
      tiles.on('tileload', event => failedTiles.delete(tileKey(event)))
      tiles.on('load', () => {
        window.clearTimeout(loadTimeout)
        if (!cancelled) setStatus(failedTiles.size ? 'error' : 'ready')
      })
      tiles.addTo(map)

      const colors = getComputedStyle(element)
      const cobalt = colors.getPropertyValue('--cobalt').trim()
      const cream = colors.getPropertyValue('--cream-white').trim()
      const navy = colors.getPropertyValue('--deep-navy').trim()
      L.polyline(points, { color: cream, weight: 9, interactive: false }).addTo(map)
      L.polyline(points, { color: cobalt, opacity: .3, weight: 4, interactive: false }).addTo(map)
      const travelled = L.polyline([], { color: cobalt, weight: 5, interactive: false }).addTo(map)
      L.circleMarker(points[0], { radius: 7, color: cream, weight: 3, fillColor: navy, fillOpacity: 1, interactive: false })
        .addTo(map).bindTooltip(t("Entrepôt · démo"), { permanent: true, direction: 'top', offset: [0, -10], className: 'journey-place-label' })
      L.circleMarker(points.at(-1), { radius: 7, color: cobalt, weight: 3, fillColor: cream, fillOpacity: 1, interactive: false })
        .addTo(map).bindTooltip(t("Destinataire · démo"), { permanent: true, direction: 'top', offset: [0, -10], className: 'journey-place-label' })
      const halo = L.circleMarker(points[0], { radius: 17, stroke: false, fillColor: cobalt, fillOpacity: .2, interactive: false }).addTo(map)
      const marker = L.circleMarker(points[0], { radius: 8, color: cream, weight: 3, fillColor: cobalt, fillOpacity: 1, interactive: false, className: 'journey-live-marker' }).addTo(map)
      const draw = value => {
        const path = travelledRoute(value)
        travelled.setLatLngs(path)
        marker.setLatLng(path.at(-1))
        halo.setLatLng(path.at(-1))
        element.dataset.progress = value.toFixed(3)
      }
      instance.current = { draw, fit, tiles }
      draw(progress.current)
      resizeObserver = new ResizeObserver(() => { map.invalidateSize({ pan: false }); fit() })
      resizeObserver.observe(element)
    }, { rootMargin: '100px' })
    observer.observe(element)
    return () => {
      cancelled = true
      observer.disconnect()
      resizeObserver?.disconnect()
      window.clearTimeout(loadTimeout)
      map?.remove()
      instance.current = null
    }
  }, [])

  return <div className="journey-real-map">
    <div ref={container} className="journey-map" role="region" aria-label={t("Carte réelle de Casablanca. Itinéraire routier de démonstration, sans suivi GPS en direct.")} />
    <button type="button" className="journey-map-reset" aria-label={t("Recentrer sur le parcours")} title={t("Voir le parcours complet")} onClick={() => instance.current?.fit()}><LocateFixed size={18} /></button>
    {status !== 'ready' && <div className={`journey-map-loading ${status === 'error' ? 'is-error' : ''}`} role="status">
      <span>{status === 'error' ? t("Fond de carte indisponible. Vérifiez votre connexion.") : t("Chargement de la carte…")}</span>
      {status === 'error' && <button type="button" onClick={() => { setStatus('loading'); instance.current?.tiles.redraw() }}><RefreshCw size={13} /> {t("Réessayer")}</button>}
    </div>}
  </div>
}
