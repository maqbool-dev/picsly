// One-off dev script: generate favicon/app-icon sizes from src/assets/logo.png.
// Run with: node scripts/generate-favicons.mjs
// (sharp is a devDependency — safe to remove both if you don't plan to regen.)
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src/assets/logo.png");
const outDir = path.join(root, "public");

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const PAPER = { r: 14, g: 15, b: 10, alpha: 1 }; // #0E0F0A — brand dark

// apple-touch-icon gets a solid dark background (iOS home screens don't do
// transparency well); the rest stay transparent so they adapt to any tab bar.
const targets = [
  { size: 32, name: "favicon-32x32.png", bg: TRANSPARENT },
  { size: 180, name: "apple-touch-icon.png", bg: PAPER },
  { size: 192, name: "icon-192.png", bg: TRANSPARENT },
  { size: 512, name: "icon-512.png", bg: TRANSPARENT },
];

for (const { size, name, bg } of targets) {
  const inner = Math.round(size * 0.84); // leave ~8% padding on each side
  const padL = Math.floor((size - inner) / 2);
  const padR = size - inner - padL;

  let img = sharp(src)
    .resize(inner, inner, { fit: "contain", background: TRANSPARENT })
    .extend({ top: padL, bottom: padR, left: padL, right: padR, background: TRANSPARENT });

  if (bg.alpha === 1) img = img.flatten({ background: bg });

  await img.png().toFile(path.join(outDir, name));
  console.log(`wrote public/${name} (${size}x${size})`);
}
