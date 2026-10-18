"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useCart } from "@/store/cart";
import { inr } from "@/lib/format";
import { jarSrc } from "@/lib/jars";

const tints = ["#f4b223", "#5e7a2e", "#b83a22", "#3b1f12", "#d98e0f", "#8f3d12"];

export default function ProductCard({ product: p, index = 0 }: { product: Product; index?: number }) {
  const add = useCart((s) => s.add);
  const v = p.variants[0];
  const off = Math.round((1 - v.price / v.mrp) * 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 110, damping: 16, delay: (index % 3) * 0.07 }}
      className="group flex flex-col rounded-[2rem] bg-surface/70 p-6 transition-shadow hover:shadow-[0_10px_0_#3b1f12]"
    >
      <Link href={`/product/${p.slug}`} className="relative block aspect-[5/4]" aria-label={p.name}>
        <span className="absolute left-1/2 top-1/2 aspect-square h-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-500 group-hover:scale-110" style={{ background: tints[index % tints.length] }} />
        <Image src={jarSrc(p.slug)} alt="" fill sizes="(min-width: 1024px) 26vw, (min-width: 640px) 42vw, 85vw" className="object-contain py-1 drop-shadow-[0_18px_14px_rgba(59,31,18,.3)] transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-translate-y-2 group-hover:-rotate-6" />
        {p.badge && <span className="absolute left-0 top-0 -rotate-6 rounded-full bg-red px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-cream">{p.badge}</span>}
      </Link>

      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <Link href={`/product/${p.slug}`} className="display text-3xl hover:text-red">{p.name}</Link>
          <p className="mt-1 text-sm text-ink-soft">{p.origin}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-extrabold">{inr(v.price)}</p>
          <p className="text-xs text-ink-soft">
            <span className="line-through">{inr(v.mrp)}</span> · {off}% off
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.notes.map((n) => (
          <span key={n} className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-ink-soft">{n}</span>
        ))}
      </div>
      <div className="mt-auto flex gap-2 pt-5">
        <button onClick={() => add({ slug: p.slug, name: p.name, size: v.size, price: v.price, color: p.color })} className="btn btn-dark flex-1">
          Add {v.size}
        </button>
        <Link href={`/product/${p.slug}`} className="btn btn-ghost">View</Link>
      </div>
    </motion.article>
  );
}
