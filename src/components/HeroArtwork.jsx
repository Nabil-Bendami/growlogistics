import { t } from '../i18n/index.js'
import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { heroVideo } from './heroVideos.js'

export default function HeroArtwork() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const video = videoRef.current
    if (paused) video.pause()
    else video.play().catch(() => setPlaying(false))
  }, [paused])

  return <>
    <div className="hero-video-background" aria-hidden="true">
      <video ref={videoRef} src={heroVideo} muted loop playsInline preload="auto"
        poster="/assets/vedio/hero-0915-poster.jpg"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onError={() => setPlaying(false)} />
      <div className="hero-video-shade" />
    </div>
    <button className="hero-video-toggle" type="button"
      aria-label={playing ? t("Mettre la vidéo en pause") : t("Lire la vidéo de fond")}
      onClick={() => {
        if (playing) setPaused(true)
        else { setPaused(false); videoRef.current?.play().catch(() => setPlaying(false)) }
      }}>
      {playing ? <Pause size={16}/> : <Play size={16}/>}
      <span>{playing ? 'Pause' : t("Lecture")}</span>
    </button>
  </>
}
