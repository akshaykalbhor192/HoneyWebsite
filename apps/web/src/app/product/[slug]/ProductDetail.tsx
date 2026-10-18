"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useCart } from "@/store/cart";
import { inr } from "@/lib/format";
import FlyingBees from "@/components/bees/FlyingBees";

const JarStage = dynamic(() => import("@/components/three/JarStage"), { ssr: false });

export default function ProductDetail({ product: p }: { product: Product }) {
  const [vi, setVi] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const v = p.variants[vi];
  const off = Math.round((1 - v.price / v.mrp) * 100);

  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 pb-20 pt-28 sm:px-10 md:grid-cols-[1.1fr_1fr] md:items-center md:pt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
          className="grain comb relative aspect-square w-full overflow-hidden rounded-[3rem] bg-honey"
        >
          <span className="absolute inset-[16%] rounded-full opacity-60 blur-2xl" style={{ background: p.color }} />
          <JarStage look={{ color: p.color, name: p.name.replace("Wild ", ""), size: p.variants[0].size.replace("g", " g") }} className="!absolute inset-0" />
          <FlyingBees flights={[
            { size: 40, speed: 0.6, rx: 10, ry: 7, cx: 30, cy: 30, phase: 0, dir: 1 },
            { size: 30, speed: 0.75, rx: 8, ry: 5, cx: 70, cy: 70, phase: 3, dir: -1 },
          ]} />
          <p className="script absolute bottom-5 left-0 right-0 text-center text-2xl text-brown/70">move your mouse, the jar follows</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.15 }}>
          <p className="script text-2xl text-red">{p.origin}</p>
          <h1 className="display mt-1 text-6xl sm:text-8xl">{p.name}</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">{p.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {p.notes.map((n) => (
              <span key={n} className="rounded-full border-2 border-brown/15 px-3 py-1 text-sm font-semibold">{n}</span>
            ))}
          </div>

          <div className="mt-8 flex items-end gap-3">
            <span className="display text-6xl">{inr(v.price)}</span>
            <span className="pb-1.5 text-lg text-ink-soft line-through">{inr(v.mrp)}</span>
            {off > 0 && <span className="mb-2 -rotate-3 rounded-full bg-red px-2.5 py-1 text-xs font-extrabold uppercase text-cream">{off}% off</span>}
          </div>
          <p className="mt-1 text-sm text-ink-soft">Inclusive of all taxes · Free shipping above ₹999</p>

          <fieldset className="mt-7">
            <legend className="label">Choose a size</legend>
            <div className="flex flex-wrap gap-2">
              {p.variants.map((x, i) => (
                <button
                  key={x.size}
                  type="button"
                  onClick={() => setVi(i)}
                  aria-pressed={i === vi}
                  className={`rounded-2xl border-2 px-5 py-3 text-left transition-colors ${i === vi ? "border-brown bg-brown text-cream" : "border-brown/20 hover:border-brown"}`}
                >
                  <span className="block text-sm font-extrabold uppercase">{x.size}</span>
                  <span className={`block text-xs ${i === vi ? "text-cream/75" : "text-ink-soft"}`}>{inr(x.price)}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-7 flex gap-3">
            <div className="flex items-center rounded-full border-2 border-brown/20">
              <button className="px-4 py-3 text-lg" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
              <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
              <button className="px-4 py-3 text-lg" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => add({ slug: p.slug, name: p.name, size: v.size, price: v.price, color: p.color }, qty)}
              className="btn btn-honey flex-1"
            >
              Add to basket · {inr(v.price * qty)}
            </motion.button>
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-3">
            {[
              ["Lab tested", "every batch"],
              ["Never heated", "raw & enzyme-rich"],
              ["Cash on delivery", "pan-India"],
            ].map(([t, s]) => (
              <li key={t} className="flex items-start gap-2 rounded-2xl bg-surface/70 p-3">
                <svg viewBox="0 0 20 22" className="mt-0.5 h-4 w-4 shrink-0 text-honey-deep" aria-hidden><path d="M10 1l9 5v10l-9 5-9-5V6z" fill="currentColor" /></svg>
                <span>
                  <span className="block text-xs font-extrabold uppercase">{t}</span>
                  <span className="block text-xs text-ink-soft">{s}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* phones: keep the buy button in reach */}
      <div className="sticky-buy fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t-2 border-brown/10 bg-cream/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="leading-tight">
          <p className="text-xs font-semibold text-ink-soft">{v.size}</p>
          <p className="text-lg font-extrabold">{inr(v.price * qty)}</p>
        </div>
        <button onClick={() => add({ slug: p.slug, name: p.name, size: v.size, price: v.price, color: p.color }, qty)} className="btn btn-dark flex-1">
          Add to basket
        </button>
      </div>
    </section>
  );
}
