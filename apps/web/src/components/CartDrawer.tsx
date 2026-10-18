"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart, cartTotals } from "@/store/cart";
import { products } from "@/data/products";
import { site } from "@/config/site";
import { inr } from "@/lib/format";
import { jarSrc } from "@/lib/jars";
import CartThumb from "./CartThumb";

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, add } = useCart();
  const t = cartTotals(items, site.shippingFee, site.freeShippingAbove);
  const toFree = site.freeShippingAbove - t.subtotal;
  // one suggestion the basket does not already hold
  const suggestion = products.find((p) => !items.some((i) => i.slug === p.slug));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-brown/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your basket"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            data-lenis-prevent
          >
            <div className="comb flex items-center justify-between bg-honey px-6 py-5">
              <h2 className="display text-3xl">Your basket {t.count > 0 && <span className="text-brown/50">({t.count})</span>}</h2>
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-cream text-lg font-bold shadow-[0_3px_0_#3b1f12]" aria-label="Close basket" autoFocus>
                ✕
              </button>
            </div>

            {t.subtotal > 0 && (
              <div className="border-b-2 border-brown/10 px-6 py-4 text-sm">
                {toFree > 0 ? <>Add <b>{inr(toFree)}</b> more for <b>free shipping</b></> : <b>You have unlocked free shipping!</b>}
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-brown/10">
                  <motion.div className="h-full rounded-full bg-honey-deep" animate={{ width: `${Math.min(100, (t.subtotal / site.freeShippingAbove) * 100)}%` }} />
                </div>
              </div>
            )}

            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {items.length === 0 && (
                <div className="py-10 text-center">
                  <div className="relative mx-auto h-40 w-32 opacity-80">
                    <Image src={jarSrc("multiflora-honey")} alt="" fill sizes="128px" className="object-contain" />
                  </div>
                  <p className="display mt-4 text-3xl">Your basket is empty</p>
                  <p className="mt-1 text-ink-soft">Let&apos;s fix that.</p>
                  <Link href="/shop" onClick={() => setOpen(false)} className="btn btn-dark mt-5">Browse honey</Link>
                </div>
              )}
              {items.map((i) => (
                <motion.div layout key={i.slug + i.size} className="flex gap-4 rounded-2xl bg-surface/70 p-3">
                  <CartThumb slug={i.slug} />
                  <div className="flex-1">
                    <p className="display text-xl leading-tight">{i.name}</p>
                    <p className="text-xs font-semibold text-ink-soft">{i.size} · {inr(i.price)} each</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border-2 border-brown/20 bg-cream">
                        <button className="px-3 py-1" onClick={() => setQty(i.slug, i.size, i.qty - 1)} aria-label={`Decrease ${i.name}`}>−</button>
                        <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                        <button className="px-3 py-1" onClick={() => setQty(i.slug, i.size, i.qty + 1)} aria-label={`Increase ${i.name}`}>+</button>
                      </div>
                      <button className="text-xs font-semibold text-ink-soft underline" onClick={() => remove(i.slug, i.size)}>Remove</button>
                    </div>
                  </div>
                  <p className="font-extrabold">{inr(i.price * i.qty)}</p>
                </motion.div>
              ))}

              {items.length > 0 && suggestion && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-dashed border-brown/20 p-3">
                  <CartThumb slug={suggestion.slug} className="h-16 w-14" />
                  <div className="flex-1 text-sm">
                    <p className="script text-lg leading-none text-red">pairs beautifully</p>
                    <p className="font-bold">{suggestion.name}</p>
                    <p className="text-ink-soft">{suggestion.variants[0].size} · {inr(suggestion.variants[0].price)}</p>
                  </div>
                  <button
                    onClick={() => add({ slug: suggestion.slug, name: suggestion.name, size: suggestion.variants[0].size, price: suggestion.variants[0].price, color: suggestion.color })}
                    className="btn btn-ghost !px-4 !py-2.5"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-2 border-t-2 border-brown/10 px-6 py-5 text-sm">
                <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span>{inr(t.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-ink-soft">Shipping</span><span>{t.shipping ? inr(t.shipping) : "Free"}</span></div>
                <div className="flex items-end justify-between pt-1"><span className="display text-2xl">Total</span><span className="display text-3xl">{inr(t.total)}</span></div>
                <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-dark mt-3 w-full !py-4">
                  Checkout →
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
