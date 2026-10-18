import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: false, args: ["--window-position=-2400,0"] });
const p = await b.newPage({ viewport: { width: 1900, height: 1040 } });
p.on("console", (m) => /reload|error|Refresh/i.test(m.text()) && console.log("console:", m.text().slice(0, 140)));
await p.goto("http://localhost:3000/track", { waitUntil: "networkidle", timeout: 120000 });
await p.evaluate(() => sessionStorage.setItem("amritasya-intro-seen", "1")); // skip loader, like a repeat visit
await p.waitForTimeout(1500);
const t0 = Date.now();
await p.goto("http://localhost:3000/", { waitUntil: "commit" });
const log = [];
for (const at of [400, 700, 1000, 1300, 1600, 2400]) {
  await p.waitForTimeout(Math.max(0, at - (Date.now() - t0)));
  await p.screenshot({ path: `lab/land-${String(at).padStart(4, "0")}.jpg`, type: "jpeg", quality: 50 });
  log.push(await p.evaluate(() => { const c = document.querySelector(".hero-jar canvas"); const w = document.querySelector(".hero-jar"); return c ? { css: [c.clientWidth, c.clientHeight], buf: [c.width, c.height], box: [Math.round(w.getBoundingClientRect().width), Math.round(w.getBoundingClientRect().height)] } : null; }));
}
console.log(JSON.stringify(log));
await b.close();
