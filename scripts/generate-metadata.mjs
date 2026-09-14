/**
 * Auto-generate metadata JSON from image files
 *
 * Scans each collection's 4k/ folder and produces:
 *   - metadata/{collection}.json  (per-collection metadata)
 *   - metadata/index.json         (updated master index)
 *
 * Usage: node scripts/generate-metadata.mjs
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
const METADATA_DIR    = path.join(ROOT, 'metadata');

const COLLECTION_META = {
  'office-avatars':      { name: 'Office Avatars',      count: 72,  style: 'photorealistic',   price: 12, description: '72 realistic office avatars featuring authentic workplace moments. Perfect for SaaS mockups, team directories, dashboards, and business software.', tags: ['professional','corporate','workplace','headshot','business'] },
  'everyday-avatars':    { name: 'Everyday Avatars',    count: 45,  style: 'photorealistic',   price: 12, description: '45 realistic everyday avatars of ordinary people. Perfect for product mockups, profiles, communities, and believable user interfaces.', tags: ['casual','lifestyle','authentic','natural','warm'] },
  'human-avatars':       { name: 'Human Avatars',       count: 30,  style: 'photorealistic',   price: 12, description: '30 polished human avatars, curated for diversity and quality. Perfect for mockups, prototypes, profiles, and client presentations.', tags: ['polished','diverse','curated','premium','studio'] },
  'company-avatars':     { name: 'Company Avatars',     count: 42,  style: 'vector',           price: 12, description: '42 fictional logo-style avatars for product mockups. Perfect for dashboards, CRM tables, vendor lists, integrations, and workspaces.', tags: ['logo','brand','corporate','geometric','emblem'] },
  'abstract-avatars':    { name: 'Abstract Avatars',    count: 30,  style: 'geometric',        price: 12, description: '30 bold abstract avatars with artistic geometric styling. Perfect for anonymous profiles, creative products, and distinct interfaces.', tags: ['abstract','geometric','artistic','bold','colorful'] },
  'sculpted-avatars':    { name: 'Sculpted Avatars',    count: 30,  style: '3d-rendered',      price: 12, description: '30 minimal sculpted avatars with faceted 3D busts. Perfect for premium mockups, anonymous profiles, and modern product interfaces.', tags: ['3d','sculpted','clay','minimal','pastel'] },
  'doodle-avatars':      { name: 'Doodle Avatars',      count: 32,  style: 'hand-drawn',       price: 24, description: '32 hand-drawn avatars, sketched on paper and digitized. Perfect for onboarding, learning apps, and friendly product mockups.', tags: ['doodle','sketch','hand-drawn','friendly','organic'] },
  'illustrated-avatars': { name: 'Illustrated Avatars', count: 30,  style: 'illustrated',      price: 6,  description: '30 refined illustrated avatars with clean editorial styling. Perfect for SaaS mockups, team profiles, communities, and presentations.', tags: ['illustrated','editorial','refined','vector','warm'] },
  'cartoon-avatars':     { name: 'Cartoon Avatars',     count: 30,  style: 'cartoon',          price: 6,  description: '30 polished cartoon avatars with friendly product-ready characters. Perfect for apps, communities, onboarding, and playful mockups.', tags: ['cartoon','friendly','playful','character','fun'] },
  'quiet-avatars':       { name: 'Quiet Avatars',       count: 100, style: 'minimal-abstract', price: 6,  description: '100 subtle line-art icons on pastel backgrounds for calm, low-distraction placeholders. Perfect for dashboards, CRM tables, comments, and serious mockups.', tags: ['quiet','subtle','minimal','calm','neutral'] },
  'memoji-avatars':      { name: 'Memoji Avatars',     count: 98,  style: '3d-cartoon',       price: 12, description: '98 expressive 3D cartoon character avatars with diverse styles. Perfect for chat apps, social profiles, onboarding, and playful product mockups.', tags: ['memoji','3d','cartoon','expressive','character'] },
  'cyber-avatars':       { name: 'Cyber Avatars',      count: 100, style: 'geometric-robot',  price: 6,  description: '100 sci-fi robot avatars with metallic heads, LED eyes, and antennas. Perfect for tech products, AI features, bot profiles, and futuristic mockups.', tags: ['robot','cyber','sci-fi','tech','bot'] },
  'pixel-avatars':       { name: 'Pixel Avatars',      count: 100, style: 'pixel-mosaic',     price: 6,  description: '100 pixel-mosaic avatars with bold flat color grids. Perfect for anonymous profiles, GitHub-style placeholders, and playful low-distraction mockups.', tags: ['pixel','mosaic','geometric','retro','colorful'] },
  'world-avatars':       { name: 'World Avatars',      count: 26,  style: '3d-cartoon',       price: 12, description: '26 stylized 3D character portraits representing diverse cultures and ethnicities from around the world. Perfect for global products, inclusive onboarding, and representative team mockups.', tags: ['3d','diverse','global','cultural','portrait'] },
  'people-bundle':       { name: 'People Bundle',       count: 147, style: 'photorealistic',   price: 24, description: '147 realistic avatars from Office, Everyday, and Human collections. Perfect for SaaS mockups, team directories, dashboards, and business software.', tags: ['bundle','realistic','diverse','comprehensive'] },
};

async function getDominantColors(filePath, n = 3) {
  try {
    const { dominant } = await sharp(filePath).resize(50, 50).stats();
    // dominant gives r, g, b
    const hex = `#${[dominant.r, dominant.g, dominant.b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
    return [hex];
  } catch {
    return [];
  }
}

async function generateCollectionMetadata(slug) {
  const srcDir = path.join(COLLECTIONS_DIR, slug, '4k');
  if (!fs.existsSync(srcDir)) {
    console.log(`  [SKIP] ${slug} — no 4k/ folder`);
    return null;
  }

  const files = (await glob(path.join(srcDir, '*.{png,jpg,jpeg,webp}'))).sort();
  if (files.length === 0) {
    console.log(`  [SKIP] ${slug} — no images`);
    return null;
  }

  const meta = COLLECTION_META[slug];
  const avatars = [];

  console.log(`  ${slug}: ${files.length} images`);

  for (const file of files) {
    const basename = path.basename(file, path.extname(file));
    const num = basename.match(/(\d+)$/)?.[1] || '000';
    const colors = await getDominantColors(file);

    avatars.push({
      id: `${slug.replace('-avatars', '').replace('-bundle', '')}-${num}`,
      filename: basename,
      tags: meta.tags.slice(0, 3),
      dominant_colors: colors,
      files: {
        '4k': `4k/${basename}.png`,
        preview: `preview/${basename}.jpg`,
        thumbnail: `thumbnails/${basename}.webp`,
      },
    });
  }

  const output = {
    collection: {
      id: slug,
      name: meta.name,
      version: '1.0.0',
      count: files.length,
      resolution: '4096x4096',
      formats: ['png', 'jpg', 'webp'],
      color_space: 'sRGB',
      style: meta.style,
      description: meta.description,
      tags: meta.tags,
      price: meta.price,
      currency: 'USD',
      licenses_total: 100,
      licenses_remaining: 100,
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
    },
    avatars,
  };

  const outPath = path.join(METADATA_DIR, `${slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  return { slug, count: files.length, meta };
}

async function main() {
  if (!fs.existsSync(METADATA_DIR)) fs.mkdirSync(METADATA_DIR, { recursive: true });

  console.log('Generating metadata...\n');

  const slugs = Object.keys(COLLECTION_META);
  const results = [];

  for (const slug of slugs) {
    const r = await generateCollectionMetadata(slug);
    if (r) results.push(r);
  }

  // Update master index
  const indexPath = path.join(METADATA_DIR, 'index.json');
  const existing = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, 'utf-8')) : {};

  const index = {
    name: 'Avatarly Avatar Collections',
    version: existing.version || '1.0.0',
    author: 'Avatarly',
    website: 'https://github.com/MUZEEBURRAHAMAN/ui-faces-avatars',
    updated: new Date().toISOString().split('T')[0],
    total_avatars: results.reduce((sum, r) => sum + r.count, 0),
    resolution: '4096x4096',
    formats: ['png', 'jpg', 'webp'],
    color_space: 'sRGB',
    collections: results.map(r => ({
      id: r.slug,
      name: r.meta.name,
      slug: r.slug,
      count: r.count,
      style: r.meta.style,
      description: r.meta.description,
      tags: r.meta.tags,
      price: r.meta.price,
      licenses_total: 100,
      licenses_remaining: 100,
      path: `collections/${r.slug}`,
    })),
  };

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

  console.log(`\nDone — ${results.length} collections, ${index.total_avatars} total avatars`);
  console.log(`Metadata written to ${METADATA_DIR}`);
}

main().catch(e => { console.error(e); process.exit(1); });
