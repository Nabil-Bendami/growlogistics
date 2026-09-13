import { useEffect, useId, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Box, Check, Navigation, PackageCheck, Truck, Warehouse } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './LogisticsMotion.css'

gsap.registerPlugin(ScrollTrigger)

const SCENES = [
  { tag: 'GROW LOGISTICS', heading: 'Votre logistique.', accent: 'En mouvement.', description: 'Du stock à la livraison, donnez le rythme à vos opérations. Le WMS organise votre entrepôt. Le TMS planifie vos tournées et suit vos véhicules.', words: ['Stock', 'Préparation', 'Transport'], icon: Box },
  { tag: '01 / WAREHOUSE MANAGEMENT', heading: 'Chaque produit.', accent: 'À sa place.', description: 'Réceptionnez les produits, contrôlez les quantités et attribuez un emplacement. Préparez ensuite les colis par client et créez leurs bons de livraison.', words: ['Réception', 'Emplacements', 'Préparation'], icon: Warehouse },
  { tag: '02 / TRANSPORT MANAGEMENT', heading: 'Chaque tournée.', accent: 'Sous contrôle.', description: 'Planifiez selon les créneaux et la capacité des véhicules. Affectez les chauffeurs, suivez la flotte par GPS et documentez la livraison depuis l’application mobile.', words: ['Planification', 'Suivi GPS', 'Preuve de livraison'], icon: Truck },
]

function MotionSculpture({ index }) {
  const uid = useId().replace(/:/g, '')
  const Icon = SCENES[index].icon
  return <div className={`motion-sculpture sculpture-${index}`} aria-hidden="true">
    <div className="sculpture-orbit"><div className="sculpture-ring"/></div>
    <div className="sculpture-diamond"/>
    <svg className="sculpture-hourglass" viewBox="0 0 60 80"><path d="M5 2H55Q60 2 55 10L35 36Q31 40 35 44L55 70Q60 78 55 78H5Q0 78 5 70L25 44Q29 40 25 36L5 10Q0 2 5 2" fill="currentColor"/></svg>
    <div className="sculpture-dome"><span className="dome-grid"/><span className="dome-label">{['WMS + TMS', 'VOTRE ENTREPÔT', 'VOTRE FLOTTE'][index]}</span></div>
    <div className="sculpture-flower"><svg viewBox="0 0 240 240"><defs><linearGradient id={uid} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#ffd7ee"/><stop offset=".5" stopColor="#f59ccb"/><stop offset="1" stopColor="#d35bbc"/></linearGradient></defs><circle cx="66" cy="66" r="62" fill={`url(#${uid})`}/><circle cx="174" cy="66" r="62" fill={`url(#${uid})`}/><circle cx="66" cy="174" r="62" fill={`url(#${uid})`}/><circle cx="174" cy="174" r="62" fill={`url(#${uid})`}/></svg><Icon className="sculpture-core" size={52} strokeWidth={1.4}/></div>
    <div className="sculpture-ticket">{index === 0 ? <Navigation size={17}/> : index === 1 ? <PackageCheck size={17}/> : <Check size={17}/>}<span>{['Chaque étape compte', 'Stock localisé', 'Livraison confirmée'][index]}</span></div>
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
    const mm = gsap.matchMedia()
    mm.add({ desktop: '(min-width: 901px) and (min-height: 650px)', reduced: '(prefers-reduced-motion: reduce)', all: '(min-width: 0px)' }, context => {
      const { desktop, reduced } = context.conditions
      if (reduced) return
      if (desktop) {
        section.classList.add('motion-is-pinned')
        setPinned(true)
        const timeline = gsap.timeline({ scrollTrigger: {
          trigger: section, start: 'top top', end: () => `+=${section.clientWidth * 2.4}`,
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
      } else {
        cards.forEach(card => {
          gsap.from(card.querySelector('.motion-sculpture'), {y: 30, rotation: -5, opacity: .3, duration: .85, ease: 'power2.out', scrollTrigger: {trigger: card, start: 'top 75%', once: true}})
        })
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
    return () => { disposed = true; window.removeEventListener('load', refresh); mm.revert() }
  }, [])

  function selectScene(index) {
    const trigger = controller.current
    if (!trigger) return
    window.scrollTo({top: trigger.start + (trigger.end - trigger.start) * index / 2, behavior: 'smooth'})
  }
  return <section ref={root} className="logistics-motion" id="logistique-en-mouvement" aria-label="Grow Logistics : du stock à la livraison">
    <div className="logistics-motion-viewport">
      <div className="motion-section-top"><span>GROW LOGISTICS <i/> DU STOCK À LA LIVRAISON</span><a href="#parcours">Voir le parcours <ArrowRight size={16}/></a></div>
      <div ref={track} className="logistics-motion-track">
        {SCENES.map((scene, index) => <article className="logistics-motion-scene" key={scene.tag}>
          <div className="motion-scene-copy"><p className="motion-scene-kicker">{scene.tag}</p>
            <h2><span className="motion-tag-top">{scene.heading}</span><span className="motion-tag-bottom">{scene.accent}</span></h2>
            <p className="motion-scene-description">{scene.description}</p>
            <ul className="motion-scene-words">{scene.words.map(word => <li key={word}>{word}</li>)}</ul>
          </div>
          <MotionSculpture index={index}/>
        </article>)}
      </div>
      <div className="motion-section-bottom"><span><ArrowDown size={15}/>{pinned ? 'Faites défiler. La logistique prend vie.' : 'Du stock à la livraison, étape par étape.'}</span>{pinned && <nav aria-label="Scènes de la présentation">{['Vue d’ensemble', 'WMS', 'TMS'].map((label, index) => <button key={label} aria-label={`Afficher ${label}`} onClick={() => selectScene(index)} aria-current={active === index ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span>{label}</button>)}</nav>}<a href="#solutions">Explorer les solutions <ArrowRight size={15}/></a></div>
    </div>
  </section>
}
