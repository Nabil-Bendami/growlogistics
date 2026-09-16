import LanguageSwitch from './LanguageSwitch.jsx'
import { t } from '../i18n/index.js'
import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Boxes, Home, Mail, Route, Workflow, X, Zap } from 'lucide-react'
import './FullscreenMenu.css'

const pages = [
  { href: '/', title: t("Accueil"), description: t("Une logistique plus simple."), icon: Home },
  { href: '/parcours', title: t("Le parcours d’un colis"), description: t("Vivez chaque étape en action."), icon: Route },
  { href: '/solutions', title: t("Nos solutions"), description: t("Transport TMS & Entrepôt WMS."), icon: Boxes },
  { href: '/fonctionnalites', title: t("Fonctionnalités"), description: t("Les outils qui font la différence."), icon: Zap },
  { href: '/comment-ca-marche', title: t("Comment ça marche"), description: t("Du premier clic à la livraison."), icon: Workflow },
  { href: '/contact', title: t("Votre projet"), description: t("Construisons la suite ensemble."), icon: Mail },
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
        window.location.assign(href)
      }
    }, reduceMotion ? 0 : 500)
    return () => window.clearTimeout(timer)
  }, [closing, onDismiss])

  const close = (event, href = null) => {
    if (href && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0)) return
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
        <a href="/" className="fullscreen-menu-brand" onClick={e => close(e, '/')} aria-label={t("Grow Logistics — accueil")}>Grow<span>LOGISTICS</span></a>
        <span className="fullscreen-menu-caption">{t("DEUX SOLUTIONS. UN MÊME CAP.")}</span>
        <LanguageSwitch/>
        <button type="button" className="fullscreen-menu-close" onClick={close} autoFocus aria-label={t("Fermer le menu")}><span>{t("Fermer")}</span><X aria-hidden="true" /></button>
      </div>

      <div className="fullscreen-menu-content">
        <div className="fullscreen-menu-intro">
          <p className="fullscreen-menu-eyebrow"><span /> {t("EXPLOREZ GROW")}</p>
          <h2 id="fullscreen-menu-title">{t("Votre prochain")}<br /><em>{t("mouvement.")}</em></h2>
          <p>{t("Des commandes à l’entrepôt.")}<br />{t("Tout commence ici.")}</p>
          <ArrowDownRight className="fullscreen-menu-big-arrow" aria-hidden="true" />
        </div>
        <nav className="fullscreen-menu-pages" aria-label={t("Pages du site")}>
          {pages.map(({ href, title, description, icon: Icon }, index) => <a href={href} key={href} className="fullscreen-menu-card" style={{ '--entry-delay': `${160 + index * 80}ms` }} onClick={e => close(e, href)}>
            <div className="fullscreen-menu-card-top"><span className="fullscreen-menu-icon"><Icon aria-hidden="true" /></span><span className="fullscreen-menu-number">0{index + 1}</span><ArrowUpRight className="fullscreen-menu-link-arrow" aria-hidden="true" /></div>
            <h3>{title}</h3><p>{description}</p>
          </a>)}
        </nav>
      </div>

      <div className="fullscreen-menu-bottom">
        <p>{t("Moins de friction.")}<br /><strong>{t("Plus de possibilités.")}</strong></p>
        <a href="/contact" className="fullscreen-menu-cta" onClick={e => close(e, '/contact')}>{t("Parlons de votre projet")} <ArrowUpRight aria-hidden="true" /></a>
        <span className="fullscreen-menu-signature">GROW LOGISTICS / TMS & WMS</span>
      </div>
    </div>
  </dialog>
}
