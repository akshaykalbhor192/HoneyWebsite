"use client";
import { useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);
const JarStage = dynamic(() => import("../three/JarStage"), { ssr: false });

const words = [
  { big: "Raw.", note: "Straight from the comb, strained through muslin." },
  { big: "Wild.", note: "Forest hives. No farms, no sugar feeding." },
  { big: "Real.", note: "Lab tested, batch by batch." },
];
const facts = [
  { t: "Never heated", x: "8%", y: "26%" },
  { t: "Single origin", x: "72%", y: "20%" },
  { t: "Zero added sugar", x: "6%", y: "70%" },
  { t: "Hand harvested", x: "74%", y: "66%" },
];

// Pinned stage: scroll tumbles the 3D jar a full turn while the words change and fill.
export default function Tumble() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=240%",
            pin: true,
            scrub: 0.6,
            onUpdate: (s) => {
              progress.current = 0.5 + s.progress;
              // re-render only when the word actually changes
              const next = Math.min(words.length - 1, Math.floor(s.progress * words.length));
              if (next !== stepRef.current) {
                stepRef.current = next;
                setStep(next);
              }
            },
          },
        });
        tl.fromTo(".tumble-fill", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "none", duration: 1 }, 0);
        gsap.utils.toArray<HTMLElement>(".tumble-fact").forEach((el, i) => {
          tl.fromTo(el, { scale: 0, rotate: -20 }, { scale: 1, rotate: i % 2 ? 6 : -6, ease: "back.out(3)", duration: 0.12 }, 0.12 + i * 0.2);
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => gsap.set(".tumble-fact", { scale: 1 }));
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="grain leaves relative h-[100svh] min-h-[640px] overflow-hidden bg-rust text-honey">
      {/* the line that fills as you scroll */}
      <div className="absolute inset-x-0 bottom-[7%] px-4 text-center">
        <p className="display relative inline-block text-[11vw] leading-none sm:text-[8vw]">
          <span className="text-honey/20">A new taste of the forest</span>
          <span className="tumble-fill absolute inset-0 text-honey" aria-hidden>A new taste of the forest</span>
        </p>
      </div>

      <div className="absolute inset-x-0 top-[12%] flex flex-col items-center px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ y: 80, opacity: 0, rotate: -4 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -80, opacity: 0, rotate: 4 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="display text-[22vw] leading-[0.85] sm:text-[13vw]"
          >
            {words[step].big}
          </motion.p>
        </AnimatePresence>
        <p className="mt-3 max-w-sm text-sm font-semibold uppercase tracking-wider text-cream/85">{words[step].note}</p>
      </div>

      <div className="absolute inset-x-0 bottom-[16%] top-[30%] mx-auto max-w-[520px]">
        <JarStage look={{ color: "#a8520c", name: "Raw Forest Honey", size: "500 g" }} motion={{ progress }} idle={false} shadow={false} />
      </div>

      {facts.map((f) => (
        <span key={f.t} className="tumble-fact absolute hidden scale-0 rounded-full bg-cream px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-brown shadow-[0_8px_0_#3b1f12] md:block" style={{ left: f.x, top: f.y }}>
          {f.t}
        </span>
      ))}
    </section>
  );
}
