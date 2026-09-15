import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu } from 'lucide-react'
import FullscreenMenu from './FullscreenMenu.jsx'
import './StickyNavigation.css'

const links = [
  ['/', 'Accueil'],
  ['/parcours', 'Parcours d’un colis'],
  ['/solutions', 'Nos solutions'],
  ['/fonctionnalites', 'Fonctionnalités'],
  ['/comment-ca-marche', 'Comment ça marche'],
]

export default function StickyNavigation() {
  const [visible, setVisible] = useState(false)
  const [menu, setMenu] = useState(null)
  const path = window.location.pathname.replace(/\/$/, '') || '/'

  useEffect(() => {
    const marker = document.querySelector('.transit-hero, .destination-masthead, .feature-page-nav')
    if (!marker) return
    const update = () => setVisible(marker.getBoundingClientRect().bottom <= 72)
    const observer = new IntersectionObserver(update, { rootMargin: '-72px 0px 0px 0px', threshold: 0 })
    observer.observe(marker)
    update()
    return () => observer.disconnect()
  }, [])

  return <>
    <div className={`sticky-navigation${visible ? ' is-visible' : ''}`} inert={!visible}>
      <div className="sticky-navigation-inner">
        <a className="sticky-navigation-brand" href="/" aria-label="Grow Logistics — accueil">Grow<span>LOGISTICS</span></a>
        <nav className="sticky-navigation-links" aria-label="Navigation entre les pages">
          {links.map(([href, label]) => <a key={href} href={href} aria-current={(href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`)) ? 'page' : undefined}>{label}</a>)}
        </nav>
        <a className="sticky-navigation-contact" href="/contact" aria-current={path === '/contact' ? 'page' : undefined}>Votre projet <ArrowUpRight size={17} aria-hidden="true"/></a>
        <button className="sticky-navigation-menu" type="button" aria-label="Ouvrir la navigation" aria-haspopup="dialog" aria-expanded={Boolean(menu)} aria-controls="fullscreen-menu" onClick={event => {
          const rect = event.currentTarget.getBoundingClientRect()
          setMenu({ trigger: event.currentTarget, origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } })
        }}><Menu size={22} aria-hidden="true"/></button>
      </div>
    </div>
    {menu && <FullscreenMenu {...menu} onDismiss={() => setMenu(null)}/>}
  </>
}
