import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { SmoothScroll, useLenis } from './lib/smooth'
import { CartProvider } from './lib/cart'
import { gsap, reduced, requestRefresh, ScrollTrigger } from './lib/gsap'
import { Header } from './components/Header'
import { CartDrawer } from './components/CartDrawer'
import { Footer, Preloader, WhatsAppFab } from './components/Chrome'
import { Logo } from './components/Logo'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/Product'
import Checkout from './pages/Checkout'

/**
 * Transizioni tra pagine in due tempi: il sipario copre, si cambia pagina sotto,
 * il sipario si alza. Così il cambio di contenuto e il reset dello scroll
 * non si vedono mai.
 */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const lenis = useLenis()
  const curtain = useRef<HTMLDivElement>(null)
  const covered = useRef(false)
  const busy = useRef(false)
  const first = useRef(true)

  // Intercetta i link interni prima di React Router
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest('a')
      if (!a || a.target || a.hasAttribute('download')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      e.preventDefault()

      // Stessa pagina: scorrimento morbido, niente sipario
      if (url.pathname === location.pathname && url.search === location.search) {
        if (url.hash) {
          history.replaceState(null, '', url.pathname + url.hash)
          lenis?.scrollTo(url.hash, { offset: -40, duration: 1.6 })
        } else lenis?.scrollTo(0, { duration: 1.4 })
        return
      }
      if (busy.current) return
      const go = () => navigate(url.pathname + url.search + url.hash)
      if (reduced() || !curtain.current) return go()

      busy.current = true
      lenis?.stop()
      const c = curtain.current
      gsap
        .timeline({
          onComplete: () => {
            covered.current = true
            go()
          },
        })
        .set(c, { visibility: 'visible' })
        .fromTo(c, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' })
        .fromTo(c.querySelector('.logo'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.35)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [lenis, navigate])

  // Nuova pagina montata sotto il sipario: reset scroll, ricalcolo, poi si alza
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    // ScrollTrigger ricorda lo scroll di ogni pagina e lo ripristina al ricalcolo: qui va azzerato
    ScrollTrigger.clearScrollMemory('manual')
    window.scrollTo(0, 0)
    lenis?.scrollTo(0, { immediate: true, force: true })
    requestRefresh()
    requestAnimationFrame(() => lenis?.scrollTo(0, { immediate: true, force: true }))
    const c = curtain.current
    if (!c || reduced()) {
      lenis?.start()
      busy.current = false
      return
    }
    // navigazione dalla cronologia (indietro/avanti): copriamo all'istante
    if (!covered.current) gsap.set(c, { visibility: 'visible', clipPath: 'inset(0% 0% 0% 0%)' })
    covered.current = false
    gsap
      .timeline({
        delay: 0.1,
        onComplete: () => {
          gsap.set(c, { visibility: 'hidden' })
          busy.current = false
        },
      })
      .to(c.querySelector('.logo'), { autoAlpha: 0, y: -20, duration: 0.4, ease: 'power2.in' })
      .to(c, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, 0.15)
      .call(() => lenis?.start(), [], 0.5)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Arrivo con un'ancora (es. /#taglia da un'altra pagina)
  useEffect(() => {
    if (!lenis || !hash) return
    const t = setTimeout(() => lenis.scrollTo(hash, { offset: -40, duration: 1.6 }), 900)
    return () => clearTimeout(t)
  }, [pathname, hash, lenis])

  return (
    <div ref={curtain} className="curtain" style={{ visibility: 'hidden' }}>
      <Logo sub />
    </div>
  )
}

function Shell() {
  // ready = l'hero può entrare (il pannello sta salendo); loaded = preloader smontato
  const [ready, setReady] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const lenis = useLenis()
  const { pathname } = useLocation()

  // Fuori dalla home lo scroll si sblocca appena il preloader esce
  useEffect(() => {
    if (ready && pathname !== '/') lenis?.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, lenis])

  // Niente scroll mentre il preloader è in scena
  useEffect(() => {
    if (!lenis) return
    if (!ready) {
      window.scrollTo(0, 0)
      lenis.stop()
    }
  }, [ready, lenis])

  return (
    <CartProvider>
      {!loaded && <Preloader onReveal={() => setReady(true)} onDone={() => setLoaded(true)} />}
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home ready={ready} />} />
          <Route path="/negozio" element={<Shop />} />
          <Route path="/negozio/:filter" element={<Shop />} />
          <Route path="/prodotto/:slug" element={<ProductPage />} />
          <Route path="/cassa" element={<Checkout />} />
          <Route path="*" element={<Home ready={ready} />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFab />
      <RouteEffects />
    </CartProvider>
  )
}

export default function App() {
  return (
    <SmoothScroll>
      <Shell />
    </SmoothScroll>
  )
}
