/**
 * Fix Specific Markdown Links Script
 * 
 * This script fixes specific broken markdown links identified in the build errors.
 */

const fs = require('fs');
const path = require('path');

console.log('Starting to fix specific markdown links...');

// Fix links in architecture-overview.md
const architectureOverviewPath = 'docs/concepts/architecture-overview.md';
console.log(`Processing ${architectureOverviewPath}...`);

let architectureContent = fs.readFileSync(architectureOverviewPath, 'utf8');
const originalArchitectureContent = architectureContent;

// Fix links in the Further Reading section
architectureContent = architectureContent.replace(/\[Token System\]\(\/token-system\.md\)/g, '[Token System](/concepts/fee-system-consolidated.md)');
architectureContent = architectureContent.replace(/\[Fee System\]\(\/fee-system\.md\)/g, '[Fee System](/concepts/fee-system-consolidated.md)');
architectureContent = architectureContent.replace(/\[Jackpot System\]\(\/jackpot-system\.md\)/g, '[Jackpot System](/concepts/jackpot-system-consolidated.md)');
architectureContent = architectureContent.replace(/\[Cross-Chain Architecture\]\(\/cross-chain\.md\)/g, '[Cross-Chain Architecture](/concepts/cross-chain-consolidated.md)');
architectureContent = architectureContent.replace(/\[Randomness System\]\(\/randomness\.md\)/g, '[Randomness System](/concepts/randomness-consolidated.md)');
architectureContent = architectureContent.replace(/\[Security Model\]\(\/security-model\.md\)/g, '[Security Model](/concepts/security-model-consolidated.md)');

// Write the file if changes were made
if (architectureContent !== originalArchitectureContent) {
  fs.writeFileSync(architectureOverviewPath, architectureContent);
  console.log(`  Updated ${architectureOverviewPath}`);
}

// Fix links in security-model-consolidated.md
const securityModelPath = 'docs/concepts/security-model-consolidated.md';
console.log(`Processing ${securityModelPath}...`);

let securityContent = fs.readFileSync(securityModelPath, 'utf8');
const originalSecurityContent = securityContent;

// Fix links in the Further Reading section
securityContent = securityContent.replace(/\[Token System\]\(\/token-system\.md\)/g, '[Token System](/concepts/fee-system-consolidated.md)');
securityContent = securityContent.replace(/\[Jackpot System\]\(\/jackpot-system\.md\)/g, '[Jackpot System](/concepts/jackpot-system-consolidated.md)');
securityContent = securityContent.replace(/\[Cross-Chain Architecture\]\(\/cross-chain\.md\)/g, '[Cross-Chain Architecture](/concepts/cross-chain-consolidated.md)');
securityContent = securityContent.replace(/\[Randomness System\]\(\/randomness\.md\)/g, '[Randomness System](/concepts/randomness-consolidated.md)');

// Write the file if changes were made
if (securityContent !== originalSecurityContent) {
  fs.writeFileSync(securityModelPath, securityContent);
  console.log(`  Updated ${securityModelPath}`);
}

// Fix links in QUICK_REFERENCE_UPDATES.md
const quickRefPath = 'docs/052525updates/summary/QUICK_REFERENCE_UPDATES.md';
console.log(`Processing ${quickRefPath}...`);

let quickRefContent = fs.readFileSync(quickRefPath, 'utf8');
const originalQuickRefContent = quickRefContent;

// Fix links with /../../docs/ pattern
quickRefContent = quickRefContent.replace(/\[VRF Deployment Guide\]\(\/\.\.\/\.\.\/docs\/053025updates\/SONIC_VRF_DEPLOYMENT_GUIDE\.md\)/g, 
  '[VRF Deployment Guide](/053025updates/SONIC_VRF_DEPLOYMENT_GUIDE.md)');
quickRefContent = quickRefContent.replace(/\[Security Audit Recommendations\]\(\/\.\.\/\.\.\/docs\/053025updates\/SECURITY_AUDIT_RECOMMENDATIONS\.md\)/g, 
  '[Security Audit Recommendations](/053025updates/SECURITY_AUDIT_RECOMMENDATIONS.md)');

// Write the file if changes were made
if (quickRefContent !== originalQuickRefContent) {
  fs.writeFileSync(quickRefPath, quickRefContent);
  console.log(`  Updated ${quickRefPath}`);
}

console.log('Finished fixing specific markdown links.');
