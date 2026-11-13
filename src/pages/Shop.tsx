import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Flip, gsap, ScrollTrigger, SplitText, useGSAP, reduced, requestRefresh } from '../lib/gsap'
import { useReveals } from '../lib/reveal'
import { kinds, products, type Gender, type Kind } from '../data/products'
import { ProductCard } from '../components/ProductCard'

const titles: Record<string, { t: string; em: string; img: string }> = {
  tutto: { t: 'Tutta la', em: 'collezione', img: '/img/p/ed-strada.jpg' },
  donna: { t: 'Donna,', em: 'dal 35 al 41', img: '/img/p/decollete-avorio.jpg' },
  uomo: { t: 'Uomo,', em: 'dal 39 al 46', img: '/img/p/ed-stivali.jpg' },
  bambino: { t: 'Bambino,', em: 'dal 24 al 38', img: '/img/p/ed-bambini.jpg' },
  saldi: { t: 'Saldi', em: 'di stagione', img: '/img/p/tronchetto-panna.jpg' },
}

type Sort = 'rilevanza' | 'prezzo-asc' | 'prezzo-desc'

export default function Shop() {
  const { filter = 'tutto' } = useParams()
  const [params, setParams] = useSearchParams()
  const [kind, setKind] = useState<Kind | 'tutti'>('tutti')
  const [sort, setSort] = useState<Sort>('rilevanza')
  const size = params.get('taglia') ? Number(params.get('taglia')) : null
  const grid = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const head = titles[filter] ?? titles.tutto

  useReveals(root, [filter])

  const list = useMemo(() => {
    let l = products.filter((p) => {
      if (filter === 'saldi') return !!p.compareAt
      if (filter !== 'tutto' && p.gender !== (filter as Gender)) return false
      return true
    })
    if (kind !== 'tutti') l = l.filter((p) => p.kind === kind)
    if (size) l = l.filter((p) => p.sizes.some((s) => s.size === size && s.stock > 0))
    if (sort === 'prezzo-asc') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'prezzo-desc') l = [...l].sort((a, b) => b.price - a.price)
    return l
  }, [filter, kind, size, sort])

  const availableKinds = kinds.filter((k) =>
    products.some((p) => p.kind === k.id && (filter === 'tutto' || filter === 'saldi' || p.gender === filter)),
  )
  const sizesHere = useMemo(() => {
    const s = new Set<number>()
    products.forEach((p) => (filter === 'tutto' || filter === 'saldi' || p.gender === filter) && p.sizes.forEach((x) => s.add(x.size)))
    return [...s].sort((a, b) => a - b)
  }, [filter])

  const capture = () => {
    if (grid.current && !reduced()) flipState.current = Flip.getState(grid.current.querySelectorAll('.pc'))
  }

  useLayoutEffect(() => {
    const st = flipState.current
    if (!st || !grid.current) return
    flipState.current = null
    Flip.from(st, {
      targets: grid.current.querySelectorAll('.pc'),
      duration: 0.8,
      ease: 'expo.inOut',
      stagger: 0.02,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.2 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.95, duration: 0.4 }),
      onComplete: () => requestRefresh(),
    })
  }, [list])

  // Ingresso titolo della categoria
  useGSAP(
    () => {
      if (reduced()) return
      const s = SplitText.create('.shop-title', { type: 'chars', mask: 'chars' })
      gsap.from(s.chars, { yPercent: 110, stagger: 0.02, duration: 1.2, delay: 0.4 })
      gsap.fromTo('.shop-hero-img', { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', delay: 0.3, clearProps: 'clipPath' })
      gsap.from('.shop-hero-img img', { scale: 1.3, duration: 2, delay: 0.3 })
      // Le card entrano a gruppi quando arrivano in vista, non tutte al caricamento
      // (prima quelle sotto la piega si animavano senza essere viste e restavano ferme).
      gsap.set('.grid .pc', { autoAlpha: 0, y: 70 })
      ScrollTrigger.batch('.grid .pc', {
        start: 'top 92%',
        once: true,
        onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 1.1, delay: 0.15 }),
      })
      // parallasse dentro le card via variabile CSS (proprietà translate): non tocca lo zoom al passaggio del mouse
      gsap.fromTo('.grid', { '--py': -5 }, { '--py': 5, ease: 'none', scrollTrigger: { trigger: '.grid', start: 'top bottom', end: 'bottom top', scrub: true } })
      return () => s.revert()
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  )

  return (
    <div ref={root} className="shop" key={filter}>
      <header className="shop-hero wrap">
        <div>
          <nav className="crumbs mono" aria-label="Percorso">
            <Link to="/">Home</Link> / <span>{filter === 'tutto' ? 'Collezione' : filter}</span>
          </nav>
          <h1 className="shop-title serif">
            {head.t} <em>{head.em}</em>
          </h1>
          <p className="mono shop-count">{String(list.length).padStart(2, '0')} modelli disponibili</p>
        </div>
        <div className="shop-hero-img">
          <img src={head.img} alt="" />
        </div>
      </header>

      <div className="filters wrap">
        <div className="chips" role="group" aria-label="Tipologia">
          <button
            className={`chip ${kind === 'tutti' ? 'is-on' : ''}`}
            onClick={() => {
              capture()
              setKind('tutti')
            }}
          >
            Tutti
          </button>
          {availableKinds.map((k) => (
            <button
              key={k.id}
              className={`chip ${kind === k.id ? 'is-on' : ''}`}
              onClick={() => {
                capture()
                setKind(k.id)
              }}
            >
              {k.label}
            </button>
          ))}
        </div>
        <div className="filters-right">
          <label className="select">
            <span className="mono">Numero</span>
            <select
              value={size ?? ''}
              onChange={(e) => {
                capture()
                const v = e.target.value
                setParams(v ? { taglia: v } : {})
              }}
            >
              <option value="">Tutti</option>
              {sizesHere.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="select">
            <span className="mono">Ordina</span>
            <select
              value={sort}
              onChange={(e) => {
                capture()
                setSort(e.target.value as Sort)
              }}
            >
              <option value="rilevanza">In evidenza</option>
              <option value="prezzo-asc">Prezzo crescente</option>
              <option value="prezzo-desc">Prezzo decrescente</option>
            </select>
          </label>
        </div>
      </div>

      <div ref={grid} className="grid wrap">
        {list.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
      {list.length === 0 && (
        <div className="empty wrap">
          <p className="serif h-md">Nessun modello con questi filtri.</p>
          <p>Il tuo numero potrebbe arrivare con il prossimo carico: scrivici e ti avvisiamo noi.</p>
        </div>
      )}
    </div>
  )
}
