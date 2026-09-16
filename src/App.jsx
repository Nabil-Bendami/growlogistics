import LanguageSwitch from './components/LanguageSwitch.jsx'
import { t, locale } from './i18n/index.js'
import StickyNavigation from './components/StickyNavigation.jsx'
import LogisticsMotion from './components/LogisticsMotion.jsx'
import AnimatedNumber from './components/AnimatedNumber.jsx'
import useExtraMotion from './hooks/useExtraMotion.js'
import useSiteMotion from './hooks/useSiteMotion.js'
import FeaturePage from './components/FeaturePage.jsx'
import { featureDetails } from './data/featureDetails.js'
import { useEffect, useRef, useState } from 'react'
import LogisticsJourney from './components/LogisticsJourney.jsx'
import HeroArtwork from './components/HeroArtwork.jsx'
import DisciplineVideo from './components/DisciplineVideo.jsx'
import { transportVideo, warehouseVideo } from './components/heroVideos.js'
import ProductVisual from './components/ProductVisual.jsx'
import './components/AboutEditorial.css'
import './components/DestinationPage.css'
import FullscreenMenu from './components/FullscreenMenu.jsx'
import WorldConnectionsMap from './components/WorldConnectionsMap.jsx'
import {
  ArrowRight, BarChart3, Boxes, ChevronRight, CircleCheck,
  Headphones, PackageCheck,
  Play, Search, ShieldCheck, ShoppingCart, Sparkles,
  TrendingUp, Truck, Warehouse, X, Zap,
} from 'lucide-react'

const products = {
  tms: {
    eyebrow: 'Transport Management',
    title: 'TMS',
    description: t("Pilotez vos transports, de la planification à la preuve de livraison. Optimisez les tournées, affectez les chauffeurs et véhicules, et suivez votre flotte en temps réel."),
    bullets: [t("Optimisation des itinéraires et capacités"), t("Suivi GPS des véhicules et alertes"), t("Application chauffeur et preuve de livraison")],
    color: 'var(--cobalt)',
  },
  wms: {
    eyebrow: 'Warehouse Management',
    title: 'WMS',
    description: t("Une maîtrise complète de l’entrepôt, de la réception jusqu’à l’expédition. Retrouvez vos stocks, emplacements et préparations dans le même outil."),
    bullets: [t("Réception normale ou globale"), t("Inventaire et emplacements"), t("Préparation et bons de livraison")],
    color: 'var(--deep-navy)',
  },
}

const features = [
  { icon: ShoppingCart, num: '01', title: t("Tournées optimisées"), text: t("Planifiez les itinéraires selon les créneaux de livraison, les capacités des véhicules et la disponibilité des chauffeurs.") },
  { icon: Boxes, num: '02', title: t("Stock en mouvement"), text: t("Réceptions, réapprovisionnements, inventaire et produits endommagés dans un seul flux.") },
  { icon: Warehouse, num: '03', title: t("Entrepôts maîtrisés"), text: t("Organisez magasins, zones, allées et étagères pour savoir exactement où se trouve chaque article.") },
  { icon: BarChart3, num: '04', title: t("Flotte et chauffeurs"), text: t("Suivez vos véhicules par GPS, répartissez les missions et gérez la maintenance de votre flotte.") },
  { icon: PackageCheck, num: '05', title: t("Préparation rapide"), text: t("Préparez les colis par client, créez vos bons de livraison et fluidifiez l’expédition.") },
  { icon: ShieldCheck, num: '06', title: t("Livraisons documentées"), text: t("L’application chauffeur réunit navigation, contact client et preuves de livraison par signature, photo ou note.") },
]

const statuses = [
  [t("Nouveau"), 28, 'var(--pale-sky)'], [t("Confirmé"), 20, 'var(--cobalt)'], [t("Expédié"), 18, 'var(--sand-gray)'],
  [t("Livré"), 46, 'var(--deep-navy)'], [t("Retourné"), 9, 'var(--text-muted)'], [t("Annulé"), 6, 'var(--sand-gray)'],
]

function Logo({ light = false }) {
  return <a className={`logo ${light ? 'logo-light' : ''}`} href="/" aria-label={t("Grow Logistics — accueil")}>
    <svg className="ship-mark" viewBox="0 0 80 80" aria-hidden="true">
      <path d="M31 3h18v7h13v20l9 4-10 28H20L10 34l9-4V10h12zm-5 15v10l14-5 15 5V18z" fill="currentColor"/>
      <path d="M4 66q8-6 16 0t16 0t16 0t16 0t8 0M4 76q8-6 16 0t16 0t16 0t16 0t8 0" fill="none" stroke="currentColor" strokeWidth="5"/>
    </svg>
    <span className="logo-copy"><b>Grow</b><small>LOGISTICS</small></span>
  </a>
}

function Header() {
  const [menu, setMenu] = useState(null)
  const [panel, setPanel] = useState(null)
  const [query, setQuery] = useState('')
  const dialog = useRef(null)
  const panelButton = useRef(null)
  const links = [
    {title:t("Le parcours d’un colis"),detail:t("Démonstration · Stock · Planification · Livraison · Performance"),href:'/parcours'},
    {title:t("Nos solutions"),detail:t("TMS · Transport · Tournées · Chauffeurs · WMS · Stock · Entrepôt"),href:'/solutions'},
    {title:t("Fonctionnalités"),detail:t("Inventaire · Colis · Réception · Livraison · Retours"),href:'/fonctionnalites'},
    {title:t("Comment ça marche"),detail:t("Centralisez · Préparez · Expédiez · Analysez"),href:'/comment-ca-marche'},
    {title:t("Votre projet"),detail:t("Contact · Démonstration · Accompagnement"),href:'/contact'},
  ]
  useEffect(() => {
    if (panel && !dialog.current.open) dialog.current.showModal()
    if (!panel && dialog.current.open) dialog.current.close()
  }, [panel])
  const close = () => { setPanel(null); panelButton.current?.focus() }
  const show = (name, event) => {panelButton.current=event.currentTarget;setPanel(name)}
  return <header className="transit-header">
    <Logo light />
    <div className="transit-tools">
      <LanguageSwitch/>
      <button aria-label={t("Rechercher dans le site")} onClick={e=>show('search',e)}><Search/></button>
      <button className="transit-menu" aria-label={t("Ouvrir le menu")} aria-expanded={Boolean(menu)} aria-controls="fullscreen-menu" aria-haspopup="dialog" onClick={e=>{const rect=e.currentTarget.getBoundingClientRect();setMenu({trigger:e.currentTarget,origin:{x:rect.left+rect.width/2,y:rect.top+rect.height/2}})}}><span/><span/><span/></button>
    </div>
    {menu&&<FullscreenMenu origin={menu.origin} trigger={menu.trigger} onDismiss={()=>setMenu(null)}/>}
    <dialog ref={dialog} className="navigation-dialog" onCancel={close} onClick={e=>{if(e.target===dialog.current)close()}}>
      <div className="navigation-inner">
        <button className="dialog-close" aria-label={t("Fermer")} onClick={close}><X/></button>
        <p className="dialog-kicker">GROW LOGISTICS</p>
        <h2>{panel==='search'?t("Que recherchez-vous ?"):t("Chaque mouvement compte.")}</h2>
        {panel==='search'&&<label className="site-search"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder={t("Commandes, stock, livraison…")} aria-label={t("Recherche")}/></label>}
        <nav aria-label={t("Navigation principale")}>
          {links.filter(link=>panel!=='search'||`${link.title} ${link.detail}`.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale))).map((link,i)=><a key={link.href} href={link.href} onClick={close}><small>0{i+1}</small><span>{link.title}{panel==='search'&&<small>{link.detail}</small>}</span><ArrowRight/></a>)}
          {panel==='search'&&!links.some(link=>`${link.title} ${link.detail}`.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale)))&&<p>{t("Aucun résultat. Essayez « stock » ou « commandes ».")}</p>}
        </nav>
      </div>
    </dialog>
  </header>
}

function Hero() {
  const [active,setActive] = useState(0)
  const slides = [
    {lead:t("Votre"),title:t("Logistique"),end:t("Simplifiée"),text:t("Grow Logistics accompagne vos opérations de transport et d’entrepôt. Planifiez vos tournées, suivez vos véhicules et vos livraisons avec le TMS. Organisez vos stocks, vos réceptions et vos préparations avec le WMS."),link:'/solutions',label:t("Découvrir nos solutions")},
    {lead:t("Vos"),title:t("Tournées"),end:t("Optimisées"),text:t("Avec le TMS, planifiez vos livraisons selon les créneaux horaires et la capacité des véhicules. Affectez vos chauffeurs, suivez leur position par GPS et retrouvez les preuves de livraison depuis une plateforme centralisée."),link:'/solutions',label:t("Découvrir le TMS")},
    {lead:t("Votre"),title:t("Entrepôt"),end:t("Organisé"),text:t("Avec le WMS, suivez vos produits dès leur réception. Gérez les emplacements, les réapprovisionnements et la préparation des colis. Des espaces client et administrateur accompagnent chaque étape, jusqu’au bon de livraison."),link:'/solutions',label:t("Découvrir le WMS")},
  ]
  const slide=slides[active]
  return <section className="transit-hero" id="top" aria-label={t("Présentation des solutions")}>
    <HeroArtwork/>
    <Header />
    <div className="transit-copy" aria-live="polite" aria-atomic="true">
      <div className="slide-copy" key={active}>
        <h1><span className="transit-lead">{slide.lead}</span><span className="transit-title">{slide.title}</span><span className="transit-end">{slide.end}</span></h1>
        <p>{slide.text}</p>
      </div>
      <a className="transit-discover" href={slide.link}>{slide.label}<ArrowRight size={17}/></a>
      <div className="transit-dots" aria-label={t("Choisir une présentation")} onKeyDown={e=>{if(['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault(); const next=(active+(e.key==='ArrowRight'?1:2))%3;setActive(next);e.currentTarget.children[next].focus()}}}>
        {slides.map((item,i)=><button key={item.title} className={active===i?'active':''} onClick={()=>setActive(i)} aria-label={`${t("Présentation")} ${i+1} : ${item.title}`} aria-pressed={active===i}/>)}
      </div>
    </div>
  </section>
}

function About() {
  const disciplines = [
    { number: '001.', label: 'TRANSPORT', title: t("Des tournées aux livraisons."), video: transportVideo, poster: '/assets/transit-banner.png', image: '/assets/transit-banner.png', alt: t("Transport et opérations logistiques"), description: t("Planifiez vos tournées, coordonnez vos chauffeurs et suivez chaque livraison. Notre TMS relie vos équipes au terrain pour garder une vision claire de vos opérations."), tags: [t("Planification des tournées"), t("Suivi de flotte"), t("Preuve de livraison")] },
    { number: '002.', label: t("ENTREPÔT"), title: t("Du stock à l’expédition."), video: warehouseVideo, poster: '/assets/warehouse-hero.png', image: '/assets/warehouse-hero.png', alt: t("Allées et rayonnages d’un entrepôt logistique"), description: t("Réceptions, emplacements, inventaires et préparation : notre WMS réunit chaque mouvement de votre entrepôt dans un même outil. Vos équipes savent où agir, à chaque étape."), tags: [t("Gestion des stocks"), t("Préparation des colis"), t("Expédition")] },
  ]
  return <section id="about" className="about-editorial" aria-labelledby="about-title">
    <div className="about-editorial-frame">
      <div className="about-editorial-top"><span>GROW LOGISTICS®</span><span>{t("DEUX SOLUTIONS.")} <b>{t("UNE MÊME AMBITION.")}</b></span></div>
      <div className="about-editorial-layout">
        <div className="about-editorial-intro">
          <div className="about-editorial-sticky">
            <div className="about-editorial-label"><span className="about-editorial-mark" aria-hidden="true"><i/><i/><i/><i/></span><span>{t("[ GL® — À PROPOS ]")}</span></div>
            <h2 id="about-title">{t("La logistique,")}<br/>{t("plus simple.")}</h2>
            <p>{t("Vos commandes, votre stock, vos équipes. Deux solutions complémentaires pour rendre votre quotidien plus simple.")}</p>
            <a className="about-editorial-link" href="/solutions">{t("Découvrir nos solutions")} <ArrowRight size={20}/></a>
          </div>
        </div>
        <div className="about-editorial-disciplines">
          {disciplines.map(item => <article className="about-editorial-article" key={item.number}>
            <header><div className="about-editorial-index">{item.number} <span>/ {item.label}</span></div><h3>{item.title}</h3></header>
            <div className="about-editorial-image">{item.video
              ? <DisciplineVideo src={item.video} poster={item.poster} label={item.alt}/>
              : <img src={item.image} alt={item.alt} loading="lazy" width="1440" height="900"/>}</div>
            <div className="about-editorial-detail"><p>{item.description}</p><ul>{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
          </article>)}
        </div>
      </div>
      <div className="about-editorial-bottom"><span>{t("DU TERRAIN À LA DÉCISION.")}</span><span>{t("TRANSPORT / ENTREPÔT")}</span></div>
    </div>
  </section>
}

function Solutions() {
  const [active, setActive] = useState('tms')
  const product = products[active]
  return <section className="solutions section" id="solutions">
    <div className="wrap">
      <div className="section-head centered">
        <div className="eyebrow"><span/> {t("Une suite, deux expertises")}</div>
        <h2>{t("Du premier clic au dernier kilomètre.")}</h2>
        <p>{t("Deux solutions complémentaires pour piloter vos transports et les opérations de votre entrepôt.")}</p>
      </div>
      <div className="product-switch" role="tablist">
        <button className={active === 'tms' ? 'active' : ''} onClick={()=>setActive('tms')}><Truck size={19}/> TMS <small>Transport Management</small></button>
        <button className={active === 'wms' ? 'active green' : ''} onClick={()=>setActive('wms')}><Warehouse size={19}/> WMS <small>Warehouse Management</small></button>
      </div>
      <div className="product-panel">
        <div className="product-copy" key={active}>
          <span className="product-tag" style={{color:product.color}}>{product.eyebrow}</span>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <ul>{product.bullets.map(item=><li key={item}><CircleCheck size={18} style={{color:product.color}}/>{item}</li>)}</ul>
          <a href="/contact" className="text-link" style={{color:product.color}}>{t("Explorer")} {product.title} <ArrowRight size={17}/></a>
        </div>
        <ProductVisual key={`visual-${active}`} active={active}/>
      </div>
    </div>
  </section>
}

function Features() {
  return <section className="features section" id="fonctionnalites">
    <div className="wrap">
      <div className="section-head split">
        <div><div className="eyebrow"><span/> {t("Tout ce qu’il faut")}</div><h2>{t("Moins de friction.")}<br/>{t("Plus de contrôle.")}</h2></div>
        <p>{t("Une suite conçue autour des vrais flux logistiques : précise pour les opérateurs, lisible pour les décideurs.")}</p>
      </div>
      <div className="feature-grid">{features.map(({icon:Icon,num,title,text}, index)=><article className="feature-card" key={num}>
        <span className="feature-num">{num}</span><div className="icon-box"><Icon size={23}/></div><h3>{title}</h3><p>{text}</p><a href={`/fonctionnalites/${featureDetails[index].slug}`} aria-label={`${t("En savoir plus sur")} ${title}`}><ChevronRight size={19}/></a>
      </article>)}</div>
    </div>
  </section>
}

function Dashboard() {
  const [period, setPeriod] = useState(t("7 jours"))
  return <section className="dashboard-section section">
    <div className="wrap dashboard-layout">
      <div className="dashboard-copy">
        <div className="eyebrow light"><span/> {t("Décidez avec les bons chiffres")}</div>
        <h2>{t("Votre activité.")}<br/><em>{t("En un coup d’œil.")}</em></h2>
        <p>{t("Suivez les indicateurs qui comptent vraiment et filtrez vos performances par ville, zone, statut ou période.")}</p>
        <div className="dashboard-points">
          <div><span><Zap size={18}/></span><p><b>{t("Une vue instantanée")}</b><small>{t("Commandes, stock et livraisons actualisés.")}</small></p></div>
          <div><span><BarChart3 size={18}/></span><p><b>{t("Des KPIs exploitables")}</b><small>{t("Ponctualité, utilisation de la flotte et coût par livraison.")}</small></p></div>
        </div>
      </div>
      <div className="analytics-card">
        <div className="analytics-top"><div><small>{t("TABLEAU DE BORD · DONNÉES DE DÉMONSTRATION")}</small><h3>{t("Performance globale")}</h3></div><div className="periods">{[t("7 jours"),t("30 jours")].map(p=><button key={p} onClick={()=>setPeriod(p)} className={period===p?'active':''}>{p}</button>)}</div></div>
        <div className="analytics-kpis"><div><span>{t("Commandes totales")}</span><AnimatedNumber value={period===t("7 jours")?2846:11420}/><small>{t("↗ 12,4%")}</small></div><div><span>{t("Taux de livraison")}</span><AnimatedNumber value={78.6} decimals={1} suffix="%"/><small>{t("↗ 4,2%")}</small></div><div><span>{t("Véhicules actifs")}</span><AnimatedNumber value={period===t("7 jours")?24:68}/><small>{t("sur la période")}</small></div></div>
        <div className="analytics-body">
          <div className="line-chart"><div className="grid-lines"><i/><i/><i/><i/></div><svg viewBox="0 0 540 170" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--cobalt)" stopOpacity=".28"/><stop offset="1" stopColor="var(--cobalt)" stopOpacity="0"/></linearGradient></defs><path d="M0 138 C60 118 66 130 112 98 S190 112 226 77 S307 91 344 52 S426 70 470 31 S520 35 540 18 L540 170 L0 170Z" fill="url(#fill)"/><path d="M0 138 C60 118 66 130 112 98 S190 112 226 77 S307 91 344 52 S426 70 470 31 S520 35 540 18" pathLength="1" fill="none" stroke="var(--cobalt)" strokeWidth="4" strokeLinecap="round"/></svg><div className="axis"><span>{t("Lun")}</span><span>{t("Mar")}</span><span>{t("Mer")}</span><span>{t("Jeu")}</span><span>{t("Ven")}</span><span>{t("Sam")}</span><span>{t("Dim")}</span></div></div>
          <div className="status-list">{statuses.slice(0,4).map(([name,val,color])=><div key={name}><span><i style={{background:color}}/>{name}<b>{val}%</b></span><progress aria-label={name} value={val} max="50" style={{'--status-color':color}}/></div>)}</div>
        </div>
      </div>
    </div>
  </section>
}

function Workflow() {
  const steps=[
    {n:'01',icon:ShoppingCart,title:t("Centralisez"),text:t("Créez vos commandes dans le TMS et importez vos produits ou colis dans le WMS via Excel.")},
    {n:'02',icon:Warehouse,title:t("Orchestrez"),text:t("Réceptionnez les produits, choisissez leurs emplacements et préparez les colis par client.")},
    {n:'03',icon:Truck,title:t("Expédiez"),text:t("Planifiez les tournées, affectez les véhicules et suivez les livraisons avec l’application chauffeur.")},
    {n:'04',icon:TrendingUp,title:t("Optimisez"),text:t("Analysez vos KPIs et améliorez chaque étape de votre chaîne logistique.")},
  ]
  return <section className="workflow section" id="workflow"><div className="wrap">
    <div className="section-head centered"><div className="eyebrow"><span/> {t("Un flux sans rupture")}</div><h2>{t("Simple à prendre en main.")}<br/>{t("Puissant sur le terrain.")}</h2></div>
    <div className="steps">{steps.map(({n,icon:Icon,title,text},i)=><article key={n}><span className="step-number">{n}</span><div className="step-icon"><Icon/></div><h3>{title}</h3><p>{text}</p>{i<steps.length-1&&<ArrowRight className="step-arrow"/>}</article>)}</div>
    <div className="quality-band">
      <div className="quality-title"><Sparkles/><span><small>{t("PENSÉ POUR VOTRE QUOTIDIEN")}</small><b>{t("Chaque étape à sa place.")}</b></span></div>
      <div><strong>2</strong><span>{t("solutions métier")}</span></div><div><strong>GPS</strong><span>{t("suivi de la flotte")}</span></div><div><strong>2</strong><span>{t("espaces WMS : client et admin")}</span></div>
    </div>
  </div></section>
}

function Contact() {
  const [emailDraft, setEmailDraft] = useState('')
  const submit = e => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const content = `${t("Bonjour,")}\n\n${t("Je souhaite une démonstration de Grow Logistics.")}\n\n${t("Nom")} : ${data.get('name')}\nEmail : ${data.get('email')}\n${t("Téléphone")} : ${data.get('phone')}\nSolution : ${data.get('solution')}\n\n${t("Merci de me recontacter pour discuter de mon projet.")}`
    const url = `mailto:bendaminabil@gmail.com?subject=${encodeURIComponent(t("Demande de démonstration — Grow Logistics"))}&body=${encodeURIComponent(content)}`
    setEmailDraft(url)
    window.location.href = url
  }
  return <section className="contact" id="contact"><div className="contact-shape"/><div className="wrap contact-inner">
    <div><div className="eyebrow light"><span/> {t("Passons à l’action")}</div><h2>{t("Prêt à faire grandir")}<br/>{t("vos opérations\u00a0?")}</h2><p>{t("Voyez comment Grow Logistics peut s’adapter à votre organisation et à vos volumes.")}</p><div className="contact-note"><Headphones/><span><b>{t("Un accompagnement humain")}</b><small>{t("De la prise en main jusqu’au déploiement.")}</small></span></div></div>
    <form onSubmit={submit} className="contact-form">
        <div className="form-head"><span><Play fill="currentColor"/></span><div><small>{t("DÉMO PERSONNALISÉE")}</small><h3>{t("Découvrez la plateforme")}</h3></div></div>
        <label>{t("Nom complet")}<input name="name" autoComplete="name" required placeholder={t("Votre nom")}/></label>
        <label>{t("Email professionnel")}<input name="email" autoComplete="email" required type="email" placeholder={t("nom@entreprise.com")}/></label>
        <label>{t("Téléphone")}<input name="phone" autoComplete="tel" required type="tel" placeholder="+212 6 00 00 00 00"/></label>
        <label>{t("Solution recherchée")}<select name="solution" required defaultValue=""><option value="" disabled>{t("Choisir une solution")}</option><option>{t("TMS — Gestion du transport")}</option><option>{t("WMS — Gestion d’entrepôt")}</option><option>{t("La suite complète")}</option></select></label>
        <button className="btn btn-primary" type="submit">{t("Demander par email")} <ArrowRight size={18}/></button>
        <small className="privacy"><ShieldCheck size={14}/> {t("Votre messagerie s’ouvre pour envoyer la demande.")}</small>
        {emailDraft && <div className="contact-email-status" role="status"><p>{t("Finalisez l’envoi dans votre messagerie à")} <a href="mailto:bendaminabil@gmail.com">bendaminabil@gmail.com</a>.</p><a href={emailDraft}>{t("Rouvrir l’email préparé")} <ArrowRight size={14}/></a></div>}
    </form>
  </div></section>
}

function Footer(){return <footer><div className="wrap footer-main"><div><Logo light/><p>{t("Les solutions TMS et WMS pour vos transports et votre entrepôt.")}</p></div><div><b>Solutions</b><a href="/solutions">TMS</a><a href="/solutions">WMS</a></div><div><b>{t("Entreprise")}</b><a href="/fonctionnalites">{t("Fonctionnalités")}</a><a href="/contact">Contact</a></div><div><b>{t("Parlons-nous")}</b><a href="/contact">{t("Préparer ma demande de démo")} <ArrowRight size={14}/></a></div></div><div className="wrap footer-bottom"><span>© 2026 Grow Logistics.</span></div></footer>}

const destinationPages = {
  '/parcours': { title: t("Le parcours d’un colis"), headline: t("Un départ. Une arrivée. Chaque étape compte."), description: t("Suivez un colis de sa réception en entrepôt à sa livraison. Découvrez comment le WMS et le TMS accompagnent chaque mouvement."), number: '02', content: <LogisticsJourney/>, next: '/solutions', nextLabel: t("Découvrez les solutions derrière le parcours") },
  '/solutions': { title: t("Nos solutions"), headline: t("Deux solutions. Une logistique connectée."), description: t("Le TMS pour piloter le transport. Le WMS pour maîtriser l’entrepôt. Explorez les outils adaptés à vos opérations."), number: '03', content: <Solutions/>, next: '/fonctionnalites', nextLabel: t("Explorez toutes les fonctionnalités") },
  '/fonctionnalites': { title: t("Fonctionnalités"), headline: t("Les bons outils, à chaque mouvement."), description: t("Planification, stock, flotte et livraison : découvrez chaque fonctionnalité et son fonctionnement concret pour vos équipes."), number: '04', content: <Features/>, next: '/comment-ca-marche', nextLabel: t("Découvrez comment tout s’articule") },
  '/comment-ca-marche': { title: t("Comment ça marche"), headline: t("De la commande à la décision."), description: t("Centralisez les informations, préparez vos commandes, organisez les expéditions et analysez votre activité. Un fonctionnement pensé pour le terrain."), number: '05', content: <><Workflow/><Dashboard/></>, next: '/parcours', nextLabel: t("Vivez le parcours d’un colis") },
  '/contact': { title: t("Votre projet"), headline: t("Parlons de votre prochain mouvement."), description: t("Transport, entrepôt ou suite complète : présentez vos besoins et préparez votre demande de démonstration personnalisée."), number: '06', content: <Contact/>, next: '/solutions', nextLabel: t("Comparez nos deux solutions") },
}

function DestinationPage({ page }) {
  useEffect(() => {
    document.title = `${page.title} — Grow Logistics`
    document.querySelector('meta[name="description"]')?.setAttribute('content', page.description)
  }, [page])
  return <div className="destination-page">
    <div className="destination-masthead"><Header/></div>
    <main>
      <section className="destination-hero wrap" aria-labelledby="destination-title">
        <nav aria-label={t("Fil d’Ariane")}><a href="/">{t("Accueil")}</a><span aria-hidden="true">/</span><span aria-current="page">{page.title}</span></nav>
        <div className="destination-kicker"><span>{page.number} / GROW LOGISTICS</span><span>{page.title}</span></div>
        <h1 id="destination-title">{page.headline}</h1><p>{page.description}</p>
      </section>
      {page.content}
      <aside className="destination-next wrap"><span>{t("POUR ALLER PLUS LOIN")}</span><a href={page.next}>{page.nextLabel}<ArrowRight aria-hidden="true"/></a></aside>
    </main>
    <Footer/>
  </div>
}

function App(){
  useSiteMotion()
  useExtraMotion()
  const path = window.location.pathname.replace(/\/$/, '')
  const feature = featureDetails.find(item => path === `/fonctionnalites/${item.slug}`)
  if (feature) return <><StickyNavigation/><FeaturePage feature={feature}/></>
  if (destinationPages[path]) return <><StickyNavigation/><DestinationPage page={destinationPages[path]}/></>
  return <><StickyNavigation/><Hero/><main><About/><LogisticsMotion/><LogisticsJourney/><Solutions/><Features/><Dashboard/><Workflow/><WorldConnectionsMap/><Contact/></main><Footer/></>}

export default App
