import Link from "next/link";
import { site } from "@/config/site";
import Bee from "./bees/Bee";

export default function Footer() {
  return (
    <footer className="grain comb relative overflow-hidden bg-honey text-brown">
      <div className="mx-auto max-w-[1500px] px-5 pt-16 sm:px-10">
        <div className="flex flex-wrap justify-between gap-x-8 gap-y-3 text-xs font-bold uppercase tracking-wider">
          <Link href="/shop" className="hover:underline">Shop all</Link>
          <Link href="/#journey" className="hover:underline">Our story</Link>
          <Link href="/track" className="hover:underline">Track order</Link>
          <span>{site.contact.email}</span>
          <span>{site.contact.phone}</span>
        </div>
        <div className="relative">
          <p className="display mt-10 whitespace-nowrap text-center text-[19.5vw] leading-[0.8]">{site.name}</p>
          <Bee className="absolute right-[8%] top-0 w-16 -rotate-12 sm:w-24" />
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-t-2 border-brown/20 py-5 text-xs font-semibold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} {site.name}. FSSAI licence number to be added.</p>
          <p className="font-deva normal-case">{site.sanskrit} · {site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
