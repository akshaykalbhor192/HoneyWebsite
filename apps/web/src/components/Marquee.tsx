import Bee from "./bees/Bee";

export default function Marquee({ items, className = "", reverse = false }: { items: string[]; className?: string; reverse?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden whitespace-nowrap py-4 ${className}`}>
      <div className={`marquee-track inline-flex ${reverse ? "marquee-rev" : ""}`}>
        {[0, 1].map((k) => (
          <span key={k} className="inline-flex" aria-hidden={k === 1}>
            {row.map((t, i) => (
              <span key={i} className="display mx-5 inline-flex items-center gap-5 text-3xl sm:text-5xl">
                {t}
                <Bee className="h-8 w-10 sm:h-10 sm:w-12" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
