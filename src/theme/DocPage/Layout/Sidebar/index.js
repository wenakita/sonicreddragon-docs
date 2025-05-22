import React from 'react';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';

// Import the original sidebar to reuse its content
import OriginalSidebar from '@theme-original/DocPage/Layout/Sidebar';

// Simple wrapper component that lets the global CSS/JS handle positioning
export default function Sidebar(props) {
  const sidebar = useDocsSidebar();
  
  // Just render the original sidebar - positioning handled by CSS/JS
  return sidebar ? <OriginalSidebar {...props} /> : null;
} 