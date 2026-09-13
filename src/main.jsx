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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
