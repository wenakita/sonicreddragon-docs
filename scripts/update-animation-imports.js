/**
 * Update Animation Imports
 * 
 * This script updates imports in files that are still referencing the old animation utility files.
 */

const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'src/clientModules/animeModule.js',
  'src/components/AnimatedButton.tsx',
  'src/components/AnimatedCard.js',
  'src/components/AnimatedDiagram.js',
  'src/components/AnimatedText.tsx',
  'src/components/AnimatedTriggerFlow.js',
  'src/components/CrossChainRandomnessAnimation.js',
  'src/components/CubeRootAnimation.js',
  'src/components/FloatingParticles.tsx',
  'src/components/GradientBackground.tsx',
  'src/components/ImmersiveFeatureCard.tsx',
  'src/components/ImmersiveTimeline.tsx',
  'src/components/InteractiveCard.tsx',
  'src/components/NavigationCard.tsx',
  'src/components/ParallaxSection.tsx',
  'src/components/ParticleBackground.tsx',
  'src/components/PartnerBoostAnimation.js',
  'src/components/SimpleCTA.tsx',
  'src/components/TokenFeeAnimation.js',
  'src/components/UltraFeatureShowcase.tsx',
  'src/components/UltraHeroSection.tsx',
  'src/components/UltraStatsDashboard.tsx',
  'src/components/UltraTimeline.tsx',
  'src/components/VotingDecayAnimation.js',
  'src/theme/Layout/index.tsx',
  'src/theme/DocRoot/index.tsx'
];

// Function to update imports in a file
function updateImportsInFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File ${filePath} does not exist, skipping`);
      return;
    }

    console.log(`Updating imports in ${filePath}`);
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace imports
    content = content
      .replace(/import .* from ['"].*\/animeUtils['"]/g, `import { anime } from '../utils/animationUtils'`)
      .replace(/import .* from ['"].*\/animationSystem['"]/g, `import { AnimationPerformanceManager } from '../utils/animationUtils'`)
      .replace(/import .* from ['"].*\/performanceOptimizedAnimations['"]/g, `import { useAnimationPerformance } from '../utils/animationUtils'`)
      .replace(/import .* from ['"].*\/unifiedAnimationSystem['"]/g, `import { anime, useAnimationPerformance } from '../utils/animationUtils'`)
      .replace(/import .* from ['"]@site\/src\/utils\/animeUtils['"]/g, `import { anime } from '@site/src/utils/animationUtils'`)
      .replace(/import .* from ['"]@site\/src\/utils\/animationSystem['"]/g, `import { AnimationPerformanceManager } from '@site/src/utils/animationUtils'`)
      .replace(/import .* from ['"]@site\/src\/utils\/performanceOptimizedAnimations['"]/g, `import { useAnimationPerformance } from '@site/src/utils/animationUtils'`)
      .replace(/import .* from ['"]@site\/src\/utils\/unifiedAnimationSystem['"]/g, `import { anime, useAnimationPerformance } from '@site/src/utils/animationUtils'`);
    
    // Write updated content
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Updated imports in ${filePath}`);
  } catch (error) {
    console.error(`Error updating imports in ${filePath}:`, error);
  }
}

// Update imports in all files
filesToUpdate.forEach(filePath => {
  updateImportsInFile(filePath);
});

console.log('Finished updating imports');
