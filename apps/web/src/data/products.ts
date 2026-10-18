export type Variant = { size: string; price: number; mrp: number };
export type Product = {
  slug: string;
  name: string;
  short: string;
  description: string;
  origin: string;
  notes: string[];
  image: string; // Unsplash photo id (placeholder)
  shade: number; // 1 = lightest honey, 6 = darkest
  color: string; // honey colour accent
  bg: string; // section background for showcase
  variants: Variant[];
  badge?: string;
};

export const products: Product[] = [
  {
    slug: "raw-forest-honey",
    image: "1605880980331-20a711b27338",
    shade: 5,
    name: "Raw Forest Honey",
    short: "Dark, bold, gathered from deep Sal forests.",
    description:
      "Collected by tribal honey hunters from wild hives high in the Sal forests of central India. Never heated, never filtered fine, so every enzyme and grain of pollen stays alive.",
    origin: "Sal forests, Madhya Pradesh",
    notes: ["Molasses", "Smoky", "Woody"],
    color: "#8a3f0a",
    bg: "#3a1c0a",
    badge: "Bestseller",
    variants: [
      { size: "250g", price: 349, mrp: 399 },
      { size: "500g", price: 649, mrp: 749 },
      { size: "1kg", price: 1199, mrp: 1399 },
    ],
  },
  {
    slug: "wild-himalayan-honey",
    image: "1587049352824-f7e128d4ebe5",
    shade: 1,
    name: "Wild Himalayan Honey",
    short: "Light and floral, from 2,000m above sea level.",
    description:
      "From cliff-side hives in the Himalayan foothills, where bees feed on wild rhododendron and mountain herbs. Delicate, clean and bright.",
    origin: "Uttarakhand Himalayas",
    notes: ["Floral", "Citrus", "Clean"],
    color: "#e8a317",
    bg: "#5a3410",
    variants: [
      { size: "250g", price: 449, mrp: 499 },
      { size: "500g", price: 849, mrp: 949 },
      { size: "1kg", price: 1599, mrp: 1799 },
    ],
  },
  {
    slug: "multiflora-honey",
    image: "1587049352851-8d4e89133924",
    shade: 3,
    name: "Multiflora Honey",
    short: "The everyday golden honey your nani kept.",
    description:
      "A balanced blend from bees foraging across mustard, sunflower and wildflower fields. Smooth, golden and perfect for chai, toast and everything between.",
    origin: "Punjab & Rajasthan fields",
    notes: ["Caramel", "Balanced", "Smooth"],
    color: "#d98a0b",
    bg: "#4a2a0e",
    variants: [
      { size: "250g", price: 249, mrp: 299 },
      { size: "500g", price: 449, mrp: 549 },
      { size: "1kg", price: 849, mrp: 999 },
    ],
  },
  {
    slug: "tulsi-honey",
    image: "1679941279735-b3b35e8bc476",
    shade: 4,
    name: "Tulsi Honey",
    short: "Holy basil blossoms, herbal and soothing.",
    description:
      "Bees forage on organic tulsi farms, giving a gently herbal honey treasured in Ayurveda for throat and immunity.",
    origin: "Organic tulsi farms, UP",
    notes: ["Herbal", "Minty", "Warm"],
    color: "#b8730c",
    bg: "#2f2a12",
    badge: "Ayurvedic",
    variants: [
      { size: "250g", price: 399, mrp: 449 },
      { size: "500g", price: 749, mrp: 849 },
    ],
  },
  {
    slug: "jamun-honey",
    image: "1558642452-9d2a7deb7f62",
    shade: 6,
    name: "Jamun Honey",
    short: "Rare, deep and slightly tangy.",
    description:
      "Harvested only during the short jamun flowering season. Dark, rich and slightly astringent, traditionally prized for balanced blood sugar.",
    origin: "Jamun groves, Gujarat",
    notes: ["Berry", "Tangy", "Rich"],
    color: "#5e2208",
    bg: "#2a0f12",
    badge: "Limited",
    variants: [
      { size: "250g", price: 499, mrp: 549 },
      { size: "500g", price: 949, mrp: 1049 },
    ],
  },
  {
    slug: "raw-honeycomb",
    image: "1773957949275-da0b3c04647e",
    shade: 2,
    name: "Raw Honeycomb",
    short: "Honey exactly as the bees made it.",
    description:
      "A whole slab of natural comb, cut straight from the frame. Chew the wax, spread it on toast, or put it on a cheese board.",
    origin: "Western Ghats, Karnataka",
    notes: ["Waxy", "Floral", "Pure"],
    color: "#f2b63a",
    bg: "#4d2e0c",
    variants: [{ size: "300g", price: 699, mrp: 799 }],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
