import { useEffect } from 'react'

// Progressive enhancement: content stays visible without JS or with reduced motion.
export default function useSiteMotion() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let dispose = () => {}
    const setup = () => {
      dispose()
      if (media.matches) return
      const elements = [...document.querySelectorAll('.section-head, .about-grid > div, .feature-card, .product-panel, .dashboard-copy, .analytics-card, .steps > article, .contact-inner > div, .contact-form, .feature-page-flow .section-head, .feature-step-list li, .feature-related a')]
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add('motion-visible')
          observer.unobserve(entry.target)
        }
      }, { threshold: 0.08 })
      elements.forEach(element => {
        // Don't hide content above the current viewport on a restored/deep-linked page.
        const rect = element.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.left < window.innerWidth && rect.right > 0) return
        element.classList.add('motion-reveal')
        const siblings = [...element.parentElement.children]
        element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element) % 3, 2) * 85}ms`)
        observer.observe(element)
      })
      const focus = event => {
        const element = event.target.closest('.motion-reveal')
        element?.classList.add('motion-visible')
      }
      document.addEventListener('focusin', focus)
      const controls = [...document.querySelectorAll('.btn, .transit-discover, .feature-card, .feature-related a')]
      const cleanups = controls.map(element => {
        let frame = 0
        const move = event => {
          if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(() => {
            const rect = element.getBoundingClientRect()
            const x = (event.clientX - rect.left) / rect.width - .5
            const y = (event.clientY - rect.top) / rect.height - .5
            element.style.setProperty('--magnet-x', `${x * 9}px`)
            element.style.setProperty('--magnet-y', `${y * 7}px`)
            element.style.setProperty('--spot-x', `${(x + .5) * 100}%`)
            element.style.setProperty('--spot-y', `${(y + .5) * 100}%`)
          })
        }
        const reset = () => {
          cancelAnimationFrame(frame)
          element.style.removeProperty('--magnet-x')
          element.style.removeProperty('--magnet-y')
        }
        element.addEventListener('pointermove', move)
        element.addEventListener('pointerleave', reset)
        element.addEventListener('blur', reset)
        return () => {
          reset()
          element.style.removeProperty('--spot-x')
          element.style.removeProperty('--spot-y')
          element.removeEventListener('pointermove', move)
          element.removeEventListener('pointerleave', reset)
          element.removeEventListener('blur', reset)
        }
      })
      dispose = () => {
        observer.disconnect()
        document.removeEventListener('focusin', focus)
        cleanups.forEach(cleanup => cleanup())
        elements.forEach(element => {
          element.classList.remove('motion-reveal', 'motion-visible')
          element.style.removeProperty('--reveal-delay')
        })
      }
    }
    setup()
    media.addEventListener('change', setup)
    return () => { dispose(); media.removeEventListener('change', setup) }
  }, [])
}
