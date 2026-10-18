// Hand-drawn style line art (Palais-inspired) to float around sections.
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function Blossom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <g {...stroke}>
        {[0, 72, 144, 216, 288].map((r) => (
          <path key={r} d="M60 60c-8-14-8-30 0-38 8 8 8 24 0 38z" transform={`rotate(${r} 60 60)`} />
        ))}
        <circle cx="60" cy="60" r="6" />
        <path d="M60 66c4 18 2 34-6 50M58 92c-8-2-14-8-16-16 8 0 14 6 16 16z" />
      </g>
    </svg>
  );
}

export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <g {...stroke}>
        <path d="M20 100C30 50 60 22 104 16c-6 44-34 74-84 84z" />
        <path d="M20 100L80 40M44 76l-4-18M58 62l-2-18M44 76l18 2M58 62l18 2" />
      </g>
    </svg>
  );
}

export function Dipper({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <g {...stroke}>
        <path d="M96 12L58 50" strokeWidth={4} />
        <ellipse cx="44" cy="64" rx="20" ry="16" transform="rotate(-45 44 64)" />
        <path d="M30 60l18 18M36 52l22 22M42 46l16 16" />
        <path d="M30 80c-2 8-2 14 2 20" />
        <circle cx="33" cy="104" r="3" fill="currentColor" />
      </g>
    </svg>
  );
}
