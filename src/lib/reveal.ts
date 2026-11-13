import type { RefObject } from 'react'
import { gsap, SplitText, useGSAP, reduced, requestRefresh } from './gsap'

/**
 * Animazioni dichiarative per tutta la pagina:
 *  data-reveal="lines"  → testo che sale riga per riga da una maschera
 *  data-reveal="up"     → elemento che sale e appare
 *  data-reveal="clip"   → immagine che si apre dal basso (con leggero zoom-out)
 *  data-reveal="stagger"→ i figli diretti entrano in sequenza
 *  data-parallax="0.15" → spostamento verticale proporzionale allo scroll
 */
export function useReveals(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      if (reduced()) {
        gsap.set(root.querySelectorAll('[data-reveal]'), { autoAlpha: 1 })
        return
      }

      root.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
        const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'line' })
        gsap.set(el, { autoAlpha: 1 })
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })

      root.querySelectorAll<HTMLElement>('[data-reveal="up"]').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1.2, delay: Number(el.dataset.delay ?? 0), scrollTrigger: { trigger: el, start: 'top 90%' } },
        )
      })

      root.querySelectorAll<HTMLElement>('[data-reveal="stagger"]').forEach((el) => {
        gsap.fromTo(
          el.children,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, stagger: 0.07, duration: 1, scrollTrigger: { trigger: el, start: 'top 88%' } },
        )
      })

      root.querySelectorAll<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
        const img = el.querySelector('img')
        gsap.set(el, { autoAlpha: 1 })
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } })
        tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
        if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.2)
      })

      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const amt = Number(el.dataset.parallax)
        gsap.fromTo(
          el,
          { yPercent: -amt * 50 },
          {
            yPercent: amt * 50,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      requestRefresh()
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}
