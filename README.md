# Marí Calzature — e-commerce

Sito e-commerce per Marí Calzature (uomo · donna · bambino).
React + TypeScript + Vite, smooth scroll con Lenis, animazioni con GSAP (ScrollTrigger, SplitText, Flip).

## Avvio in locale

Serve Node.js 20 o superiore.

```bash
npm install
npm run dev
```

Il sito si apre su `http://localhost:5173`.

## Build di produzione

```bash
npm run build
npm run preview
```

L'output finisce in `dist/`.

## Pubblicazione

È una single-page app: tutte le pagine (`/negozio/donna`, `/prodotto/...`, `/cassa`) devono rispondere con `index.html`.
La configurazione è già inclusa:

- **Vercel** — `vercel.json` (importa la repo, nessuna impostazione da cambiare)
- **Netlify** — `public/_redirects` (build command `npm run build`, publish directory `dist`)

Non servono variabili d'ambiente.

## Struttura

| Percorso | Contenuto |
| --- | --- |
| `src/pages/` | Home, catalogo, scheda prodotto, cassa |
| `src/components/` | Header, carrello, card prodotto, logo, preloader, footer |
| `src/lib/` | Smooth scroll, GSAP, animazioni allo scroll, carrello |
| `src/data/products.ts` | Catalogo prodotti (provvisorio) |
| `convex/schema.ts` | Schema del database Convex (prodotti, stock per taglia, ordini, prenotazioni) |
| `public/img/` | Immagini |

## Stato attuale

- Catalogo, prezzi e foto prodotto sono **provvisori**: vanno sostituiti con quelli reali del negozio.
- Il carrello vive nel browser; la cassa conferma l'ordine solo a schermo, senza pagamento né salvataggio.
- Il backend Convex è definito in `convex/schema.ts` ma non ancora collegato: i componenti leggono da `src/data/products.ts`, che ha la stessa forma delle tabelle.
