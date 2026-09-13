import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Boxes, Home, Mail, Route, Workflow, X, Zap } from 'lucide-react'
import './FullscreenMenu.css'

const pages = [
  { href: '#top', title: 'Accueil', description: 'Une logistique plus simple.', icon: Home },
  { href: '#parcours', title: 'Le parcours d’un colis', description: 'Vivez chaque étape en action.', icon: Route },
  { href: '#solutions', title: 'Nos solutions', description: 'Transport TMS & Entrepôt WMS.', icon: Boxes },
  { href: '#fonctionnalites', title: 'Fonctionnalités', description: 'Les outils qui font la différence.', icon: Zap },
  { href: '#workflow', title: 'Comment ça marche', description: 'Du premier clic à la livraison.', icon: Workflow },
  { href: '#contact', title: 'Votre projet', description: 'Construisons la suite ensemble.', icon: Mail },
]

export default function FullscreenMenu({ onDismiss, origin, trigger }) {
  const dialog = useRef(null)
  const destination = useRef(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
      trigger?.focus({ preventScroll: true })
    }
  }, [trigger])

  useEffect(() => {
    if (!closing) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => {
      const href = destination.current
      onDismiss()
      if (href) {
        // Wait for the modal to release focus and the document scroll lock.
        window.requestAnimationFrame(() => {
          const section = document.querySelector(href)
          if (!section) return
          window.location.hash = href
          section.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' })
          section.setAttribute('tabindex', '-1')
          section.focus({ preventScroll: true })
          section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true })
        })
      }
    }, reduceMotion ? 0 : 500)
    return () => window.clearTimeout(timer)
  }, [closing, onDismiss])

  const close = (event, href = null) => {
    event.preventDefault()
    if (closing) return
    destination.current = href
    setClosing(true)
  }

  return <dialog
    ref={dialog}
    id="fullscreen-menu"
    className={`fullscreen-menu${closing ? ' is-closing' : ''}`}
    aria-labelledby="fullscreen-menu-title"
    style={{ '--menu-origin-x': `${origin.x}px`, '--menu-origin-y': `${origin.y}px` }}
    onCancel={close}
  >
    <div className="fullscreen-menu-orbit" aria-hidden="true" />
    <div className="fullscreen-menu-shell">
      <div className="fullscreen-menu-top">
        <a href="#top" className="fullscreen-menu-brand" onClick={e => close(e, '#top')} aria-label="Grow Logistics — accueil">Grow<span>LOGISTICS</span></a>
        <span className="fullscreen-menu-caption">DEUX SOLUTIONS. UN MÊME CAP.</span>
        <button type="button" className="fullscreen-menu-close" onClick={close} autoFocus aria-label="Fermer le menu"><span>Fermer</span><X aria-hidden="true" /></button>
      </div>

      <div className="fullscreen-menu-content">
        <div className="fullscreen-menu-intro">
          <p className="fullscreen-menu-eyebrow"><span /> EXPLOREZ GROW</p>
          <h2 id="fullscreen-menu-title">Votre prochain<br /><em>mouvement.</em></h2>
          <p>Des commandes à l’entrepôt.<br />Tout commence ici.</p>
          <ArrowDownRight className="fullscreen-menu-big-arrow" aria-hidden="true" />
        </div>
        <nav className="fullscreen-menu-pages" aria-label="Pages du site">
          {pages.map(({ href, title, description, icon: Icon }, index) => <a href={href} key={href} className="fullscreen-menu-card" style={{ '--entry-delay': `${160 + index * 80}ms` }} onClick={e => close(e, href)}>
            <div className="fullscreen-menu-card-top"><span className="fullscreen-menu-icon"><Icon aria-hidden="true" /></span><span className="fullscreen-menu-number">0{index + 1}</span><ArrowUpRight className="fullscreen-menu-link-arrow" aria-hidden="true" /></div>
            <h3>{title}</h3><p>{description}</p>
          </a>)}
        </nav>
      </div>

      <div className="fullscreen-menu-bottom">
        <p>Moins de friction.<br /><strong>Plus de possibilités.</strong></p>
        <a href="#contact" className="fullscreen-menu-cta" onClick={e => close(e, '#contact')}>Parlons de votre projet <ArrowUpRight aria-hidden="true" /></a>
        <span className="fullscreen-menu-signature">GROW LOGISTICS / TMS & WMS</span>
      </div>
    </div>
  </dialog>
}
