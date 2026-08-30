/**
 * Generate all vector-based avatar collections at 4096px
 * Fetches SVGs from DiceBear, renders to 4096x4096 PNG via sharp
 *
 * Usage: node scripts/generate-vectors.mjs
 * Deps: npm install sharp
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT  = path.resolve(__dir, '..');
const COLLECTIONS = path.join(ROOT, 'collections');
const SIZE = 4096;
const DELAY = 200;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

async function fetchSvg(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'UIFaces-Generator/1.0' },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(800 * (i + 1));
    }
  }
}

async function svgToPng(svgText, outPath) {
  await sharp(Buffer.from(svgText), { density: 300 })
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 6 })
    .toFile(outPath);
}

async function generateCollection(slug, sources) {
  const dir4k      = path.join(COLLECTIONS, slug, '4k');
  const dirPreview = path.join(COLLECTIONS, slug, 'preview');
  const dirThumb   = path.join(COLLECTIONS, slug, 'thumbnails');
  ensureDir(dir4k); ensureDir(dirPreview); ensureDir(dirThumb);

  process.stdout.write(`\n── ${slug.toUpperCase()} (${sources.length})`);
  let done = 0;

  for (let i = 0; i < sources.length; i++) {
    const num  = String(i + 1).padStart(3, '0');
    const base = `${slug}-${num}`;
    const png4k   = path.join(dir4k, `${base}.png`);
    const jpgPrev = path.join(dirPreview, `${base}.jpg`);
    const webpThm = path.join(dirThumb, `${base}.webp`);

    // Skip if 4k already exists
    if (fs.existsSync(png4k)) { process.stdout.write('s'); done++; continue; }

    try {
      const svg = await fetchSvg(sources[i]);

      // 4K PNG
      await svgToPng(svg, png4k);

      // 800px JPG preview
      await sharp(png4k).resize(800, 800, { fit: 'cover' }).jpeg({ quality: 95, mozjpeg: true }).toFile(jpgPrev);

      // 200px WebP thumbnail
      await sharp(png4k).resize(200, 200, { fit: 'cover' }).webp({ quality: 80 }).toFile(webpThm);

      done++;
      process.stdout.write('.');
    } catch (e) {
      process.stdout.write('x');
    }
    await sleep(DELAY);
  }

  console.log(` → ${done}/${sources.length}`);
  return done;
}

// ── Seed generators ───────────────────────────────────

function dicebear(style, seeds) {
  return seeds.map(seed => `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&size=256`);
}

function uniqueSeeds(prefix, count) {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
}

// Curated diverse seeds for better variety
const COMPANY_SEEDS = [
  'Acme','Nexus','Apex','Vertex','Prism','Lumina','Orion','Zenith','Forge','Atlas',
  'Nova','Cipher','Axiom','Vortex','Helix','Qubit','Zeta','Krypton','Tesseract','Strata',
  'Epoch','Meraki','Cobalt','Indigo','Sirius','Polaris','Caldera','Obsidian','Tungsten','Aegis',
  'Bastion','Citadel','Delphi','Elara','Fenrir','Glyph','Halcyon','Iridis','Jarvis','Kestrel',
  'Lumen','Morpho',
];

const SCULPTED_SEEDS = [
  'Sophia','Lucas','Amelia','Elijah','Harper','Oliver','Chloe','Mia','Noah','Liam',
  'Emma','Ava','Isabella','Mason','Ethan','Aiden','James','Charlotte','Benjamin','Lily',
  'Zoe','Henry','Jack','Luna','Aria','Leo','Grace','Max','Ella','Owen',
];

const ILLUSTRATED_SEEDS = [
  'Aurora','Felix','Maya','Oscar','Iris','Hugo','Clara','Theo','Nadia','Sasha',
  'Petra','Jasper','Ingrid','Rafael','Sylvie','Anton','Lucia','Yuki','Nia','Ezra',
  'Lena','Axel','Freya','Dante','Mira','Kai','Rosa','Emil','Hana','Leon',
];

const CARTOON_FUN_SEEDS = [
  'HappyGlow','JoyBurst','SunnyDay','Sparkle','Giggles','Twinkle','Bliss','Cheer','Fizz','Bubble',
  'Zoom','Boing','Wink','Jolly','Zippy',
];

const CARTOON_SMILE_SEEDS = [
  'Sunny','Bright','Grin','Beam','Shine','Gleam','Flash','Snap','Pop','Zing',
  'Pep','Dash','Skip','Hop','Bounce',
];

const DOODLE_SEEDS = [
  'Alex','Jordan','Casey','Morgan','Taylor','Riley','Quinn','Sage','Blake','Drew',
  'Cameron','Hayden','Parker','Avery','Jamie','Rowan','Finley','Emerson','Skyler','River',
  'Phoenix','Dakota','Kendall','Peyton','Logan','Reese','Spencer','Aubrey','Charlie','Harley',
  'Jesse','Marley',
];

const ABSTRACT_SEEDS = [
  'Prism','Kaleidoscope','Mosaic','Fractal','Tessellation','Spiral','Vortex','Wave','Pulse','Grid',
  'Lattice','Nexus','Matrix','Orbit','Radial','Hexagon','Pentagon','Rhombus','Cube','Sphere',
  'Torus','Helix','Arc','Beam','Ray','Glow','Aura','Halo','Eclipse','Zenith',
];

const QUIET_SEEDS = [
  'Mist','Fog','Dawn','Dusk','Haze','Calm','Still','Soft','Pale','Mute',
  'Whisper','Silence','Echo','Drift','Float','Lull','Rest','Ease','Gentle','Serene',
  'Peace','Harbor','Haven','Shore','Brook','Pond','Cloud','Shade','Moon','Stone',
];

// ── Main ──────────────────────────────────────────────

async function main() {
  console.log('UI Faces — Vector Avatar Generator');
  console.log(`Output: ${COLLECTIONS}`);
  console.log(`Resolution: ${SIZE}x${SIZE}px\n`);

  let total = 0;

  // Company (42) — alternating identicon + thumbs
  const companySources = COMPANY_SEEDS.map((seed, i) =>
    `https://api.dicebear.com/9.x/${i % 2 === 0 ? 'identicon' : 'thumbs'}/svg?seed=${seed}&size=256`
  );
  total += await generateCollection('company-avatars', companySources);

  // Sculpted (30) — adventurer
  total += await generateCollection('sculpted-avatars', dicebear('adventurer', SCULPTED_SEEDS));

  // Illustrated (30) — lorelei
  total += await generateCollection('illustrated-avatars', dicebear('lorelei', ILLUSTRATED_SEEDS));

  // Cartoon (30) — fun-emoji (15) + big-smile (15)
  const cartoonSources = [
    ...dicebear('fun-emoji', CARTOON_FUN_SEEDS),
    ...dicebear('big-smile', CARTOON_SMILE_SEEDS),
  ];
  total += await generateCollection('cartoon-avatars', cartoonSources);

  // Doodle (32) — open-peeps
  total += await generateCollection('doodle-avatars', dicebear('open-peeps', DOODLE_SEEDS));

  // Abstract (30) — shapes
  total += await generateCollection('abstract-avatars', dicebear('shapes', ABSTRACT_SEEDS));

  // Quiet (30) — rings
  total += await generateCollection('quiet-avatars', dicebear('rings', QUIET_SEEDS));

  console.log(`\nDone — ${total} avatars generated at ${SIZE}x${SIZE}px`);
}

main().catch(e => { console.error(e); process.exit(1); });
