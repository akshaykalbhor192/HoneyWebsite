import { chromium } from "playwright-core";
const [w, h, tag, reduced] = [+process.argv[2] || 1440, +process.argv[3] || 900, process.argv[4] || "desk", process.argv[5] === "reduced"];
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: reduced ? "reduce" : "no-preference" });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:3000/shop", { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(3000);
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const steps = +process.argv[6] || 16;
for (let i = 0; i <= steps; i++) {
  const y = Math.round((total * i) / steps);
  await page.evaluate((y) => (window.lenis ? window.lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)), y);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `lab/${tag}-${String(i).padStart(2, "0")}.jpg`, type: "jpeg", quality: 60 });
}
console.log(JSON.stringify({ total, errors, overflowX: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) }));
await browser.close();
