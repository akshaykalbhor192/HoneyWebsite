"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CartThumb from "@/components/CartThumb";
import { useCart, cartTotals } from "@/store/cart";
import { site } from "@/config/site";
import { inr } from "@/lib/format";

function Field({ label, className = "", ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      <input className="field" {...props} />
    </label>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-[2rem] bg-surface/60 p-6 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-center gap-3">
        <span className="display grid h-10 w-10 place-items-center rounded-full bg-brown text-xl text-honey" aria-hidden>{n}</span>
        <h2 className="display text-3xl">{title}</h2>
      </div>
      {children}
    </fieldset>
  );
}

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [pay, setPay] = useState<"online" | "cod">("online");
  useEffect(() => setMounted(true), []);
  const t = cartTotals(items, site.shippingFee, site.freeShippingAbove);

  // TODO(backend): create order in Supabase + open Razorpay; server must recalculate totals.
  const placeOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = `AMR${Date.now().toString().slice(-6)}`;
    clear();
    router.push(`/track?id=${id}&new=1`);
  };

  if (mounted && items.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Checkout" title="Basket empty" />
        <div className="bg-cream px-5 pb-28 pt-28 text-center">
          <p className="text-lg text-ink-soft">Nothing to check out yet. Your future favourite honey is one click away.</p>
          <Link href="/shop" className="btn btn-dark mt-6">Shop honey</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Almost there" title="Checkout" />
      <section className="bg-cream px-5 pb-24 pt-24 sm:px-10">
        <form onSubmit={placeOrder} className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[1.45fr_1fr]">
          <div className="space-y-6">
            <Step n={1} title="Contact">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required name="name" autoComplete="name" className="sm:col-span-2" />
                <Field label="Mobile number" required name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" placeholder="10 digits" autoComplete="tel-national" />
                <Field label="Email (optional)" name="email" type="email" placeholder="for your receipt" autoComplete="email" />
              </div>
            </Step>
            <Step n={2} title="Delivery address">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="House no, street, area" required name="line1" autoComplete="street-address" className="sm:col-span-3" />
                <Field label="City" required name="city" autoComplete="address-level2" />
                <Field label="State" required name="state" autoComplete="address-level1" />
                <Field label="Pincode" required name="pincode" inputMode="numeric" pattern="[0-9]{6}" autoComplete="postal-code" />
              </div>
            </Step>
            <Step n={3} title="Payment">
              <div className="grid gap-3 sm:grid-cols-2">
                {([
                  ["online", "Pay online", "UPI, cards, netbanking"],
                  ["cod", "Cash on delivery", "Pay when it arrives"],
                ] as const).map(([val, title, sub]) => (
                  <label
                    key={val}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-red ${
                      pay === val ? "border-brown bg-honey/25" : "border-brown/15 hover:border-brown/40"
                    }`}
                  >
                    <input type="radio" name="pay" className="sr-only" checked={pay === val} onChange={() => setPay(val)} />
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-brown ${pay === val ? "bg-brown" : ""}`} aria-hidden>
                      {pay === val && <span className="h-2 w-2 rounded-full bg-honey" />}
                    </span>
                    <span>
                      <span className="block font-extrabold">{title}</span>
                      <span className="block text-sm text-ink-soft">{sub}</span>
                    </span>
                  </label>
                ))}
              </div>
            </Step>
          </div>

          <aside className="rounded-[2rem] bg-brown p-6 text-cream sm:p-8 lg:sticky lg:top-24">
            <h2 className="display text-3xl text-honey">Order summary</h2>
            <div className="mt-6 space-y-4">
              {mounted &&
                items.map((i) => (
                  <div key={i.slug + i.size} className="flex items-center gap-3">
                    <CartThumb slug={i.slug} className="h-16 w-14" />
                    <div className="flex-1 text-sm">
                      <p className="font-bold">{i.name}</p>
                      <p className="text-cream/65">{i.size} × {i.qty}</p>
                    </div>
                    <p className="font-semibold">{inr(i.price * i.qty)}</p>
                  </div>
                ))}
            </div>
            <dl className="mt-6 space-y-2 border-t border-cream/15 pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-cream/70">Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-cream/70">Shipping</dt><dd>{t.shipping ? inr(t.shipping) : "Free"}</dd></div>
              <div className="flex items-end justify-between pt-2"><dt className="display text-2xl">Total</dt><dd className="display text-4xl text-honey">{inr(t.total)}</dd></div>
            </dl>
            {t.shipping > 0 && (
              <p className="mt-3 rounded-xl bg-cream/10 px-3 py-2 text-xs">Add {inr(site.freeShippingAbove - t.subtotal)} more for free shipping.</p>
            )}
            <button type="submit" className="btn btn-honey mt-6 w-full !py-4">
              {pay === "cod" ? "Place order" : `Pay ${inr(t.total)}`}
            </button>
            <p className="mt-3 text-center text-xs text-cream/55">Demo mode: no real payment is taken.</p>
          </aside>
        </form>
      </section>
    </>
  );
}
