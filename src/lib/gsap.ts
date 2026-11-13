import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP)

gsap.defaults({ ease: 'expo.out', duration: 1.1 })

// La barra degli indirizzi su mobile cambia l'altezza della finestra a metà scroll:
// senza questa opzione ogni variazione ricalcola i pin e la pagina "salta".
ScrollTrigger.config({ ignoreMobileResize: true })

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Un solo ricalcolo, ordinato dall'alto verso il basso, al frame successivo.
 * Tutti i componenti passano da qui invece di chiamare ScrollTrigger.refresh() per conto loro.
 */
let queued = 0
export function requestRefresh() {
  cancelAnimationFrame(queued)
  queued = requestAnimationFrame(() => {
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
  })
}

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP }
