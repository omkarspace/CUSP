import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svg = readFileSync(resolve(__dirname, "..", "public", "icon.svg"), "utf-8");

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  const s = name === "icon-maskable.png"
    ? svg.replace('rx="128"', 'rx="64"').replace('rx="104"', 'rx="40"').replace('rx="88"', 'rx="32"')
    : svg;

  const buf = await sharp(Buffer.from(s)).resize(size, size).png().toBuffer();
  writeFileSync(resolve(__dirname, "..", "public", name), buf);
  console.log(`Generated ${name} (${size}x${size})`);
}
