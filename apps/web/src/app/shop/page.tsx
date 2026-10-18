"use client";
import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import { products, type Product } from "@/data/products";

const sorts = {
  featured: () => 0,
  "price-asc": (a: Product, b: Product) => a.variants[0].price - b.variants[0].price,
  "price-desc": (a: Product, b: Product) => b.variants[0].price - a.variants[0].price,
};

// shade is 1 (lightest) to 6 (darkest)
const shades = [
  { id: "all", label: "All honey", test: () => true },
  { id: "light", label: "Light & floral", test: (p: Product) => p.shade <= 2 },
  { id: "medium", label: "Golden", test: (p: Product) => p.shade === 3 || p.shade === 4 },
  { id: "dark", label: "Dark & bold", test: (p: Product) => p.shade >= 5 },
] as const;

export default function ShopPage() {
  const [q, setQ] = useState("");
  const [shade, setShade] = useState<(typeof shades)[number]["id"]>("all");
  const [sort, setSort] = useState<keyof typeof sorts>("featured");

  const list = useMemo(() => {
    const test = shades.find((s) => s.id === shade)!.test;
    return products
      .filter((p) => test(p) && (p.name + p.notes.join(" ") + p.origin).toLowerCase().includes(q.toLowerCase()))
      .sort(sorts[sort]);
  }, [q, shade, sort]);

  return (
    <>
      <PageHeader
        eyebrow="The collection"
        title="All honey"
        aside={<p className="font-semibold leading-relaxed">Six single-origin honeys from India&apos;s forests and foothills. Raw, never heated, never blended.</p>}
      />
      <section className="bg-cream px-5 pb-24 pt-24 sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by colour">
              {shades.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShade(s.id)}
                  aria-pressed={shade === s.id}
                  className={`rounded-full border-2 px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors ${
                    shade === s.id ? "border-brown bg-brown text-cream" : "border-brown/20 hover:border-brown"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1 lg:w-72">
                <span className="sr-only">Search honey</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search flavour or region" className="field rounded-full pl-11" />
                <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-4-4" />
                </svg>
              </label>
              <label>
                <span className="sr-only">Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof sorts)} className="field !rounded-full font-semibold sm:!w-auto">
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </label>
            </div>
          </div>

          <p className="mb-6 text-sm font-semibold text-ink-soft">{list.length} {list.length === 1 ? "honey" : "honeys"}</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
          {list.length === 0 && (
            <div className="py-20 text-center">
              <p className="display text-4xl">No honey matches that</p>
              <button onClick={() => { setQ(""); setShade("all"); }} className="btn btn-ghost mt-6">Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
