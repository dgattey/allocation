/**
 * Generates app/favicon.ico from a $ symbol design.
 * Run: node scripts/generate-favicon.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import toIco from "to-ico";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ea5e9"/>
      <stop offset="100%" style="stop-color:#0284c7"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="6" fill="url(#bg)"/>
  <text x="16" y="24" font-family="system-ui,Arial,sans-serif" font-size="20" font-weight="700" fill="white" text-anchor="middle">$</text>
</svg>
`;

async function generate() {
  const png32 = await sharp(Buffer.from(SVG))
    .resize(32, 32)
    .png()
    .toBuffer();

  const ico = await toIco([png32], { sizes: [16, 32] });
  const outPath = path.join(__dirname, "..", "public", "favicon.ico");
  fs.writeFileSync(outPath, ico);
  console.log("Generated", outPath);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
