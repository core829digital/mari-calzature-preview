import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FREE_SHIPPING, useCart } from '../lib/cart'
import { formatEUR } from '../data/products'
import { gsap } from '../lib/gsap'
import { useLenis } from '../lib/smooth'
import { CloseIcon, MinusIcon, PlusIcon, StoreIcon } from './Icons'

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty } = useCart()
  const lenis = useLenis()
  const panel = useRef<HTMLElement>(null)
  const veil = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)
  const missing = Math.max(0, FREE_SHIPPING - subtotal)
  const pct = Math.min(1, subtotal / FREE_SHIPPING)

  useEffect(() => {
    const p = panel.current
    const v = veil.current
    if (!p || !v) return
    if (open) {
      wasOpen.current = true
      lenis?.stop()
      gsap.set([p, v], { visibility: 'visible' })
      gsap.to(v, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      gsap.fromTo(p, { xPercent: 100 }, { xPercent: 0, duration: 0.9, ease: 'expo.out' })
      gsap.fromTo(p.querySelectorAll('.cd-line'), { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: 0.05, delay: 0.15, duration: 0.8 })
    } else {
      if (wasOpen.current) lenis?.start()
      wasOpen.current = false
      gsap.to(v, { opacity: 0, duration: 0.4 })
      gsap.to(p, { xPercent: 100, duration: 0.6, ease: 'expo.in', onComplete: () => void gsap.set([p, v], { visibility: 'hidden' }) })
    }
  }, [open, lenis])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  return (
    <>
      <div ref={veil} className="cd-veil" onClick={() => setOpen(false)} style={{ visibility: 'hidden', opacity: 0 }} />
      <aside ref={panel} className="cd" aria-label="Carrello" style={{ visibility: 'hidden' }} data-lenis-prevent>
        <div className="cd-head">
          <h2 className="serif">Il tuo carrello</h2>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Chiudi">
            <CloseIcon className="ico" />
          </button>
        </div>

        <div className="cd-ship">
          <p className="mono">
            {missing > 0 ? (
              <>Mancano {formatEUR(missing)} alla spedizione gratuita</>
            ) : (
              <>Spedizione gratuita sbloccata</>
            )}
          </p>
          <div className="cd-bar">
            <span style={{ transform: `scaleX(${pct})` }} />
          </div>
        </div>

        {lines.length === 0 ? (
          <div className="cd-empty">
            <p className="serif">Ancora nessun paio.</p>
            <Link to="/negozio" className="btn btn-ink" onClick={() => setOpen(false)}>
              <span>Inizia dalla collezione</span>
            </Link>
          </div>
        ) : (
          <ul className="cd-list">
            {lines.map((l) => (
              <li key={l.slug + l.size} className="cd-line">
                <Link to={`/prodotto/${l.product.slug}`} className="cd-thumb" onClick={() => setOpen(false)}>
                  <img src={l.product.image} alt="" />
                </Link>
                <div className="cd-info">
                  <p className="mono cd-brand">{l.product.brand}</p>
                  <p className="cd-name">{l.product.name}</p>
                  <p className="cd-meta">
                    {l.product.color} · EU {l.size}
                  </p>
                  <div className="qty">
                    <button onClick={() => setQty(l.slug, l.size, l.qty - 1)} aria-label="Togli uno">
                      <MinusIcon className="ico-s" />
                    </button>
                    <span>{l.qty}</span>
                    <button onClick={() => setQty(l.slug, l.size, l.qty + 1)} aria-label="Aggiungi uno">
                      <PlusIcon className="ico-s" />
                    </button>
                  </div>
                </div>
                <p className="cd-price">{formatEUR(l.qty * l.product.price)}</p>
              </li>
            ))}
          </ul>
        )}

        {lines.length > 0 && (
          <div className="cd-foot">
            <div className="cd-row">
              <span>Subtotale</span>
              <strong>{formatEUR(subtotal)}</strong>
            </div>
            <p className="cd-note">
              <StoreIcon className="ico-s" /> Puoi scegliere il ritiro in negozio al checkout, senza costi.
            </p>
            <Link to="/cassa" className="btn btn-ink btn-full" onClick={() => setOpen(false)}>
              <span>Vai alla cassa</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
