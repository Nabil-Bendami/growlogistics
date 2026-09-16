import { t } from '../i18n/index.js'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Globe2, Pause, Play } from 'lucide-react'
import { worldConnections } from '../config/worldConnections'
import { countries, projection, path, validCoordinates, connectionGeometry, originCountry } from './worldMapGeometry'
import './WorldConnectionsMap.css'

export default function WorldConnectionsMap({ config = worldConnections }) {
  const uid = useId().replaceAll(':', '')
  const section = useRef(null)
  const particles = useRef([])
  const countryRefs = useRef([])
  const canvas = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [activeCountry, setActiveCountry] = useState(null)
  const [paused, setPaused] = useState(false)
  const [running, setRunning] = useState(false)
  const origin = config.origin
  const validOrigin = validCoordinates(origin?.coordinates)
  const destinations = useMemo(() => (config.destinations ?? []).filter(item => validCoordinates(item.coordinates)), [config.destinations])
  const connections = useMemo(() => validOrigin ? destinations.map(destination => ({ ...destination, ...connectionGeometry(origin.coordinates, destination.coordinates) })) : [], [origin, destinations, validOrigin])
  const originId = useMemo(() => validOrigin ? originCountry(origin.coordinates) : null, [origin, validOrigin])
  const locations = validOrigin ? [origin, ...destinations] : []
  const duration = Math.max(1, Number(config.animation?.durationSeconds) || 9)
  const stagger = Math.max(0, Number(config.animation?.staggerSeconds) || 0)
  const pulse = Math.max(1, Number(config.animation?.pulseSeconds) || 3.6)

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const update = () => setRunning(visible && !media.matches && !document.hidden && !paused)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(section.current)
    media.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); media.removeEventListener('change', update); document.removeEventListener('visibilitychange', update) }
  }, [paused])

  useEffect(() => {
    if (!running) return
    let frame
    let start
    const tick = time => {
      start ??= time
      const elapsed = (time - start) / 1000
      connections.forEach((connection, index) => {
        const phase = ((elapsed - index * stagger) % duration + duration) % duration / duration
        const point = projection(connection.interpolate(phase))
        particles.current[index]?.setAttribute('transform', `translate(${point[0]} ${point[1]})`)
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running, connections, duration, stagger])

  useEffect(() => {
    const node = canvas.current
    if (!node) return
    const center = () => { node.scrollLeft = (node.scrollWidth - node.clientWidth) / 2 }
    center()
    addEventListener('resize', center)
    return () => removeEventListener('resize', center)
  }, [validOrigin])

  useEffect(() => {
    const dismiss = () => setTooltip(null)
    const keydown = event => { if (event.key === 'Escape') dismiss() }
    window.addEventListener('scroll', dismiss, { passive: true })
    window.addEventListener('resize', dismiss)
    window.addEventListener('keydown', keydown)
    return () => { window.removeEventListener('scroll', dismiss); window.removeEventListener('resize', dismiss); window.removeEventListener('keydown', keydown) }
  }, [])

  function show(event, label, detail, id = null) {
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX || box.x + box.width / 2
    const y = event.clientY || box.y + box.height / 2
    setActiveCountry(id)
    setTooltip({ label, detail, x: Math.max(8, Math.min(x + 14, innerWidth - 248)), y: Math.max(8, Math.min(y + 14, innerHeight - 90)) })
  }

  function countryKey(event, index) {
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? countries.length - 1 : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + countries.length) % countries.length
      countryRefs.current[next]?.focus()
    } else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(event, countries[index].properties.name, t("Pays"), countries[index].id) }
  }

  const colors = Object.fromEntries(Object.entries(config.colors ?? {}).map(([key, value]) => [`--world-${key}`, value]))
  return <section ref={section} className="world-connections section" id="monde" style={{ ...colors, '--world-pulse': `${pulse}s` }} data-running={running} aria-labelledby={`${uid}-heading`}>
    <div className="wrap">
      <div className="world-heading"><div><div className="eyebrow"><span /> {t("UNE PERSPECTIVE MONDIALE")}</div><h2 id={`${uid}-heading`}>{t("Un point de départ.")}<br /><em>{t("Un monde de connexions.")}</em></h2></div><p>{t("Depuis Casablanca, explorez des connexions à travers les continents. Une visualisation pour imaginer les échanges de demain.")}</p></div>
      {!validOrigin ? <p role="status">{t("Carte indisponible : vérifiez les coordonnées de l’origine dans la configuration.")}</p> : <>
        <div className="world-toolbar"><span><Globe2 size={17} /> {origin.label}<small>{t("ORIGINE · DÉMO")}</small></span><button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? t("Reprendre les animations") : t("Mettre les animations en pause")}>{paused ? <Play size={14} /> : <Pause size={14} />}<span>{paused ? t("Reprendre") : 'Pause'}</span></button></div>
        <div className="world-canvas" ref={canvas}>
        <svg className="world-svg" viewBox="0 0 1200 630" role="group" aria-labelledby={`${uid}-title ${uid}-desc`} onPointerLeave={() => { setTooltip(null); setActiveCountry(null) }}>
          <title id={`${uid}-title`}>{t("Connexions mondiales depuis")} {origin.label}</title><desc id={`${uid}-desc`}>{t("Carte du monde interactive. Lieux et routes de démonstration, sans couverture commerciale confirmée. Utilisez les flèches pour parcourir les pays, ou le sélecteur sous la carte.")}</desc>
          <defs><clipPath id={`${uid}-clip`}><path d={path({ type: 'Sphere' })} /></clipPath></defs>
          <g clipPath={`url(#${uid}-clip)`}>
            {countries.map((country, index) => <path ref={el => { countryRefs.current[index] = el }} key={country.id ?? index} d={path(country)} className={`world-country${country.id === originId ? ' is-origin' : ''}${country.id === activeCountry ? ' is-hovered' : ''}`} role="button" tabIndex={country.id === activeCountry || (!activeCountry && index === 0) ? 0 : -1} aria-label={country.properties.name} onPointerEnter={event => show(event, country.properties.name, t("Pays"), country.id)} onFocus={event => show(event, country.properties.name, t("Pays"), country.id)} onBlur={() => setTooltip(null)} onClick={event => show(event, country.properties.name, t("Pays"), country.id)} onKeyDown={event => countryKey(event, index)} />)}
            <g className="world-routes" aria-hidden="true">{connections.map(connection => <path key={connection.id} d={connection.d} />)}</g>
            <g className="world-particles" aria-hidden="true">{connections.map((connection, index) => { const point = projection(connection.interpolate(.5)); return <g key={connection.id} ref={el => { particles.current[index] = el }} transform={`translate(${point[0]} ${point[1]})`}><circle r="7" opacity=".1" /><circle r="3.5" opacity=".22" /><circle r="1.8" /></g> })}</g>
          </g>
          {locations.map((location, index) => { const point = projection(location.coordinates); return <g key={location.id} transform={`translate(${point[0]} ${point[1]})`} className={`world-marker${index === 0 ? ' is-origin' : ''}`} role="button" tabIndex="0" aria-label={`${location.label} — ${index === 0 ? t("origine") : 'destination'} ${t("de démonstration")}`} onPointerEnter={event => show(event, location.label, t("Lieu de démonstration"))} onFocus={event => show(event, location.label, t("Lieu de démonstration"))} onBlur={() => setTooltip(null)} onClick={event => show(event, location.label, t("Lieu de démonstration"))} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(event, location.label, t("Lieu de démonstration")) } }}>
            <circle className="world-marker-hit" r="13" /><circle className="world-pulse" r={index === 0 ? 15 : 11} style={{ animationDelay: `${-index * .45}s` }} /><circle className="world-marker-core" r={index === 0 ? 5 : 3.5} />
          </g> })}
        </svg>
        </div>
        <div className="world-explore"><label>{t("Pays à explorer")}<select aria-label={t("Explorer un pays")} value={activeCountry ?? ''} onChange={event => { const country = countries.find(item => item.id === event.target.value); if (country) show(event, country.properties.name, t("Pays"), country.id) }}><option value="">{t("Choisir un pays")}</option>{[...countries].sort((a, b) => a.properties.name.localeCompare(b.properties.name)).map((country, index) => <option key={country.id ?? index} value={country.id}>{country.properties.name}</option>)}</select></label><span>{t("Survolez, touchez ou explorez au clavier.")}</span></div>
      </>}
      <div className="world-footnote"><span>{t("Lieux et liaisons illustratifs · Ni bureaux, ni clients, ni couverture commerciale confirmée.")}</span><a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">{t("Géographie : Natural Earth")}</a></div>
    </div>
    {tooltip && createPortal(<div id={`${uid}-tooltip`} className="world-tooltip" role="status" style={{ left: tooltip.x, top: tooltip.y }}><strong>{tooltip.label}</strong><small>{tooltip.detail}</small></div>, document.body)}
  </section>
}
