import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Sonic Red Dragon',
  tagline: 'LayerZero V2 Compatible Token',
  favicon: 'img/logo.svg',

  // Set the production url of your site here
  url: 'https://wenakita.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/sonicreddragon-docs/',
  // Remove trailing slash for GitHub Pages
  trailingSlash: false,

  // GitHub pages deployment config
  organizationName: 'wenakita',
  projectName: 'sonicreddragon-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/wenakita/sonicreddragon-docs/edit/main/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo.svg',
    navbar: {
      title: 'Sonic Red Dragon',
      logo: {
        alt: 'Sonic Red Dragon Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Overview',
        },
        {
          type: 'doc',
          docId: 'contracts/overview',
          position: 'left',
          label: 'Contracts',
        },
        {
          type: 'doc',
          docId: 'ecosystem/drand-network',
          position: 'left',
          label: 'Randomness',
        },
        {
          href: 'https://github.com/wenakita/omnidragon',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/intro',
            },
            {
              label: 'Randomness',
              to: '/ecosystem/drand-network',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/sonicreddragon',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/sonicreddragon',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wenakita/omnidragon',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sonic Red Dragon. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'forest'},
    },
  } satisfies Preset.ThemeConfig,

  // Add Mermaid support
  themes: ['@docusaurus/theme-mermaid'],
};

export default config;
