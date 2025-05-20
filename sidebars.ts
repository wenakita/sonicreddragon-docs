import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'doc',
      id: 'getting-started',
      label: 'Getting Started',
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      items: [
        {
          type: 'doc',
          id: 'contracts/overview',
          label: 'Overview',
        },
        {
          type: 'category',
          label: 'Guides',
          items: [
            {
              type: 'doc',
              id: 'contracts/guides/integration',
              label: 'Integration Guide',
            },
            {
              type: 'doc',
              id: 'contracts/guides/security',
              label: 'Security Best Practices',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Ecosystem',
      items: [
        {
          type: 'doc',
          id: 'ecosystem/drand-network',
          label: 'dRAND Network',
        },
        {
          type: 'category',
          label: 'LayerZero',
          items: [
            {
              type: 'doc',
              id: 'ecosystem/layerzero/overview',
              label: 'Overview',
            },
            {
              type: 'doc',
              id: 'ecosystem/layerzero/integration',
              label: 'Integration Guide',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          type: 'doc',
          id: 'api/token',
          label: 'Token Contract',
        },
        {
          type: 'doc',
          id: 'api/bridge',
          label: 'Bridge Contract',
        },
        {
          type: 'doc',
          id: 'api/randomness',
          label: 'Randomness Contract',
        },
      ],
    },
  ],
};

export default sidebars;
