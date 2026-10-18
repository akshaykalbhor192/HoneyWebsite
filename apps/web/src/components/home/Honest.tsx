"use client";
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlyingBees from "../bees/FlyingBees";
import Drips from "../Drips";
import { photos, unsplash } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

// Brick-red colour block: a comb photo that spins up into place, and a headline that slides in from both sides.
export default function Honest() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: root.current, start: "top 85%", end: "center 55%", scrub: 0.8 };
        gsap.fromTo(".honest-photo", { rotate: -25, scale: 0.4 }, { rotate: 6, scale: 1, ease: "none", scrollTrigger: st });
        gsap.fromTo(".honest-l", { xPercent: -40, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: st });
        gsap.fromTo(".honest-r", { xPercent: 40, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: st });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="grain relative z-20 bg-red px-5 pb-28 pt-24 text-center text-cream">
      <div className="relative overflow-hidden">
        <FlyingBees flights={[
          { size: 44, speed: 0.6, rx: 18, ry: 10, cx: 25, cy: 30, phase: 1, dir: 1 },
          { size: 36, speed: 0.7, rx: 14, ry: 8, cx: 76, cy: 55, phase: 4, dir: -1 },
        ]} />
        <div className="honest-photo relative mx-auto h-40 w-40 overflow-hidden rounded-[2rem] shadow-[0_14px_0_#3b1f12] sm:h-52 sm:w-52">
          <Image src={unsplash(photos.combGold, 600)} alt="Golden honeycomb" fill sizes="208px" className="object-cover" />
        </div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-cream/75">From their busy hive to your busy home</p>
        <h2 className="display mt-4 text-6xl sm:text-8xl">
          <span className="honest-l block">Real honest honey</span>
          <span className="honest-r block text-honey">from India&apos;s forests</span>
        </h2>
        <Link href="/shop" className="btn btn-honey mt-10">
          Shop the honey →
        </Link>
      </div>
      <Drips color="#b83a22" />
    </section>
  );
}
