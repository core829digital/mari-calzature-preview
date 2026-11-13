import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FREE_SHIPPING, useCart } from '../lib/cart'
import { formatEUR } from '../data/products'
import { gsap, useGSAP, reduced } from '../lib/gsap'
import { Heel } from '../components/Logo'
import { StoreIcon } from '../components/Icons'

const payments = [
  { id: 'carta', label: 'Carta o Bancomat', note: 'Visa, Mastercard, Maestro' },
  { id: 'paypal', label: 'PayPal', note: 'Paghi con il tuo account' },
  { id: 'satispay', label: 'Satispay', note: "Dall'app, in un tocco" },
  { id: 'klarna', label: 'Klarna', note: '3 rate senza interessi' },
  { id: 'contrassegno', label: 'Contrassegno', note: 'Paghi alla consegna, +3 €' },
]

export default function Checkout() {
  const { lines, subtotal, clear } = useCart()
  const [delivery, setDelivery] = useState<'spedizione' | 'ritiro'>('spedizione')
  const [pay, setPay] = useState('carta')
  const [done, setDone] = useState<null | { n: string; total: number; delivery: string }>(null)
  const root = useRef<HTMLDivElement>(null)

  const ship = delivery === 'ritiro' || subtotal >= FREE_SHIPPING ? 0 : 5.9
  const cod = pay === 'contrassegno' ? 3 : 0
  const total = subtotal + ship + cod

  useGSAP(
    () => {
      if (reduced()) return
      gsap.from('.co-block, .co-summary', { autoAlpha: 0, y: 40, stagger: 0.08, duration: 1.1, delay: 0.4 })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (!done || reduced()) return
      gsap
        .timeline()
        .from('.ok-heel', { y: -120, rotate: -40, autoAlpha: 0, duration: 1.2, ease: 'bounce.out' })
        .from('.ok > *:not(.ok-heel)', { autoAlpha: 0, y: 24, stagger: 0.08, duration: 0.9 }, 0.5)
    },
    { scope: root, dependencies: [done] },
  )

  if (done) {
    return (
      <div ref={root} className="co wrap">
        <div className="ok">
          <Heel className="ok-heel" />
          <p className="mono">Ordine {done.n}</p>
          <h1 className="serif h-xl">
            Grazie, <em>a presto.</em>
          </h1>
          <p>
            {done.delivery === 'ritiro'
              ? 'Ti scriviamo su WhatsApp appena il tuo paio è pronto al banco. Lo teniamo da parte per 7 giorni.'
              : 'Riceverai una email con il tracciamento appena il pacco parte, di solito entro 24 ore.'}
          </p>
          <Link to="/negozio" className="btn btn-ink">
            <span>Torna alla collezione</span>
          </Link>
        </div>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <div ref={root} className="co wrap">
        <div className="ok">
          <Heel className="ok-heel" />
          <h1 className="serif h-lg">
            Il carrello è <em>vuoto.</em>
          </h1>
          <Link to="/negozio" className="btn btn-ink">
            <span>Scegli il primo paio</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div ref={root} className="co wrap">
      <h1 className="serif h-lg co-title">Cassa</h1>
      <form
        className="co-grid"
        onSubmit={(e) => {
          e.preventDefault()
          setDone({ n: `M-${String(Date.now()).slice(-5)}`, total, delivery })
          clear()
        }}
      >
        <div className="co-forms">
          <section className="co-block">
            <h2 className="mono eyebrow">01 · Come vuoi riceverle</h2>
            <div className="seg">
              <button type="button" className={delivery === 'spedizione' ? 'is-on' : ''} onClick={() => setDelivery('spedizione')}>
                <strong>Spedizione</strong>
                <span>{subtotal >= FREE_SHIPPING ? 'Gratuita' : '5,90 €'} · 24/48 h</span>
              </button>
              <button type="button" className={delivery === 'ritiro' ? 'is-on' : ''} onClick={() => setDelivery('ritiro')}>
                <strong>
                  <StoreIcon className="ico-s" /> Ritiro in negozio
                </strong>
                <span>Gratuito · pronto in giornata</span>
              </button>
              <i className="seg-pill" style={{ transform: `translateX(${delivery === 'ritiro' ? '100%' : '0'})` }} />
            </div>
          </section>

          <section className="co-block">
            <h2 className="mono eyebrow">02 · I tuoi dati</h2>
            <div className="fields">
              <Field label="Nome e cognome" name="name" autoComplete="name" />
              <Field label="Email" name="email" type="email" autoComplete="email" />
              <Field label="Telefono (per WhatsApp)" name="tel" type="tel" autoComplete="tel" />
              {delivery === 'spedizione' && (
                <>
                  <Field label="Indirizzo" name="address" autoComplete="street-address" wide />
                  <Field label="CAP" name="cap" autoComplete="postal-code" />
                  <Field label="Città" name="city" autoComplete="address-level2" />
                </>
              )}
            </div>
          </section>

          <section className="co-block">
            <h2 className="mono eyebrow">03 · Pagamento</h2>
            <div className="pays">
              {payments.map((p) => (
                <label key={p.id} className={`pay ${pay === p.id ? 'is-on' : ''}`}>
                  <input type="radio" name="pay" value={p.id} checked={pay === p.id} onChange={() => setPay(p.id)} />
                  <span className="pay-dot" />
                  <span className="pay-txt">
                    <strong>{p.label}</strong>
                    <small>{p.note}</small>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="co-summary">
          <h2 className="mono eyebrow">Riepilogo</h2>
          <ul>
            {lines.map((l) => (
              <li key={l.slug + l.size}>
                <img src={l.product.image} alt="" />
                <div>
                  <p>{l.product.name}</p>
                  <p className="mono">
                    EU {l.size} × {l.qty}
                  </p>
                </div>
                <span>{formatEUR(l.qty * l.product.price)}</span>
              </li>
            ))}
          </ul>
          <div className="co-rows">
            <p>
              <span>Subtotale</span>
              <span>{formatEUR(subtotal)}</span>
            </p>
            <p>
              <span>{delivery === 'ritiro' ? 'Ritiro in negozio' : 'Spedizione'}</span>
              <span>{ship ? formatEUR(ship) : 'Gratuita'}</span>
            </p>
            {cod > 0 && (
              <p>
                <span>Contrassegno</span>
                <span>{formatEUR(cod)}</span>
              </p>
            )}
            <p className="co-total">
              <span>Totale</span>
              <strong className="serif">{formatEUR(total)}</strong>
            </p>
          </div>
          <button className="btn btn-ink btn-full btn-lg" type="submit">
            <span>Conferma ordine</span>
          </button>
          <p className="co-legal">Confermando accetti le condizioni di vendita. Reso gratuito entro 30 giorni.</p>
        </aside>
      </form>
    </div>
  )
}

function Field({ label, wide, ...rest }: { label: string; wide?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`field ${wide ? 'is-wide' : ''}`}>
      <input placeholder=" " required {...rest} />
      <span>{label}</span>
    </label>
  )
}
