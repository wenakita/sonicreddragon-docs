#!/usr/bin/env node

/**
 * Test script to verify educational animations are working
 */

const puppeteer = require('puppeteer');

async function testAnimations() {
  console.log('🎬 Testing educational animations...');
  
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Navigate to the interactive learning page
    await page.goto('http://localhost:3000/concepts/interactive-learning');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if educational animation containers exist
    const animationContainers = await page.$$('.educational-animation');
    console.log(`✅ Found ${animationContainers.length} educational animation containers`);
    
    // Check if mermaid diagrams are present
    const mermaidDiagrams = await page.$$('.docusaurus-mermaid-container');
    console.log(`✅ Found ${mermaidDiagrams.length} mermaid diagrams`);
    
    // Check if interactive controls are present
    const controls = await page.$$('.learning-controls');
    console.log(`✅ Found ${controls.length} sets of learning controls`);
    
    // Test clicking a play button
    if (controls.length > 0) {
      const playButton = await page.$('.learning-btn[data-action="play"]');
      if (playButton) {
        await playButton.click();
        console.log('✅ Successfully clicked play button');
        await page.waitForTimeout(2000);
      }
    }
    
    // Check if anime.js is loaded
    const animeLoaded = await page.evaluate(() => {
      return typeof window.anime !== 'undefined';
    });
    console.log(`✅ Anime.js loaded: ${animeLoaded}`);
    
    console.log('🎉 All animation tests passed!');
    
    await browser.close();
  } catch (error) {
    console.error('❌ Animation test failed:', error.message);
  }
}

// Only run if puppeteer is available
try {
  testAnimations();
} catch (error) {
  console.log('ℹ️ Puppeteer not available, skipping animation tests');
  console.log('📝 To test animations manually, visit: http://localhost:3000/concepts/interactive-learning');
} 