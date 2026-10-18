"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import Bee from "@/components/bees/Bee";

const stages = [
  ["Placed", "We have your order"],
  ["Confirmed", "Payment or COD verified"],
  ["Packed", "Jarred and sealed by hand"],
  ["Shipped", "On its way to you"],
  ["Delivered", "Enjoy your honey"],
] as const;

function Tracker() {
  const params = useSearchParams();
  const [id, setId] = useState(params.get("id") ?? "");
  const [shown, setShown] = useState(params.get("id"));
  const isNew = params.get("new") === "1";
  // TODO(backend): read real status from Supabase order_status_history
  const current = isNew ? 0 : 2;
  const pct = (current / (stages.length - 1)) * 100;

  return (
    <section className="bg-cream px-5 pb-28 pt-24 sm:px-10">
      <div className="mx-auto max-w-4xl">
        {isNew && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
            className="relative mb-10 overflow-hidden rounded-[2rem] bg-leaf p-8 text-cream"
          >
            <Bee className="absolute right-6 top-6 w-14 rotate-12" />
            <p className="display text-5xl">Thank you!</p>
            <p className="mt-2 max-w-md">
              Order <b>{shown}</b> is placed. We will send you an SMS at every step.
            </p>
          </motion.div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShown(id.trim());
          }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="flex-1">
            <span className="label">Order number</span>
            <input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. AMR123456" className="field" required />
          </label>
          <button className="btn btn-dark">Track order</button>
        </form>

        {shown && (
          <div className="mt-10 rounded-[2rem] bg-surface/70 p-6 sm:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="display text-3xl">Order {shown}</p>
              <p className="rounded-full bg-honey px-3 py-1 text-xs font-extrabold uppercase tracking-wider">{stages[current][0]}</p>
            </div>

            {/* progress line */}
            <div className="relative mt-10 hidden sm:block">
              <div className="h-2 rounded-full bg-brown/10" />
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="absolute left-0 top-0 h-2 rounded-full bg-honey-deep" />
              <motion.div initial={{ left: 0 }} animate={{ left: `${pct}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="absolute -top-6 w-10 -translate-x-1/2">
                <Bee className="w-full" />
              </motion.div>
            </div>

            <ol className="mt-6 grid gap-5 sm:mt-6 sm:grid-cols-5 sm:gap-3">
              {stages.map(([s, d], i) => (
                <motion.li key={s} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-start gap-3 sm:block">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold sm:mb-3 ${i <= current ? "bg-brown text-honey" : "border-2 border-brown/20 text-ink-soft"}`}>
                    {i < current ? "✓" : i + 1}
                  </span>
                  <span>
                    <span className={`display block text-2xl ${i <= current ? "" : "text-brown/35"}`}>{s}</span>
                    <span className={`block text-sm ${i <= current ? "text-ink-soft" : "text-brown/35"}`}>{d}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-ink-soft">
          Questions about your order? Write to us, or <Link href="/shop" className="font-bold underline">keep shopping</Link>.
        </p>
      </div>
    </section>
  );
}

export default function TrackPage() {
  return (
    <>
      <PageHeader eyebrow="Where's my honey?" title="Track order" />
      <Suspense>
        <Tracker />
      </Suspense>
    </>
  );
}
