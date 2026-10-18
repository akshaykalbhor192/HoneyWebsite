import Drips from "./Drips";
import { Blossom } from "./Botanicals";

export default function PageHeader({ eyebrow, title, aside }: { eyebrow: string; title: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="grain comb relative z-20 bg-honey px-5 pb-14 pt-32 text-brown sm:px-10 sm:pt-36">
      <Blossom className="absolute right-[4%] top-24 hidden w-36 text-brown/15 lg:block" />
      <div className="relative mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-6">
        <div>
          <p className="script text-3xl text-red">{eyebrow}</p>
          <h1 className="display mt-1 text-7xl sm:text-9xl">{title}</h1>
        </div>
        {aside && <div className="max-w-sm pb-3 lg:mr-40">{aside}</div>}
      </div>
      <Drips color="#f4b223" calm />
    </section>
  );
}
