import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// Aspettiamo i font prima di montare: lo split del testo e le misure dei pin
// vengono calcolati sulle altezze definitive, non su quelle del font di ripiego.
const fonts = Promise.all(
  ['400 1em "Instrument Serif"', 'italic 400 1em "Instrument Serif"', '400 1em "Pinyon Script"', '400 1em Geist'].map((f) =>
    document.fonts.load(f).catch(() => undefined),
  ),
)
const timeout = new Promise((r) => setTimeout(r, 2000))

Promise.race([fonts, timeout]).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
