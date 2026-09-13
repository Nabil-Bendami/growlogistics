import { useEffect } from 'react'

export default function useExtraMotion() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let cleanup = () => {}
    function setup() {
      cleanup()
      if (media.matches) return
      const root = document.documentElement
      const hero = document.querySelector('.hero-video-background')
      let frame = 0
      const update = () => {
        frame = 0
        const total = root.scrollHeight - window.innerHeight
        root.style.setProperty('--reading-progress', total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0)
        if (hero) hero.style.setProperty('--hero-drift', `${Math.min(window.scrollY, window.innerHeight) * .12}px`)
      }
      const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
      const resize = new ResizeObserver(schedule)
      resize.observe(document.body)
      const elements = [...document.querySelectorAll('.product-panel, .analytics-card')]
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('extra-motion-ready'); observer.unobserve(entry.target) }
        })
      }, { threshold: .2 })
      elements.forEach(element => observer.observe(element))
      update()
      cleanup = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('scroll', schedule)
        window.removeEventListener('resize', schedule)
        resize.disconnect()
        observer.disconnect()
        elements.forEach(element => element.classList.remove('extra-motion-ready'))
        root.style.removeProperty('--reading-progress')
        hero?.style.removeProperty('--hero-drift')
      }
    }
    setup()
    media.addEventListener('change', setup)
    return () => { cleanup(); media.removeEventListener('change', setup) }
  }, [])
}
