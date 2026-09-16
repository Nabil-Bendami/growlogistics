import { language, t } from './i18n/index.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import './transit.css'
import './palette.css'
import './hero-video.css'
import './motion.css'
import './extra-motion.css'
import './components/ProductVisual.css'
import './components/AboutScene.css'

document.documentElement.lang = language
document.title = t('Grow Logistics — Pilotez chaque mouvement')
document.querySelector('meta[name="description"]')?.setAttribute('content', t('Grow Logistics : solutions TMS et WMS pour planifier vos tournées, suivre votre flotte et gérer vos stocks, de la réception à la livraison.'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
