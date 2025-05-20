const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all markdown files in the docs directory
const docFiles = glob.sync('docs/**/*.md', { cwd: path.resolve(__dirname, '..') });

// Count of issues found
let issuesFound = 0;

// Check each file
docFiles.forEach(file => {
  const filePath = path.resolve(__dirname, '..', file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find mermaid code blocks
  const mermaidRegex = /```mermaid\s+([\s\S]*?)```/g;
  let match;
  let fileHasIssues = false;
  
  while ((match = mermaidRegex.exec(content)) !== null) {
    const diagramCode = match[1];
    
    // Check for deprecated 'graph' syntax that should be 'flowchart'
    if (diagramCode.trim().startsWith('graph ')) {
      if (!fileHasIssues) {
        console.log(`\n${file}:`);
        fileHasIssues = true;
      }
      
      // Get the line number where this diagram starts
      const contentUpToMatch = content.substring(0, match.index);
      const lineNumber = contentUpToMatch.split('\n').length;
      
      console.log(`  - Line ${lineNumber}: Found deprecated 'graph' syntax (should be 'flowchart')`);
      issuesFound++;
    }
  }
});

if (issuesFound > 0) {
  console.log(`\nFound ${issuesFound} issues with mermaid diagram syntax.`);
  console.log('Tip: Replace "graph" with "flowchart" in your mermaid diagrams.');
} else {
  console.log('No mermaid syntax issues found! All diagrams are using modern syntax.');
} 