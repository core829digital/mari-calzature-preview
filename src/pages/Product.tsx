import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bySlug, fitCopy, formatEUR, products, waLink } from '../data/products'
import { useCart } from '../lib/cart'
import { flyToCart } from '../lib/fly'
import { gsap, SplitText, useGSAP, reduced } from '../lib/gsap'
import { useReveals } from '../lib/reveal'
import { ProductCard } from '../components/ProductCard'
import { ArrowIcon, ChatIcon, PlusIcon, ReturnIcon, RulerIcon, StoreIcon } from '../components/Icons'

export default function ProductPage() {
  const { slug = '' } = useParams()
  const p = bySlug(slug) ?? products[0]
  const { add, setOpen } = useCart()
  const [size, setSize] = useState<number | null>(null)
  const [nudge, setNudge] = useState(false)
  const [openAcc, setOpenAcc] = useState<number | null>(0)
  const root = useRef<HTMLDivElement>(null)
  const related = products.filter((x) => x.gender === p.gender && x.slug !== p.slug).slice(0, 4)
  const chosen = p.sizes.find((s) => s.size === size)

  useReveals(root, [slug])

  useGSAP(
    () => {
      if (reduced()) return
      const s = SplitText.create('.pd-name', { type: 'chars', mask: 'chars' })
      gsap
        .timeline({ delay: 0.35 })
        .fromTo('.pd-shot', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, stagger: 0.12, ease: 'expo.inOut', clearProps: 'clipPath' })
        .from('.pd-shot img', { scale: 1.3, duration: 2, stagger: 0.12 }, 0)
        .from(s.chars, { yPercent: 110, stagger: 0.02, duration: 1.1 }, 0.3)
        .from('.pd-info > *:not(.pd-name-wrap)', { autoAlpha: 0, y: 24, stagger: 0.06, duration: 1 }, 0.45)
      return () => s.revert()
    },
    { scope: root, dependencies: [slug], revertOnUpdate: true },
  )

  const addToCart = () => {
    if (!size) {
      setNudge(true)
      gsap.fromTo('.pd-sizes', { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
      return
    }
    flyToCart(root.current?.querySelector('.pd-shot img') ?? null)
    add(p.slug, size)
    setTimeout(() => setOpen(true), 900)
  }

  const acc = [
    { t: 'Materiali e dettagli', d: `${p.material}. Colore: ${p.color}. Prodotto selezionato da ${p.brand}.` },
    { t: 'Spedizione e ritiro', d: 'Spedizione in 24/48 ore, gratuita sopra i 69 €. Ritiro in negozio gratuito: ti scriviamo su WhatsApp quando è pronto.' },
    { t: 'Resi e cambi', d: 'Hai 30 giorni. Il cambio taglia è gratuito, anche al banco in negozio senza moduli.' },
  ]

  return (
    <div ref={root} className="pd" key={slug}>
      <div className="pd-main wrap">
        <div className="pd-gallery">
          <figure className="pd-shot pd-shot-main">
            <img src={p.image} alt={`${p.name}, ${p.color}`} style={{ objectPosition: p.focus }} data-parallax="0.1" />
            {p.tag && <span className={`pc-tag mono ${p.tag === 'Saldo' ? 'is-sale' : ''}`}>{p.tag}</span>}
          </figure>
          <figure className="pd-shot pd-shot-detail">
            <img src={p.image} alt="" style={{ objectPosition: '30% 65%', transform: 'scale(1.9)', transformOrigin: '35% 65%' }} />
            <figcaption className="mono">Dettaglio · {p.material.split(',')[0]}</figcaption>
          </figure>
          <figure className="pd-shot pd-shot-detail">
            <img src={p.image} alt="" style={{ objectPosition: '70% 40%', transform: 'scale(1.6)', transformOrigin: '70% 40%' }} />
            <figcaption className="mono">Lavorazione</figcaption>
          </figure>
        </div>

        <aside className="pd-info">
          <nav className="crumbs mono" aria-label="Percorso">
            <Link to="/">Home</Link> / <Link to={`/negozio/${p.gender}`}>{p.gender}</Link> / <span>{p.name}</span>
          </nav>
          <p className="mono pd-brand">{p.brand}</p>
          <div className="pd-name-wrap">
            <h1 className="pd-name serif">{p.name}</h1>
          </div>
          <p className="pd-price">
            {p.compareAt && <s>{formatEUR(p.compareAt)}</s>}
            {formatEUR(p.price)}
            <span className="mono pd-klarna">o 3 rate da {formatEUR(Math.round((p.price / 3) * 100) / 100)}</span>
          </p>
          <p className="pd-desc">{p.description}</p>

          <div className="pd-color">
            <span className="mono">Colore</span>
            <span>
              <i style={{ background: p.swatch }} /> {p.color}
            </span>
          </div>

          <div className="pd-size-head">
            <span className="mono">Numero EU</span>
            <Link to="/#taglia" className="link-u mono">
              <RulerIcon className="ico-s" /> Guida taglie
            </Link>
          </div>
          <div className={`pd-sizes ${nudge && !size ? 'is-nudge' : ''}`} role="radiogroup" aria-label="Numero">
            {p.sizes.map((s) => (
              <button
                key={s.size}
                role="radio"
                aria-checked={size === s.size}
                disabled={s.stock === 0}
                className={`sz ${size === s.size ? 'is-on' : ''} ${s.stock === 1 ? 'is-last' : ''}`}
                onClick={() => {
                  setSize(s.size)
                  setNudge(false)
                }}
              >
                {s.size}
              </button>
            ))}
          </div>
          <p className="pd-fit">
            <span className="fit-dot" data-fit={p.fit} />
            {fitCopy[p.fit]}
          </p>
          <p className="pd-stock mono" aria-live="polite">
            {!size && nudge && 'Scegli prima il tuo numero'}
            {chosen && chosen.stock === 1 && 'Ultimo paio in questo numero'}
            {chosen && chosen.stock > 1 && `Disponibile · ${chosen.stock} paia in negozio`}
          </p>

          <div className="pd-actions">
            <button className="btn btn-ink btn-full btn-lg" onClick={addToCart}>
              <span>{size ? `Aggiungi al carrello — EU ${size}` : 'Aggiungi al carrello'}</span>
            </button>
            <a
              className="btn btn-ghost btn-full"
              href={waLink(`Ciao Marí, vorrei provare in negozio: ${p.name} (${p.color})${size ? `, numero ${size}` : ''}. Me lo tenete da parte?`)}
              target="_blank"
              rel="noreferrer"
            >
              <StoreIcon className="ico-s" />
              <span>Tienimelo da parte, passo a provarlo</span>
            </a>
          </div>

          <ul className="pd-perks">
            <li>
              <StoreIcon className="ico-s" /> Ritiro gratuito in negozio
            </li>
            <li>
              <ReturnIcon className="ico-s" /> Reso e cambio taglia in 30 giorni
            </li>
            <li>
              <ChatIcon className="ico-s" />
              <a href={waLink(`Ciao, ho una domanda su ${p.name}.`)} target="_blank" rel="noreferrer" className="link-u">
                Domande? Scrivici su WhatsApp
              </a>
            </li>
          </ul>

          <div className="acc">
            {acc.map((a, i) => (
              <div key={a.t} className={`acc-item ${openAcc === i ? 'is-open' : ''}`}>
                <button onClick={() => setOpenAcc(openAcc === i ? null : i)} aria-expanded={openAcc === i}>
                  <span>{a.t}</span>
                  <PlusIcon className="ico-s acc-ico" />
                </button>
                <div className="acc-body">
                  <div>
                    <p>{a.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="related wrap">
        <div className="sec-head row">
          <h2 className="serif h-md" data-reveal="lines">
            Sta bene <em>anche con</em>
          </h2>
          <Link to={`/negozio/${p.gender}`} className="link-u">
            Tutto {p.gender} <ArrowIcon className="ico-s" />
          </Link>
        </div>
        <div className="grid grid-4" data-reveal="stagger">
          {related.map((r) => (
            <ProductCard key={r.slug} p={r} />
          ))}
        </div>
      </section>
    </div>
  )
}
