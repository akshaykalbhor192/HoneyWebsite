"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { useCart } from "@/store/cart";
import { inr } from "@/lib/format";
import { jarSrc } from "@/lib/jars";

const tints = ["#f4b223", "#5e7a2e", "#b83a22", "#3b1f12", "#d98e0f", "#8f3d12"];

export default function BestSellers() {
  const rail = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);
  const nudge = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.6, behavior: "smooth" });

  return (
    <section className="relative bg-cream py-24 text-brown">
      <div className="px-5 text-center">
        <p className="script text-3xl text-red">from our forests to your kitchen</p>
        <h2 className="display mt-2 text-6xl sm:text-8xl">Our very best sellers</h2>
        <Link href="/shop" className="mt-4 inline-block text-sm font-bold uppercase tracking-widest underline underline-offset-4">See all honey →</Link>
      </div>

      <div className="relative mt-14">
        <div ref={rail} className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 [scrollbar-width:none] sm:px-10" data-lenis-prevent-horizontal>
          {products.map((p, i) => {
            const v = p.variants[0];
            return (
              <motion.article
                key={p.slug}
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 4) * 0.08, type: "spring", stiffness: 110, damping: 15 }}
                className="group w-[78vw] max-w-[320px] shrink-0 snap-start text-center"
              >
                <Link href={`/product/${p.slug}`} className="relative block aspect-[4/5]">
                  <span className="absolute inset-x-[8%] bottom-[6%] top-[22%] rounded-[45%] transition-transform duration-500 group-hover:scale-105" style={{ background: tints[i % tints.length] }} />
                  <Image src={jarSrc(p.slug)} alt={`${p.name} jar`} fill sizes="320px" className="object-contain drop-shadow-[0_24px_24px_rgba(59,31,18,.35)] transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-translate-y-4 group-hover:-rotate-6" />
                  {p.badge && <span className="absolute right-2 top-6 rotate-12 rounded-full bg-red px-3 py-1.5 text-xs font-bold uppercase text-cream">{p.badge}</span>}
                </Link>
                <h3 className="display mt-4 text-3xl">{p.name}</h3>
                <p className="text-sm text-ink-soft">{p.origin}</p>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <span className="font-bold">{inr(v.price)}</span>
                  <button
                    onClick={() => add({ slug: p.slug, name: p.name, size: v.size, price: v.price, color: p.color })}
                    className="btn btn-ghost !px-4 !py-2.5 !text-xs"
                  >
                    Add to basket
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={() => nudge(-1)} className="grid h-12 w-12 place-items-center rounded-full bg-brown text-cream transition-transform hover:scale-110" aria-label="Previous products">←</button>
          <button onClick={() => nudge(1)} className="grid h-12 w-12 place-items-center rounded-full bg-brown text-cream transition-transform hover:scale-110" aria-label="Next products">→</button>
        </div>
      </div>
    </section>
  );
}
