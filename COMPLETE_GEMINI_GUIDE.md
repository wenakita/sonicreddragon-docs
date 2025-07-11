# Complete Guide to Building a Markdown Fixer App with Gemini 2.0

This guide provides comprehensive instructions on how to use Gemini 2.0 to build an application that fixes Markdown files in your Docusaurus documentation.

## Step 1: Prepare Your Prompt

When asking Gemini to build your application, structure your prompt in this order:

1. **System Information** (from `SYSTEM_INFORMATION.md`)
2. **Problem Statement** (from `SOLUTION_PRESENTATION.md`)
3. **Application Requirements** (from `GEMINI_WEB_APP_PROMPT.md`)

### Example Prompt Structure:

```
I need you to help me build a web application that can fix Markdown files for my Docusaurus documentation. Here's my environment and requirements:

[PASTE CONTENT FROM SYSTEM_INFORMATION.MD]

The problem I'm trying to solve is:

[PASTE PROBLEM STATEMENT SECTION FROM SOLUTION_PRESENTATION.MD]

Here are the detailed requirements for the application:

[PASTE CONTENT FROM GEMINI_WEB_APP_PROMPT.MD]
```

## Step 2: Engage in Iterative Development

After providing your initial prompt, engage with Gemini in an iterative development process:

### 1. Request Architecture First

Ask Gemini to start by outlining the architecture of the application:

```
Before writing any code, could you outline the architecture of the application? Please include:
1. Component diagram
2. Data flow
3. Key modules and their responsibilities
```

### 2. Focus on Core Functionality First

Ask Gemini to focus on implementing the core functionality:

```
Let's start by implementing the core file processing module that can:
1. Scan directories for Markdown files
2. Parse Markdown to identify Mermaid diagrams and links
3. Apply fixes to common issues
```

### 3. Build the UI After Core Functionality

Once the core functionality is working, ask Gemini to help with the UI:

```
Now that we have the core functionality working, let's design the user interface. Could you provide:
1. React component structure
2. Key UI screens
3. State management approach
```

## Step 3: Test and Refine

As Gemini provides code, test it and provide feedback:

```
I've tested the code you provided, and I found these issues:
1. [Describe issue 1]
2. [Describe issue 2]

Could you update the code to address these problems?
```

## Step 4: Request Complete Implementation

Once you're satisfied with the design and core functionality, ask for the complete implementation:

```
Now that we've designed the architecture and core functionality, could you provide the complete implementation of the application? Please include:
1. All necessary files and their content
2. Installation instructions
3. Usage examples
```

## Tips for Getting the Best Results

1. **Be specific about issues**: When providing feedback, be as specific as possible about what's not working.

2. **Share examples**: If possible, share snippets of your actual Markdown files with Mermaid diagrams so Gemini can see the specific issues.

3. **Break down complex requests**: Instead of asking for everything at once, break it down into smaller components.

4. **Ask for explanations**: When Gemini provides code, ask it to explain how the code works so you understand it better.

5. **Request tests**: Ask Gemini to provide test cases for the code it generates to ensure it works correctly.

## Handling Limitations

If Gemini struggles with certain aspects:

1. **Simplify the request**: Focus on a command-line tool first, then add the UI later.

2. **Use existing code as reference**: Share the scripts we've already created as reference implementations.

3. **Split into multiple sessions**: Build the application across multiple sessions, saving the code from each session.

## Reference Files

Use these files as needed throughout your conversation with Gemini:

1. `SYSTEM_INFORMATION.md` - Details about your environment
2. `SOLUTION_PRESENTATION.md` - Overview of the problem and solution
3. `GEMINI_APP_PROMPT.md` - Prompt for a general-purpose application
4. `GEMINI_WEB_APP_PROMPT.md` - Prompt for a web application

## Final Notes

Remember that building a complex application may require multiple sessions with Gemini. Save the code and explanations from each session to maintain continuity.

The scripts we've already created (`fix-broken-links.js`, `mermaid-diagram-fixer.js`, etc.) provide working examples of the core functionality needed. You can share these with Gemini as reference implementations if it struggles with certain aspects of the application.
