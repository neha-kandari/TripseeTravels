const fs = require('fs');
const path = require('path');

/**
 * Setup script to ensure uploads directory structure exists
 * This should be run before deployment
 */

const destinations = [
  'bali',
  'thailand', 
  'vietnam',
  'singapore',
  'malaysia',
  'dubai',
  'andaman',
  'maldives'
];

async function setupUploadsDirectory() {
  try {
    console.log('Setting up uploads directory structure...');
    
    const publicDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicDir, 'uploads');
    
    // Create main uploads directory
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory');
    } else {
      console.log('✅ Uploads directory already exists');
    }
    
    // Create destination subdirectories
    for (const destination of destinations) {
      const destDir = path.join(uploadsDir, destination);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        console.log(`✅ Created uploads/${destination} directory`);
      } else {
        console.log(`✅ uploads/${destination} directory already exists`);
      }
    }
    
    // Create .gitkeep files to ensure directories are tracked
    for (const destination of destinations) {
      const gitkeepPath = path.join(uploadsDir, destination, '.gitkeep');
      if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '');
        console.log(`✅ Created .gitkeep in uploads/${destination}`);
      }
    }
    
    console.log('🎉 Uploads directory setup complete!');
    console.log('📁 Directory structure:');
    console.log('public/uploads/');
    destinations.forEach(dest => {
      console.log(`  └── ${dest}/`);
    });
    
  } catch (error) {
    console.error('❌ Error setting up uploads directory:', error);
    process.exit(1);
  }
}

// Run the setup
setupUploadsDirectory();
