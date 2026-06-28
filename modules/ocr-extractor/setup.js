#!/usr/bin/env node

/**
 * Setup script for @crewport/ocr-extractor module
 * Run this after extracting the module to a new project
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up @crewport/ocr-extractor module...\n');

// Check Node version
const nodeVersion = parseInt(process.version.split('.')[0].slice(1));
if (nodeVersion < 16) {
  console.error('❌ Node.js 16+ is required');
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Build the module
console.log('\n📦 Building the module...');
const moduleDir = __dirname;

try {
  // Check if TypeScript is available
  const tsPath = path.join(moduleDir, 'node_modules', '.bin', 'tsc');
  
  if (!fs.existsSync(tsPath)) {
    console.log('Installing dependencies...');
    require('child_process').execSync('npm install', { cwd: moduleDir, stdio: 'inherit' });
  }
  
  // Build TypeScript
  console.log('Compiling TypeScript...');
  require('child_process').execSync('npm run build', { cwd: moduleDir, stdio: 'inherit' });
  
  console.log('\n✅ Module built successfully!');
  console.log('\n📚 Next steps:');
  console.log('1. Update your imports to use @crewport/ocr-extractor');
  console.log('2. See examples/ folder for implementation guides');
  console.log('3. Check README.md for complete API documentation');
  console.log('\n🎉 Ready to use!');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
