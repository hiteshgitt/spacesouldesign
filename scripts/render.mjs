/**
 * Generates placeholder concept renders for every sample project using the
 * site's own booth generator. Requires `npm run dev` running and
 * `playwright-core` + a Chromium build (see README).
 *
 *   BASE_URL=http://localhost:3000 CHROME=/path/to/chrome node scripts/render.mjs [slug…]
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright-core");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SLUGS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["monolith-pavilion", "folded-light", "orbit-lounge", "tidal-corridor", "the-assembly", "gallery-of-objects"];
const SHOTS = ["cover", "portrait", "wide", "detail", "plan", "blueprint", "concept"];

const browser = await chromium.launch({
  executablePath: process.env.CHROME,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
page.on("pageerror", (e) => console.error("  page error:", e.message));

for (const slug of SLUGS) {
  const dir = path.join("public/images/projects", slug);
  await mkdir(dir, { recursive: true });
  for (const shot of SHOTS) {
    await page.goto(`${BASE}/dev/render?v=${slug}&shot=${shot}`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 120_000 });
    const data = await page.evaluate(() => window.__shot);
    const png = Buffer.from(data.split(",")[1], "base64");
    const out = path.join(dir, `${shot}.jpg`);
    await writeFile(out, await sharp(png).jpeg({ quality: 82, mozjpeg: true, progressive: true }).toBuffer());
    console.log("✓", out);
  }
}
await browser.close();
