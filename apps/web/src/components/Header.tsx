"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart, cartTotals } from "@/store/cart";
import { site } from "@/config/site";

const pill = "rounded-full bg-cream px-4 py-2 text-xs font-bold uppercase tracking-wider text-brown shadow-[0_3px_0_#3b1f12] transition-transform hover:-translate-y-0.5";

// Floating cream pills: readable over every colour block on the page.
export default function Header() {
  const { items, setOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setMounted(true);
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // hide while scrolling down, show again on any scroll up
      if (y > 300 && y > last + 4) setHidden(true);
      else if (y < last - 4) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = mounted ? cartTotals(items, site.shippingFee, site.freeShippingAbove).count : 0;

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-transform duration-500 ${hidden ? "-translate-y-full" : ""}`}>
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-8">
        <nav className="hidden gap-2 md:flex">
          <Link href="/shop" className={pill}>Shop</Link>
          <Link href="/#journey" className={pill}>Our story</Link>
          <Link href="/track" className={pill}>Track order</Link>
        </nav>
        <Link href="/" aria-label="Amritasya home" className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <span className="display inline-flex items-center gap-2 rounded-full bg-brown px-5 py-2 text-2xl text-honey shadow-[0_3px_0_rgba(0,0,0,.3)]">
            <svg viewBox="0 0 20 22" className="h-5 w-5" aria-hidden><path d="M10 1l9 5v10l-9 5-9-5V6z" fill="currentColor" /></svg>
            {site.name}
          </span>
        </Link>
        <div className="flex gap-2">
          <Link href="/shop" className={`${pill} md:hidden`}>Shop</Link>
          <button onClick={() => setOpen(true)} className={`${pill} flex items-center gap-2 bg-honey`} aria-label={`Open basket, ${count} items`}>
            Basket <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brown px-1 text-[10px] text-cream">{count}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
