# System Information for Gemini Prompt

When communicating with Gemini about building the application, include the following system information to ensure the solution is compatible with your environment:

## Operating System
- **OS**: Linux 5.15
- **Shell**: zsh

## Node.js Environment
- **Node.js Version**: v18.20.8
- **npm Version**: 10.8.2 (with 11.4.1 available)

## Project Information
- **Framework**: Docusaurus 3.8.0
- **Project Structure**: 
  - Documentation in `/docs` and `/docs-new` directories
  - Scripts in `/scripts` directory
  - Client modules in `/src/clientModules`
  - CSS in `/src/css` and `/static/css`

## Key Files
- **Configuration**: `docusaurus.config.ts`
- **Sidebar Configuration**: `sidebars.ts` and `sidebars-new.ts`
- **Package Management**: `package.json` and `package-lock.json`

## Build Commands
- **Build**: `npm run build`
- **Serve**: `npm run serve`

## Important Notes
- The project uses TypeScript (`.ts` files)
- The documentation is written in Markdown (`.md`) and MDX (`.mdx`) files
- Mermaid diagrams are used extensively throughout the documentation
- The project has a complex directory structure with multiple documentation sections

When asking Gemini to build the application, include this system information at the beginning of your prompt to ensure the solution is tailored to your specific environment.
