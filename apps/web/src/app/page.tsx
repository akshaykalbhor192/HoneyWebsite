import Hero from "@/components/home/Hero";
import Tumble from "@/components/home/Tumble";
import Journey from "@/components/home/Journey";
import BestSellers from "@/components/home/BestSellers";
import Honest from "@/components/home/Honest";
import Enjoy from "@/components/home/Enjoy";
import Marquee from "@/components/Marquee";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee className="relative z-10 -rotate-2 bg-brown pt-20 text-honey sm:pt-24" items={["100% raw", "Never heated", "Wild forest hives", "Lab tested", "Made in Bharat"]} />
      <Tumble />
      <Journey />
      <BestSellers />
      <Honest />
      <Enjoy />
      <Marquee reverse className="rotate-1 bg-leaf text-cream" items={["Free shipping above ₹999", "Cash on delivery", "Pan-India delivery", "Gift boxes"]} />
    </>
  );
}
