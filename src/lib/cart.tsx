import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { bySlug, type Product } from '../data/products'

export interface Line {
  slug: string
  size: number
  qty: number
}

export const FREE_SHIPPING = 69

interface CartApi {
  lines: (Line & { product: Product })[]
  count: number
  subtotal: number
  open: boolean
  setOpen: (v: boolean) => void
  add: (slug: string, size: number) => void
  setQty: (slug: string, size: number, qty: number) => void
  clear: () => void
  bump: number
}

const Ctx = createContext<CartApi | null>(null)
const KEY = 'mari.cart'

function load(): Line[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Line[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Line[]>(load)
  const [open, setOpen] = useState(false)
  const [bump, setBump] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(raw))
    } catch {
      /* storage non disponibile */
    }
  }, [raw])

  const add = useCallback((slug: string, size: number) => {
    setRaw((ls) => {
      const hit = ls.find((l) => l.slug === slug && l.size === size)
      if (hit) return ls.map((l) => (l === hit ? { ...l, qty: l.qty + 1 } : l))
      return [...ls, { slug, size, qty: 1 }]
    })
    setBump((b) => b + 1)
  }, [])

  const setQty = useCallback((slug: string, size: number, qty: number) => {
    setRaw((ls) =>
      qty <= 0 ? ls.filter((l) => !(l.slug === slug && l.size === size)) : ls.map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l)),
    )
  }, [])

  const clear = useCallback(() => setRaw([]), [])

  const value = useMemo<CartApi>(() => {
    const lines = raw.flatMap((l) => {
      const product = bySlug(l.slug)
      return product ? [{ ...l, product }] : []
    })
    return {
      lines,
      count: lines.reduce((a, l) => a + l.qty, 0),
      subtotal: lines.reduce((a, l) => a + l.qty * l.product.price, 0),
      open,
      setOpen,
      add,
      setQty,
      clear,
      bump,
    }
  }, [raw, open, add, setQty, clear, bump])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useCart = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart fuori dal provider')
  return c
}
