import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, Check, CircleCheck, FileText, Route, Package, PackageCheck, RotateCcw, ShoppingCart, Truck, BarChart3, Warehouse } from 'lucide-react'
import JourneyMap from './JourneyMap.jsx'
import './LogisticsJourney.css'

const STAGES = [
  { label: 'Réception', product: 'WMS', role: 'Réception du stock', title: 'Tout commence ici.', description: 'Les produits arrivent à l’entrepôt. Les quantités reçues sont vérifiées et chaque article trouve son emplacement, prêt pour la prochaine commande.', icon: Warehouse, badge: 'Entrepôt · Casablanca', status: 'Stock réceptionné', detail: 'Allée A · Étagère 04' },
  { label: 'Commande', product: 'TMS', role: 'Gestion des commandes', title: 'Une commande arrive.', description: 'Une nouvelle commande de livraison est créée. Le client, son adresse, les articles et les informations de livraison sont réunis dans une fiche claire.', icon: ShoppingCart, badge: 'Commande GL-2048', status: 'Nouvelle commande', detail: '2 articles · 349 MAD' },
  { label: 'Planification', product: 'TMS', role: 'Tournées et affectations', title: 'La bonne tournée.', description: 'La livraison est affectée à un chauffeur et à un véhicule. L’itinéraire tient compte des créneaux horaires, des capacités de chargement et des autres arrêts de la tournée.', icon: Route, badge: 'Tournée · TR-2048', status: 'Livraison planifiée', detail: 'Chauffeur et véhicule affectés' },
  { label: 'Préparation', product: 'WMS', role: 'Préparation des colis', title: 'Prêt à partir.', description: 'Les produits sont prélevés et ajoutés au colis. La préparation par client et le bon de livraison accompagnent le passage de l’entrepôt à l’expédition.', icon: PackageCheck, badge: 'Préparation · Colis 2048', status: 'Colis préparé', detail: '2 articles vérifiés' },
  { label: 'Expédition', product: 'TMS', role: 'Suivi GPS', title: 'En route.', description: 'Le colis quitte l’entrepôt. Le suivi GPS permet de visualiser le véhicule et de suivre l’avancement de sa tournée depuis le TMS.', icon: Truck, badge: 'Expédition · GL-2048', status: 'Commande expédiée', detail: 'Casablanca · Tournée en cours' },
  { label: 'Livraison', product: 'TMS', role: 'Suivi de la livraison', title: 'Bien arrivé.', description: 'Le chauffeur enregistre la livraison depuis son application mobile. Une signature, une photo ou une note documente la remise du colis et complète l’historique.', icon: CircleCheck, badge: 'Livraison · GL-2048', status: 'Commande livrée', detail: '2 articles remis' },
  { label: 'Bilan', product: 'TMS', role: 'Tableau de bord', title: 'Chaque livraison compte.', description: 'Suivez la ponctualité des livraisons, l’utilisation de votre flotte et le coût par livraison. Les rapports vous aident à analyser vos tournées et à améliorer les prochaines.', icon: BarChart3, badge: 'Bilan · GL-2048', status: 'Rapport de livraison disponible', detail: 'Tournée TR-2048' },
]


const SHORT_LABELS = ['Stock', 'Création', 'Planifier', 'Préparer', 'Expédier', 'Livrer', 'Bilan']
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

function StageVisual({ active }) {
  if (active === 0 || active === 4) return null
  if (active === 2) return <div className="journey-overlay journey-picking" key={active}>
    <div className="journey-card-heading"><span className="journey-card-icon"><Route size={20}/></span><div><strong>Tournée planifiée</strong><small>TMS · TR-2048</small></div><span className="journey-online">Exemple</span></div>
    <div className="journey-picking-row"><CircleCheck/><div><strong>Chauffeur et véhicule affectés</strong><small>Capacité de chargement vérifiée</small></div></div>
    <div className="journey-picking-row"><CircleCheck/><div><strong>Créneau : 14 h – 16 h</strong><small>Casablanca · Arrêt 03</small></div></div>
    <div className="journey-card-foot"><Route size={14}/> Itinéraire et séquence des arrêts définis</div>
  </div>
  if (active === 1) return <div className="journey-overlay journey-order" key={active}>
    <div className="journey-card-heading"><span className="journey-card-icon"><ShoppingCart size={20}/></span><div><strong>Nouvelle commande</strong><small>TMS · GL-2048</small></div><span className="journey-status-pill">Nouveau</span></div>
    <div className="journey-order-client"><span>SA</span><div><strong>Sara Amrani</strong><small>Casablanca, Maroc</small></div></div>
    <div className="journey-item"><Package size={18}/><span>Article A <small>Quantité : 1</small></span><b>249 MAD</b></div>
    <div className="journey-item"><Package size={18}/><span>Article B <small>Quantité : 1</small></span><b>100 MAD</b></div>
    <div className="journey-total"><span>Valeur des articles</span><strong>349 <small>MAD</small></strong></div>
  </div>
  if (active === 3) return <div className="journey-overlay journey-picking" key={active}>
    <div className="journey-card-heading"><span className="journey-card-icon"><PackageCheck size={20}/></span><div><strong>Préparation du colis</strong><small>WMS · Colis 2048</small></div></div>
    <div className="journey-picking-row"><CircleCheck/><div><strong>Article A · 1 unité</strong><small>Allée A / Étagère 04</small></div><span>Vérifié</span></div>
    <div className="journey-picking-row"><CircleCheck/><div><strong>Article B · 1 unité</strong><small>Allée B / Étagère 02</small></div><span>Vérifié</span></div>
    <div className="journey-delivery-note"><FileText size={20}/><div><strong>Bon de livraison</strong><small>BL-2048 · Colis prêt à expédier</small></div><Check size={18}/></div>
  </div>
  return <div className={`journey-overlay journey-complete ${active===6?'is-finance':''}`} key={active}>
    <div className="journey-success-icon">{active===5?<Check size={35}/>:<BarChart3 size={32}/>}</div>
    <p>{active===5?'Livraison terminée':'Bilan de la tournée'}</p>
    <strong className="journey-success-number">{active===5?'GL-2048':<>1 <small>livraison</small></>}</strong>
    <ul>{(active===5?['Statut « Livrée » enregistré','Preuve de livraison enregistrée','2 articles remis au destinataire']:['Livraison ajoutée au rapport','Indicateurs de tournée consultables','Analyse des coûts disponible']).map(line=><li key={line}><Check size={15}/>{line}</li>)}</ul>
  </div>
}

export default function LogisticsJourney() {
  const sectionRef = useRef(null)
  const mapRef = useRef(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)
  const railRefs = useRef([])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 901px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)')
    const update = () => setPinned(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    activeRef.current = active
    if (pinned) return
    const progress = active >= 5 ? 1 : active === 4 ? .6 : 0
    mapRef.current?.setProgress(progress)
  }, [active, pinned])

  useEffect(() => {
    if (!pinned) return
    let frame = 0
    let visible = false
    const update = () => {
      frame = 0
      const rect = sectionRef.current.getBoundingClientRect()
      const progress = clamp(-rect.top / Math.max(1, sectionRef.current.offsetHeight - window.innerHeight))
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
      const start = window.scrollY + section.getBoundingClientRect().top
      const midpoint = (next + .5) / STAGES.length
      window.scrollTo({ top: start + midpoint * (section.offsetHeight - window.innerHeight), behavior: 'smooth' })
    } else setActive(next)
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
          <div className="eyebrow"><span/> Du stock à la livraison</div>
          <h2 id="journey-title">Un colis. Toute une histoire.</h2>
          <p>{pinned?'Faites défiler pour suivre':'Explorez les étapes pour suivre'} une commande, de l’entrepôt à la livraison, avec les solutions WMS et TMS de Grow Logistics.</p>
        </div>
        <div className="journey-stage">
          <div className="journey-left">
            <div className={`journey-scene ${active!==0&&active!==4?'has-overlay':''}`}>
              <JourneyMap ref={mapRef}/>
              <div className="journey-map-badge"><span/>{stage.badge}</div>
              <StageVisual active={active}/>
              <div className="journey-map-stat"><span className={active>=5?'is-delivered':''}/><b>{stage.status}</b><i/>{stage.detail}</div>
            </div>
            <ol className="journey-rail" aria-label="Les sept étapes du parcours" style={{'--rail-progress':`${active / (STAGES.length - 1) * 100}%`}}>
              {STAGES.map((item,index)=><li key={item.label} className={index===active?'is-active':index<active?'is-complete':''}>
                <button ref={el=>{railRefs.current[index]=el}} onClick={()=>selectStage(index)} onKeyDown={e=>onRailKeyDown(e,index)} aria-current={active===index?'step':undefined} aria-label={`Étape ${index+1} : ${item.label}`}><span className="journey-rail-dot">{index<active&&<Check size={10}/>}</span><span className="journey-label-full">{item.label}</span><span className="journey-label-short" aria-hidden="true">{SHORT_LABELS[index]}</span></button>
              </li>)}
            </ol>
          </div>
          <div className="journey-right">
            <div className="journey-story" aria-live="polite" aria-atomic="true">
              <div className="journey-story-content" key={active}>
              <div className="journey-owner"><span><Icon size={23}/></span><div><b>{stage.product}</b><small>{stage.role}</small></div></div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              </div>
            </div>
            <a className="btn btn-primary journey-cta" href="/solutions">Découvrir les solutions <ArrowRight size={17}/></a>
            <div className="journey-controls">
              <span className="journey-step-count">0{active+1}<span> / 07</span></span>
              <button aria-label="Étape précédente" disabled={active===0} onClick={()=>selectStage(active-1)}><ArrowLeft size={18}/></button>
              <button aria-label={active===6?'Recommencer le parcours':'Étape suivante'} onClick={()=>selectStage(active===6?0:active+1)}>{active===6?<RotateCcw size={17}/>:<ArrowRight size={18}/>}</button>
            </div>
          </div>
        </div>
        <div className="journey-bottom"><span><ArrowDown size={13}/>{pinned?'Défilez pour faire avancer le parcours':'Sélectionnez une étape pour explorer le parcours'}</span><small>Scénario illustratif · Données de démonstration</small><a href="/solutions">Passer le parcours <ArrowRight size={13}/></a></div>
      </div>
    </div>
  </section>
}
