"use client";
import { useEffect, useRef } from "react";
import Bee from "./Bee";

type Flight = { size: number; speed: number; rx: number; ry: number; cx: number; cy: number; phase: number; dir: 1 | -1 };

// Bees looping figure-eights around a point. Positions are % of the parent box.
export default function FlyingBees({ flights, className = "" }: { flights: Flight[]; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let running = false;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      flights.forEach((f, i) => {
        const el = refs.current[i];
        if (!el) return;
        const a = t * f.speed * f.dir + f.phase;
        // lissajous figure-eight
        const x = Math.sin(a) * f.rx;
        const y = Math.sin(a * 2) * f.ry;
        const vx = Math.cos(a) * f.rx * f.dir;
        const vy = Math.cos(a * 2) * 2 * f.ry * f.dir;
        const flip = vx < 0 ? -1 : 1;
        const tilt = Math.max(-30, Math.min(30, (vy / (Math.abs(vx) + 1)) * 18));
        el.style.transform = `translate3d(-50%, -50%, 0) translate(${x}vw, ${y}vh) scaleX(${flip}) rotate(${tilt * flip}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    // only animate while the section is on screen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    if (box.current) io.observe(box.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [flights]);

  return (
    <div ref={box} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {flights.map((f, i) => (
        <div key={i} ref={(n) => { refs.current[i] = n; }} className="absolute will-change-transform" style={{ left: `${f.cx}%`, top: `${f.cy}%`, width: f.size }}>
          <Bee className="w-full" />
        </div>
      ))}
    </div>
  );
}
