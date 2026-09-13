import LogisticsMotion from './components/LogisticsMotion.jsx'
import AnimatedNumber from './components/AnimatedNumber.jsx'
import useExtraMotion from './hooks/useExtraMotion.js'
import useSiteMotion from './hooks/useSiteMotion.js'
import FeaturePage from './components/FeaturePage.jsx'
import { featureDetails } from './data/featureDetails.js'
import { useEffect, useRef, useState } from 'react'
import LogisticsJourney from './components/LogisticsJourney.jsx'
import HeroArtwork from './components/HeroArtwork.jsx'
import ProductVisual from './components/ProductVisual.jsx'
import ProductVideo from './components/ProductVideo.jsx'
import AboutScene from './components/AboutScene.jsx'
import FullscreenMenu from './components/FullscreenMenu.jsx'
import WorldConnectionsMap from './components/WorldConnectionsMap.jsx'
import {
  ArrowRight, BarChart3, Boxes, ChevronRight, CircleCheck,
  Headphones, PackageCheck, UserRound,
  Play, Search, ShieldCheck, ShoppingCart, Sparkles,
  TrendingUp, Truck, Warehouse, X, Zap,
} from 'lucide-react'

const products = {
  tms: {
    eyebrow: 'Transport Management',
    title: 'TMS',
    description: 'Pilotez vos transports, de la planification à la preuve de livraison. Optimisez les tournées, affectez les chauffeurs et véhicules, et suivez votre flotte en temps réel.',
    bullets: ['Optimisation des itinéraires et capacités', 'Suivi GPS des véhicules et alertes', 'Application chauffeur et preuve de livraison'],
    color: 'var(--cobalt)',
  },
  wms: {
    eyebrow: 'Warehouse Management',
    title: 'WMS',
    description: 'Une maîtrise complète de l’entrepôt, de la réception jusqu’à l’expédition. Retrouvez vos stocks, emplacements et préparations dans le même outil.',
    bullets: ['Réception normale ou globale', 'Inventaire et emplacements', 'Préparation et bons de livraison'],
    color: 'var(--deep-navy)',
  },
}

const features = [
  { icon: ShoppingCart, num: '01', title: 'Tournées optimisées', text: 'Planifiez les itinéraires selon les créneaux de livraison, les capacités des véhicules et la disponibilité des chauffeurs.' },
  { icon: Boxes, num: '02', title: 'Stock en mouvement', text: 'Réceptions, réapprovisionnements, inventaire et produits endommagés dans un seul flux.' },
  { icon: Warehouse, num: '03', title: 'Entrepôts maîtrisés', text: 'Organisez magasins, zones, allées et étagères pour savoir exactement où se trouve chaque article.' },
  { icon: BarChart3, num: '04', title: 'Flotte et chauffeurs', text: 'Suivez vos véhicules par GPS, répartissez les missions et gérez la maintenance de votre flotte.' },
  { icon: PackageCheck, num: '05', title: 'Préparation rapide', text: 'Préparez les colis par client, créez vos bons de livraison et fluidifiez l’expédition.' },
  { icon: ShieldCheck, num: '06', title: 'Livraisons documentées', text: 'L’application chauffeur réunit navigation, contact client et preuves de livraison par signature, photo ou note.' },
]

const statuses = [
  ['Nouveau', 28, 'var(--pale-sky)'], ['Confirmé', 20, 'var(--cobalt)'], ['Expédié', 18, 'var(--sand-gray)'],
  ['Livré', 46, 'var(--deep-navy)'], ['Retourné', 9, 'var(--text-muted)'], ['Annulé', 6, 'var(--sand-gray)'],
]

function Logo({ light = false }) {
  return <a className={`logo ${light ? 'logo-light' : ''}`} href="#top" aria-label="Grow Logistics — accueil">
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
    {title:'Le parcours d’un colis',detail:'Démonstration · Stock · Planification · Livraison · Performance',href:'#parcours'},
    {title:'Nos solutions',detail:'TMS · Transport · Tournées · Chauffeurs · WMS · Stock · Entrepôt',href:'#solutions'},
    {title:'Fonctionnalités',detail:'Inventaire · Colis · Réception · Livraison · Retours',href:'#fonctionnalites'},
    {title:'Comment ça marche',detail:'Centralisez · Préparez · Expédiez · Analysez',href:'#workflow'},
    {title:'Votre projet',detail:'Contact · Démonstration · Accompagnement',href:'#contact'},
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
      <a href="#contact" aria-label="Parlons de votre projet"><UserRound fill="currentColor" strokeWidth={1.5}/></a>
      <button aria-label="Rechercher dans le site" onClick={e=>show('search',e)}><Search/></button>
      <button className="transit-menu" aria-label="Ouvrir le menu" aria-expanded={Boolean(menu)} aria-controls="fullscreen-menu" aria-haspopup="dialog" onClick={e=>{const rect=e.currentTarget.getBoundingClientRect();setMenu({trigger:e.currentTarget,origin:{x:rect.left+rect.width/2,y:rect.top+rect.height/2}})}}><span/><span/><span/></button>
    </div>
    {menu&&<FullscreenMenu origin={menu.origin} trigger={menu.trigger} onDismiss={()=>setMenu(null)}/>}
    <dialog ref={dialog} className="navigation-dialog" onCancel={close} onClick={e=>{if(e.target===dialog.current)close()}}>
      <div className="navigation-inner">
        <button className="dialog-close" aria-label="Fermer" onClick={close}><X/></button>
        <p className="dialog-kicker">GROW LOGISTICS</p>
        <h2>{panel==='search'?'Que recherchez-vous ?':'Chaque mouvement compte.'}</h2>
        {panel==='search'&&<label className="site-search"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Commandes, stock, livraison…" aria-label="Recherche"/></label>}
        <nav aria-label="Navigation principale">
          {links.filter(link=>panel!=='search'||`${link.title} ${link.detail}`.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr'))).map((link,i)=><a key={link.href} href={link.href} onClick={close}><small>0{i+1}</small><span>{link.title}{panel==='search'&&<small>{link.detail}</small>}</span><ArrowRight/></a>)}
          {panel==='search'&&!links.some(link=>`${link.title} ${link.detail}`.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')))&&<p>Aucun résultat. Essayez « stock » ou « commandes ».</p>}
        </nav>
      </div>
    </dialog>
  </header>
}

function Hero() {
  const [active,setActive] = useState(0)
  const slides = [
    {lead:'Votre',title:'Logistique',end:'Simplifiée',text:'Grow Logistics accompagne vos opérations de transport et d’entrepôt. Planifiez vos tournées, suivez vos véhicules et vos livraisons avec le TMS. Organisez vos stocks, vos réceptions et vos préparations avec le WMS.',link:'#solutions',label:'Découvrir nos solutions'},
    {lead:'Vos',title:'Tournées',end:'Optimisées',text:'Avec le TMS, planifiez vos livraisons selon les créneaux horaires et la capacité des véhicules. Affectez vos chauffeurs, suivez leur position par GPS et retrouvez les preuves de livraison depuis une plateforme centralisée.',link:'#solutions',label:'Découvrir le TMS'},
    {lead:'Votre',title:'Entrepôt',end:'Organisé',text:'Avec le WMS, suivez vos produits dès leur réception. Gérez les emplacements, les réapprovisionnements et la préparation des colis. Des espaces client et administrateur accompagnent chaque étape, jusqu’au bon de livraison.',link:'#solutions',label:'Découvrir le WMS'},
  ]
  const slide=slides[active]
  return <section className="transit-hero" id="top" aria-label="Présentation des solutions">
    <HeroArtwork/>
    <Header />
    <div className="transit-copy" aria-live="polite" aria-atomic="true">
      <div className="slide-copy" key={active}>
        <h1><span className="transit-lead">{slide.lead}</span><span className="transit-title">{slide.title}</span><span className="transit-end">{slide.end}</span></h1>
        <p>{slide.text}</p>
      </div>
      <a className="transit-discover" href={slide.link}>{slide.label}<ArrowRight size={17}/></a>
      <div className="transit-dots" aria-label="Choisir une présentation" onKeyDown={e=>{if(['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault(); const next=(active+(e.key==='ArrowRight'?1:2))%3;setActive(next);e.currentTarget.children[next].focus()}}}>
        {slides.map((item,i)=><button key={item.title} className={active===i?'active':''} onClick={()=>setActive(i)} aria-label={`Présentation ${i+1} : ${item.title}`} aria-pressed={active===i}/>)}
      </div>
    </div>
  </section>
}

function About() {
  return <section className="transit-about" aria-labelledby="about-title">
    <div className="wrap about-grid">
      <div><h2 id="about-title">À propos de <em>nous</em></h2><p>Vos commandes, votre stock, vos équipes : chaque étape mérite un outil à sa mesure. Grow Logistics présente deux solutions complémentaires pour les métiers de la logistique.</p><p>Le TMS pour les tournées, la flotte et les livraisons. Le WMS pour les stocks, les emplacements et la préparation des colis. Une même ambition : rendre votre quotidien plus simple.</p><a className="btn btn-primary" href="#solutions">Nos solutions <ArrowRight size={17}/></a></div>
      <AboutScene/>
    </div>
  </section>
}

function Solutions() {
  const [active, setActive] = useState('tms')
  const product = products[active]
  return <section className="solutions section" id="solutions">
    <div className="wrap">
      <div className="section-head centered">
        <div className="eyebrow"><span/> Une suite, deux expertises</div>
        <h2>Du premier clic au dernier kilomètre.</h2>
        <p>Deux solutions complémentaires pour piloter vos transports et les opérations de votre entrepôt.</p>
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
          <a href="#contact" className="text-link" style={{color:product.color}}>Explorer {product.title} <ArrowRight size={17}/></a>
        </div>
        {active === 'tms' ? <ProductVideo/> : <ProductVisual key={`visual-${active}`} active={active}/>}
      </div>
    </div>
  </section>
}

function Features() {
  return <section className="features section" id="fonctionnalites">
    <div className="wrap">
      <div className="section-head split">
        <div><div className="eyebrow"><span/> Tout ce qu’il faut</div><h2>Moins de friction.<br/>Plus de contrôle.</h2></div>
        <p>Une suite conçue autour des vrais flux logistiques : précise pour les opérateurs, lisible pour les décideurs.</p>
      </div>
      <div className="feature-grid">{features.map(({icon:Icon,num,title,text}, index)=><article className="feature-card" key={num}>
        <span className="feature-num">{num}</span><div className="icon-box"><Icon size={23}/></div><h3>{title}</h3><p>{text}</p><a href={`/fonctionnalites/${featureDetails[index].slug}`} aria-label={`En savoir plus sur ${title}`}><ChevronRight size={19}/></a>
      </article>)}</div>
    </div>
  </section>
}

function Dashboard() {
  const [period, setPeriod] = useState('7 jours')
  return <section className="dashboard-section section">
    <div className="wrap dashboard-layout">
      <div className="dashboard-copy">
        <div className="eyebrow light"><span/> Décidez avec les bons chiffres</div>
        <h2>Votre activité.<br/><em>En un coup d’œil.</em></h2>
        <p>Suivez les indicateurs qui comptent vraiment et filtrez vos performances par ville, zone, statut ou période.</p>
        <div className="dashboard-points">
          <div><span><Zap size={18}/></span><p><b>Une vue instantanée</b><small>Commandes, stock et livraisons actualisés.</small></p></div>
          <div><span><BarChart3 size={18}/></span><p><b>Des KPIs exploitables</b><small>Ponctualité, utilisation de la flotte et coût par livraison.</small></p></div>
        </div>
      </div>
      <div className="analytics-card">
        <div className="analytics-top"><div><small>TABLEAU DE BORD · DONNÉES DE DÉMONSTRATION</small><h3>Performance globale</h3></div><div className="periods">{['7 jours','30 jours'].map(p=><button key={p} onClick={()=>setPeriod(p)} className={period===p?'active':''}>{p}</button>)}</div></div>
        <div className="analytics-kpis"><div><span>Commandes totales</span><AnimatedNumber value={period==='7 jours'?2846:11420}/><small>↗ 12,4%</small></div><div><span>Taux de livraison</span><AnimatedNumber value={78.6} decimals={1} suffix="%"/><small>↗ 4,2%</small></div><div><span>Véhicules actifs</span><AnimatedNumber value={period==='7 jours'?24:68}/><small>sur la période</small></div></div>
        <div className="analytics-body">
          <div className="line-chart"><div className="grid-lines"><i/><i/><i/><i/></div><svg viewBox="0 0 540 170" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--cobalt)" stopOpacity=".28"/><stop offset="1" stopColor="var(--cobalt)" stopOpacity="0"/></linearGradient></defs><path d="M0 138 C60 118 66 130 112 98 S190 112 226 77 S307 91 344 52 S426 70 470 31 S520 35 540 18 L540 170 L0 170Z" fill="url(#fill)"/><path d="M0 138 C60 118 66 130 112 98 S190 112 226 77 S307 91 344 52 S426 70 470 31 S520 35 540 18" pathLength="1" fill="none" stroke="var(--cobalt)" strokeWidth="4" strokeLinecap="round"/></svg><div className="axis"><span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span></div></div>
          <div className="status-list">{statuses.slice(0,4).map(([name,val,color])=><div key={name}><span><i style={{background:color}}/>{name}<b>{val}%</b></span><progress aria-label={name} value={val} max="50" style={{'--status-color':color}}/></div>)}</div>
        </div>
      </div>
    </div>
  </section>
}

function Workflow() {
  const steps=[
    {n:'01',icon:ShoppingCart,title:'Centralisez',text:'Créez vos commandes dans le TMS et importez vos produits ou colis dans le WMS via Excel.'},
    {n:'02',icon:Warehouse,title:'Orchestrez',text:'Réceptionnez les produits, choisissez leurs emplacements et préparez les colis par client.'},
    {n:'03',icon:Truck,title:'Expédiez',text:'Planifiez les tournées, affectez les véhicules et suivez les livraisons avec l’application chauffeur.'},
    {n:'04',icon:TrendingUp,title:'Optimisez',text:'Analysez vos KPIs et améliorez chaque étape de votre chaîne logistique.'},
  ]
  return <section className="workflow section" id="workflow"><div className="wrap">
    <div className="section-head centered"><div className="eyebrow"><span/> Un flux sans rupture</div><h2>Simple à prendre en main.<br/>Puissant sur le terrain.</h2></div>
    <div className="steps">{steps.map(({n,icon:Icon,title,text},i)=><article key={n}><span className="step-number">{n}</span><div className="step-icon"><Icon/></div><h3>{title}</h3><p>{text}</p>{i<steps.length-1&&<ArrowRight className="step-arrow"/>}</article>)}</div>
    <div className="quality-band">
      <div className="quality-title"><Sparkles/><span><small>PENSÉ POUR VOTRE QUOTIDIEN</small><b>Chaque étape à sa place.</b></span></div>
      <div><strong>2</strong><span>solutions métier</span></div><div><strong>GPS</strong><span>suivi de la flotte</span></div><div><strong>2</strong><span>espaces WMS : client et admin</span></div>
    </div>
  </div></section>
}

function Contact() {
  const [sent,setSent]=useState(false)
  const submit=e=>{
    e.preventDefault()
    const data=new FormData(e.currentTarget)
    const content=`Demande de démonstration — Grow Logistics\n\nNom : ${data.get('name')}\nEmail : ${data.get('email')}\nTéléphone : ${data.get('phone')}\nSolution : ${data.get('solution')}\n\nBrouillon préparé localement. Aucun message n’a été envoyé.`
    const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}))
    const link=document.createElement('a');link.href=url;link.download='demande-demo-grow-logistics.txt';link.click()
    setTimeout(()=>URL.revokeObjectURL(url),1000)
    setSent(true)
  }
  return <section className="contact" id="contact"><div className="contact-shape"/><div className="wrap contact-inner">
    <div><div className="eyebrow light"><span/> Passons à l’action</div><h2>Prêt à faire grandir<br/>vos opérations&nbsp;?</h2><p>Voyez comment Grow Logistics peut s’adapter à votre organisation et à vos volumes.</p><div className="contact-note"><Headphones/><span><b>Un accompagnement humain</b><small>De la prise en main jusqu’au déploiement.</small></span></div></div>
    <form onSubmit={submit} className="contact-form">
      {sent ? <div className="success" role="status"><CircleCheck size={46}/><h3>Votre demande est prête.</h3><p>Le récapitulatif a été téléchargé. Ce formulaire prépare un brouillon local ; aucun message n’a été envoyé.</p><button type="button" onClick={()=>setSent(false)}>Préparer une autre demande</button></div> : <>
        <div className="form-head"><span><Play fill="currentColor"/></span><div><small>DÉMO PERSONNALISÉE</small><h3>Découvrez la plateforme</h3></div></div>
        <label>Nom complet<input name="name" autoComplete="name" required placeholder="Votre nom"/></label>
        <label>Email professionnel<input name="email" autoComplete="email" required type="email" placeholder="nom@entreprise.com"/></label>
        <label>Téléphone<input name="phone" autoComplete="tel" required type="tel" placeholder="+212 6 00 00 00 00"/></label>
        <label>Solution recherchée<select name="solution" required defaultValue=""><option value="" disabled>Choisir une solution</option><option>TMS — Gestion du transport</option><option>WMS — Gestion d’entrepôt</option><option>La suite complète</option></select></label>
        <button className="btn btn-primary" type="submit">Préparer ma demande <ArrowRight size={18}/></button>
        <small className="privacy"><ShieldCheck size={14}/> Brouillon téléchargé sur votre appareil, sans envoi.</small>
      </>}
    </form>
  </div></section>
}

function Footer(){return <footer><div className="wrap footer-main"><div><Logo light/><p>Les solutions TMS et WMS pour vos transports et votre entrepôt.</p></div><div><b>Solutions</b><a href="#solutions">TMS</a><a href="#solutions">WMS</a></div><div><b>Entreprise</b><a href="#fonctionnalites">Fonctionnalités</a><a href="#contact">Contact</a></div><div><b>Parlons-nous</b><a href="#contact">Préparer ma demande de démo <ArrowRight size={14}/></a></div></div><div className="wrap footer-bottom"><span>© 2026 Grow Logistics.</span><span>Design et visuels adaptés de <a href="https://html.design/download/logistic-service-website-template/" target="_blank" rel="noreferrer">Transit — HTML Design</a> · CC BY 3.0</span></div></footer>}

function App(){
  useSiteMotion()
  useExtraMotion()
  const path = window.location.pathname.replace(/\/$/, '')
  const feature = featureDetails.find(item => path === `/fonctionnalites/${item.slug}`)
  if (feature) return <FeaturePage feature={feature}/>
  return <><Hero/><main><About/><LogisticsMotion/><LogisticsJourney/><Solutions/><Features/><Dashboard/><Workflow/><WorldConnectionsMap/><Contact/></main><Footer/></>}

export default App
