import { chromium } from "playwright-core";
// Captures each route at a few scroll depths, plus the cart drawer, on one viewport.
const [w, h, tag] = [+process.argv[2], +process.argv[3], process.argv[4]];
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: w, height: h } });
const errs = []; p.on("pageerror", (e) => errs.push(e.message));
const go = async (path, shots, name) => {
  await p.goto("http://localhost:3000" + path, { waitUntil: "networkidle", timeout: 120000 });
  await p.waitForTimeout(2500);
  const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let i = 0; i < shots; i++) {
    const y = shots === 1 ? 0 : Math.round((total * i) / (shots - 1));
    await p.evaluate((y) => (window.lenis ? window.lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)), y);
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `lab/ui-${tag}-${name}-${i}.jpg`, type: "jpeg", quality: 60 });
  }
};
await go("/shop", 3, "a-shop");
await go("/product/tulsi-honey", 2, "b-product");
await p.evaluate(() => document.querySelector("button[aria-label^='Open basket']"));
// add two items, open drawer
await p.locator("button.btn-honey").first().click();
await p.waitForTimeout(1200);
await p.screenshot({ path: `lab/ui-${tag}-c-drawer-0.jpg`, type: "jpeg", quality: 60 });
await go("/checkout", 2, "d-checkout");
await go("/track?id=AMR123456", 1, "e-track");
console.log(JSON.stringify(errs.slice(0, 5)));
await b.close();
