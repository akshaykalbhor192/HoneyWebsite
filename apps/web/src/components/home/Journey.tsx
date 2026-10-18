"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import FlyingBees from "../bees/FlyingBees";
import { Blossom, Dipper } from "../Botanicals";
import { photos, unsplash } from "@/lib/images";

const steps = [
  ["Flower", "Bees forage sal, jamun, tulsi and wild rhododendron."],
  ["Hive", "Forest families harvest only the ripe, capped comb."],
  ["You", "Strained cold, jarred raw, sent straight to your door."],
];

// Busy Bee style split: a colour block of copy against a full-bleed photo with bees.
export default function Journey() {
  return (
    <section id="journey" className="grid bg-cream md:grid-cols-2">
      <div className="relative flex flex-col justify-center overflow-hidden bg-honey px-6 py-24 text-brown sm:px-14 md:min-h-[90svh]">
        <Blossom className="absolute -right-6 top-10 w-40 text-brown/15" />
        <Dipper className="absolute bottom-8 left-6 w-28 text-brown/15" />
        <motion.h2
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="display relative text-6xl sm:text-8xl"
        >
          Trace your
          <br />
          honey&apos;s journey
        </motion.h2>
        <ol className="relative mt-10 space-y-6">
          {steps.map(([t, d], i) => (
            <motion.li
              key={t}
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.15 * i, type: "spring", stiffness: 140, damping: 16 }}
              className="flex items-start gap-5"
            >
              <span className="display grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brown text-2xl text-honey">{i + 1}</span>
              <div>
                <p className="display text-3xl">{t}</p>
                <p className="max-w-sm text-brown/80">{d}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
      <div className="relative min-h-[70svh] overflow-hidden">
        <motion.div initial={{ scale: 1.25 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
          <Image src={unsplash(photos.frameBees, 1400)} alt="Honeybees working on a honeycomb frame" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </motion.div>
        <FlyingBees flights={[
          { size: 46, speed: 0.6, rx: 12, ry: 8, cx: 50, cy: 35, phase: 0, dir: 1 },
          { size: 34, speed: 0.75, rx: 9, ry: 6, cx: 30, cy: 65, phase: 3, dir: -1 },
        ]} />
      </div>
    </section>
  );
}
