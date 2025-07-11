/**
 * Custom DocRoot Layout Component
 * Extends the original to maintain sidebar state
 */

import React from 'react';
import OriginalDocRootLayout from '@theme-original/DocRoot/Layout';

export default function DocRootLayout(props) {
  // Simply extend the original layout without adding extra wrappers
  return <OriginalDocRootLayout {...props} />;
} 