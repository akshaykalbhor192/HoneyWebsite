import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const [prefix, out] = [process.argv[2], process.argv[3]];
const files = fs.readdirSync("lab").filter((f) => f.startsWith(prefix)).sort();
const html = `<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(4,1fr);gap:4px">${files
  .map((f) => `<img src="${pathToFileURL(path.resolve("lab", f)).href}" style="width:100%">`)
  .join("")}</body>`;
fs.writeFileSync("lab/_sheet.html", html);
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const p = await b.newPage({ viewport: { width: 1800, height: 800 } });
await p.goto(pathToFileURL(path.resolve("lab/_sheet.html")).href);
await p.waitForTimeout(800);
await p.screenshot({ path: out, fullPage: true, type: "jpeg", quality: 70 });
await b.close();
