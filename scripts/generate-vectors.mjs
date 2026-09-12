/**
 * Generate all vector-based avatar collections at 4096px — 100 per category
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
const DELAY = 180;

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
  let done = 0, skipped = 0;

  for (let i = 0; i < sources.length; i++) {
    const num  = String(i + 1).padStart(3, '0');
    const base = `${slug}-${num}`;
    const png4k   = path.join(dir4k, `${base}.png`);
    const jpgPrev = path.join(dirPreview, `${base}.jpg`);
    const webpThm = path.join(dirThumb, `${base}.webp`);

    if (fs.existsSync(png4k)) { process.stdout.write('s'); skipped++; done++; continue; }

    try {
      const svg = await fetchSvg(sources[i]);
      await svgToPng(svg, png4k);
      await sharp(png4k).resize(800, 800, { fit: 'cover' }).jpeg({ quality: 95, mozjpeg: true }).toFile(jpgPrev);
      await sharp(png4k).resize(200, 200, { fit: 'cover' }).webp({ quality: 80 }).toFile(webpThm);
      done++;
      process.stdout.write('.');
    } catch (e) {
      process.stdout.write('x');
    }
    await sleep(DELAY);
  }

  console.log(` → ${done}/100 (${skipped} cached)`);
  return done;
}

// ── 100 unique seeds per category ─────────────────────

function dicebear(style, seeds) {
  return seeds.map(seed => `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&size=256`);
}

const COMPANY_SEEDS = [
  'Acme','Nexus','Apex','Vertex','Prism','Lumina','Orion','Zenith','Forge','Atlas',
  'Nova','Cipher','Axiom','Vortex','Helix','Qubit','Zeta','Krypton','Tesseract','Strata',
  'Epoch','Meraki','Cobalt','Indigo','Sirius','Polaris','Caldera','Obsidian','Tungsten','Aegis',
  'Bastion','Citadel','Delphi','Elara','Fenrir','Glyph','Halcyon','Iridis','Jarvis','Kestrel',
  'Lumen','Morpho','Noctis','Osmium','Pyrex','Quasar','Raven','Solaris','Titan','Umbra',
  'Vector','Wyvern','Xenon','Ymir','Zarkov','Andor','Bravo','Calix','Draco','Ember',
  'Fable','Gideon','Hydra','Invoke','Jubilee','Karma','Lycan','Midas','Nimbus','Oracle',
  'Pulse','Quest','Rogue','Sigma','Talon','Ultra','Vigor','Warden','Xara','Yield',
  'Zion','Alpha','Beta','Gamma','Delta','Omega','Lambda','Theta','Epsilon','Phi',
  'Psi','Chi','Kappa','Iota','Rho','Tau','Upsilon','Mu','Nu','Xi',
];

const SCULPTED_SEEDS = [
  'Sophia','Lucas','Amelia','Elijah','Harper','Oliver','Chloe','Mia','Noah','Liam',
  'Emma','Ava','Isabella','Mason','Ethan','Aiden','James','Charlotte','Benjamin','Lily',
  'Zoe','Henry','Jack','Luna','Aria','Leo','Grace','Max','Ella','Owen',
  'Violet','Sebastian','Scarlett','Daniel','Layla','Matthew','Penelope','David','Riley','Carter',
  'Nora','Julian','Hannah','Wyatt','Addison','Grayson','Aubrey','Levi','Ellie','Luke',
  'Stella','Jayden','Natalie','Gabriel','Zoey','Isaac','Leah','Lincoln','Hazel','Caleb',
  'Aurora','Theodore','Savannah','Jaxon','Audrey','Asher','Brooklyn','Thomas','Claire','Josiah',
  'Skylar','Christopher','Lucy','Ezra','Anna','Maverick','Caroline','Ryder','Kennedy','Miles',
  'Sawyer','Evelyn','Nathan','Aaliyah','Adrian','Gianna','Xavier','Valentina','Dominic','Bella',
  'Greer','Austin','Naomi','Jace','Elena','Easton','Willow','Colton','Autumn','Silas',
];

const ILLUSTRATED_SEEDS = [
  'Aurora','Felix','Maya','Oscar','Iris','Hugo','Clara','Theo','Nadia','Sasha',
  'Petra','Jasper','Ingrid','Rafael','Sylvie','Anton','Lucia','Yuki','Nia','Ezra',
  'Lena','Axel','Freya','Dante','Mira','Kai','Rosa','Emil','Hana','Leon',
  'Margot','River','Celeste','Ronan','Ivy','Callum','Esme','Arlo','Wren','Orion',
  'Sage','Atlas','Fern','Quinn','Briar','Jasmine','Everett','Willow','Bodhi','Cleo',
  'Thea','Phoenix','Sienna','Remy','Isla','Lane','Lark','Drew','Neve','Brooks',
  'Shea','Odin','Tess','Cyrus','Belle','Zane','Olive','Jude','Pearl','Reed',
  'Blythe','Grey','Sable','Ash','Indigo','Flint','Clover','Bryce','Faye','Hart',
  'Raine','Cruz','Lyra','Finn','June','Blake','Skye','Cole','Dawn','West',
  'Maple','Knox','Rue','Chase','Maeve','Thor','Aura','Rhys','Lux','Birch',
];

const CARTOON_SEEDS = [
  'HappyGlow','JoyBurst','SunnyDay','Sparkle','Giggles','Twinkle','Bliss','Cheer','Fizz','Bubble',
  'Zoom','Boing','Wink','Jolly','Zippy','Sunny','Bright','Grin','Beam','Shine',
  'Gleam','Flash','Snap','Pop','Zing','Pep','Dash','Skip','Hop','Bounce',
  'Glimmer','Dazzle','Shimmer','Flicker','Glow','Radiance','Sparkler','Twirl','Swirl','Whirl',
  'Candy','Sugar','Honey','Maple','Cherry','Berry','Peach','Mango','Plum','Kiwi',
  'Rocket','Comet','Star','Moon','Planet','Galaxy','Nebula','Quasar','Pulsar','Nova',
  'Pixel','Byte','Chip','Code','Loop','Stack','Widget','Sprite','Render','Frame',
  'Jazz','Blues','Funk','Soul','Tempo','Beat','Rhythm','Groove','Melody','Tune',
  'Safari','Jungle','Arctic','Desert','Ocean','Forest','Mountain','Valley','Island','Coast',
  'Thunder','Lightning','Storm','Rain','Breeze','Tornado','Cyclone','Typhoon','Monsoon','Squall',
];

const DOODLE_SEEDS = [
  'Alex','Jordan','Casey','Morgan','Taylor','Riley','Quinn','Sage','Blake','Drew',
  'Cameron','Hayden','Parker','Avery','Jamie','Rowan','Finley','Emerson','Skyler','River',
  'Phoenix','Dakota','Kendall','Peyton','Logan','Reese','Spencer','Aubrey','Charlie','Harley',
  'Jesse','Marley','Robin','Addison','Bailey','Devon','Eden','Frankie','Glenn','Haven',
  'Jade','Kerry','Lane','Milan','Nico','Oakley','Presley','Raven','Shiloh','Tatum',
  'Unique','Valentine','Winter','Xen','Yael','Zephyr','Arrow','Bellamy','Cedar','Dale',
  'Elliot','Fallon','Gray','Harbor','Ira','Jules','Kit','Lennox','Marlowe','Onyx',
  'Palmer','Quest','Ridley','Scout','True','Uri','Vesper','Wynn','Xander','York',
  'Zen','Birch','Clove','Drift','Echo','Fawn','Grove','Heath','Indie','Juniper',
  'Kai','Lake','Moss','Noel','Olive','Pine','Quill','Rain','Sol','Tide',
];

const ABSTRACT_SEEDS = [
  'Prism','Kaleidoscope','Mosaic','Fractal','Tessellation','Spiral','Vortex','Wave','Pulse','Grid',
  'Lattice','Nexus','Matrix','Orbit','Radial','Hexagon','Pentagon','Rhombus','Cube','Sphere',
  'Torus','Helix','Arc','Beam','Ray','Glow','Aura','Halo','Eclipse','Zenith',
  'Spectrum','Gradient','Contour','Relief','Topology','Manifold','Isometric','Geodesic','Polytope','Simplex',
  'Crystal','Quartz','Obsidian','Jade','Onyx','Amber','Opal','Topaz','Ruby','Garnet',
  'Vector','Raster','Pixel','Voxel','Mesh','Wireframe','Surface','Volume','Density','Field',
  'Harmonic','Resonance','Frequency','Amplitude','Wavelength','Phase','Signal','Noise','Filter','Echo',
  'Nebula','Cosmos','Stellar','Solar','Lunar','Comet','Asteroid','Meteor','Plasma','Photon',
  'Algorithm','Fibonacci','Mandelbrot','Julia','Sierpinski','Koch','Cantor','Lorenz','Chaos','Entropy',
  'Zen','Wabi','Sabi','Kintsugi','Ikigai','Mono','Fuji','Sakura','Bamboo','Stone',
];

const QUIET_SEEDS = [
  'Mist','Fog','Dawn','Dusk','Haze','Calm','Still','Soft','Pale','Mute',
  'Whisper','Silence','Echo','Drift','Float','Lull','Rest','Ease','Gentle','Serene',
  'Peace','Harbor','Haven','Shore','Brook','Pond','Cloud','Shade','Moon','Stone',
  'Linen','Cotton','Silk','Wool','Canvas','Paper','Chalk','Clay','Sand','Dust',
  'Frost','Snow','Ice','Sleet','Dew','Rain','Drizzle','Vapor','Steam','Melt',
  'Ivory','Pearl','Bone','Cream','Eggshell','Oyster','Vanilla','Birch','Ash','Dove',
  'Hush','Murmur','Sigh','Breath','Pause','Moment','Linger','Wane','Fade','Dim',
  'Petal','Bloom','Bud','Sprout','Leaf','Stem','Root','Seed','Moss','Lichen',
  'Wax','Tallow','Wick','Flame','Ember','Spark','Glow','Lantern','Candle','Light',
  'Zen','Om','Tao','Qi','Mu','Ma','Wa','Ki','Chi','Ka',
];

async function main() {
  console.log('Avatarly — Vector Generator (100 per category)');
  console.log(`Output: ${COLLECTIONS}`);
  console.log(`Resolution: ${SIZE}x${SIZE}px\n`);

  let total = 0;

  // Company (100) — alternating identicon + thumbs
  const companySources = COMPANY_SEEDS.map((seed, i) =>
    `https://api.dicebear.com/9.x/${i % 2 === 0 ? 'identicon' : 'thumbs'}/svg?seed=${seed}&size=256`
  );
  total += await generateCollection('company-avatars', companySources);

  // Sculpted (100) — adventurer
  total += await generateCollection('sculpted-avatars', dicebear('adventurer', SCULPTED_SEEDS));

  // Illustrated (100) — lorelei
  total += await generateCollection('illustrated-avatars', dicebear('lorelei', ILLUSTRATED_SEEDS));

  // Cartoon (100) — fun-emoji (50) + big-smile (50)
  const cartoonSources = [
    ...dicebear('fun-emoji', CARTOON_SEEDS.slice(0, 50)),
    ...dicebear('big-smile', CARTOON_SEEDS.slice(50)),
  ];
  total += await generateCollection('cartoon-avatars', cartoonSources);

  // Doodle (100) — open-peeps
  total += await generateCollection('doodle-avatars', dicebear('open-peeps', DOODLE_SEEDS));

  // Abstract (100) — shapes
  total += await generateCollection('abstract-avatars', dicebear('shapes', ABSTRACT_SEEDS));

  // Quiet (100) — rings
  total += await generateCollection('quiet-avatars', dicebear('rings', QUIET_SEEDS));

  console.log(`\nDone — ${total} avatars at ${SIZE}x${SIZE}px`);
}

main().catch(e => { console.error(e); process.exit(1); });
