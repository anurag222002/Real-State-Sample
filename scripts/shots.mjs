import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3111";
const OUT = "/tmp/meridian-shots";
mkdirSync(OUT, { recursive: true });

// section id -> fractions of the section's scroll range to capture
const targets = [
  ["process", [0.15, 0.55, 0.95]],
  ["facade", [0.2, 0.55, 0.95]],
  ["masterplan", [0.25, 0.6, 0.98]],
];

const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text().slice(0, 300));
});
page.on("pageerror", (err) => errors.push(`PAGEERROR ${err.message.slice(0, 300)}`));

await page.goto(BASE, { waitUntil: "load", timeout: 90000 });
await page.waitForTimeout(6000);
await page.screenshot({ path: `${OUT}/00-hero.png` });

async function scrollTo(y) {
  for (let i = 0; i < 400; i += 1) {
    const current = await page.evaluate(() => window.scrollY);
    const delta = y - current;
    if (Math.abs(delta) < 40) break;
    await page.mouse.wheel(0, Math.sign(delta) * Math.min(Math.abs(delta), 1400));
    await page.waitForTimeout(35);
  }
  await page.waitForTimeout(900);
}

for (const [id, fractions] of targets) {
  const box = await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { top: rect.top + window.scrollY, height: rect.height };
  }, id);

  if (!box) {
    console.log(`MISSING SECTION: ${id}`);
    continue;
  }

  const range = box.height - window.innerHeight;
  for (const fraction of fractions) {
    await scrollTo(box.top + (box.height - 900) * fraction);
    await page.screenshot({ path: `${OUT}/${id}-${fraction}.png` });
    console.log(`shot ${id} @${fraction} range=${Math.round(range)}`);
  }
}

console.log("CONSOLE ERRORS:", errors.length ? errors.slice(0, 8) : "none");
await browser.close();
