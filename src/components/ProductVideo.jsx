import { useRef, useState } from 'react'
import { Play } from 'lucide-react'
import './ProductVideo.css'

export default function ProductVideo() {
  const video = useRef(null)
  const [started, setStarted] = useState(false)
  const [failed, setFailed] = useState(false)

  function start() {
    const player = video.current
    setFailed(false)
    if (!player.getAttribute('src')) player.src = '/assets/vedio/tms-demo.mp4'
    setStarted(true)
    player.play().catch(() => setStarted(false))
  }

  return <div className="product-video">
    <video ref={video} controls={started} preload="none" playsInline
      poster="/assets/vedio/tms-demo-poster.jpg" aria-label="Démonstration du TMS Grow Logistics"
      onError={() => { setFailed(true); setStarted(false) }}/>
    {!started && <button type="button" className="product-video-play" onClick={start}
      aria-label="Lire la vidéo de démonstration TMS">
      <span><Play size={28} fill="currentColor" aria-hidden="true"/></span>
      <b>Voir la démonstration TMS</b>
    </button>}
    {failed && <p className="product-video-error" role="alert">La vidéo n’a pas pu être chargée. Réessayez en cliquant sur lecture.</p>}
  </div>
}
