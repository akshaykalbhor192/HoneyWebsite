"use client";
import { motion } from "framer-motion";

const cards = [
  { t: "In your morning chai", s: "a spoon instead of sugar", bg: "bg-brown text-cream", r: -5 },
  { t: "On hot parathas", s: "with a little ghee, trust us", bg: "bg-leaf text-cream", r: 4 },
  { t: "Nani's face pack", s: "honey, haldi, a pinch of besan", bg: "bg-red text-cream", r: -3 },
  { t: "Straight off the spoon", s: "no judgement here", bg: "bg-honey text-brown", r: 5 },
];

export default function Enjoy() {
  return (
    <section className="relative overflow-hidden bg-cream px-5 pb-28 pt-40 text-brown sm:px-10">
      <h2 className="display text-center text-6xl sm:text-8xl">A spoonful of everything</h2>
      <p className="script mt-2 text-center text-3xl text-red">four ways we never stop eating it</p>
      <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.t}
            initial={{ y: 120, rotate: 0, opacity: 0 }}
            whileInView={{ y: 0, rotate: c.r, opacity: 1 }}
            whileHover={{ rotate: 0, y: -12, scale: 1.03 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: i * 0.08 }}
            className={`flex aspect-[5/3] flex-col justify-between rounded-[2rem] p-7 sm:aspect-[4/5] ${c.bg}`}
          >
            <span className="display text-6xl opacity-30">0{i + 1}</span>
            <div>
              <p className="display text-4xl leading-[0.95]">{c.t}</p>
              <p className="script mt-2 text-2xl opacity-85">{c.s}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
