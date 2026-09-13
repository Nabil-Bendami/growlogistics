import { useEffect, useRef, useState } from 'react'

export default function AnimatedNumber({ value, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(value)
  const formatted = number => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(number) + suffix
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let observer
    const start = () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      setDisplay(value)
      if (media.matches) return
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const beginning = performance.now()
        const tick = now => {
          const progress = Math.min(1, (now - beginning) / 1100)
          const current = value * (1 - (1 - progress) ** 3)
          setDisplay(decimals ? current : Math.round(current))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      }, { threshold: .5 })
      observer.observe(ref.current)
    }
    start()
    media.addEventListener('change', start)
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); media.removeEventListener('change', start) }
  }, [value, decimals])
  return <strong ref={ref} aria-label={formatted(value)}><span aria-hidden="true">{formatted(display)}</span></strong>
}
