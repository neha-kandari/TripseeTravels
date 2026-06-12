#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Video Optimization Script for Hostinger VPS
 * 
 * This script helps optimize video files for better loading on Hostinger VPS
 * Run with: node scripts/optimize-videos.js
 */

const feedbackDir = path.join(__dirname, '..', 'public', 'feedback');

function checkVideoFiles() {
  console.log('🔍 Checking video files in feedback directory...');
  
  if (!fs.existsSync(feedbackDir)) {
    console.error('❌ Feedback directory not found:', feedbackDir);
    return;
  }

  const files = fs.readdirSync(feedbackDir);
  const videoFiles = files.filter(file => file.endsWith('.mp4'));
  
  console.log(`📹 Found ${videoFiles.length} video files:`);
  
  videoFiles.forEach((file, index) => {
    const filePath = path.join(feedbackDir, file);
    const stats = fs.statSync(filePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`  ${index + 1}. ${file} (${fileSizeMB} MB)`);
    
    // Check if file is too large (> 50MB)
    if (stats.size > 50 * 1024 * 1024) {
      console.warn(`    ⚠️  Warning: File is large (${fileSizeMB} MB). Consider compressing.`);
    }
  });
  
  console.log('\n📋 Recommendations:');
  console.log('1. Ensure all video files are uploaded to Hostinger VPS');
  console.log('2. Check file permissions (should be 644)');
  console.log('3. Verify MIME type configuration on server');
  console.log('4. Consider compressing large files (> 50MB)');
  console.log('5. Test video URLs directly in browser');
  
  console.log('\n🔗 Test URLs:');
  videoFiles.slice(0, 3).forEach(file => {
    console.log(`   https://yourdomain.com/feedback/${encodeURIComponent(file)}`);
  });
}

function generateVideoManifest() {
  console.log('\n📝 Generating video manifest...');
  
  const files = fs.readdirSync(feedbackDir);
  const videoFiles = files.filter(file => file.endsWith('.mp4'));
  
  const manifest = {
    videos: videoFiles.map(file => ({
      filename: file,
      url: `/feedback/${file}`,
      encodedUrl: `/feedback/${encodeURIComponent(file)}`
    })),
    lastUpdated: new Date().toISOString(),
    totalVideos: videoFiles.length
  };
  
  const manifestPath = path.join(__dirname, '..', 'public', 'video-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Video manifest created: ${manifestPath}`);
}

function main() {
  console.log('🎬 Video Optimization Script for Hostinger VPS\n');
  
  try {
    checkVideoFiles();
    generateVideoManifest();
    
    console.log('\n✅ Script completed successfully!');
    console.log('\n📖 Next steps:');
    console.log('1. Deploy the updated code to Hostinger VPS');
    console.log('2. Run the commands in HOSTINGER_VIDEO_FIX.md');
    console.log('3. Test video loading in production');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkVideoFiles, generateVideoManifest };
