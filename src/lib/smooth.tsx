import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger, reduced, requestRefresh } from './gsap'

const LenisCtx = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisCtx)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const l = new Lenis({
      lerp: reduced() ? 1 : 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      // lo scroll touch resta nativo: niente doppia inerzia su telefono
      syncTouch: false,
    })
    l.on('scroll', ScrollTrigger.update)

    // Velocità dello scroll come variabile CSS (-1…1, smorzata): immagini e card
    // "respirano" mentre ci si muove e tornano ferme quando ci si ferma.
    const root = document.documentElement
    let vel = 0
    let last = ''
    const vtick = () => {
      const target = reduced() ? 0 : Math.max(-1, Math.min(1, l.velocity / 40))
      vel += (target - vel) * 0.12
      if (Math.abs(vel) < 0.001) vel = 0
      const v = vel.toFixed(3)
      if (v !== last) root.style.setProperty('--vel', (last = v))
    }
    gsap.ticker.add(vtick)
    const tick = (t: number) => l.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(l)

    // Ricalcolo quando tutte le immagini sono caricate e quando cambia davvero la larghezza
    const onLoad = () => requestRefresh()
    window.addEventListener('load', onLoad)
    let w = window.innerWidth
    let t = 0
    const onResize = () => {
      if (window.innerWidth === w) return
      w = window.innerWidth
      clearTimeout(t)
      t = window.setTimeout(requestRefresh, 200)
    }
    window.addEventListener('resize', onResize)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.remove(vtick)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('resize', onResize)
      l.destroy()
    }
  }, [])

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>
}
