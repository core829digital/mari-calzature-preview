import { useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { ArrowIcon, ChatIcon } from './Icons'
import { gsap, useGSAP, reduced } from '../lib/gsap'
import { useReveals } from '../lib/reveal'
import { waLink } from '../data/products'
import { useLenis } from '../lib/smooth'

/* ---------- Preloader: il marchio si "scrive", poi il pannello si alza e scopre l'hero ----------
   onReveal parte all'inizio dell'uscita (l'hero entra sotto il pannello),
   onDone a pannello sparito (il preloader viene smontato). Un solo ingresso, senza pause. */
export function Preloader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (reduced()) {
        onReveal()
        onDone()
        return
      }
      const counter = { v: 0 }
      const num = ref.current!.querySelector('.pl-num')!
      gsap
        .timeline({ onComplete: onDone })
        .fromTo('.pl-logo .logo-script', { clipPath: 'inset(-20% 100% -20% 0)' }, { clipPath: 'inset(-20% 0% -20% 0)', duration: 1.6, ease: 'power2.inOut' })
        .fromTo('.pl-logo .logo-heel', { y: -30, rotate: -30, autoAlpha: 0 }, { y: 0, rotate: 0, autoAlpha: 1, duration: 0.9, ease: 'back.out(2)' }, 1.15)
        .fromTo('.pl-logo .logo-sub', { autoAlpha: 0, letterSpacing: '0.6em' }, { autoAlpha: 1, letterSpacing: '0.28em', duration: 1.2 }, 1.1)
        .to(counter, { v: 100, duration: 2, ease: 'power2.inOut', onUpdate: () => void (num.textContent = String(Math.round(counter.v)).padStart(3, '0')) }, 0)
        .addLabel('exit', '+=0.2')
        .call(onReveal, [], 'exit')
        .fromTo(ref.current, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'expo.inOut' }, 'exit')
        .to('.pl-logo', { yPercent: -40, autoAlpha: 0, duration: 0.9, ease: 'power3.in' }, 'exit')
        .to('.pl-foot', { autoAlpha: 0, duration: 0.4 }, 'exit')
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className="preloader">
      <div className="pl-logo">
        <Logo sub />
      </div>
      <div className="pl-foot mono">
        <span>Calzature dal negozio di quartiere</span>
        <span className="pl-num">000</span>
      </div>
    </div>
  )
}

/* ---------- Marquee infinito, rallenta al passaggio del mouse ---------- */
export function Marquee({ children, speed = 40, className = '' }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const lenis = useLenis()
  useGSAP(
    () => {
      if (reduced()) return
      const track = ref.current!.querySelector('.mq-track')!
      const tw = gsap.to(track, { xPercent: -50, ease: 'none', duration: speed, repeat: -1 })
      tw.totalTime(speed * 200) // margine per scorrere anche all'indietro
      const el = ref.current!
      // Il nastro segue lo scroll: accelera con la velocità e cambia verso quando si risale
      let hover = 1
      let dir = 1
      let boost = 0
      const apply = () => gsap.to(tw, { timeScale: dir * (1 + boost) * hover, duration: 0.5, overwrite: true })
      const onScroll = () => {
        if (!lenis) return
        if (lenis.direction) dir = lenis.direction as number
        boost = Math.min(Math.abs(lenis.velocity) * 0.12, 5)
        apply()
      }
      lenis?.on('scroll', onScroll)
      const slow = () => ((hover = 0.25), apply())
      const fast = () => ((hover = 1), apply())
      el.addEventListener('mouseenter', slow)
      el.addEventListener('mouseleave', fast)
      return () => {
        lenis?.off('scroll', onScroll)
        el.removeEventListener('mouseenter', slow)
        el.removeEventListener('mouseleave', fast)
      }
    },
    { scope: ref, dependencies: [lenis] },
  )
  return (
    <div ref={ref} className={`mq ${className}`}>
      <div className="mq-track">
        <div className="mq-group">{children}</div>
        <div className="mq-group" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ---------- Pulsante WhatsApp ---------- */
export function WhatsAppFab() {
  return (
    <a className="wa-fab" href={waLink('Ciao Marí, vorrei un consiglio su un paio di scarpe.')} target="_blank" rel="noreferrer">
      <ChatIcon className="ico" />
      <span className="wa-label">Scrivici</span>
    </a>
  )
}

/* ---------- Footer ---------- */
export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const [sent, setSent] = useState(false)
  useReveals(ref)
  // Il marchio sale e si apre mentre si arriva in fondo: il movimento continua fino all'ultimo pixel
  useGSAP(
    () => {
      if (reduced()) return
      gsap.fromTo(
        '.ftr-brand .logo',
        { yPercent: 45, scale: 0.86 },
        { yPercent: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true } },
      )
      gsap.fromTo(
        '.ftr-brand .logo-script',
        { clipPath: 'inset(-30% 100% -30% 0%)' },
        { clipPath: 'inset(-30% 0% -30% 0%)', ease: 'none', scrollTrigger: { trigger: '.ftr-brand', start: 'top 95%', end: 'bottom bottom', scrub: true } },
      )
    },
    { scope: ref },
  )
  return (
    <footer ref={ref} className="ftr">
      <div className="ftr-top wrap">
        <div className="ftr-news">
          <p className="mono eyebrow">Lettera di stagione</p>
          <h3 className="serif h-md" data-reveal="lines">
            Nuovi arrivi e saldi, <em>prima</em> della vetrina.
          </h3>
          <form
            className="news"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            <input type="email" required placeholder="La tua email" aria-label="Email" disabled={sent} />
            <button className="news-btn" aria-label="Iscriviti" disabled={sent}>
              {sent ? <span className="mono">Iscritta/o</span> : <ArrowIcon className="ico" />}
            </button>
          </form>
        </div>
        <div className="ftr-cols" data-reveal="stagger">
          <div>
            <p className="mono eyebrow">Collezione</p>
            <Link to="/negozio/donna">Donna</Link>
            <Link to="/negozio/uomo">Uomo</Link>
            <Link to="/negozio/bambino">Bambino</Link>
            <Link to="/negozio/saldi">Saldi</Link>
          </div>
          <div>
            <p className="mono eyebrow">Aiuto</p>
            <Link to="/#taglia">Guida alle taglie</Link>
            <Link to="/#servizi">Spedizioni e resi</Link>
            <Link to="/#servizi">Prova in negozio</Link>
            <a href={waLink('Ciao Marí!')} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
          <div>
            <p className="mono eyebrow">Pagamenti</p>
            <span>Carte e Bancomat</span>
            <span>PayPal · Satispay</span>
            <span>Klarna in 3 rate</span>
            <span>Contrassegno</span>
          </div>
        </div>
      </div>
      <div className="ftr-brand">
        <Logo sub />
      </div>
      <div className="ftr-legal wrap mono">
        <span>© {new Date().getFullYear()} Marí Calzature</span>
        <span>Privacy · Cookie · Condizioni di vendita</span>
      </div>
    </footer>
  )
}
