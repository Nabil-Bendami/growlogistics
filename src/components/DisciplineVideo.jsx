import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { t } from '../i18n/index.js'

export default function DisciplineVideo({ src, poster, label }) {
  const ref = useRef(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = ref.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    // Set both properties before playback for inline, muted mobile playback.
    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    const update = () => {
      if (!visible || document.hidden || reduced.matches || userPaused.current) {
        video.pause()
        return
      }
      if (!video.getAttribute('src')) video.src = src
      video.play().catch(() => setPlaying(false))
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    }, { threshold: .15 })
    observer.observe(video)
    document.addEventListener('visibilitychange', update)
    reduced.addEventListener('change', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      reduced.removeEventListener('change', update)
      video.pause()
    }
  }, [src])

  const toggle = () => {
    const video = ref.current
    if (!video.paused) {
      userPaused.current = true
      video.pause()
    } else {
      userPaused.current = false
      setFailed(false)
      if (!video.getAttribute('src')) video.src = src
      if (video.error) video.load()
      // A direct tap can start playback when the browser blocks autoplay.
      video.play().catch(() => setPlaying(false))
    }
  }

  return <div className="discipline-player">
    <video ref={ref} className="discipline-video" poster={poster} muted loop playsInline preload="none"
      aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => { setFailed(true); setPlaying(false) }}/>
    <button type="button" className="discipline-video-toggle" onClick={toggle}
      aria-label={`${playing ? t('Mettre la vidéo en pause') : t('Lire la vidéo')} — ${label}`}>
      {playing ? <Pause size={16} aria-hidden="true"/> : <Play size={16} aria-hidden="true"/>}
      {failed ? t('Réessayer') : playing ? 'Pause' : t('Lecture')}
    </button>
  </div>
}
