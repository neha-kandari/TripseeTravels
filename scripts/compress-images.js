#!/usr/bin/env node
/**
 * compress-images.js
 * Compresses all WebP/JPG/PNG images > 150KB in the public folder.
 * Uses sharp to re-encode at quality 78, keeping original dimensions.
 * Safe to re-run — already-small images are skipped.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const THRESHOLD_BYTES = 80 * 1024; // 80 KB — compress anything over 80 KB
const QUALITY = 72;                 // sweet spot: ~50-70% smaller, visually identical

let totalSaved = 0;
let totalProcessed = 0;
let totalSkipped = 0;
let errors = 0;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else if (/\.(webp|jpg|jpeg|png)$/i.test(entry)) files.push(full);
  }
  return files;
}

async function compress(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.size <= THRESHOLD_BYTES) { totalSkipped++; return; }

  try {
    const original = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    let buf;

    if (ext === '.webp') {
      buf = await sharp(original).webp({ quality: QUALITY, effort: 4 }).toBuffer();
    } else if (ext === '.png') {
      buf = await sharp(original).webp({ quality: QUALITY, effort: 4 }).toBuffer();
      // Rename .png → .webp
      const newPath = filePath.replace(/\.png$/i, '.webp');
      fs.writeFileSync(newPath, buf);
      fs.unlinkSync(filePath);
      const saved = stat.size - buf.length;
      totalSaved += saved;
      totalProcessed++;
      console.log(`  ✓ ${path.basename(filePath)} → ${path.basename(newPath)}  ${(stat.size/1024).toFixed(0)}KB → ${(buf.length/1024).toFixed(0)}KB  (-${(saved/1024).toFixed(0)}KB)`);
      return;
    } else {
      buf = await sharp(original).webp({ quality: QUALITY, effort: 4 }).toBuffer();
      const newPath = filePath.replace(/\.(jpg|jpeg)$/i, '.webp');
      fs.writeFileSync(newPath, buf);
      fs.unlinkSync(filePath);
      const saved = stat.size - buf.length;
      totalSaved += saved;
      totalProcessed++;
      console.log(`  ✓ ${path.basename(filePath)} → ${path.basename(newPath)}  ${(stat.size/1024).toFixed(0)}KB → ${(buf.length/1024).toFixed(0)}KB  (-${(saved/1024).toFixed(0)}KB)`);
      return;
    }

    // Only write if actually smaller
    if (buf.length < stat.size) {
      fs.writeFileSync(filePath, buf);
      const saved = stat.size - buf.length;
      totalSaved += saved;
      totalProcessed++;
      console.log(`  ✓ ${path.relative('public', filePath).padEnd(55)} ${(stat.size/1024).toFixed(0).padStart(4)}KB → ${(buf.length/1024).toFixed(0).padStart(4)}KB  (-${(saved/1024).toFixed(0)}KB)`);
    } else {
      totalSkipped++;
    }
  } catch (e) {
    console.error(`  ✗ ${filePath}: ${e.message}`);
    errors++;
  }
}

async function main() {
  console.log('🗜️  Tripsee Image Compressor');
  console.log('   Threshold: >' + (THRESHOLD_BYTES/1024) + 'KB  |  Quality: ' + QUALITY + '%  |  Format: WebP\n');

  const files = walk('public');
  console.log(`Found ${files.length} images total.\n`);

  for (const f of files) await compress(f);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Compressed : ${totalProcessed} files`);
  console.log(`⏭️  Skipped    : ${totalSkipped} files (already ≤${THRESHOLD_BYTES/1024}KB)`);
  console.log(`❌ Errors     : ${errors}`);
  console.log(`💾 Total saved: ${(totalSaved/1024/1024).toFixed(2)} MB`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(console.error);
