import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await p.waitForTimeout(3000);
console.log(await p.evaluate(() => [...document.querySelectorAll(".h-copy, .h-copy > *")].map(e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return [e.tagName, Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height), s.opacity, s.transform, s.visibility]; })));
await b.close();
