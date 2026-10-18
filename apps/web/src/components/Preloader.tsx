"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Bee from "./bees/Bee";
import { INTRO_KEY, markIntroDone } from "@/lib/intro";
import { site } from "@/config/site";

const MIN_MS = 2600; // long enough to read, short enough not to annoy
const HEX = "M100 6l82 47v94l-82 47-82-47V53z";

// First-visit loader: a honeycomb cell fills with honey while the count runs to 100,
// then the whole curtain lifts off the page with a dripping edge.
export default function Preloader() {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);
  const loaded = useRef(false);

  useEffect(() => {
    if (!document.documentElement.classList.contains("intro-active")) return;
    setShow(true);
    (window as unknown as { lenis?: { stop: () => void } }).lenis?.stop();
    const onLoad = () => (loaded.current = true);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / MIN_MS);
      // ease out, and hold at 92% until the page has actually loaded
      const eased = 1 - Math.pow(1 - t, 3);
      const target = loaded.current ? eased : Math.min(eased, 0.92);
      setPct((p) => Math.max(p, Math.round(target * 100)));
      if (t < 1 || !loaded.current) raf = requestAnimationFrame(tick);
      else setTimeout(() => {
        // reveal starts now: hero animations begin while the curtain lifts
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {}
        markIntroDone();
        (window as unknown as { lenis?: { start: () => void } }).lenis?.start();
        setShow(false);
      }, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // honey surface: 0% sits at the bottom of the cell (y=194), 100% at the top (y=6)
  const level = 194 - (pct / 100) * 188;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brown text-honey"
          exit={{ y: "-110%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label={`Loading ${pct}%`}
        >
          <div className="comb pointer-events-none absolute inset-0 opacity-40" />

          {/* the cell */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 14 }}
            className="relative w-[min(56vw,260px)]"
          >
            <svg viewBox="0 0 200 200" className="w-full overflow-visible" aria-hidden>
              <defs>
                <clipPath id="pre-hex">
                  <path d={HEX} />
                </clipPath>
              </defs>
              <g clipPath="url(#pre-hex)">
                <rect x="0" y="0" width="200" height="200" fill="#2a160c" />
                {/* two offset waves give the surface a slow slosh */}
                <g style={{ transform: `translateY(${level}px)`, transition: "transform .25s linear" }}>
                  <path className="pre-wave" d="M-200 6 Q-150 -6 -100 6 T0 6 T100 6 T200 6 T300 6 T400 6 V220 H-200Z" fill="#d98e0f" />
                  <path className="pre-wave pre-wave-b" d="M-200 10 Q-150 0 -100 10 T0 10 T100 10 T200 10 T300 10 T400 10 V220 H-200Z" fill="#f4b223" />
                </g>
              </g>
              <path d={HEX} fill="none" stroke="#f4b223" strokeWidth="6" strokeLinejoin="round" />
            </svg>
            <p className="display absolute inset-0 grid place-items-center text-6xl text-brown mix-blend-normal sm:text-7xl" style={{ color: pct > 55 ? "#3b1f12" : "#f4b223" }}>
              {pct}
              <span className="sr-only">%</span>
            </p>

            {/* a bee orbiting the cell */}
            <div className="pre-orbit pointer-events-none absolute inset-[-28%]">
              <Bee className="absolute left-1/2 top-0 w-12 -translate-x-1/2" />
            </div>
          </motion.div>

          <div className="mt-12 flex overflow-hidden" aria-hidden>
            {site.name.toUpperCase().split("").map((c, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.25 + i * 0.05, type: "spring", stiffness: 220, damping: 18 }}
                className="display inline-block text-5xl sm:text-6xl"
              >
                {c}
              </motion.span>
            ))}
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="script mt-2 text-2xl text-cream/80">
            gathering the nectar…
          </motion.p>

          {/* dripping bottom edge that trails the curtain as it lifts */}
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute inset-x-0 top-full h-16 w-full" aria-hidden>
            <path d="M0 0H100V4C97 4 96 12 93 12S89 4 86 5 82 15 78 15 74 4 70 5 66 10 62 10 58 3 54 4 50 16 46 16 41 4 37 4 33 11 29 11 24 3 20 4 16 13 12 13 8 4 4 4 2 7 0 6Z" fill="#3b1f12" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
