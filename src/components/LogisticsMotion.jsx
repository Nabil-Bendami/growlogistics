import { t } from '../i18n/index.js'
import { useEffect, useId, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Box, Check, Navigation, PackageCheck, Truck, Warehouse } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './LogisticsMotion.css'

gsap.registerPlugin(ScrollTrigger)

const SCENES = [
  { tag: 'GROW LOGISTICS', heading: t("Votre logistique."), accent: t("En mouvement."), description: t("Du stock à la livraison, donnez le rythme à vos opérations. Le WMS organise votre entrepôt. Le TMS planifie vos tournées et suit vos véhicules."), words: ['Stock', t("Préparation"), 'Transport'], icon: Box },
  { tag: '01 / WAREHOUSE MANAGEMENT', heading: t("Chaque produit."), accent: t("À sa place."), description: t("Réceptionnez les produits, contrôlez les quantités et attribuez un emplacement. Préparez ensuite les colis par client et créez leurs bons de livraison."), words: [t("Réception"), t("Emplacements"), t("Préparation")], icon: Warehouse },
  { tag: '02 / TRANSPORT MANAGEMENT', heading: t("Chaque tournée."), accent: t("Sous contrôle."), description: t("Planifiez selon les créneaux et la capacité des véhicules. Affectez les chauffeurs, suivez la flotte par GPS et documentez la livraison depuis l’application mobile."), words: [t("Planification"), t("Suivi GPS"), t("Preuve de livraison")], icon: Truck },
]

function MotionSculpture({ index }) {
  const uid = useId().replace(/:/g, '')
  const Icon = SCENES[index].icon
  return <div className={`motion-sculpture sculpture-${index}`} aria-hidden="true">
    <div className="sculpture-orbit"><div className="sculpture-ring"/></div>
    <div className="sculpture-diamond"/>
    <svg className="sculpture-hourglass" viewBox="0 0 60 80"><path d="M5 2H55Q60 2 55 10L35 36Q31 40 35 44L55 70Q60 78 55 78H5Q0 78 5 70L25 44Q29 40 25 36L5 10Q0 2 5 2" fill="currentColor"/></svg>
    <div className="sculpture-dome"><span className="dome-grid"/><span className="dome-label">{['WMS + TMS', t("VOTRE ENTREPÔT"), t("VOTRE FLOTTE")][index]}</span></div>
    <div className="sculpture-flower"><svg viewBox="0 0 240 240"><defs><linearGradient id={uid} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#ffd7ee"/><stop offset=".5" stopColor="#f59ccb"/><stop offset="1" stopColor="#d35bbc"/></linearGradient></defs><circle cx="66" cy="66" r="62" fill={`url(#${uid})`}/><circle cx="174" cy="66" r="62" fill={`url(#${uid})`}/><circle cx="66" cy="174" r="62" fill={`url(#${uid})`}/><circle cx="174" cy="174" r="62" fill={`url(#${uid})`}/></svg><Icon className="sculpture-core" size={52} strokeWidth={1.4}/></div>
    <div className="sculpture-ticket">{index === 0 ? <Navigation size={17}/> : index === 1 ? <PackageCheck size={17}/> : <Check size={17}/>}<span>{[t("Chaque étape compte"), t("Stock localisé"), t("Livraison confirmée")][index]}</span></div>
  </div>
}

export default function LogisticsMotion() {
  const root = useRef(null)
  const track = useRef(null)
  const controller = useRef(null)
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const section = root.current
    const cards = [...section.querySelectorAll('.logistics-motion-scene')]
    const navigation = document.querySelector('.sticky-navigation')
    const navHeight = () => navigation?.offsetHeight ?? 0
    section.style.setProperty('--motion-nav-height', `${navHeight()}px`)
    const navResize = new ResizeObserver(() => {
      const height = `${navHeight()}px`
      if (section.style.getPropertyValue('--motion-nav-height') !== height) {
        section.style.setProperty('--motion-nav-height', height)
        ScrollTrigger.refresh()
      }
    })
    if (navigation) navResize.observe(navigation)
    const mm = gsap.matchMedia()
    mm.add({ desktop: '(min-width: 901px) and (min-height: 650px)', mobile: '(max-width: 900px) and (min-height: 620px)', reduced: '(prefers-reduced-motion: reduce)', all: '(min-width: 0px)' }, context => {
      const { desktop, mobile, reduced } = context.conditions
      if (reduced) return
      if (desktop || mobile) {
        section.classList.add('motion-is-pinned')
        setPinned(true)
        const timeline = gsap.timeline({ scrollTrigger: {
          trigger: section, start: () => `top top+=${navHeight()}`, end: () => `+=${Math.max(section.clientWidth * 2.4, window.innerHeight * 1.8)}`,
          pin: section.querySelector('.logistics-motion-viewport'), scrub: .7, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: self => {
            const index = Math.min(2, Math.round(self.progress * 2))
            setActive(previous => previous === index ? previous : index)
            cards.forEach((card, i) => { card.inert = i !== index })
          },
        } })
        controller.current = timeline.scrollTrigger
        timeline.to(track.current, { x: () => -(track.current.scrollWidth - section.clientWidth), ease: 'none', duration: 2 }, 0)
        cards.forEach((card, i) => {
          timeline.fromTo(card.querySelector('.sculpture-flower'), {rotation: -22}, {rotation: 80, ease: 'none', duration: 2}, 0)
          timeline.fromTo(card.querySelector('.sculpture-orbit'), {y: 22, rotation: -14}, {y: -50, rotation: 100, ease: 'none', duration: 2}, 0)
          timeline.fromTo(card.querySelector('.sculpture-diamond'), {rotation: 30}, {rotation: 210, y: -65, duration: 2, ease: 'none'}, 0)
          timeline.fromTo(card.querySelector('.sculpture-hourglass'), {rotation: -15}, {rotation: 180, y: 55, duration: 2, ease: 'none'}, 0)
          if (i) timeline.from(card.querySelector('.motion-tag-bottom'), {rotation: 8, y: 32, duration: .45, ease: 'back.out(1.4)'}, (i - 1) + .25)
          card.inert = i !== 0
        })
        gsap.from(cards[0].querySelectorAll('.motion-tag-top, .motion-tag-bottom'), {y: 45, rotation: -5, opacity: 0, stagger: .1, duration: .85, ease: 'back.out(1.3)', scrollTrigger: {trigger: section, start: 'top 80%', once: true}})
      }
      return () => {
        controller.current = null
        section.classList.remove('motion-is-pinned')
        cards.forEach(card => { card.inert = false })
        setPinned(false)
      }
    }, root)
    let disposed = false
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { disposed = true; window.removeEventListener('load', refresh); navResize.disconnect(); mm.revert() }
  }, [])

  function selectScene(index) {
    const trigger = controller.current
    if (!trigger) {
      if (window.matchMedia('(max-width: 900px)').matches) {
        track.current.scrollTo({ left: index * track.current.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
      } else track.current.children[index]?.scrollIntoView({ behavior: 'instant', block: 'center' })
      setActive(index)
      return
    }
    window.scrollTo({top: trigger.start + (trigger.end - trigger.start) * index / 2, behavior: 'smooth'})
  }
  return <section ref={root} className="logistics-motion" id="logistique-en-mouvement" aria-label={t("Grow Logistics : du stock à la livraison")}>
    <div className="logistics-motion-viewport">
      <div className="motion-section-top"><span>GROW LOGISTICS <i/> {t("DU STOCK À LA LIVRAISON")}</span><a href="/parcours">{t("Voir le parcours")} <ArrowRight size={16}/></a></div>
      <div ref={track} className="logistics-motion-track" onScroll={event => {
        if (!pinned) setActive(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))
      }}>
        {SCENES.map((scene, index) => <article className="logistics-motion-scene" key={scene.tag}>
          <div className="motion-scene-copy"><p className="motion-scene-kicker">{scene.tag}</p>
            <h2><span className="motion-tag-top">{scene.heading}</span><span className="motion-tag-bottom">{scene.accent}</span></h2>
            <p className="motion-scene-description">{scene.description}</p>
            <ul className="motion-scene-words">{scene.words.map(word => <li key={word}>{word}</li>)}</ul>
          </div>
          <MotionSculpture index={index}/>
        </article>)}
      </div>
      <div className="motion-section-bottom"><span><ArrowDown size={15}/>{pinned ? t("Faites défiler. La logistique prend vie.") : t("Du stock à la livraison, étape par étape.")}</span>{<nav aria-label={t("Scènes de la présentation")}>{[t("Vue d’ensemble"), 'WMS', 'TMS'].map((label, index) => <button key={label} aria-label={`${t("Afficher")} ${label}`} onClick={() => selectScene(index)} aria-current={active === index ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span>{label}</button>)}</nav>}<a href="/solutions">{t("Explorer les solutions")} <ArrowRight size={15}/></a></div>
    </div>
  </section>
}
