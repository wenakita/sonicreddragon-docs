/**
 * Cleanup Components Script
 * 
 * This script removes deprecated and duplicate components from the codebase
 * to address the issues identified in the frontend audit.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Components to remove
const DEPRECATED_COMPONENTS = [
  // Deprecated Mermaid components
  'src/components/EnhancedMermaid.js',
  'src/components/ImmersiveMermaid.tsx',
  'src/components/MermaidDiagram.js',
  'src/components/MermaidWrapper.js',
  'src/components/StandardMermaid.js',
  'src/components/ModernMermaid.tsx',
  'src/components/MermaidRenderer.tsx',
  'src/components/StandardMermaid.module.css',
  'src/components/ModernMermaid.module.css',
  'src/components/ImmersiveMermaid.module.css',
  
  // Redundant scroll reveal components (keep ScrollRevealWrapper.tsx as the main one)
  'src/components/ScrollReveal.tsx',
  'src/components/SimpleScrollReveal.tsx',
  
  // Test components
  'src/components/AnimeTester.js',
  'src/components/SimpleTest.tsx',
  'src/components/TestHero.tsx',
];

// Duplicate hero/feature components to consolidate
// We'll keep UltraHeroSection.tsx and UltraFeatureShowcase.tsx as they are the most advanced
const DUPLICATE_COMPONENTS = [
  'src/components/HeroSection.tsx',
  'src/components/SimpleHeroSection.tsx',
];

// Files to update with import replacements
const FILES_TO_UPDATE = [
  // Update any files that might import the deprecated components
  'src/pages/index.tsx',
  'src/theme/MDXComponents.js',
];

// Import replacements
const IMPORT_REPLACEMENTS = [
  {
    from: "import EnhancedMermaid from '@site/src/components/EnhancedMermaid';",
    to: "import UnifiedMermaid from '@site/src/components/UnifiedMermaid';"
  },
  {
    from: "import ImmersiveMermaid from '@site/src/components/ImmersiveMermaid';",
    to: "import UnifiedMermaid from '@site/src/components/UnifiedMermaid';"
  },
  {
    from: "import MermaidDiagram from '@site/src/components/MermaidDiagram';",
    to: "import UnifiedMermaid from '@site/src/components/UnifiedMermaid';"
  },
  {
    from: "import MermaidWrapper from '@site/src/components/MermaidWrapper';",
    to: "import UnifiedMermaid from '@site/src/components/UnifiedMermaid';"
  },
  {
    from: "import StandardMermaid from '@site/src/components/StandardMermaid';",
    to: "import UnifiedMermaid from '@site/src/components/UnifiedMermaid';"
  },
  {
    from: "import ModernMermaid from '@site/src/components/ModernMermaid';",
    to: "import UnifiedMermaid from '@site/src/components/UnifiedMermaid';"
  },
  {
    from: "import ScrollReveal from '@site/src/components/ScrollReveal';",
    to: "import ScrollRevealWrapper from '@site/src/components/ScrollRevealWrapper';"
  },
  {
    from: "import SimpleScrollReveal from '@site/src/components/SimpleScrollReveal';",
    to: "import ScrollRevealWrapper from '@site/src/components/ScrollRevealWrapper';"
  },
  {
    from: "import HeroSection from '@site/src/components/HeroSection';",
    to: "import UltraHeroSection from '@site/src/components/UltraHeroSection';"
  },
  {
    from: "import SimpleHeroSection from '@site/src/components/SimpleHeroSection';",
    to: "import UltraHeroSection from '@site/src/components/UltraHeroSection';"
  },
];

// Component usage replacements
const COMPONENT_REPLACEMENTS = [
  {
    from: /<EnhancedMermaid([^>]*)>/g,
    to: "<UnifiedMermaid$1>"
  },
  {
    from: /<\/EnhancedMermaid>/g,
    to: "</UnifiedMermaid>"
  },
  {
    from: /<ImmersiveMermaid([^>]*)>/g,
    to: "<UnifiedMermaid$1 particles={true}>"
  },
  {
    from: /<\/ImmersiveMermaid>/g,
    to: "</UnifiedMermaid>"
  },
  {
    from: /<MermaidDiagram([^>]*)>/g,
    to: "<UnifiedMermaid$1>"
  },
  {
    from: /<\/MermaidDiagram>/g,
    to: "</UnifiedMermaid>"
  },
  {
    from: /<MermaidWrapper([^>]*)>/g,
    to: "<UnifiedMermaid$1>"
  },
  {
    from: /<\/MermaidWrapper>/g,
    to: "</UnifiedMermaid>"
  },
  {
    from: /<StandardMermaid([^>]*)>/g,
    to: "<UnifiedMermaid$1 animated={false}>"
  },
  {
    from: /<\/StandardMermaid>/g,
    to: "</UnifiedMermaid>"
  },
  {
    from: /<ModernMermaid([^>]*)>/g,
    to: "<UnifiedMermaid$1>"
  },
  {
    from: /<\/ModernMermaid>/g,
    to: "</UnifiedMermaid>"
  },
  {
    from: /<ScrollReveal([^>]*)>/g,
    to: "<ScrollRevealWrapper$1>"
  },
  {
    from: /<\/ScrollReveal>/g,
    to: "</ScrollRevealWrapper>"
  },
  {
    from: /<SimpleScrollReveal([^>]*)>/g,
    to: "<ScrollRevealWrapper$1>"
  },
  {
    from: /<\/SimpleScrollReveal>/g,
    to: "</ScrollRevealWrapper>"
  },
  {
    from: /<HeroSection([^>]*)>/g,
    to: "<UltraHeroSection$1>"
  },
  {
    from: /<\/HeroSection>/g,
    to: "</UltraHeroSection>"
  },
  {
    from: /<SimpleHeroSection([^>]*)>/g,
    to: "<UltraHeroSection$1>"
  },
  {
    from: /<\/SimpleHeroSection>/g,
    to: "</UltraHeroSection>"
  },
];

/**
 * Find all MDX files in the docs directory
 */
async function findMdxFiles(dir) {
  const files = await readdir(dir);
  const mdxFiles = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      const subDirFiles = await findMdxFiles(filePath);
      mdxFiles.push(...subDirFiles);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      mdxFiles.push(filePath);
    }
  }

  return mdxFiles;
}

/**
 * Update imports and component usage in a file
 */
async function updateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

    let content = await readFile(filePath, 'utf8');
    let modified = false;

    // Replace imports
    for (const replacement of IMPORT_REPLACEMENTS) {
      if (content.includes(replacement.from)) {
        content = content.replace(replacement.from, replacement.to);
        modified = true;
        console.log(`Updated import in ${filePath}: ${replacement.from} -> ${replacement.to}`);
      }
    }

    // Replace component usage
    for (const replacement of COMPONENT_REPLACEMENTS) {
      const regex = replacement.from;
      if (regex.test(content)) {
        content = content.replace(regex, replacement.to);
        modified = true;
        console.log(`Updated component usage in ${filePath}: ${regex} -> ${replacement.to}`);
      }
    }

    if (modified) {
      await writeFile(filePath, content, 'utf8');
      console.log(`Updated file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating file ${filePath}:`, error);
  }
}

/**
 * Main cleanup function
 */
async function cleanup() {
  console.log('Starting component cleanup...');

  // Remove deprecated components
  for (const componentPath of DEPRECATED_COMPONENTS) {
    try {
      if (fs.existsSync(componentPath)) {
        await unlink(componentPath);
        console.log(`Removed deprecated component: ${componentPath}`);
      } else {
        console.log(`Component already removed: ${componentPath}`);
      }
    } catch (error) {
      console.error(`Error removing component ${componentPath}:`, error);
    }
  }

  // Remove duplicate components
  for (const componentPath of DUPLICATE_COMPONENTS) {
    try {
      if (fs.existsSync(componentPath)) {
        await unlink(componentPath);
        console.log(`Removed duplicate component: ${componentPath}`);
      } else {
        console.log(`Component already removed: ${componentPath}`);
      }
    } catch (error) {
      console.error(`Error removing component ${componentPath}:`, error);
    }
  }

  // Update specified files
  for (const filePath of FILES_TO_UPDATE) {
    await updateFile(filePath);
  }

  // Find and update all MDX files
  const mdxFiles = await findMdxFiles('./docs');
  console.log(`Found ${mdxFiles.length} MDX files to check for component usage`);
  
  for (const mdxFile of mdxFiles) {
    await updateFile(mdxFile);
  }

  console.log('Component cleanup completed!');
}

// Run the cleanup
cleanup().catch(console.error);
