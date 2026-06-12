#!/usr/bin/env node

/**
 * Bulk Upload Script for Cloudinary
 * 
 * Uploads all files from the public folder to Cloudinary while preserving folder structure
 * Usage: node scripts/upload-to-cloudinary.js
 * 
 * Make sure to set these environment variables in .env.local:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Supported file types
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];

// Configuration
const CONFIG = {
  // Base folder prefix in Cloudinary (leave empty for root, or use 'tripsee' or 'public')
  FOLDER_PREFIX: '', // Will preserve exact structure: Destination/bali.jpg
  // Set to 'tripsee' if you want: tripsee/Destination/bali.jpg
  
  // Path to public folder
  PUBLIC_DIR: path.join(process.cwd(), 'public'),
  
  // Files/folders to skip
  SKIP_FOLDERS: ['node_modules', '.next', '.git'],
  SKIP_FILES: ['.gitkeep', '.DS_Store'],
  
  // Batch size for concurrent uploads (adjust based on rate limits)
  BATCH_SIZE: 5,
  
  // Delay between batches (ms) to avoid rate limiting
  BATCH_DELAY: 1000,
};

// Statistics
const stats = {
  total: 0,
  uploaded: 0,
  skipped: 0,
  errors: 0,
  startTime: Date.now(),
};

// Path mapping (old path -> Cloudinary URL)
const pathMapping = {};

/**
 * Get resource type (image or video)
 */
function getResourceType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (imageExtensions.includes(ext)) return 'image';
  if (videoExtensions.includes(ext)) return 'video';
  return null;
}

/**
 * Convert local path to Cloudinary folder path
 * Example: public/Destination/bali.jpg -> Destination/bali.jpg
 */
function getCloudinaryPath(localPath) {
  // Remove public/ prefix and normalize
  let relativePath = path.relative(CONFIG.PUBLIC_DIR, localPath);
  
  // Normalize path separators (Windows to Unix)
  relativePath = relativePath.replace(/\\/g, '/');
  
  // Add folder prefix if specified
  if (CONFIG.FOLDER_PREFIX) {
    relativePath = `${CONFIG.FOLDER_PREFIX}/${relativePath}`;
  }
  
  return relativePath;
}

/**
 * Upload a single file to Cloudinary
 */
async function uploadFile(filePath) {
  const fileStats = fs.statSync(filePath);
  const fileName = path.basename(filePath);
  const resourceType = getResourceType(filePath);
  
  if (!resourceType) {
    console.log(`⏭️  Skipping unsupported file: ${filePath}`);
    stats.skipped++;
    return null;
  }
  
  // Get Cloudinary path
  const cloudinaryPath = getCloudinaryPath(filePath);
  const publicId = cloudinaryPath.replace(/\.\w+$/, ''); // Remove extension (includes full folder path)
  
  try {
    console.log(`📤 Uploading: ${cloudinaryPath}`);
    
    const uploadOptions = {
      public_id: publicId, // Full path including folders (e.g., "Destination/Bali" or "Feedback/WhatsApp Video 2024")
      resource_type: resourceType,
      overwrite: false, // Set to true if you want to overwrite existing files
      use_filename: false, // Don't use filename since we're providing full public_id path
      unique_filename: false,
    };
    
    // Don't set 'folder' option - the folder structure is already in public_id
    
    // Note: Format and quality optimization should be applied in URL transformations,
    // not during upload. Cloudinary will store the original format.
    
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    
    // Store mapping: local path -> Cloudinary URL
    const localPath = '/' + path.relative(CONFIG.PUBLIC_DIR, filePath).replace(/\\/g, '/');
    pathMapping[localPath] = {
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
    
    console.log(`✅ Uploaded: ${cloudinaryPath} → ${result.secure_url}`);
    stats.uploaded++;
    
    return result;
  } catch (error) {
    const errorMsg = error.message || error.toString();
    
    // Provide more helpful error messages
    if (errorMsg.includes('File size too large')) {
      const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
      console.error(`❌ File too large (${fileSizeMB}MB > 10MB): ${cloudinaryPath}`);
      console.log(`   💡 Tip: Consider compressing this file or upgrading your Cloudinary plan`);
    } else {
      console.error(`❌ Error uploading ${cloudinaryPath}:`, errorMsg);
    }
    
    stats.errors++;
    return null;
  }
}

/**
 * Process files in batches to avoid rate limiting
 */
async function uploadBatch(files) {
  const promises = files.map(file => uploadFile(file));
  return Promise.all(promises);
}

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dirPath, file.name);
    
    // Skip certain folders
    if (file.isDirectory()) {
      if (CONFIG.SKIP_FOLDERS.includes(file.name)) {
        continue;
      }
      getAllFiles(filePath, arrayOfFiles);
    } else {
      // Skip certain files
      if (CONFIG.SKIP_FILES.includes(file.name)) {
        continue;
      }
      
      // Only process images and videos
      if (getResourceType(filePath)) {
        arrayOfFiles.push(filePath);
        stats.total++;
      }
    }
  }
  
  return arrayOfFiles;
}

/**
 * Save path mapping to JSON file
 */
function saveMapping() {
  const mappingPath = path.join(process.cwd(), 'cloudinary-path-mapping.json');
  const report = {
    timestamp: new Date().toISOString(),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folderPrefix: CONFIG.FOLDER_PREFIX || 'root',
    statistics: {
      total: stats.total,
      uploaded: stats.uploaded,
      skipped: stats.skipped,
      errors: stats.errors,
      duration: `${((Date.now() - stats.startTime) / 1000).toFixed(2)}s`,
    },
    mappings: pathMapping,
  };
  
  fs.writeFileSync(mappingPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Path mapping saved to: cloudinary-path-mapping.json`);
  return mappingPath;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Cloudinary bulk upload...\n');
  
  // Validate environment variables
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Error: Cloudinary credentials not found in .env.local');
    console.log('\nPlease add these to your .env.local file:');
    console.log('CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.log('CLOUDINARY_API_KEY=your_api_key');
    console.log('CLOUDINARY_API_SECRET=your_api_secret');
    process.exit(1);
  }
  
  console.log(`☁️  Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`📁 Public Directory: ${CONFIG.PUBLIC_DIR}`);
  console.log(`📂 Folder Prefix: ${CONFIG.FOLDER_PREFIX || '(none - preserving exact structure)'}`);
  console.log('');
  
  // Get all files
  console.log('📋 Scanning files...');
  const allFiles = getAllFiles(CONFIG.PUBLIC_DIR);
  console.log(`✅ Found ${allFiles.length} files to upload\n`);
  
  if (allFiles.length === 0) {
    console.log('⚠️  No files found to upload!');
    return;
  }
  
  // Upload in batches
  console.log(`📦 Uploading in batches of ${CONFIG.BATCH_SIZE}...\n`);
  
  for (let i = 0; i < allFiles.length; i += CONFIG.BATCH_SIZE) {
    const batch = allFiles.slice(i, i + CONFIG.BATCH_SIZE);
    await uploadBatch(batch);
    
    // Progress update
    const progress = ((stats.uploaded + stats.errors) / stats.total * 100).toFixed(1);
    console.log(`\n📊 Progress: ${stats.uploaded + stats.errors}/${stats.total} (${progress}%)\n`);
    
    // Delay between batches (except for the last batch)
    if (i + CONFIG.BATCH_SIZE < allFiles.length) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.BATCH_DELAY));
    }
  }
  
  // Save mapping
  const mappingPath = saveMapping();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Upload Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully uploaded: ${stats.uploaded}`);
  console.log(`⏭️  Skipped: ${stats.skipped}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`⏱️  Duration: ${((Date.now() - stats.startTime) / 1000).toFixed(2)}s`);
  console.log('\n📄 Path mapping saved to:', mappingPath);
  console.log('\n🎉 Upload complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Review cloudinary-path-mapping.json');
  console.log('2. Update your code to use Cloudinary URLs');
  console.log('3. Test your website with the new CDN URLs');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { uploadFile, getCloudinaryPath };

