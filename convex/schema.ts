// Schema Convex per il negozio. Rispecchia src/data/products.ts.
// Le taglie sono una tabella a parte: lo stock per numero si aggiorna in tempo reale
// sia dalla cassa del negozio sia dagli ordini online, senza doppie vendite.
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  products: defineTable({
    slug: v.string(),
    name: v.string(),
    brand: v.string(),
    gender: v.union(v.literal('uomo'), v.literal('donna'), v.literal('bambino')),
    kind: v.string(),
    price: v.number(),
    compareAt: v.optional(v.number()),
    color: v.string(),
    swatch: v.string(),
    material: v.string(),
    fit: v.union(v.literal('piccolo'), v.literal('regolare'), v.literal('abbondante')),
    images: v.array(v.id('_storage')),
    description: v.string(),
    tag: v.optional(v.string()),
    published: v.boolean(),
  })
    .index('by_slug', ['slug'])
    .index('by_gender_kind', ['gender', 'kind']),

  stock: defineTable({
    productId: v.id('products'),
    size: v.number(),
    quantity: v.number(),
  }).index('by_product', ['productId']),

  orders: defineTable({
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    delivery: v.union(v.literal('spedizione'), v.literal('ritiro')),
    address: v.optional(v.string()),
    payment: v.string(),
    lines: v.array(v.object({ productId: v.id('products'), size: v.number(), qty: v.number(), price: v.number() })),
    total: v.number(),
    status: v.union(v.literal('nuovo'), v.literal('pronto'), v.literal('spedito'), v.literal('ritirato'), v.literal('reso')),
  }).index('by_status', ['status']),

  // "Prova in negozio": il paio resta da parte per 48 ore.
  reservations: defineTable({
    productId: v.id('products'),
    size: v.number(),
    name: v.string(),
    phone: v.string(),
    expiresAt: v.number(),
  }).index('by_expiry', ['expiresAt']),
})
