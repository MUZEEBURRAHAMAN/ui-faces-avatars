/**
 * Generate preview grid images for each collection
 *
 * Creates a 4x3 grid (12 sample avatars) as a single showcase image
 * for README and social previews.
 *
 * Usage: node scripts/generate-preview-grid.mjs
 *
 * Deps: npm install sharp glob
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { glob } from 'glob';

const __dir  = path.dirname(fileURLToPath(import.meta.url));
const ROOT   = path.resolve(__dir, '..');
const COLLECTIONS_DIR = path.join(ROOT, 'collections');
const SHOWCASE_DIR    = path.join(ROOT, 'assets', 'showcase');
const SOCIAL_DIR      = path.join(ROOT, 'assets', 'social-previews');

const GRID = { cols: 4, rows: 3, cellSize: 200, gap: 8 };
const OG   = { width: 1200, height: 630 };

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function createGrid(collection) {
  // Use previews if they exist, else 4k
  let srcDir = path.join(COLLECTIONS_DIR, collection, 'preview');
  if (!fs.existsSync(srcDir)) srcDir = path.join(COLLECTIONS_DIR, collection, '4k');
  if (!fs.existsSync(srcDir)) {
    console.log(`  [SKIP] ${collection} — no images`);
    return;
  }

  const files = (await glob(path.join(srcDir, '*.{png,jpg,jpeg,webp}'))).sort();
  if (files.length === 0) return;

  // Pick evenly-spaced samples
  const sampleCount = GRID.cols * GRID.rows;
  const samples = Array.from({ length: Math.min(sampleCount, files.length) }, (_, i) =>
    files[Math.floor(i * files.length / Math.min(sampleCount, files.length))]
  );

  const { cols, rows, cellSize, gap } = GRID;
  const width  = cols * cellSize + (cols - 1) * gap;
  const height = rows * cellSize + (rows - 1) * gap;

  // Create composites
  const composites = [];
  for (let i = 0; i < samples.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x   = col * (cellSize + gap);
    const y   = row * (cellSize + gap);

    const thumb = await sharp(samples[i])
      .resize(cellSize, cellSize, { fit: 'cover' })
      .png()
      .toBuffer();

    composites.push({ input: thumb, left: x, top: y });
  }

  // White background grid
  const grid = sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite(composites)
    .jpeg({ quality: 90 });

  await ensureDir(SHOWCASE_DIR);
  const outPath = path.join(SHOWCASE_DIR, `${collection}-preview.jpg`);
  await grid.toFile(outPath);
  console.log(`  ${collection}-preview.jpg (${width}x${height})`);

  // Open Graph version (1200x630)
  await ensureDir(SOCIAL_DIR);
  const ogPath = path.join(SOCIAL_DIR, `${collection}-og.jpg`);
  await sharp(outPath)
    .resize(OG.width, OG.height, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(ogPath);
  console.log(`  ${collection}-og.jpg (${OG.width}x${OG.height})`);
}

async function main() {
  console.log('Generating preview grids...\n');

  const dirs = fs.readdirSync(COLLECTIONS_DIR).filter(d =>
    fs.statSync(path.join(COLLECTIONS_DIR, d)).isDirectory()
  );

  for (const dir of dirs.sort()) {
    await createGrid(dir);
  }

  console.log('\nDone.');
}

main().catch(e => { console.error(e); process.exit(1); });
