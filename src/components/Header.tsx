import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { BagIcon } from './Icons'
import { useCart } from '../lib/cart'
import { useLenis } from '../lib/smooth'
import { gsap } from '../lib/gsap'

const nav = [
  { to: '/negozio/donna', label: 'Donna' },
  { to: '/negozio/uomo', label: 'Uomo' },
  { to: '/negozio/bambino', label: 'Bambino' },
  { to: '/negozio/saldi', label: 'Saldi' },
]

export function Header() {
  const { count, setOpen, bump } = useCart()
  const lenis = useLenis()
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const countRef = useRef<HTMLSpanElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const wasMenu = useRef(false)

  useEffect(() => {
    if (!lenis) return
    // isteresi: l'header cambia stato solo dopo 12px nella stessa direzione,
    // così non lampeggia con i micro-movimenti della rotella
    let anchor = lenis.scroll
    let state = false
    const onScroll = () => {
      const y = lenis.scroll
      setSolid(y > 40)
      const d = y - anchor
      let next = state
      if (y < 240) next = false
      else if (d > 12) next = true
      else if (d < -12) next = false
      if (Math.abs(d) > 12 || y < 240) anchor = y
      if (next !== state) {
        state = next
        setHidden(next)
        document.documentElement.classList.toggle('hdr-off', next)
      }
    }
    lenis.on('scroll', onScroll)
    return () => lenis.off('scroll', onScroll)
  }, [lenis])

  useEffect(() => setMenu(false), [pathname])

  useEffect(() => {
    if (!bump || !countRef.current) return
    gsap.fromTo(countRef.current, { scale: 1.6 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
  }, [bump])

  useEffect(() => {
    const el = menuRef.current
    if (!el) return
    if (menu) {
      wasMenu.current = true
      lenis?.stop()
      gsap.set(el, { visibility: 'visible' })
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' })
      gsap.fromTo(el.querySelectorAll('.mm-link'), { yPercent: 110 }, { yPercent: 0, stagger: 0.06, delay: 0.35, duration: 1 })
    } else {
      if (wasMenu.current) lenis?.start()
      wasMenu.current = false
      gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: () => void gsap.set(el, { visibility: 'hidden' }) })
    }
  }, [menu, lenis])

  return (
    <>
      <header className={`hdr ${hidden && !menu ? 'is-hidden' : ''} ${solid || menu ? 'is-solid' : ''} ${pathname === '/' ? 'is-light' : ''}`}>
        <nav className="hdr-nav" aria-label="Categorie">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className="hdr-link">
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className={`hdr-burger ${menu ? 'is-open' : ''}`} onClick={() => setMenu((m) => !m)} aria-label="Menu" aria-expanded={menu}>
          <span />
          <span />
        </button>
        <Link to="/" className="hdr-logo" aria-label="Marí, home">
          <Logo />
        </Link>
        <div className="hdr-right">
          <Link to="/#taglia" className="hdr-link hide-sm">
            <span>Guida taglie</span>
          </Link>
          <button className="hdr-bag" onClick={() => setOpen(true)} aria-label={`Carrello, ${count} articoli`}>
            <BagIcon className="ico" />
            <span ref={countRef} className="hdr-count">
              {count}
            </span>
          </button>
        </div>
      </header>

      <div ref={menuRef} className="mobile-menu" style={{ visibility: 'hidden' }}>
        <ul>
          {[{ to: '/negozio', label: 'Tutto' }, ...nav].map((n, i) => (
            <li key={n.to}>
              <Link to={n.to} className="mm-row">
                <span className="mm-idx">0{i + 1}</span>
                <span className="mm-mask">
                  <span className="mm-link">{n.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mm-foot mono">Ritiro e reso gratuiti in negozio</p>
      </div>
    </>
  )
}
