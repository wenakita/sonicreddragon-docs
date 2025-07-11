#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING MDX COMPILATION ERRORS');
console.log('=================================\n');

function fixMDXErrors() {
  const fixes = [
    {
      file: 'docs-new/concepts/cross-chain.md',
      description: 'Fix malformed classDef syntax on line 42',
      fix: (content) => {
        // Fix the malformed classDef line
        return content.replace(
          /classDef avax fill:#f3e5f5,stroke:#4a148c,stroke-width:2pxll:#f3e5f5,stroke:#4a148c,stroke-width:2pxl:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#fffffffff/g,
          'classDef avax fill:#f3e5f5,stroke:#4a148c,stroke-width:2px'
        );
      }
    },
    {
      file: 'docs-new/concepts/overview.md',
      description: 'Fix malformed class definition on line 212',
      fix: (content) => {
        // Fix the malformed class definition
        return content.replace(
          /class class class Ve69LPGovernance   \{/g,
          'class Ve69LPGovernance {'
        );
      }
    },
    {
      file: 'docs-new/concepts/security-model.md',
      description: 'Fix acorn parsing error on line 346',
      fix: (content) => {
        // Fix malformed classDef syntax
        return content.replace(
          /classDef endpoint fill:#f3e5f5,stroke:#4a148c,stroke-width:2pxll:#f3e5f5,stroke:#4a148c,stroke-width:2pxl:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#fffffffff/g,
          'classDef endpoint fill:#f3e5f5,stroke:#4a148c,stroke-width:2px'
        ).replace(
          /classDef alert fill:#f3e5f5,stroke:#4a148c,stroke-width:2pxll:#f3e5f5,stroke:#4a148c,stroke-width:2pxl:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#fffffffff/g,
          'classDef alert fill:#f3e5f5,stroke:#4a148c,stroke-width:2px'
        );
      }
    },
    {
      file: 'docs-new/partner/case-studies/chainlink.md',
      description: 'Fix unclosed br tags',
      fix: (content) => {
        // Fix unclosed br tags
        return content.replace(
          /Process<br>Randomness/g,
          'Process Randomness'
        ).replace(
          /Provide<br>Verified<br>Randomness/g,
          'Provide Verified Randomness'
        ).replace(
          /Request<br>Randomness/g,
          'Request Randomness'
        ).replace(
          /Request<br>Random Words/g,
          'Request Random Words'
        );
      }
    },
    {
      file: 'docs-new/partner/case-studies/drand.md',
      description: 'Fix unclosed br tags',
      fix: (content) => {
        // Fix unclosed br tags
        return content.replace(
          /VRF Consumer<br>Contract/g,
          'VRF Consumer Contract'
        ).replace(
          /Jackpot<br>System/g,
          'Jackpot System'
        ).replace(
          /Game<br>Mechanics/g,
          'Game Mechanics'
        ).replace(
          /Raffles &<br>Giveaways/g,
          'Raffles & Giveaways'
        ).replace(
          /Emits Random<br>Beacons/g,
          'Emits Random Beacons'
        ).replace(
          /Fetch<br>Beacons/g,
          'Fetch Beacons'
        ).replace(
          /Verify<br>Randomness/g,
          'Verify Randomness'
        ).replace(
          /Provide<br>Verified<br>Randomness/g,
          'Provide Verified Randomness'
        ).replace(
          /Request<br>Randomness/g,
          'Request Randomness'
        );
      }
    }
  ];

  let totalFixed = 0;

  fixes.forEach(({ file, description, fix }) => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const fixedContent = fix(content);
      
      if (content !== fixedContent) {
        fs.writeFileSync(file, fixedContent);
        console.log(`✅ Fixed ${file}: ${description}`);
        totalFixed++;
      } else {
        console.log(`ℹ️  No changes needed for ${file}`);
      }
    } catch (error) {
      console.log(`❌ Error fixing ${file}: ${error.message}`);
    }
  });

  console.log(`\n🎉 Fixed ${totalFixed} MDX compilation errors!`);
  console.log('   The site should now build without MDX errors.\n');
}

// Run the fixes
fixMDXErrors(); 