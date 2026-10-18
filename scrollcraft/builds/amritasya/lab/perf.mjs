import { chromium } from "playwright-core";
// Real GPU Chrome; wheel-scrolls the home page and records frame intervals.
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: false, args: ["--window-position=-2400,0"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 120000 });
await p.waitForTimeout(4000);
await p.evaluate(() => { window.__f = []; let l = performance.now(); const t = (n) => { window.__f.push(n - l); l = n; requestAnimationFrame(t); }; requestAnimationFrame(t); });
await p.mouse.move(700, 450);
for (let i = 0; i < 120; i++) { await p.mouse.wheel(0, 90); await p.waitForTimeout(40); }
await p.waitForTimeout(1500);
const f = await p.evaluate(() => window.__f.slice(5));
f.sort((a, b) => a - b);
const avg = f.reduce((s, x) => s + x, 0) / f.length;
console.log(JSON.stringify({ frames: f.length, avgMs: +avg.toFixed(1), p95: +f[Math.floor(f.length * 0.95)].toFixed(1), jank: f.filter(x => x > 25).length }));
await b.close();
