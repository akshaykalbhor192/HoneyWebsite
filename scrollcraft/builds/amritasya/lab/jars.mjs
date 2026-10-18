import { chromium } from "playwright-core";
const list = [
  ["raw-forest-honey", "#8a3f0a", "Raw Forest Honey", "500 g"],
  ["wild-himalayan-honey", "#e8a317", "Himalayan Honey", "500 g"],
  ["multiflora-honey", "#d98a0b", "Multiflora Honey", "500 g"],
  ["tulsi-honey", "#b8730c", "Tulsi Honey", "500 g"],
  ["jamun-honey", "#5e2208", "Jamun Honey", "500 g"],
  ["raw-honeycomb", "#f2b63a", "Raw Honeycomb", "300 g"],
];
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: 800, height: 1000 }, deviceScaleFactor: 1.5 });
for (const [slug, c, n, s] of list) {
  await p.goto(`http://localhost:3000/render?c=${encodeURIComponent(c)}&n=${encodeURIComponent(n)}&s=${encodeURIComponent(s)}&r=0.03`, { waitUntil: "networkidle", timeout: 120000 });
  await p.waitForTimeout(4500);
  await p.screenshot({ path: `../../../apps/web/public/jars/${slug}.png`, omitBackground: true, clip: { x: 130, y: 110, width: 540, height: 760 } });
  console.log("ok", slug);
}
await b.close();
