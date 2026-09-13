import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { heroVideos } from './heroVideos.js'

export default function HeroArtwork() {
  const videoRef = useRef(null)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const video = videoRef.current
    if (paused) video.pause()
    else video.play().catch(() => setPlaying(false))
  }, [active, paused])

  return <>
    <div className="hero-video-background" aria-hidden="true">
      <video ref={videoRef} src={heroVideos[active]} muted playsInline preload="auto"
        poster="/assets/vedio/hero-poster.jpg"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onEnded={() => setActive(index => (index + 1) % heroVideos.length)}
        onError={() => setPlaying(false)} />
      <div className="hero-video-shade" />
    </div>
    <button className="hero-video-toggle" type="button"
      aria-label={playing ? 'Mettre la vidéo en pause' : 'Lire la vidéo de fond'}
      onClick={() => {
        if (playing) setPaused(true)
        else { setPaused(false); videoRef.current?.play().catch(() => setPlaying(false)) }
      }}>
      {playing ? <Pause size={16}/> : <Play size={16}/>}
      <span>{playing ? 'Pause' : 'Lecture'}</span>
    </button>
  </>
}
