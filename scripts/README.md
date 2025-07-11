# Documentation Fix Scripts

This directory contains scripts to automatically fix and verify documentation issues in the Sonic Red Dragon documentation.

## Available Scripts

### `fix-all-docs-issues.js`

This is the main script that fixes all documentation issues, including:

- Mermaid syntax issues (invalid color codes, mismatched subgraph/end statements)
- Broken links (removing .md extensions, fixing paths)

Usage:
```bash
npm run fix-docs
```

### `verify-fixes.js`

This script verifies that all documentation issues have been fixed.

Usage:
```bash
npm run verify-docs
```

### `fix-mermaid-subgraph-issues.js`

This script specifically targets and fixes mismatched subgraph/end statements in Mermaid diagrams.

Usage:
```bash
node scripts/fix-mermaid-subgraph-issues.js
```

### `fix-specific-mermaid-issues.js`

This script applies hardcoded fixes to specific files with known Mermaid syntax issues.

Usage:
```bash
node scripts/fix-specific-mermaid-issues.js
```

### `update-package-json.js`

This script updates the package.json file to include the fix-docs script as a pre-start script, ensuring that documentation issues are automatically fixed before the development server starts.

Usage:
```bash
node scripts/update-package-json.js
```

## Automated Workflow

The documentation fix scripts are integrated into the development workflow:

1. **Pre-start**: The `fix-all-docs-issues.js` script runs automatically before the development server starts (`npm start`), ensuring that all documentation issues are fixed.

2. **Manual Fix**: You can manually run the fix script at any time with `npm run fix-docs`.

3. **Verification**: You can verify that all issues have been fixed with `npm run verify-docs`.

## Issues Fixed

1. **Mermaid Syntax Issues**:
   - Invalid color codes (`#fffffffff` → `#ffffff`)
   - Mismatched subgraph/end statements
   - Missing spaces in `endstyle` patterns

2. **Broken Links**:
   - Removed `.md` extensions from links
   - Fixed paths to concept pages

## Implementation Details

The fix scripts use a combination of approaches:

1. **General Fixes**: Applied to all files, fixing common issues like invalid color codes.

2. **Specific Fixes**: Targeted fixes for specific files with complex issues.

3. **Verification**: Checks that all issues have been fixed.

The scripts are designed to be idempotent, meaning they can be run multiple times without causing issues.
