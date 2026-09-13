import { useEffect, useRef, useState } from 'react'
import {
  Bell, Boxes, Building2, Calendar, ChevronDown, ChevronLeft, ClipboardList,
  FileText, Home, Layers, LayoutDashboard, MapPin, Maximize2, Package,
  PackageCheck, RotateCcw, Search, Settings, ShoppingCart, Store, Sun,
  Truck, TriangleAlert, Undo2, UserRound, Users, Warehouse,
} from 'lucide-react'

/* Sidebars reproduced from the real TMS and WMS applications. */
const tmsNav = [
  { icon: Home, label: 'Dashboards' },
  { icon: Calendar, label: 'Options', sub: true },
  { icon: ShoppingCart, label: 'Produits', sub: true },
  { icon: UserRound, label: 'Clients', sub: true },
  { icon: FileText, label: 'Bons de livraison' },
  { icon: Boxes, label: 'Préparation', sub: true },
  { icon: Truck, label: 'Gestion de la flotte', sub: true },
  { icon: Users, label: 'Utilisateurs', sub: true },
  { icon: TriangleAlert, label: 'Anomalies' },
  { icon: Settings, label: 'Paramétrage', sub: true },
]

const wmsNav = [
  { icon: LayoutDashboard, label: 'Boardboard' },
  { icon: Home, label: 'Products' },
  { icon: Store, label: 'Inventory' },
  { icon: ClipboardList, label: 'Stock requests (2)' },
  { icon: Package, label: 'Good Delivery Stock (1)' },
  { icon: FileText, label: 'Stock Reception' },
  { icon: Store, label: 'Stock package' },
  { icon: Layers, label: 'Customer Preparation' },
  { icon: PackageCheck, label: 'Package Preparation' },
  { icon: Undo2, label: 'Return Reception' },
  { icon: RotateCcw, label: 'Good to have' },
  { icon: Building2, label: 'Good Damaged' },
]

/* KPI tiles from the WMS boardboard, with their colored icon chips. */
const wmsTiles = [
  ['Total Products', 242, 'green', Package],
  ['Total Packages', 21, 'indigo', Boxes],
  ['Total Store', 28, 'rose', Store],
  ['Total Warehouses', 1, 'sky', Warehouse],
  ['Total Stock Reception', 7, 'slate', ClipboardList],
  ['Total good Damaged', 3, 'amber', Package],
  ['Total return receipt', 1, 'orange', Undo2],
  ['Total Zones', 13, 'red', MapPin],
  ['Total Claims', 0, 'lime', FileText],
]

const wmsFilters = [['Store:', 'All'], ['Warehouse:', 'All'], ['City', 'All'], ['Area', 'All']]

/* Counts up once the mock enters the viewport, then holds its final value. */
function Counter({ value, play }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!play) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(value); return }
    let frame, start
    const step = now => {
      start ??= now
      const progress = Math.min((now - start) / 900, 1)
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [value, play])
  return <>{shown.toLocaleString('fr-FR').replace(/ | /g, ' ')}</>
}

function TmsScreen({ play }) {
  return <div className="app-mock is-tms">
    <aside className="app-side">
      <div className="app-side-head"><b>TMS</b><span className="app-side-toggle"><ChevronLeft size={11}/></span></div>
      <nav>{tmsNav.map(({ icon: Icon, label, sub }, i) => (
        <span key={label} className={i === 6 ? 'active' : ''} style={{ '--nav-index': i }}>
          <Icon size={12}/><em>{label}</em>{sub && <ChevronDown size={10} className="app-nav-caret"/>}
        </span>
      ))}</nav>
    </aside>

    <div className="app-body">
      <header className="app-topbar">
        <span className="app-topbar-search"><Search size={11}/> Rechercher une tournée…</span>
        <div className="app-topbar-tools">
          <i className="tool-alert"><TriangleAlert size={12}/></i>
          <i><Sun size={12}/></i>
          <i className="tool-bell"><Bell size={12}/><b>10</b></i>
          <i className="tool-online"/>
        </div>
      </header>

      <div className="app-scroll">
        <div className="app-row-return">
          <div><b>RET-1764086580</b><span className="pill-retour">RETOUR <i><FileText size={8}/>PDF</i></span></div>
          <div className="app-row-client">LUXOR SA</div>
          <div className="app-row-coords">33.583766166866305, -7.623695666248583</div>
        </div>

        <p className="app-map-label">Trajet sur la carte :</p>
        <div className="app-map">
          <svg viewBox="0 0 520 210" className="map-canvas" aria-hidden="true">
            <rect width="520" height="210" fill="var(--map-land)"/>
            <path d="M0 0 L150 0 C120 60 96 120 84 210 L0 210Z" fill="var(--map-sea)"/>
            <g stroke="var(--map-road)" strokeWidth="2.4" fill="none" opacity=".75">
              <path d="M96 168 C180 150 250 150 330 128 S440 96 520 76"/>
              <path d="M120 62 C200 84 260 120 300 210"/>
              <path d="M186 210 C220 150 300 120 410 118 L520 130"/>
              <path d="M150 110 L520 158" strokeDasharray="7 6"/>
            </g>
            <g className="map-label" fill="var(--map-ink)">
              <text x="318" y="152" fontSize="17" fontWeight="800">Casablanca</text>
              <text x="352" y="105" fontSize="8">AÏN SEBAÂ</text>
              <text x="228" y="186" fontSize="8">MAÂRIF</text>
              <text x="424" y="176" fontSize="8">SIDI MOUMEN</text>
            </g>
            <path className="map-route" d="M258 132 C320 118 380 104 452 92" pathLength="1"
              stroke="var(--cobalt)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <g className="map-truck">
              <circle r="9" fill="var(--cobalt)"/>
              <path d="M-4.5 -2h5v4h-5zM0.5 -0.5h2.5l1.5 1.5v1h-4z" fill="#fff"/>
              <circle cx="-2.5" cy="2.6" r="1.2" fill="#fff"/><circle cx="2.4" cy="2.6" r="1.2" fill="#fff"/>
            </g>
          </svg>

          <span className="map-pin pin-1"><i>1</i></span>
          <span className="map-pin pin-2"><i>2</i></span>
          <span className="map-pin pin-end"><i>E</i></span>
          <span className="map-full"><Maximize2 size={10}/></span>
          <span className="map-credit">Map data ©2025</span>
        </div>

        <div className="app-metrics">
          <div><span>Commandes</span><strong><Counter value={2846} play={play}/></strong><small>↗ 12,4 %</small></div>
          <div><span>Livrées</span><strong><Counter value={1964} play={play}/></strong><small>↗ 8,1 %</small></div>
          <div><span>Véhicules actifs</span><strong><Counter value={24} play={play}/></strong><small>en tournée</small></div>
        </div>
      </div>
    </div>
  </div>
}

function WmsScreen({ play }) {
  return <div className="app-mock is-wms">
    <aside className="app-side">
      <nav>{wmsNav.map(({ icon: Icon, label }, i) => (
        <span key={label} className={i === 0 ? 'active' : ''} style={{ '--nav-index': i }}>
          <Icon size={12}/><em>{label}</em>
        </span>
      ))}</nav>
    </aside>

    <div className="app-body">
      <div className="app-scroll">
        <div className="wms-filters">
          {wmsFilters.map(([label, value]) => (
            <label key={label}>{label}<span>{value}<ChevronDown size={10}/></span></label>
          ))}
          <label>Status :<span>All<ChevronDown size={10}/></span></label>
          <label>From to:<span><Calendar size={10}/><ChevronDown size={10}/></span></label>
          <div className="wms-actions">
            <button type="button" className="wms-pick">Pick up package</button>
            <button type="button" className="wms-cancel">Cancel</button>
          </div>
        </div>

        <div className="wms-tiles">
          {wmsTiles.map(([label, value, tone, Icon], i) => (
            <div key={label} style={{ '--tile-index': i }}>
              <span>{label}</span>
              <strong><Counter value={value} play={play}/></strong>
              <i className={`tile-chip tone-${tone}`}><Icon size={13}/></i>
            </div>
          ))}
        </div>

        <div className="wms-stats">
          <b>Statistics</b>
          <div className="wms-stats-row">
            <div><span>Total Packages</span><strong>21</strong></div>
            <div><span>Total Store</span><strong>28</strong></div>
            <div><span>Total Product</span><strong>242</strong></div>
          </div>
          <div className="wms-bars">
            {[42, 58, 49, 74, 61, 88, 70, 95, 78, 100].map((h, i) => (
              <i key={i} style={{ '--bar-h': `${h}%`, '--bar-index': i }}/>
            ))}
          </div>
        </div>
      </div>
      <footer className="wms-foot">Copyright © 2026. <b>P2M</b> All rights reserved.</footer>
    </div>
  </div>
}

export default function ProductVisual({ active }) {
  const host = useRef(null)
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const node = host.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setPlay(true); observer.disconnect() }
    }, { threshold: .25 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={host} className={`app-frame ${play ? 'is-live' : ''}`}>
    <div className="app-chrome"><i/><i/><i/><span>{active === 'wms' ? 'wms.growlogistics.ma' : 'tms.growlogistics.ma'}</span></div>
    <div className="app-stage" key={active}>
      {active === 'wms' ? <WmsScreen play={play}/> : <TmsScreen play={play}/>}
    </div>
  </div>
}
