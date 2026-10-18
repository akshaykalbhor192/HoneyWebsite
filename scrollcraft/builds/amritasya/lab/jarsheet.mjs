import { chromium } from "playwright-core";
import { pathToFileURL } from "url"; import path from "path"; import fs from "fs";
const dir = path.resolve("../../../apps/web/public/jars");
const html = `<body style="margin:0;background:#f4b223;display:flex;gap:10px;padding:20px">${fs.readdirSync(dir).map(f => `<img src="${pathToFileURL(path.join(dir, f)).href}" style="height:300px">`).join("")}</body>`;
fs.writeFileSync("lab/_jars.html", html);
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const p = await b.newPage({ viewport: { width: 1400, height: 340 } });
await p.goto(pathToFileURL(path.resolve("lab/_jars.html")).href); await p.waitForTimeout(500);
await p.screenshot({ path: "lab/jarsheet.jpg", type: "jpeg" }); await b.close();
