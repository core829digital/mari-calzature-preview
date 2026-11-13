import { gsap, reduced } from './gsap'

/** Una miniatura del prodotto vola fino all'icona del carrello. */
export function flyToCart(img: HTMLImageElement | null) {
  const target = document.querySelector('.hdr-bag')
  if (!img || !target || reduced()) return
  const a = img.getBoundingClientRect()
  const b = target.getBoundingClientRect()
  const size = 72
  const ghost = img.cloneNode() as HTMLImageElement
  ghost.className = 'fly-ghost'
  Object.assign(ghost.style, {
    left: `${a.left + a.width / 2 - size / 2}px`,
    top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
  })
  document.body.appendChild(ghost)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)
  gsap
    .timeline({ onComplete: () => ghost.remove() })
    .fromTo(ghost, { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'power2.out' })
    .to(ghost, { x: dx, duration: 0.8, ease: 'power3.inOut' }, 0.15)
    .to(ghost, { y: dy, duration: 0.8, ease: 'back.in(1.6)' }, 0.15)
    .to(ghost, { scale: 0.2, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0.75)
}
