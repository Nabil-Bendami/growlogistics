import { useEffect, useRef, useState } from 'react'

/*
 * A muted, looping clip inside an editorial card. It only downloads and plays
 * while the card is on screen, and it respects the reduced-motion preference by
 * staying on its poster frame.
 */
export default function DisciplineVideo({ src, poster, label }) {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!video.getAttribute('src')) video.src = src
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }, { threshold: .25 })
    observer.observe(video)
    return () => { observer.disconnect(); video.pause() }
  }, [src])

  return <video ref={ref} className={`discipline-video ${ready ? 'is-ready' : ''}`}
    poster={poster} muted loop playsInline preload="none"
    aria-label={label} onLoadedData={() => setReady(true)}/>
}
