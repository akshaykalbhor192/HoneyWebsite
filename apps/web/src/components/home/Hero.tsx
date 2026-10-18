"use client";
import { useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlyingBees from "../bees/FlyingBees";
import Drips from "../Drips";
import { Blossom, Leaf } from "../Botanicals";
import { site } from "@/config/site";
import { onIntroDone } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger);
const JarStage = dynamic(() => import("../three/JarStage"), { ssr: false });

const flights = [
  { size: 54, speed: 0.55, rx: 16, ry: 10, cx: 30, cy: 40, phase: 0, dir: 1 as const },
  { size: 40, speed: 0.7, rx: 12, ry: 8, cx: 72, cy: 36, phase: 2, dir: -1 as const },
  { size: 34, speed: 0.45, rx: 22, ry: 14, cx: 55, cy: 70, phase: 4, dir: 1 as const },
  { size: 28, speed: 0.8, rx: 9, ry: 6, cx: 18, cy: 74, phase: 1, dir: -1 as const },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    let stopIntro = () => {};

    const ctx = gsap.context(() => {
      // hold everything until the first-visit loader lifts
      gsap.set(".hero-letter", { y: 0, yPercent: 120 });
      gsap.set([".hero-jar", ".hero-side"], { opacity: 0 });
      gsap.set(".hero-note", { scale: 0 });
      const intro = gsap.timeline({ paused: true });
      // letters bounce in, jar drops onto the stage, side copy slides up
      intro.fromTo(".hero-letter", { y: 0, yPercent: 120, rotate: () => gsap.utils.random(-25, 25) }, { y: 0, yPercent: 0, rotate: 0, duration: 1.1, ease: "back.out(1.8)", stagger: 0.06 });
      intro.fromTo(".hero-jar", { y: -500, rotate: -20, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 1.6, ease: "bounce.out" }, 0.4);
      intro.fromTo(".hero-side", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.12 }, 1.1);
      intro.fromTo(".hero-note", { scale: 0, rotate: -30 }, { scale: 1, rotate: -8, duration: 0.8, ease: "back.out(2.5)" }, 1.8);
      stopIntro = onIntroDone(() => intro.play());
      gsap.to(".hero-botanical", { y: -14, rotate: 6, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.6 });

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-word", { yPercent: -35, scale: 0.92, ease: "none", scrollTrigger: st });
        gsap.to(".hero-jar", { yPercent: 30, ease: "none", scrollTrigger: st });
        ScrollTrigger.create({ ...st, onUpdate: (s) => (progress.current = s.progress * 0.5) });
      });
    }, root);
    return () => {
      stopIntro();
      ctx.revert();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section ref={root} className="grain comb relative z-20 h-[100svh] min-h-[680px] bg-honey text-brown">
      <div className="absolute inset-0 overflow-hidden">
        {/* honey drip falling from the top of the screen onto the lid */}
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2" style={{ ["--len" as string]: "22vh", ["--delay" as string]: "1.6s" }} aria-hidden>
          <span className="drip-stem absolute left-0 top-0 block w-4 rounded-b-full bg-honey-deep" />
          <span className="drip-bead absolute left-0 top-0 block h-5 w-5 rounded-full bg-honey-deep" />
        </div>

        <Blossom className="hero-botanical absolute left-[6%] top-[22%] w-24 text-brown/40 sm:w-32" />
        <Leaf className="hero-botanical absolute bottom-[26%] right-[5%] w-24 text-brown/40 sm:w-36" />

        {/* giant wordmark, the jar sits in front of it */}
        <h1 className="hero-word display absolute inset-x-0 top-[16%] flex justify-center text-[24vw] leading-none sm:top-[12%] sm:text-[21vw]" aria-label={site.name}>
          {site.name.toUpperCase().split("").map((c, i) => (
            <span key={i} className="overflow-hidden pt-[0.04em]" aria-hidden>
              <span className="hero-letter inline-block">{c}</span>
            </span>
          ))}
        </h1>

        <div className="hero-jar absolute inset-x-0 bottom-[8%] top-[22%] z-[5] mx-auto w-full max-w-[640px] sm:top-[14%]">
          <JarStage look={{ color: "#a8520c", name: "Raw Forest Honey", size: "500 g" }} motion={{ progress, pointer }} />
        </div>

        <FlyingBees flights={flights} className="z-[6]" />

        <p className="hero-note script absolute right-[8%] top-[56%] z-[7] hidden rotate-[-8deg] text-3xl text-red md:block">
          straight from
          <br />
          the wild hive!
          <svg viewBox="0 0 120 60" className="-ml-24 mt-1 w-28 text-red" aria-hidden>
            <path d="M110 6C80 10 50 30 14 46M14 46l14-14M14 46l20 2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </p>

        <div className="absolute inset-x-0 bottom-10 z-[7] flex flex-col gap-4 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-10">
          <p className="hero-side max-w-[19rem] text-sm font-semibold uppercase leading-relaxed tracking-wider">
            Raw honey from India&apos;s wild forest hives. Never heated. Never blended.
          </p>
          <div className="hero-side flex items-center gap-3">
            <Link href="/shop" className="btn btn-dark">
              Shop honey →
            </Link>
            <Link href="/#journey" className="btn btn-ghost">
              Our story
            </Link>
          </div>
        </div>
      </div>
      <Drips color="#f4b223" />
    </section>
  );
}
