#!/usr/bin/env node

/**
 * Debug script for docusaurus build errors
 * Sets environment variables to provide more verbose output
 */

const { execSync } = require('child_process');

// Set environment variables to help debug issues
process.env.NODE_ENV = 'development';
process.env.DEBUG = 'docusaurus:*';
process.env.NODE_OPTIONS = '--trace-warnings --unhandled-rejections=strict';

console.log('Running Docusaurus build in debug mode...');

try {
  // Run the build with verbose output
  execSync('npx docusaurus build --no-minify', { 
    stdio: 'inherit',
    env: process.env
  });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed with error:', error.message);
  process.exit(1);
} 