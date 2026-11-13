// Catalogo locale. Ha la stessa forma delle tabelle definite in /convex/schema.ts,
// così il passaggio a Convex è una sostituzione della sorgente dati, non dei componenti.

export type Gender = 'uomo' | 'donna' | 'bambino'
export type Kind = 'sneakers' | 'eleganti' | 'stivaletti' | 'decollete' | 'sandali'
export type Fit = 'piccolo' | 'regolare' | 'abbondante'

export interface SizeStock {
  size: number
  stock: number
}

export interface Product {
  slug: string
  name: string
  brand: string
  gender: Gender
  kind: Kind
  price: number
  compareAt?: number
  color: string
  swatch: string
  material: string
  fit: Fit
  image: string
  focus?: string // object-position per i dettagli
  tag?: 'Nuovo' | 'Ultimi pezzi' | 'Saldo'
  description: string
  sizes: SizeStock[]
}

const range = (from: number, to: number, stock: number[]): SizeStock[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({ size: from + i, stock: stock[i % stock.length] }))

const img = (n: string) => `/img/p/${n}.jpg`

export const products: Product[] = [
  {
    slug: 'derby-fiorentina',
    name: 'Derby Fiorentina',
    brand: 'La Cuoieria',
    gender: 'uomo',
    kind: 'eleganti',
    price: 129,
    color: 'Cuoio',
    swatch: '#8a4b2a',
    material: 'Vitello spazzolato, suola in cuoio',
    fit: 'regolare',
    image: img('derby-cuoio'),
    focus: '30% 60%',
    tag: 'Nuovo',
    description:
      'Il derby che si mette con tutto: dal completo al jeans della domenica. Pellame che con il tempo prende il colore di chi lo porta.',
    sizes: range(39, 46, [2, 4, 3, 1, 5, 2, 0, 1]),
  },
  {
    slug: 'monk-doppia-fibbia',
    name: 'Monk Doppia Fibbia',
    brand: 'La Cuoieria',
    gender: 'uomo',
    kind: 'eleganti',
    price: 149,
    color: 'Testa di moro',
    swatch: '#4a2f22',
    material: 'Pelle liscia, fodera in vitello',
    fit: 'piccolo',
    image: img('doppia-fibbia'),
    description:
      'Due fibbie, nessun laccio. Per chi vuole una scarpa da cerimonia che non sembri di cerimonia.',
    sizes: range(39, 46, [1, 2, 2, 3, 2, 1, 1, 0]),
  },
  {
    slug: 'oxford-brunito',
    name: 'Oxford Brunito',
    brand: 'La Cuoieria',
    gender: 'uomo',
    kind: 'eleganti',
    price: 159,
    color: 'Brunito',
    swatch: '#6b3a22',
    material: 'Pelle anticata a mano',
    fit: 'regolare',
    image: img('oxford-brunito'),
    focus: '60% 40%',
    description:
      "Punta pulita e brunitura fatta a mano: ogni paio ha sfumature diverse dall'altro.",
    sizes: range(39, 46, [3, 3, 2, 4, 2, 1, 1, 1]),
  },
  {
    slug: 'chelsea-moro',
    name: 'Chelsea Moro',
    brand: 'La Cuoieria',
    gender: 'uomo',
    kind: 'stivaletti',
    price: 169,
    color: 'Moro',
    swatch: '#3b2a22',
    material: 'Crosta idrorepellente, gomma antiscivolo',
    fit: 'abbondante',
    image: img('chelsea-moro'),
    tag: 'Nuovo',
    description:
      "Elastici laterali, suola in gomma che tiene sull'asfalto bagnato. L'inverno, risolto.",
    sizes: range(40, 46, [2, 3, 3, 2, 1, 1, 1]),
  },
  {
    slug: 'scarponcino-trail',
    name: 'Scarponcino Trail',
    brand: 'Mares',
    gender: 'uomo',
    kind: 'stivaletti',
    price: 119,
    color: 'Tabacco',
    swatch: '#9a5a2b',
    material: 'Nabuk, membrana traspirante',
    fit: 'regolare',
    image: img('scarponcino-trail'),
    focus: '40% 70%',
    description: 'Per i sentieri del sabato e le pozzanghere del lunedì. Lacci in cordino, puntale rinforzato.',
    sizes: range(40, 46, [1, 2, 3, 3, 2, 1, 0]),
  },
  {
    slug: 'sneaker-pelle-bianca',
    name: 'Sneaker Pelle Bianca',
    brand: 'Mares',
    gender: 'uomo',
    kind: 'sneakers',
    price: 89,
    color: 'Bianco',
    swatch: '#efeee9',
    material: 'Nappa, suola cucita',
    fit: 'regolare',
    image: img('sneaker-bianca'),
    description: 'La sneaker bianca che cercavi: pulita, cucita, senza loghi urlati.',
    sizes: range(39, 46, [4, 5, 6, 6, 5, 3, 2, 1]),
  },
  {
    slug: 'sneaker-cuoio',
    name: 'Sneaker Cuoio',
    brand: 'Inblu',
    gender: 'uomo',
    kind: 'sneakers',
    price: 95,
    compareAt: 119,
    color: 'Cammello',
    swatch: '#b07a45',
    material: 'Scamosciato e pelle',
    fit: 'abbondante',
    image: img('sneaker-cuoio'),
    tag: 'Saldo',
    description: 'Il colore del cuoio su una sagoma sportiva. Plantare estraibile in memory foam.',
    sizes: range(40, 45, [1, 2, 2, 1, 1, 0]),
  },
  {
    slug: 'tronchetto-panna',
    name: 'Tronchetto Panna',
    brand: 'Marí Selezione',
    gender: 'donna',
    kind: 'stivaletti',
    price: 139,
    color: 'Panna',
    swatch: '#e8dccb',
    material: 'Scamosciato, tacco 6 cm',
    fit: 'regolare',
    image: img('tronchetto-panna'),
    focus: '40% 50%',
    tag: 'Nuovo',
    description: "Il colore che illumina i cappotti scuri. Tacco largo, comodo dalla mattina all'aperitivo.",
    sizes: range(35, 41, [1, 2, 3, 4, 3, 2, 1]),
  },
  {
    slug: 'polacchino-cuoio',
    name: 'Polacchino Cuoio',
    brand: 'La Cuoieria',
    gender: 'uomo',
    kind: 'stivaletti',
    price: 145,
    color: 'Cuoio',
    swatch: '#9b5a32',
    material: 'Pelle ingrassata, suola in gomma',
    fit: 'piccolo',
    image: img('ed-stivali'),
    focus: '50% 60%',
    description: 'Si scioglie al passo dopo due giorni. Ganci in metallo, cuciture a vista, suola che non teme la pioggia.',
    sizes: range(40, 46, [2, 2, 3, 3, 2, 1, 1]),
  },
  {
    slug: 'decollete-avorio',
    name: 'Décolleté Avorio',
    brand: 'Marí Selezione',
    gender: 'donna',
    kind: 'decollete',
    price: 115,
    color: 'Avorio',
    swatch: '#ebe1d3',
    material: 'Pelle martellata, tacco 8 cm',
    fit: 'regolare',
    image: img('decollete-avorio'),
    description: 'Allunga la gamba e sparisce sotto ogni abito. Il passe-partout di ogni armadio.',
    sizes: range(35, 41, [1, 3, 4, 3, 2, 1, 0]),
  },
  {
    slug: 'decollete-notte',
    name: 'Décolleté Notte',
    brand: 'Marí Selezione',
    gender: 'donna',
    kind: 'decollete',
    price: 119,
    color: 'Blu notte',
    swatch: '#1f2a44',
    material: 'Camoscio, tacco 9 cm',
    fit: 'piccolo',
    image: img('decollete-notte'),
    focus: '60% 40%',
    description: "Più profondo del nero, più morbido del nero. Per le sere in cui conta l'ingresso.",
    sizes: range(35, 41, [1, 2, 2, 2, 1, 1, 1]),
  },
  {
    slug: 'decollete-nero-90',
    name: 'Décolleté Nero 90',
    brand: 'Marí Selezione',
    gender: 'donna',
    kind: 'decollete',
    price: 109,
    color: 'Nero',
    swatch: '#151515',
    material: 'Pelle lucida, tacco a spillo 9 cm',
    fit: 'regolare',
    image: img('decollete-nero'),
    description: 'Lo spillo classico, rivisto con un plantare imbottito che si fa ringraziare.',
    sizes: range(35, 41, [2, 3, 4, 4, 3, 2, 1]),
  },
  {
    slug: 'decollete-luce',
    name: 'Décolleté Luce',
    brand: 'Marí Cerimonia',
    gender: 'donna',
    kind: 'decollete',
    price: 149,
    color: 'Glitter argento',
    swatch: '#cfcac4',
    material: 'Tessuto glitter, tacco 10 cm',
    fit: 'regolare',
    image: img('decollete-luce'),
    tag: 'Ultimi pezzi',
    description: 'Per matrimoni, lauree e capodanni. Brilla senza rubare la scena a chi la porta.',
    sizes: range(35, 40, [0, 1, 1, 1, 1, 0]),
  },
  {
    slug: 'decollete-fiori',
    name: 'Décolleté Fiori',
    brand: 'Marí Selezione',
    gender: 'donna',
    kind: 'decollete',
    price: 99,
    compareAt: 129,
    color: 'Stampa floreale',
    swatch: '#3f6db3',
    material: 'Raso stampato, tacco 10 cm',
    fit: 'piccolo',
    image: img('decollete-fiori'),
    tag: 'Saldo',
    description: 'Una stampa che fa il vestito. Da sola basta e avanza.',
    sizes: range(35, 40, [1, 1, 2, 1, 1, 0]),
  },
  {
    slug: 'stringata-salvia',
    name: 'Stringata Salvia',
    brand: 'Marí Selezione',
    gender: 'donna',
    kind: 'eleganti',
    price: 129,
    color: 'Salvia',
    swatch: '#5f8f7c',
    material: 'Pelle spazzolata, tacco a rocchetto 4 cm',
    fit: 'abbondante',
    image: img('stringata-salvia'),
    tag: 'Nuovo',
    description: 'La stringata maschile, tradotta al femminile. Un colore che sta bene con il grigio, il cammello e il blu.',
    sizes: range(35, 41, [2, 3, 3, 3, 2, 1, 1]),
  },
  {
    slug: 'sabot-cipria',
    name: 'Sabot Cipria',
    brand: 'Inblu',
    gender: 'donna',
    kind: 'sandali',
    price: 69,
    color: 'Cipria',
    swatch: '#e9cbbd',
    material: 'Pelle morbida, plantare anatomico',
    fit: 'regolare',
    image: img('sabot-cipria'),
    focus: '50% 30%',
    description: 'Si infila e si dimentica. Il plantare anatomico sostiene la volta per tutto il giorno.',
    sizes: range(35, 41, [3, 3, 4, 4, 3, 2, 1]),
  },
  {
    slug: 'sneaker-duna',
    name: 'Sneaker Duna',
    brand: 'Mares',
    gender: 'donna',
    kind: 'sneakers',
    price: 79,
    color: 'Sabbia',
    swatch: '#d9c7a9',
    material: 'Pelle e camoscio',
    fit: 'regolare',
    image: img('sneaker-duna'),
    tag: 'Nuovo',
    description: 'Toni sabbia e una suola alta il giusto. La sneaker da ufficio che regge il weekend.',
    sizes: range(35, 41, [3, 4, 5, 4, 3, 2, 1]),
  },
  {
    slug: 'sneaker-strappo',
    name: 'Sneaker Strappo',
    brand: 'Mares',
    gender: 'bambino',
    kind: 'sneakers',
    price: 49,
    color: 'Bianco e rosso',
    swatch: '#c43a2f',
    material: 'Pelle sintetica lavabile',
    fit: 'abbondante',
    image: img('sneaker-strappo'),
    description: 'Lacci elastici e chiusura che fanno da soli: per uscire di casa in tempo.',
    sizes: range(24, 35, [2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 1]),
  },
  {
    slug: 'sneaker-fragola',
    name: 'Sneaker Fragola',
    brand: 'Mares',
    gender: 'bambino',
    kind: 'sneakers',
    price: 52,
    color: 'Rosa',
    swatch: '#e7a9ad',
    material: 'Mesh traspirante, suola flessibile',
    fit: 'regolare',
    image: img('sneaker-fragola'),
    tag: 'Nuovo',
    description: 'Leggera e flessibile: si piega come il piede, non contro.',
    sizes: range(24, 35, [1, 2, 3, 3, 3, 3, 2, 2, 1, 1, 1, 0]),
  },
  {
    slug: 'running-junior',
    name: 'Running Junior',
    brand: 'Inblu',
    gender: 'bambino',
    kind: 'sneakers',
    price: 59,
    color: 'Grigio e arancio',
    swatch: '#e07a3a',
    material: 'Tessuto tecnico, intersuola ammortizzata',
    fit: 'regolare',
    image: img('running-junior'),
    focus: '50% 60%',
    description: "Per l'educazione fisica e tutto quello che succede dopo la campanella.",
    sizes: range(28, 38, [2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1]),
  },
]

export const bySlug = (slug: string) => products.find((p) => p.slug === slug)

export const genders: { id: Gender; label: string; image: string; line: string }[] = [
  { id: 'donna', label: 'Donna', image: img('tronchetto-panna'), line: 'Décolleté, tronchetti, sandali' },
  { id: 'uomo', label: 'Uomo', image: img('derby-cuoio'), line: 'Derby, stivaletti, sneakers' },
  { id: 'bambino', label: 'Bambino', image: img('ed-bambini'), line: 'Dal primo passo alla terza media' },
]

export const kinds: { id: Kind; label: string }[] = [
  { id: 'sneakers', label: 'Sneakers' },
  { id: 'eleganti', label: 'Eleganti' },
  { id: 'stivaletti', label: 'Stivaletti' },
  { id: 'decollete', label: 'Décolleté' },
  { id: 'sandali', label: 'Sandali' },
]

export const fitCopy: Record<Fit, string> = {
  piccolo: 'Calza piccolo: consigliamo mezzo numero in più.',
  regolare: 'Calza regolare: prendi il tuo numero abituale.',
  abbondante: 'Calza abbondante: se sei tra due numeri, scegli il più piccolo.',
}

export const totalStock = (p: Product) => p.sizes.reduce((a, s) => a + s.stock, 0)

export const formatEUR = (n: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: n % 1 ? 2 : 0 }).format(n)

export const WHATSAPP = '393348490457'
export const waLink = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
