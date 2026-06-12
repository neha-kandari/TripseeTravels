const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Directories to migrate
const directoriesToMigrate = [
  'public/Destination',
  'public/uploads',
  'public/assets',
  'public/mystical_coastline',
  'public/TravelVibes',
  'public/Feedback'
];

// File extensions to include
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
const videoExtensions = ['.mp4', '.webm', '.mov'];

async function uploadFile(filePath, bucketName) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const relativePath = path.relative('public', filePath);
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(fileName).toLowerCase();
    
    // Determine content type
    let contentType = 'image/jpeg';
    if (imageExtensions.includes(fileExtension)) {
      contentType = `image/${fileExtension.slice(1)}`;
    } else if (videoExtensions.includes(fileExtension)) {
      contentType = `video/${fileExtension.slice(1)}`;
    }

    // Create blob with proper content type
    const blob = new Blob([fileBuffer], { type: contentType });
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(relativePath, blob, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error(`❌ Failed to upload ${filePath}:`, error.message);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(relativePath);

    console.log(`✅ Uploaded: ${relativePath} -> ${urlData.publicUrl}`);
    return {
      originalPath: relativePath,
      supabasePath: data.path,
      publicUrl: urlData.publicUrl,
      size: fileBuffer.length
    };

  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message);
    return null;
  }
}

async function migrateDirectory(dirPath, bucketName) {
  console.log(`\n📁 Migrating directory: ${dirPath}`);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return [];
  }

  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  const results = [];

  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      // Recursively process subdirectories
      const subResults = await migrateDirectory(fullPath, bucketName);
      results.push(...subResults);
    } else {
      const fileExtension = path.extname(file.name).toLowerCase();
      
      if (imageExtensions.includes(fileExtension) || videoExtensions.includes(fileExtension)) {
        const result = await uploadFile(fullPath, bucketName);
        if (result) {
          results.push(result);
        }
      }
    }
  }

  return results;
}

async function main() {
  console.log('🚀 Starting migration to Supabase...');
  console.log(`📊 Supabase URL: ${supabaseUrl}`);
  
  const allResults = [];
  
  // Migrate images
  for (const dir of directoriesToMigrate) {
    const results = await migrateDirectory(dir, 'images');
    allResults.push(...results);
  }
  
  // Migrate videos separately
  const videoDirs = ['public/Feedback', 'public/videos'];
  for (const dir of videoDirs) {
    if (fs.existsSync(dir)) {
      const results = await migrateDirectory(dir, 'videos');
      allResults.push(...results);
    }
  }

  // Generate migration report
  const report = {
    totalFiles: allResults.length,
    totalSize: allResults.reduce((sum, file) => sum + file.size, 0),
    files: allResults,
    timestamp: new Date().toISOString()
  };

  // Save report
  fs.writeFileSync('supabase-migration-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n📊 Migration Summary:');
  console.log(`✅ Total files migrated: ${report.totalFiles}`);
  console.log(`📦 Total size: ${(report.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📄 Report saved: supabase-migration-report.json`);
  
  console.log('\n🎉 Migration completed!');
  console.log('\nNext steps:');
  console.log('1. Update your components to use SupabaseImage component');
  console.log('2. Update image paths in your database');
  console.log('3. Test the new image loading performance');
}

main().catch(console.error);
