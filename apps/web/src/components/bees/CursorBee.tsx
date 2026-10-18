"use client";
import { useEffect, useRef } from "react";
import Bee from "./Bee";

// A bee that lazily chases the pointer around the whole site (Busy Bee does this too).
export default function CursorBee() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const target = { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 };
    const pos = { ...target };
    let angle = 0, raf = 0, t = 0;
    const move = (e: PointerEvent) => {
      target.x = e.clientX + 26;
      target.y = e.clientY - 22;
    };
    const tick = () => {
      t += 0.05;
      // wobble around the target so it hovers instead of sticking
      const tx = target.x + Math.cos(t * 1.7) * 18;
      const ty = target.y + Math.sin(t * 2.3) * 12;
      const dx = tx - pos.x, dy = ty - pos.y;
      pos.x += dx * 0.06;
      pos.y += dy * 0.06;
      const want = Math.max(-35, Math.min(35, dy * 0.6));
      angle += (want - angle) * 0.1;
      const flip = dx < -2 ? -1 : 1;
      if (el.current) el.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scaleX(${flip}) rotate(${angle * flip}deg)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    if (el.current) el.current.style.opacity = "1";
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={el} className="cursor-bee pointer-events-none fixed left-0 top-0 z-[45] -ml-6 -mt-5 w-12 opacity-0 transition-opacity will-change-transform" aria-hidden>
      <Bee className="w-full" />
    </div>
  );
}
