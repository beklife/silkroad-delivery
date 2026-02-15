#!/usr/bin/env node

/**
 * Image optimization script for Lighthouse performance
 * Recompresses existing WebP images with better quality/size balance
 */

import sharp from 'sharp';
import fs from 'fs';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IMAGES_DIR = join(__dirname, '../attached_assets');
const STOCK_IMAGES_DIR = join(IMAGES_DIR, 'stock_images');
const MENU_DIR = join(STOCK_IMAGES_DIR, 'menu');

// Define specific optimization settings per image category
const imageSettings = {
  // Hero/large images - displayed full screen
  hero: { quality: 50, effort: 6, maxWidth: 1920 },
  // Background images - can be more compressed
  background: { quality: 40, effort: 6, maxWidth: 1600 },
  // Interior/gallery images
  interior: { quality: 55, effort: 6, maxWidth: 1200 },
  // Menu images - displayed in cards
  menu: { quality: 85, effort: 6, maxWidth: 800 },
};

// Map specific files to settings
const fileSettings = {
  // Menu images
};

async function optimizeImage(inputPath, settings) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const filename = basename(inputPath);
    const ext = extname(inputPath).toLowerCase();

    // Get original file size
    const originalStats = await stat(inputPath);
    const originalSize = originalStats.size;

    console.log(`\nProcessing: ${filename}`);
    console.log(`  Original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024).toFixed(1)}KB`);

    // For JPG files, output as WebP with .webp extension
    const isJpg = ext === '.jpg' || ext === '.jpeg';
    const outputPath = isJpg
      ? inputPath.replace(/\.(jpg|jpeg|JPG|JPEG)$/i, '.webp')
      : inputPath;
    const tempPath = outputPath + '.tmp';

    // Resize if wider than maxWidth
    let pipeline = image;
    if (metadata.width > settings.maxWidth) {
      pipeline = pipeline.resize(settings.maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    // Apply WebP compression
    await pipeline
      .webp({
        quality: settings.quality,
        effort: settings.effort,
        smartSubsample: true,
        nearLossless: false,
      })
      .toFile(tempPath);

    // Get new file size
    const newStats = await stat(tempPath);
    const newSize = newStats.size;
    const saved = originalSize - newSize;
    const percentage = ((saved / originalSize) * 100).toFixed(1);

    if (newSize < originalSize || isJpg) {
      // For JPG files, delete original and create WebP
      if (isJpg) {
        await unlink(inputPath);
        await rename(tempPath, outputPath);
        console.log(`  ✓ Converted to WebP: ${(newSize / 1024).toFixed(1)}KB (saved ${(saved / 1024).toFixed(1)}KB, ${percentage}%)`);
      } else {
        // For WebP files, replace if smaller
        await unlink(inputPath);
        await rename(tempPath, inputPath);
        console.log(`  ✓ Optimized: ${(newSize / 1024).toFixed(1)}KB (saved ${(saved / 1024).toFixed(1)}KB, ${percentage}%)`);
      }
      return { saved, percentage };
    } else {
      // Keep original if it's already smaller
      await unlink(tempPath);
      console.log(`  ↳ Kept original (already optimized)`);
      return { saved: 0, percentage: 0 };
    }
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return { saved: 0, percentage: 0 };
  }
}

async function processDirectory(dir, defaultSettings = 'menu') {
  try {
    const files = await readdir(dir);
    const imageFiles = files.filter(f => {
      const ext = extname(f).toLowerCase();
      return ext === '.webp' || ext === '.jpg' || ext === '.jpeg';
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing ${imageFiles.length} images in ${basename(dir)}/`);
    console.log('='.repeat(60));

    let totalSaved = 0;
    let filesOptimized = 0;

    for (const file of imageFiles) {
      const inputPath = join(dir, file);
      const settingsKey = fileSettings[file] || defaultSettings;
      const settings = imageSettings[settingsKey];

      const result = await optimizeImage(inputPath, settings);
      if (result.saved > 0) {
        totalSaved += result.saved;
        filesOptimized++;
      }
    }

    console.log(`\n📊 Directory Summary:`);
    console.log(`  Files optimized: ${filesOptimized}/${imageFiles.length}`);
    console.log(`  Total saved: ${(totalSaved / 1024).toFixed(1)}KB`);

    return { totalSaved, filesOptimized };
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error.message);
    return { totalSaved: 0, filesOptimized: 0 };
  }
}

async function main() {
  console.log('🖼️  Image Optimization - Converting JPG to WebP with Quality 85\n');

  let grandTotalSaved = 0;
  let grandTotalOptimized = 0;

  // Process stock images
  const stockResult = await processDirectory(STOCK_IMAGES_DIR, 'interior');
  grandTotalSaved += stockResult.totalSaved;
  grandTotalOptimized += stockResult.filesOptimized;

  // Process menu images
  try {
    const menuResult = await processDirectory(MENU_DIR, 'menu');
    grandTotalSaved += menuResult.totalSaved;
    grandTotalOptimized += menuResult.filesOptimized;
  } catch (error) {
    console.log('Menu directory not found, skipping...');
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Image Optimization Complete!');
  console.log('='.repeat(60));
  console.log(`📊 Grand Total:`);
  console.log(`  Files optimized: ${grandTotalOptimized}`);
  console.log(`  Total saved: ${(grandTotalSaved / 1024).toFixed(1)}KB (${(grandTotalSaved / (1024 * 1024)).toFixed(2)}MB)`);
  console.log(`\n✨ Next Steps:`);
  console.log('  1. Build the production version: npm run build');
  console.log('  2. Run Lighthouse test: npm run check:lighthouse');
  console.log('  3. Expected improvements:');
  console.log('     - Reduced image transfer size');
  console.log('     - Faster LCP (Largest Contentful Paint)');
  console.log('     - Better performance score\n');
}

main();
