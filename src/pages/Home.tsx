import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap, SplitText, useGSAP, reduced, requestRefresh } from '../lib/gsap'
import { useLenis } from '../lib/smooth'
import { useReveals } from '../lib/reveal'
import { genders, products, waLink } from '../data/products'
import { ProductCard } from '../components/ProductCard'
import { Marquee } from '../components/Chrome'
import { Logo, Heel } from '../components/Logo'
import { ArrowIcon, ChatIcon, ReturnIcon, RulerIcon, StoreIcon } from '../components/Icons'

const arrivals = products.filter((p) => p.tag === 'Nuovo').concat(products.filter((p) => !p.tag).slice(0, 3))

export default function Home({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  useReveals(root)

  return (
    <div ref={root} className="home">
      <Hero ready={ready} />
      <Marquee className="mq-band" speed={36}>
        {['Spedizione gratuita da 69 €', 'Ritiro in negozio', 'Reso in 30 giorni', 'Klarna in 3 rate', 'Consiglio su WhatsApp'].map((t) => (
          <span key={t} className="mq-item">
            {t}
            <svg viewBox="0 0 10 10" className="mq-dot" aria-hidden>
              <circle cx="5" cy="5" r="2.2" />
            </svg>
          </span>
        ))}
      </Marquee>
      <Entrance />
      <Categories />
      <Arrivals />
      <Steps />
      <SizeFinder />
      <Store />
      <Brands />
    </div>
  )
}

/* ================= HERO ================= */
// Apertura a tutto schermo; scorrendo l'immagine si ritira nell'arco della vetrina
// e i modelli entrano ai lati.
const FULL = 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)'
let firstVisit = true
const ARCH = 'inset(13% 33% 0% 33% round 999px 999px 0px 0px)'

function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const lenis = useLenis()

  // 1) Scroll: creato subito al montaggio, così il pin esiste prima che vengano
  //    misurate le sezioni successive (nessun ricalcolo tardivo = nessun salto).
  useGSAP(
    () => {
      const el = ref.current!
      if (reduced()) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none', immediateRender: false },
          scrollTrigger: { trigger: el, start: 'top top', end: '+=160%', scrub: true, pin: true },
        })
        tl.fromTo('.hero-copy', { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0)
          .fromTo('.hero-title', { yPercent: 0 }, { yPercent: -40, duration: 0.35 }, 0)
          .fromTo('.hero-shade', { opacity: 1 }, { opacity: 0, duration: 0.6 }, 0.1)
          .fromTo('.hero-frame', { clipPath: FULL }, { clipPath: ARCH, duration: 0.75, ease: 'power2.inOut' }, 0.15)
          .fromTo('.hero-img', { scale: 1.12 }, { scale: 1, duration: 0.75 }, 0.15)
          .fromTo('.hero-float', { y: () => window.innerHeight * 0.9, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out' }, 0.45)
          .fromTo('.hero-over > *', { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out' }, 0.6)
          .fromTo('.hero-float.f1', { yPercent: 0 }, { yPercent: -18, duration: 1.15 }, 0)
          .fromTo('.hero-float.f2', { yPercent: 0 }, { yPercent: -30, duration: 1.15 }, 0)
          .fromTo('.hero-float.f3', { yPercent: 0 }, { yPercent: -12, duration: 1.15 }, 0)
          .fromTo('.hero-over', { yPercent: 0 }, { yPercent: -25, duration: 0.5 }, 0.65)
          .fromTo('.hero-img', { yPercent: 0 }, { yPercent: -4, duration: 0.5 }, 0.65)
      })
      mm.add('(max-width: 899px)', () => {
        const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
        gsap.fromTo('.hero-frame', { yPercent: 0 }, { yPercent: 18, ease: 'none', scrollTrigger: st })
        gsap.fromTo('.hero-title, .hero-intro', { y: 0 }, { y: -60, ease: 'none', scrollTrigger: st })
      })
      requestRefresh()
      return () => mm.revert()
    },
    { scope: ref },
  )

  // 2) Intro: parte quando il preloader si chiude. Lo scroll viene sbloccato
  //    solo quando l'immagine è aperta, così le due animazioni non si contendono la scena.
  useGSAP(
    () => {
      if (!ready) return
      const el = ref.current!
      const title = SplitText.create(el.querySelectorAll('.hero-title .ln'), { type: 'chars', mask: 'chars' })
      gsap.set(el.querySelectorAll('.hero-title, .hero-intro'), { autoAlpha: 1 })
      if (reduced()) {
        lenis?.start()
        return () => title.revert()
      }
      lenis?.stop()
      // L'immagine è già a schermo pieno sotto il preloader: nessuna seconda "apertura",
      // solo un lento assestamento della foto mentre il pannello sale e il titolo entra.
      const tl = gsap.timeline({ defaults: { duration: 1.4 } })
      tl.fromTo('.hero-img', { scale: 1.32 }, { scale: 1.12, duration: 2.6, ease: 'expo.out' }, 0)
        .fromTo('.hero-shade', { opacity: 0.4 }, { opacity: 1, duration: 1, ease: 'power2.out' }, 0)
        .from(title.chars, { yPercent: 115, stagger: 0.02, ease: 'expo.out' }, 0.45)
        .from('.hero-meta > *', { autoAlpha: 0, y: -12, stagger: 0.06 }, 0.7)
        .from('.hero-intro > *', { autoAlpha: 0, y: 24, stagger: 0.08 }, 0.8)
        .call(() => lenis?.start(), [], 1.1)
      // L'header entra insieme all'hero solo al primo caricamento
      if (firstVisit) {
        firstVisit = false
        tl.from(document.querySelectorAll('.hdr > *'), { autoAlpha: 0, y: -16, stagger: 0.06, duration: 1 }, 0.6)
      }
      return () => {
        lenis?.start()
        title.revert()
      }
    },
    { scope: ref, dependencies: [ready, lenis] },
  )

  return (
    <section ref={ref} className="hero">
      <div className="hero-frame">
        <img className="hero-img" src="/img/p/decollete-avorio.jpg" alt="Décolleté in pelle avorio" />
        <div className="hero-shade" />
      </div>

      {/* Livello testi: lo scroll anima questo contenitore, l'ingresso anima i figli.
          Così il ricalcolo dello scroll non può rendere visibile nulla prima del tempo. */}
      <div className="hero-copy">
      <div className="hero-meta mono">
        <span>Autunno — Inverno 26/27</span>
        <span className="hide-sm">Uomo · Donna · Bambino</span>
        <span>Dal 24 al 46</span>
      </div>

      <h1 className="hero-title serif">
        <span className="ln ln-a">Ogni passo,</span>
        <span className="ln ln-b">
          <em>su misura.</em>
        </span>
      </h1>

      <div className="hero-intro">
        <p>Scarpe per uomo, donna e bambino. Le ordini qui, le provi a casa o in negozio: la taglia giusta la troviamo insieme.</p>
        <div className="hero-ctas">
          <Link to="/negozio" className="btn btn-light">
            <span>Scopri la collezione</span>
            <ArrowIcon className="ico-s" />
          </Link>
          <Link to="/#taglia" className="btn btn-glass">
            <span>Trova il tuo numero</span>
          </Link>
        </div>
      </div>

      <div className="hero-scroll mono" aria-hidden>
        <span>Scorri</span>
        <i />
      </div>

      </div>

      {/* Secondo atto: l'arco della vetrina */}
      <Link to="/prodotto/decollete-nero-90" className="hero-float f1" aria-label="Décolleté Nero 90">
        <img src="/img/p/decollete-nero.jpg" alt="" />
        <span className="mono">Décolleté Nero 90 — 109 €</span>
      </Link>
      <Link to="/prodotto/derby-fiorentina" className="hero-float f2" aria-label="Derby Fiorentina">
        <img src="/img/p/derby-cuoio.jpg" alt="" />
        <span className="mono">Derby Fiorentina — 129 €</span>
      </Link>
      <Link to="/prodotto/sneaker-strappo" className="hero-float f3" aria-label="Sneaker Strappo">
        <img src="/img/p/sneaker-strappo.jpg" alt="" />
        <span className="mono">Sneaker Strappo — 49 €</span>
      </Link>
      <div className="hero-over">
        <p className="mono eyebrow">La vetrina di stagione</p>
        <p className="serif">
          Scelte una a una, <em>provate in negozio,</em> spedite a casa tua.
        </p>
      </div>
    </section>
  )
}

/* ================= INGRESSO: si attraversa la vetrina ================= */
// La foto reale della vetrina si avvicina fino a "passare il vetro"; dietro c'è il negozio
// (fondo carta) con il benvenuto, e da lì si prosegue nei reparti. Nessun istante fermo:
// ogni tratto dello scroll muove qualcosa.
function Entrance() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const el = ref.current!
      if (reduced()) return
      const mm = gsap.matchMedia()
      mm.add({ desk: '(min-width: 900px)', mob: '(max-width: 899px)' }, (ctx) => {
        const desk = ctx.conditions?.desk
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: desk ? '+=190%' : '+=130%', scrub: true, pin: true },
        })
        tl.fromTo('.ent-photo', { scale: 1 }, { scale: desk ? 3.4 : 2.6, duration: 1, ease: 'power2.in' }, 0)
          .fromTo('.ent-shade', { opacity: 1 }, { opacity: 0.2, duration: 0.5 }, 0)
          .fromTo('.ent-copy', { yPercent: 0, opacity: 1 }, { yPercent: -60, opacity: 0, duration: 0.4 }, 0.05)
          .fromTo('.ent-door', { clipPath: 'inset(50% 50% 50% 50% round 999px 999px 0px 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', duration: 0.42, ease: 'power2.inOut' }, 0.55)
          .fromTo('.ent-welcome .logo-script', { clipPath: 'inset(-30% 100% -30% 0%)' }, { clipPath: 'inset(-30% 0% -30% 0%)', duration: 0.3 }, 0.72)
          .fromTo('.ent-welcome .logo-heel', { autoAlpha: 0, rotate: -35, y: -20 }, { autoAlpha: 1, rotate: 0, y: 0, duration: 0.12 }, 0.95)
          .fromTo('.ent-welcome .ent-line', { yPercent: 110 }, { yPercent: 0, duration: 0.2, stagger: 0.05 }, 0.82)
          .fromTo('.ent-welcome', { y: 60 }, { y: -40, duration: 0.45 }, 0.6)
          .fromTo('.ent-rail span', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
      })
      requestRefresh()
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="ent" aria-label="Entra in negozio">
      <div className="ent-photo-wrap">
        <img className="ent-photo" src="/img/negozio.jpg" alt="La vetrina di Marí, con le scarpe in esposizione" />
        <div className="ent-shade" />
      </div>
      <div className="ent-copy">
        <p className="mono">La vetrina, sotto i pini</p>
        <h2 className="serif">
          La porta è <em>aperta.</em>
        </h2>
      </div>
      <div className="ent-door">
        <div className="ent-welcome">
          <Logo />
          <p className="serif">
            <span className="ent-mask">
              <span className="ent-line">Benvenuti in negozio.</span>
            </span>
            <span className="ent-mask">
              <span className="ent-line">
                <em>Fai un giro tra i reparti.</em>
              </span>
            </span>
          </p>
        </div>
      </div>
      <div className="ent-rail" aria-hidden>
        <span />
      </div>
    </section>
  )
}

/* ================= CATEGORIE ================= */
function Categories() {
  return (
    <section className="cats wrap">
      <div className="sec-head">
        <p className="mono eyebrow">01 — I reparti</p>
        <h2 className="serif h-lg" data-reveal="lines">
          Per tutta la famiglia, <em>dal 24 al 46.</em>
        </h2>
      </div>
      <div className="cats-grid">
        {genders.map((g, i) => (
          <Link key={g.id} to={`/negozio/${g.id}`} className={`cat cat-${i}`} data-parallax={[0.1, 0.32, 0.18][i]}>
            <div className="cat-arch" data-reveal="clip">
              <img src={g.image} alt={g.label} loading="lazy" />
            </div>
            <div className="cat-label">
              <h3 className="serif">{g.label}</h3>
              <span className="cat-go">
                <ArrowIcon className="ico-s" />
              </span>
            </div>
            <p className="mono cat-line">{g.line}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ================= NUOVI ARRIVI (scroll orizzontale) ================= */
function Arrivals() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const el = ref.current!
      const track = el.querySelector<HTMLElement>('.arr-track')!
      const bar = el.querySelector<HTMLElement>('.arr-progress span')!
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const dist = () => track.scrollWidth - window.innerWidth + 64
        gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (s) => void gsap.set(bar, { scaleX: s.progress }),
          },
        })
        gsap.utils.toArray<HTMLElement>('.arr-track .pc').forEach((c, i) => {
          gsap.from(c, { y: 60 + (i % 3) * 30, autoAlpha: 0, duration: 1.2, delay: i * 0.05, scrollTrigger: { trigger: el, start: 'top 70%' } })
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="arr">
      <div className="arr-head wrap">
        <div>
          <p className="mono eyebrow">02 — Lo scaffale delle novità</p>
          <h2 className="serif h-lg" data-reveal="lines">
            Nuovi in <em>vetrina</em>
          </h2>
        </div>
        <div className="arr-side">
          <span className="mono">{String(arrivals.length).padStart(2, '0')} modelli</span>
          <div className="arr-progress">
            <span />
          </div>
          <Link to="/negozio" className="link-u">
            Vedi tutto
          </Link>
        </div>
      </div>
      <div className="arr-track" data-lenis-prevent-touch>
        {arrivals.map((p, i) => (
          <ProductCard key={p.slug} p={p} index={i} />
        ))}
        <Link to="/negozio" className="arr-end">
          <span className="serif">
            Tutta la <em>collezione</em>
          </span>
          <ArrowIcon className="ico" />
        </Link>
      </div>
    </section>
  )
}

/* ================= QUATTRO PASSI (card impilate) ================= */
const steps = [
  {
    k: 'Misura',
    t: 'Il numero giusto, al primo colpo.',
    d: 'Guida in centimetri e una nota di calzata su ogni modello: calza piccolo, regolare o abbondante. Te lo diciamo prima, non dopo il reso.',
    img: '/img/p/ed-strada.jpg',
    Icon: RulerIcon,
  },
  {
    k: 'Prova',
    t: 'Prenota online, provale in negozio.',
    d: 'Scegli modello e numero: li teniamo da parte per 48 ore. Passi, provi, decidi. Se non sono loro, non paghi nulla.',
    img: '/img/p/ed-negozio.jpg',
    Icon: StoreIcon,
  },
  {
    k: 'Reso',
    t: 'Trenta giorni per ripensarci.',
    d: 'Cambio taglia gratuito. Il reso puoi farlo con il corriere o direttamente al banco, senza moduli da stampare.',
    img: '/img/p/ed-stivali.jpg',
    Icon: ReturnIcon,
  },
  {
    k: 'Consiglio',
    t: 'Una persona, non un chatbot.',
    d: 'Hai un dubbio su pianta larga, plantare o abbinamento? Scrivici su WhatsApp: risponde chi le scarpe le vende ogni giorno.',
    img: '/img/p/ed-bambini.jpg',
    Icon: ChatIcon,
  },
]

function Steps() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (reduced()) return
      const cards = gsap.utils.toArray<HTMLElement>('.step')
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        // solo transform e opacity: nessun filtro, nessun repaint pesante
        const st = { trigger: cards[i + 1], start: 'top bottom', end: 'top 15%', scrub: true }
        gsap.fromTo(card.querySelector('.step-inner'), { scale: 1 }, { scale: 0.94, ease: 'none', scrollTrigger: st })
        gsap.fromTo(card.querySelector('.step-veil'), { opacity: 0 }, { opacity: 0.22, ease: 'none', scrollTrigger: st })
      })
      cards.forEach((card) => {
        gsap.fromTo(card.querySelector('.step-img img'), { scale: 1.3 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 15%', scrub: true },
        })
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="servizi" className="steps">
      <div className="steps-wrap wrap">
        <div className="steps-aside">
          <p className="mono eyebrow">03 — Al banco</p>
          <h2 className="serif h-xl" data-reveal="lines">
            Quattro passi per <em>non sbagliare</em> scarpa.
          </h2>
          <p className="steps-lead" data-reveal="up">
            Comprare scarpe online in Italia vuol dire spesso indovinare la taglia e sperare nel reso. Noi siamo un negozio vero: usiamo il sito per
            togliere i dubbi, non per aggiungerne.
          </p>
        </div>
        <div className="steps-list">
          {steps.map((s, i) => (
            <article key={s.k} className="step" style={{ top: `calc(14vh + ${i * 22}px)` }}>
              <div className="step-inner">
                <div className="step-txt">
                  <div className="step-top mono">
                    <span>
                      <s.Icon className="ico-s" /> {s.k}
                    </span>
                    <span>
                      0{i + 1} / 0{steps.length}
                    </span>
                  </div>
                  <h3 className="serif">{s.t}</h3>
                  <p>{s.d}</p>
                </div>
                <div className="step-img">
                  <img src={s.img} alt="" loading="lazy" decoding="async" />
                </div>
                <i className="step-veil" aria-hidden />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= TROVA IL TUO NUMERO ================= */
const toEU = (cm: number) => Math.round((cm + 1.5) * 1.5)

function SizeFinder() {
  const [cm, setCm] = useState(25)
  const eu = toEU(cm)
  const numRef = useRef<HTMLSpanElement>(null)
  const prev = useRef(eu)

  useEffect(() => {
    const el = numRef.current
    if (!el || prev.current === eu) return
    const dir = eu > prev.current ? 1 : -1
    prev.current = eu
    gsap.fromTo(el, { yPercent: 40 * dir, autoAlpha: 0.2 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out' })
  }, [eu])

  const kid = cm < 21.5
  const pct = ((cm - 14) / (31 - 14)) * 100

  return (
    <section id="taglia" className="finder wrap">
      <div className="finder-copy">
        <p className="mono eyebrow">04 — La misura</p>
        <h2 className="serif h-lg" data-reveal="lines">
          Trova il tuo numero <em>in trenta secondi.</em>
        </h2>
        <ol className="finder-how" data-reveal="stagger">
          <li>
            <span className="mono">01</span>Appoggia il tallone a un muro, su un foglio.
          </li>
          <li>
            <span className="mono">02</span>Segna con una matita la punta del dito più lungo.
          </li>
          <li>
            <span className="mono">03</span>Misura in centimetri e sposta il cursore.
          </li>
        </ol>
      </div>

      <div className="finder-tool" data-reveal="up" data-parallax="-0.12">
        <div className="finder-read">
          <div>
            <p className="mono">Lunghezza piede</p>
            <p className="finder-cm">
              {cm.toFixed(1).replace('.', ',')} <small>cm</small>
            </p>
          </div>
          <div className="finder-eu">
            <p className="mono">Il tuo numero</p>
            <p className="finder-num serif">
              <span ref={numRef}>{eu}</span>
            </p>
          </div>
        </div>

        <div className="ruler" style={{ ['--p' as string]: `${pct}%` }}>
          <div className="ruler-ticks" aria-hidden>
            {Array.from({ length: 18 }, (_, i) => (
              <span key={i}>
                <em>{14 + i}</em>
              </span>
            ))}
          </div>
          <input
            type="range"
            min={14}
            max={31}
            step={0.5}
            value={cm}
            onChange={(e) => setCm(Number(e.target.value))}
            aria-label="Lunghezza del piede in centimetri"
          />
        </div>

        <p className="finder-note">
          {kid
            ? 'Per i bambini lasciamo circa un centimetro di spazio in punta: il piede cresce anche di un numero a stagione. Rimisuralo ogni tre mesi.'
            : 'Tra due numeri? Su ogni modello trovi la nota di calzata: ti diciamo noi se prendere il più piccolo o il più grande.'}
        </p>
        <Link to={`/negozio?taglia=${eu}`} className="btn btn-ink">
          <span>Vedi i modelli nel {eu}</span>
          <ArrowIcon className="ico-s" />
        </Link>
      </div>
    </section>
  )
}

/* ================= IL NEGOZIO ================= */
function Store() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (reduced()) return
      gsap.fromTo(
        '.store-script',
        { clipPath: 'inset(-30% 100% -30% 0)' },
        { clipPath: 'inset(-30% 0% -30% 0)', duration: 2, ease: 'power2.inOut', scrollTrigger: { trigger: '.store-script', start: 'top 80%' } },
      )
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="store">
      <div className="store-media">
        <div className="store-frame" data-reveal="clip">
          <img src="/img/negozio.jpg" alt="La vetrina del negozio Marí" data-parallax="0.18" />
        </div>
        <span className="mono store-cap">La nostra vetrina, sotto i pini</span>
      </div>
      <div className="store-copy">
        <div className="store-script">
          <Logo />
        </div>
        <h2 className="serif h-lg" data-reveal="lines">
          Prima di tutto, <em>un negozio.</em>
        </h2>
        <p data-reveal="up">
          Scaffali pieni di scatole, il banco dove si prova con calma, e qualcuno che ti guarda il piede prima di guardare il prezzo. Il sito è la
          stessa vetrina, aperta anche di sera.
        </p>
        <ul className="store-facts" data-reveal="stagger">
          <li>
            <strong className="serif">48 h</strong>
            <span>il tuo paio resta da parte</span>
          </li>
          <li>
            <strong className="serif">30 gg</strong>
            <span>per reso e cambio taglia</span>
          </li>
          <li>
            <strong className="serif">0 €</strong>
            <span>ritiro in negozio</span>
          </li>
        </ul>
        <div className="hero-ctas" data-reveal="up">
          <a className="btn btn-ink" href={waLink('Ciao Marí, vorrei passare in negozio.')} target="_blank" rel="noreferrer">
            <span>Scrivici su WhatsApp</span>
          </a>
          <a className="btn btn-ghost" href="https://www.google.com/maps/search/?api=1&query=Mar%C3%AC+Calzature" target="_blank" rel="noreferrer">
            <span>Come arrivare</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ================= MARCHI ================= */
function Brands() {
  return (
    <section className="brands">
      <p className="mono eyebrow wrap">In negozio trovi</p>
      <Marquee speed={28} className="mq-brands">
        {['Mares', 'La Cuoieria', 'Inblu', 'Marí Selezione', 'Marí Cerimonia'].map((b) => (
          <span key={b} className="brand serif">
            {b}
            <Heel className="brand-heel" />
          </span>
        ))}
      </Marquee>
    </section>
  )
}
