import type { Metadata } from "next";
import { Anton, Manrope, Caveat, Tiro_Devanagari_Sanskrit } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import CursorBee from "@/components/bees/CursorBee";
import Preloader from "@/components/Preloader";
import { introBootScript } from "@/lib/intro";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-caveat" });
const tiro = Tiro_Devanagari_Sanskrit({ subsets: ["devanagari"], weight: "400", variable: "--font-tiro" });

export const metadata: Metadata = {
  title: `${site.name} · ${site.tagline}`,
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${manrope.variable} ${caveat.variable} ${tiro.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
      </head>
      <body>
        <SmoothScroll />
        <Preloader />
        <Header />
        <CartDrawer />
        <CursorBee />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
