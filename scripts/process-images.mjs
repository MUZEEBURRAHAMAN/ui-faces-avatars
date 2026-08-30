/**
 * Batch Image Processor — UI Faces Avatar Collections
 *
 * Takes source 4K images from each collection's 4k/ folder and generates:
 *   - preview/  (800x800 JPG, 95% quality)
 *   - thumbnails/ (200x200 WebP, 80% quality)
 *
 * Also validates originals against quality standards.
 *
 * Usage:
 *   node scripts/process-images.mjs                    # Process all collections
 *   node scripts/process-images.mjs office-avatars      # Process single collection
 *   node scripts/process-images.mjs --validate-only     # Just validate, no processing
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

const SIZES = {
  preview:    { width: 800,  height: 800,  format: 'jpeg', quality: 95, ext: '.jpg'  },
  thumbnails: { width: 200,  height: 200,  format: 'webp', quality: 80, ext: '.webp' },
};

const MIN_RESOLUTION = 4096;
const MAX_FILE_SIZE  = 5 * 1024 * 1024; // 5 MB

const COLLECTIONS = [
  'office-avatars',
  'everyday-avatars',
  'human-avatars',
  'company-avatars',
  'abstract-avatars',
  'sculpted-avatars',
  'doodle-avatars',
  'illustrated-avatars',
  'cartoon-avatars',
  'quiet-avatars',
  'people-bundle',
];

// ── Helpers ───────────────────────────────────────────

function log(msg)   { process.stdout.write(msg); }
function logln(msg) { console.log(msg); }

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function getImageInfo(filePath) {
  const meta = await sharp(filePath).metadata();
  const stat = fs.statSync(filePath);
  return {
    width:  meta.width,
    height: meta.height,
    format: meta.format,
    space:  meta.space,
    size:   stat.size,
    path:   filePath,
  };
}

// ── Validate ──────────────────────────────────────────

async function validateImage(filePath) {
  const issues = [];
  try {
    const info = await getImageInfo(filePath);

    if (info.width < MIN_RESOLUTION || info.height < MIN_RESOLUTION) {
      issues.push(`Resolution ${info.width}x${info.height} < ${MIN_RESOLUTION}x${MIN_RESOLUTION}`);
    }

    if (info.width !== info.height) {
      issues.push(`Not square: ${info.width}x${info.height}`);
    }

    if (info.size > MAX_FILE_SIZE) {
      issues.push(`File size ${(info.size / 1024 / 1024).toFixed(1)}MB > 5MB limit`);
    }

    if (info.space !== 'srgb' && info.space !== 'rgb') {
      issues.push(`Color space: ${info.space} (expected sRGB)`);
    }
  } catch (e) {
    issues.push(`Cannot read: ${e.message}`);
  }
  return issues;
}

// ── Process ───────────────────────────────────────────

async function processImage(srcPath, collection) {
  const basename = path.basename(srcPath, path.extname(srcPath));

  for (const [sizeKey, config] of Object.entries(SIZES)) {
    const outDir  = path.join(COLLECTIONS_DIR, collection, sizeKey);
    const outFile = path.join(outDir, basename + config.ext);

    await ensureDir(outDir);

    // Skip if already processed and newer than source
    if (fs.existsSync(outFile)) {
      const srcMtime = fs.statSync(srcPath).mtimeMs;
      const outMtime = fs.statSync(outFile).mtimeMs;
      if (outMtime >= srcMtime) continue;
    }

    let pipeline = sharp(srcPath)
      .resize(config.width, config.height, { fit: 'cover', position: 'top' });

    if (config.format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality: config.quality, mozjpeg: true });
    } else if (config.format === 'webp') {
      pipeline = pipeline.webp({ quality: config.quality });
    } else if (config.format === 'png') {
      pipeline = pipeline.png({ compressionLevel: 8 });
    }

    await pipeline.toFile(outFile);
  }
}

// ── Run ───────────────────────────────────────────────

async function processCollection(collection) {
  const srcDir = path.join(COLLECTIONS_DIR, collection, '4k');

  if (!fs.existsSync(srcDir)) {
    logln(`  [SKIP] ${collection} — no 4k/ folder`);
    return { collection, processed: 0, errors: 0, validationIssues: [] };
  }

  const files = await glob(path.join(srcDir, '*.{png,jpg,jpeg,webp}'));
  if (files.length === 0) {
    logln(`  [SKIP] ${collection} — no images in 4k/`);
    return { collection, processed: 0, errors: 0, validationIssues: [] };
  }

  logln(`\n── ${collection.toUpperCase()} (${files.length} source images)`);

  const validationIssues = [];
  let processed = 0;
  let errors = 0;

  for (const file of files.sort()) {
    // Validate
    const issues = await validateImage(file);
    if (issues.length > 0) {
      validationIssues.push({ file: path.basename(file), issues });
      log('!');
    }

    // Process (generate preview + thumbnail even if validation fails)
    try {
      await processImage(file, collection);
      processed++;
      log('.');
    } catch (e) {
      errors++;
      log(`x`);
    }
  }

  logln(` → ${processed} processed, ${errors} errors, ${validationIssues.length} warnings`);
  return { collection, processed, errors, validationIssues };
}

async function main() {
  const args = process.argv.slice(2);
  const validateOnly = args.includes('--validate-only');
  const targetCollection = args.find(a => !a.startsWith('--'));

  const collections = targetCollection
    ? [targetCollection]
    : COLLECTIONS;

  logln('UI Faces — Image Processor');
  logln(`Mode: ${validateOnly ? 'VALIDATE ONLY' : 'PROCESS + VALIDATE'}`);
  logln(`Collections: ${collections.length}`);

  const results = [];

  for (const col of collections) {
    if (validateOnly) {
      const srcDir = path.join(COLLECTIONS_DIR, col, '4k');
      if (!fs.existsSync(srcDir)) { logln(`  [SKIP] ${col}`); continue; }
      const files = await glob(path.join(srcDir, '*.{png,jpg,jpeg,webp}'));
      logln(`\n── ${col.toUpperCase()} (${files.length} files)`);
      for (const file of files.sort()) {
        const issues = await validateImage(file);
        if (issues.length > 0) {
          logln(`  WARN ${path.basename(file)}: ${issues.join(', ')}`);
        }
      }
    } else {
      results.push(await processCollection(col));
    }
  }

  if (!validateOnly) {
    logln('\n── SUMMARY ──');
    let totalProcessed = 0, totalErrors = 0, totalWarnings = 0;
    for (const r of results) {
      totalProcessed += r.processed;
      totalErrors += r.errors;
      totalWarnings += r.validationIssues.length;
      if (r.validationIssues.length > 0) {
        for (const v of r.validationIssues) {
          logln(`  WARN [${r.collection}] ${v.file}: ${v.issues.join(', ')}`);
        }
      }
    }
    logln(`\nTotal: ${totalProcessed} processed, ${totalErrors} errors, ${totalWarnings} warnings`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
