import { t } from '../i18n/index.js'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, Check, CircleCheck, FileText, Route, Package, PackageCheck, RotateCcw, ShoppingCart, Truck, BarChart3, Warehouse } from 'lucide-react'
import JourneyMap from './JourneyMap.jsx'
import './LogisticsJourney.css'

const STAGES = [
  { label: t("Réception"), product: 'WMS', role: t("Réception du stock"), title: t("Tout commence ici."), description: t("Les produits arrivent à l’entrepôt. Les quantités reçues sont vérifiées et chaque article trouve son emplacement, prêt pour la prochaine commande."), icon: Warehouse, badge: t("Entrepôt · Casablanca"), status: t("Stock réceptionné"), detail: t("Allée A · Étagère 04") },
  { label: t("Commande"), product: 'TMS', role: t("Gestion des commandes"), title: t("Une commande arrive."), description: t("Une nouvelle commande de livraison est créée. Le client, son adresse, les articles et les informations de livraison sont réunis dans une fiche claire."), icon: ShoppingCart, badge: t("Commande GL-2048"), status: t("Nouvelle commande"), detail: t("2 articles · 349 MAD") },
  { label: t("Planification"), product: 'TMS', role: t("Tournées et affectations"), title: t("La bonne tournée."), description: t("La livraison est affectée à un chauffeur et à un véhicule. L’itinéraire tient compte des créneaux horaires, des capacités de chargement et des autres arrêts de la tournée."), icon: Route, badge: t("Tournée · TR-2048"), status: t("Livraison planifiée"), detail: t("Chauffeur et véhicule affectés") },
  { label: t("Préparation"), product: 'WMS', role: t("Préparation des colis"), title: t("Prêt à partir."), description: t("Les produits sont prélevés et ajoutés au colis. La préparation par client et le bon de livraison accompagnent le passage de l’entrepôt à l’expédition."), icon: PackageCheck, badge: t("Préparation · Colis 2048"), status: t("Colis préparé"), detail: t("2 articles vérifiés") },
  { label: t("Expédition"), product: 'TMS', role: t("Suivi GPS"), title: t("En route."), description: t("Le colis quitte l’entrepôt. Le suivi GPS permet de visualiser le véhicule et de suivre l’avancement de sa tournée depuis le TMS."), icon: Truck, badge: t("Expédition · GL-2048"), status: t("Commande expédiée"), detail: t("Casablanca · Tournée en cours") },
  { label: t("Livraison"), product: 'TMS', role: t("Suivi de la livraison"), title: t("Bien arrivé."), description: t("Le chauffeur enregistre la livraison depuis son application mobile. Une signature, une photo ou une note documente la remise du colis et complète l’historique."), icon: CircleCheck, badge: t("Livraison · GL-2048"), status: t("Commande livrée"), detail: t("2 articles remis") },
  { label: t("Bilan"), product: 'TMS', role: t("Tableau de bord"), title: t("Chaque livraison compte."), description: t("Suivez la ponctualité des livraisons, l’utilisation de votre flotte et le coût par livraison. Les rapports vous aident à analyser vos tournées et à améliorer les prochaines."), icon: BarChart3, badge: t("Bilan · GL-2048"), status: t("Rapport de livraison disponible"), detail: t("Tournée TR-2048") },
]


const SHORT_LABELS = ['Stock', t("Création"), t("Planifier"), t("Préparer"), t("Expédier"), t("Livrer"), t("Bilan")]
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

function StageVisual({ active }) {
  if (active === 0 || active === 4) return null
  if (active === 2) return <div className="journey-overlay journey-picking" key={active}>
    <div className="journey-card-heading"><span className="journey-card-icon"><Route size={20}/></span><div><strong>{t("Tournée planifiée")}</strong><small>TMS · TR-2048</small></div><span className="journey-online">{t("Exemple")}</span></div>
    <div className="journey-picking-row"><CircleCheck/><div><strong>{t("Chauffeur et véhicule affectés")}</strong><small>{t("Capacité de chargement vérifiée")}</small></div></div>
    <div className="journey-picking-row"><CircleCheck/><div><strong>{t("Créneau : 14 h – 16 h")}</strong><small>{t("Casablanca · Arrêt 03")}</small></div></div>
    <div className="journey-card-foot"><Route size={14}/> {t("Itinéraire et séquence des arrêts définis")}</div>
  </div>
  if (active === 1) return <div className="journey-overlay journey-order" key={active}>
    <div className="journey-card-heading"><span className="journey-card-icon"><ShoppingCart size={20}/></span><div><strong>{t("Nouvelle commande")}</strong><small>TMS · GL-2048</small></div><span className="journey-status-pill">{t("Nouveau")}</span></div>
    <div className="journey-order-client"><span>SA</span><div><strong>Sara Amrani</strong><small>{t("Casablanca, Maroc")}</small></div></div>
    <div className="journey-item"><Package size={18}/><span>{t("Article A")} <small>{t("Quantité : 1")}</small></span><b>249 MAD</b></div>
    <div className="journey-item"><Package size={18}/><span>{t("Article B")} <small>{t("Quantité : 1")}</small></span><b>100 MAD</b></div>
    <div className="journey-total"><span>{t("Valeur des articles")}</span><strong>349 <small>MAD</small></strong></div>
  </div>
  if (active === 3) return <div className="journey-overlay journey-picking" key={active}>
    <div className="journey-card-heading"><span className="journey-card-icon"><PackageCheck size={20}/></span><div><strong>{t("Préparation du colis")}</strong><small>{t("WMS · Colis 2048")}</small></div></div>
    <div className="journey-picking-row"><CircleCheck/><div><strong>{t("Article A · 1 unité")}</strong><small>{t("Allée A / Étagère 04")}</small></div><span>{t("Vérifié")}</span></div>
    <div className="journey-picking-row"><CircleCheck/><div><strong>{t("Article B · 1 unité")}</strong><small>{t("Allée B / Étagère 02")}</small></div><span>{t("Vérifié")}</span></div>
    <div className="journey-delivery-note"><FileText size={20}/><div><strong>{t("Bon de livraison")}</strong><small>{t("BL-2048 · Colis prêt à expédier")}</small></div><Check size={18}/></div>
  </div>
  return <div className={`journey-overlay journey-complete ${active===6?'is-finance':''}`} key={active}>
    <div className="journey-success-icon">{active===5?<Check size={35}/>:<BarChart3 size={32}/>}</div>
    <p>{active===5?t("Livraison terminée"):t("Bilan de la tournée")}</p>
    <strong className="journey-success-number">{active===5?'GL-2048':<>1 <small>{t("livraison")}</small></>}</strong>
    <ul>{(active===5?[t("Statut « Livrée » enregistré"),t("Preuve de livraison enregistrée"),t("2 articles remis au destinataire")]:[t("Livraison ajoutée au rapport"),t("Indicateurs de tournée consultables"),t("Analyse des coûts disponible")]).map(line=><li key={line}><Check size={15}/>{line}</li>)}</ul>
  </div>
}

export default function LogisticsJourney() {
  const sectionRef = useRef(null)
  const mapRef = useRef(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)
  const railRefs = useRef([])
  const headerHeight = useRef(0)

  useEffect(() => {
    const header = document.querySelector('.sticky-navigation')
    const resize = () => {
      headerHeight.current = header?.offsetHeight ?? 0
      sectionRef.current.style.setProperty('--journey-nav-height', `${headerHeight.current}px`)
    }
    resize()
    const observer = new ResizeObserver(resize)
    if (header) observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 901px) and (min-height: 680px) and (prefers-reduced-motion: no-preference), (max-width: 900px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)')
    const update = () => setPinned(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    activeRef.current = active
    if (pinned) return
    const progress = active >= 5 ? 1 : 0
    mapRef.current?.setProgress(progress)
  }, [active, pinned])

  useEffect(() => {
    if (!pinned) return
    let frame = 0
    let visible = false
    const update = () => {
      frame = 0
      const rect = sectionRef.current.getBoundingClientRect()
      const pinHeight = sectionRef.current.querySelector('.journey-pin').offsetHeight
      const progress = clamp((headerHeight.current - rect.top) / Math.max(1, sectionRef.current.offsetHeight - pinHeight))
      const beat = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length))
      if (beat !== activeRef.current) { activeRef.current = beat; setActive(beat) }
      // The dot travels with the scroll during the dispatch beat; reverse scroll reverses it.
      const travel = clamp(progress * STAGES.length - 4)
      mapRef.current?.setProgress(travel)
    }
    const schedule = () => { if (visible && !frame) frame = requestAnimationFrame(update) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule() }, { rootMargin: '150px' })
    observer.observe(sectionRef.current)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => { observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame) }
  }, [pinned])

  function selectStage(index, focus = false) {
    const next = clamp(index, 0, STAGES.length - 1)
    if (pinned) {
      const section = sectionRef.current
      const start = window.scrollY + section.getBoundingClientRect().top - headerHeight.current
      const midpoint = (next + .5) / STAGES.length
      window.scrollTo({ top: start + midpoint * (section.offsetHeight - section.querySelector('.journey-pin').offsetHeight), behavior: 'smooth' })
    } else {
      activeRef.current = next
      setActive(next)
      mapRef.current?.setProgress(next >= 5 ? 1 : 0)
    }
    if (focus) railRefs.current[next]?.focus({ preventScroll: true })
  }

  function onRailKeyDown(event, index) {
    const key = event.key
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return
    event.preventDefault()
    selectStage(key === 'Home' ? 0 : key === 'End' ? STAGES.length - 1 : index + (key === 'ArrowRight' ? 1 : -1), true)
  }

  const stage = STAGES[active]
  const Icon = stage.icon
  return <section ref={sectionRef} className={`logistics-journey ${pinned?'is-pinned':'is-manual'}`} id="parcours" aria-labelledby="journey-title" data-stage={active}>
    <div className="journey-pin">
      <div className="journey-container">
        <div className="journey-heading">
          <div className="eyebrow"><span/> {t("Du stock à la livraison")}</div>
          <h2 id="journey-title">{t("Un colis. Toute une histoire.")}</h2>
          <p>{pinned?t("Faites défiler pour suivre"):t("Explorez les étapes pour suivre")} {t("une commande, de l’entrepôt à la livraison, avec les solutions WMS et TMS de Grow Logistics.")}</p>
        </div>
        <div className="journey-stage">
          <div className="journey-left">
            <div className={`journey-scene ${active!==0&&active!==4?'has-overlay':''}`}>
              <JourneyMap ref={mapRef}/>
              <div className="journey-map-badge"><span/>{stage.badge}</div>
              <StageVisual active={active}/>
              <div className="journey-map-stat"><span className={active>=5?'is-delivered':''}/><b>{stage.status}</b><i/>{stage.detail}</div>
            </div>
            <ol className="journey-rail" aria-label={t("Les sept étapes du parcours")} style={{'--rail-progress':`${active / (STAGES.length - 1) * 100}%`}}>
              {STAGES.map((item,index)=><li key={item.label} className={index===active?'is-active':index<active?'is-complete':''}>
                <button ref={el=>{railRefs.current[index]=el}} onClick={()=>selectStage(index)} onKeyDown={e=>onRailKeyDown(e,index)} aria-current={active===index?'step':undefined} aria-label={`${t("Étape")} ${index+1} : ${item.label}`}><span className="journey-rail-dot">{index<active&&<Check size={10}/>}</span><span className="journey-label-full">{item.label}</span><span className="journey-label-short" aria-hidden="true">{SHORT_LABELS[index]}</span></button>
              </li>)}
            </ol>
          </div>
          <div className="journey-right">
            <div className="journey-story" aria-live={pinned ? "off" : "polite"} aria-atomic="true">
              <div className="journey-story-content" key={active}>
              <div className="journey-owner"><span><Icon size={23}/></span><div><b>{stage.product}</b><small>{stage.role}</small></div></div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              </div>
            </div>
            <a className="btn btn-primary journey-cta" href="/solutions">{t("Découvrir les solutions")} <ArrowRight size={17}/></a>
            <div className="journey-controls">
              <span className="journey-step-count">0{active+1}<span> / 07</span></span>
              <button aria-label={t("Étape précédente")} disabled={active===0} onClick={()=>selectStage(active-1)}><ArrowLeft size={18}/></button>
              <button aria-label={active===6?t("Recommencer le parcours"):t("Étape suivante")} onClick={()=>selectStage(active===6?0:active+1)}>{active===6?<RotateCcw size={17}/>:<ArrowRight size={18}/>}</button>
            </div>
          </div>
        </div>
        <div className="journey-bottom"><span><ArrowDown size={13}/>{pinned?t("Défilez pour faire avancer le parcours"):t("Sélectionnez une étape pour explorer le parcours")}</span><small>{t("Scénario illustratif · Données de démonstration")}</small><a href="/solutions">{t("Passer le parcours")} <ArrowRight size={13}/></a></div>
      </div>
    </div>
  </section>
}
