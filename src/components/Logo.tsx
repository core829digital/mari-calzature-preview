interface Props {
  sub?: boolean
  className?: string
}

/** Ricostruzione del marchio dell'insegna: "Marí" in corsivo, con lo stiletto al posto dell'accento. */
export function Logo({ sub = false, className = '' }: Props) {
  return (
    <span className={`logo ${className}`} aria-label="Marí Calzature">
      <span className="logo-mark" aria-hidden>
        <span className="logo-script">Mar&#305;</span>
        <Heel className="logo-heel" />
      </span>
      {sub && (
        <span className="logo-sub" aria-hidden>
          Uomo<i>•</i>Donna<i>•</i>Bambino
        </span>
      )}
    </span>
  )
}

export function Heel({ className = '' }: { className?: string }) {
  // Décolleté a spillo, vista laterale, appoggiata in verticale come nell'insegna.
  return (
    <svg className={className} viewBox="36 -16 60 98" fill="currentColor" overflow="visible" aria-hidden>
      <g transform="rotate(-62 47 30)">
        <path d="M4 52C10 46 22 41 38 38c8-1 14 1 20 0 8-2 16-14 22-24 2-3 8-3 10 1 1 4 0 11-3 16l-2 27h-3l-1-22c-9 6-23 16-43 19-12 1-26 2-32 1-3-1-3-3-2-4z" />
      </g>
    </svg>
  )
}
