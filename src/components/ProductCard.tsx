import { Link } from 'react-router-dom'
import { formatEUR, totalStock, type Product } from '../data/products'
import { useCart } from '../lib/cart'
import { flyToCart } from '../lib/fly'

export function ProductCard({ p, index }: { p: Product; index?: number }) {
  const { add } = useCart()
  const low = totalStock(p) <= 6

  return (
    <article className="pc" data-flip-id={p.slug}>
      <Link to={`/prodotto/${p.slug}`} className="pc-media" aria-label={p.name}>
        <img src={p.image} alt={`${p.name} ${p.color}`} loading="lazy" style={{ objectPosition: p.focus }} />
        {p.tag && <span className={`pc-tag mono ${p.tag === 'Saldo' ? 'is-sale' : ''}`}>{p.tag}</span>}
        {typeof index === 'number' && <span className="pc-idx mono">{String(index + 1).padStart(2, '0')}</span>}
      </Link>
      <div className="pc-quick" aria-label="Aggiunta rapida">
        {p.sizes.map((s) => (
          <button
            key={s.size}
            disabled={s.stock === 0}
            onClick={(e) => {
              flyToCart(e.currentTarget.closest('.pc')?.querySelector('img') ?? null)
              add(p.slug, s.size)
            }}
          >
            {s.size}
          </button>
        ))}
      </div>
      <Link to={`/prodotto/${p.slug}`} className="pc-body">
        <div>
          <p className="mono pc-brand">{p.brand}</p>
          <h3 className="pc-name">{p.name}</h3>
          <p className="pc-color">
            <i style={{ background: p.swatch }} /> {p.color}
            {low && <em> · ultime taglie</em>}
          </p>
        </div>
        <p className="pc-price">
          {p.compareAt && <s>{formatEUR(p.compareAt)}</s>}
          {formatEUR(p.price)}
        </p>
      </Link>
    </article>
  )
}
