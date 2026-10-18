// A wavy honey edge hanging from the bottom of a section, with drops that
// stretch, let go and fall. `color` should match the section above.
const drops = [
  { x: 9, len: 46, delay: 0.2 }, { x: 23, len: 86, delay: 1.4 }, { x: 38, len: 56, delay: 0.7 },
  { x: 54, len: 100, delay: 2.1 }, { x: 70, len: 62, delay: 0.1 }, { x: 85, len: 90, delay: 1.1 }, { x: 96, len: 40, delay: 2.6 },
];

// calm: drops stretch and recoil without falling (for pages with forms below)
export default function Drips({ color, className = "", calm = false }: { color: string; className?: string; calm?: boolean }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-full z-20 h-28 ${className}`} aria-hidden>
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-10 w-full sm:h-14">
        <path d="M0 0H100V4C97 4 96 12 93 12S89 4 86 5 82 15 78 15 74 4 70 5 66 10 62 10 58 3 54 4 50 16 46 16 41 4 37 4 33 11 29 11 24 3 20 4 16 13 12 13 8 4 4 4 2 7 0 6Z" fill={color} />
      </svg>
      {drops.map((d, i) => (
        <div key={i} className="absolute top-6 sm:top-9" style={{ left: `${d.x}%`, ["--len" as string]: `${d.len}px`, ["--delay" as string]: `${d.delay}s` }}>
          <span className={`${calm ? "drip-stem-calm" : "drip-stem"} absolute left-0 top-0 block w-3 -translate-x-1/2 rounded-b-full`} style={{ background: color }} />
          <span className={`${calm ? "drip-bead-calm" : "drip-bead"} absolute left-0 top-0 block h-4 w-4 -translate-x-1/2 rounded-full`} style={{ background: color }} />
        </div>
      ))}
    </div>
  );
}
