import { chromium } from "playwright-core";
const [w, h, tag] = [+process.argv[2], +process.argv[3], process.argv[4]];
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: w, height: h } });
const errs = []; p.on("pageerror", (e) => errs.push(e.message));
// warm the dev server so compile time doesn't distort timing
await p.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 120000 });
await p.waitForTimeout(6000);
await p.goto("about:blank");
await p.goto("http://localhost:3000/track", { waitUntil: "domcontentloaded" });
await p.evaluate(() => sessionStorage.clear());
const t0 = Date.now();
await p.goto("http://localhost:3000/", { waitUntil: "commit" });
for (const at of [400, 1400, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 5600]) {
  await p.waitForTimeout(Math.max(0, at - (Date.now() - t0)));
  await p.screenshot({ path: `lab/intro-${tag}-${at}.jpg`, type: "jpeg", quality: 60 });
}
const active = await p.evaluate(() => document.documentElement.classList.contains("intro-active"));
// second visit in the same session should skip it
await p.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(300);
const skipped = await p.evaluate(() => !document.documentElement.classList.contains("intro-active") && !document.querySelector(".preloader"));
console.log(JSON.stringify({ stillActiveAfter5s: active, secondVisitSkipped: skipped, errs: errs.slice(0, 3) }));
await b.close();
