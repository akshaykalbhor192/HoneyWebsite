import { chromium } from "playwright-core";
const [url, tag] = [process.argv[2], process.argv[3]];
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(4000);
const fonts = await p.evaluate(() => { const s = new Set(); document.querySelectorAll("h1,h2,h3,p,a,button").forEach(e => s.add(getComputedStyle(e).fontFamily.split(",")[0])); return [...s].slice(0, 8); });
const total = await p.evaluate(() => document.documentElement.scrollHeight);
console.log(tag, total, fonts);
const n = 12;
for (let i = 0; i < n; i++) {
  await p.mouse.wheel(0, Math.round(total / n));
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `lab/study-${tag}-${String(i).padStart(2, "0")}.jpg`, type: "jpeg", quality: 50 });
}
await b.close();
