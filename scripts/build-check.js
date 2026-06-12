#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Tripsee Build Check...\n');

// Check if required files exist
const requiredFiles = [
  'next.config.ts',
  'tsconfig.json',
  'tailwind.config.js',
  'postcss.config.js',
  'package.json',
  'app/layout.tsx',
  'app/page.tsx'
];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    process.exit(1);
  }
});

// Check if public directory has required assets
console.log('\n🖼️  Checking public assets...');
const publicDirs = [
  'public/Destination',
  'public/uploads',
  'public/videos',
  'public/Feedback'
];

publicDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    console.log(`✅ ${dir} (${files.length} files)`);
  } else {
    console.log(`⚠️  ${dir} - Directory not found`);
  }
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['dev', 'build', 'start', 'lint'];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`❌ ${script} - MISSING`);
  }
});

// Check dependencies
console.log('\n🔧 Checking critical dependencies...');
const criticalDeps = [
  'next',
  'react',
  'react-dom',
  'typescript',
  'tailwindcss',
  'framer-motion',
  'swiper',
  'mongodb',
  'mongoose'
];

criticalDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    const version = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
    console.log(`✅ ${dep}: ${version}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
  }
});

console.log('\n🎯 Build check completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run build');
console.log('3. Run: npm start');
console.log('\n✨ Happy coding!');
