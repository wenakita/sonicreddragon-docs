import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OmniDragon',
  tagline: 'Cross-Chain Token Ecosystem',
  favicon: '/img/favicon-32x32.png',

  // Set the production url of your site here
  url: 'https://docs.sonicreddragon.io',
  // For custom domain with GitHub Pages, use baseUrl: '/'
  baseUrl: '/',
  // Remove trailing slash for GitHub Pages
  trailingSlash: false,

  // GitHub pages deployment config
  organizationName: 'wenakita',
  projectName: 'sonicreddragon-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Enable mermaid diagrams
  markdown: {
    mermaid: true,
  },

  // Add the theme for mermaid
  themes: ['@docusaurus/theme-mermaid'],

  // Configure client modules for browser execution
  clientModules: [
    require.resolve('./src/clientModules/animeModule.js'),
    require.resolve('./src/clientModules/mermaidFixModule.js'),
    // Removed contextual sidebar to show all sections
    // require.resolve('./src/clientModules/contextualSidebarModule.js'),
  ],

  // Custom sidebar - no scripts needed
  scripts: [],

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
          // Disable table of contents
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
          // Add custom remark plugins for mermaid processing
          // remarkPlugins: [
          //   require('./src/plugins/mermaid-plugin'),
          // ],
        },
        blog: false,
        theme: {
          customCss: [
            './src/css/custom.css',
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Enable dark mode by default
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    
    // Modern navbar configuration
    navbar: {
      title: 'OmniDragon',
      logo: {
        alt: 'OmniDragon Logo',
        src: '/img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'docsSidebar',
          label: 'Documentation',
          className: 'navbar__item--modern',
        },
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'security',
          label: 'Security',
          className: 'navbar__item--modern',
        },
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'contracts',
          label: 'Contracts',
          className: 'navbar__item--modern',
        },
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'integrations',
          label: 'Integrations',
          className: 'navbar__item--modern',
        },
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'reference',
          label: 'Reference',
          className: 'navbar__item--modern',
        },
        {
          type: 'dropdown',
          position: 'right',
          label: 'Resources',
          className: 'navbar__item--modern',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wenakita/sonicreddragon',
              className: 'navbar__item--github',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/w75vaxDXuE',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/sonicreddragon',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/SonicRedDragon',
            },
            {
              label: 'Blog',
              href: 'https://blog.sonicreddragon.io',
            },
          ],
        },
      ],
      style: 'dark',
    },

    // Modern footer configuration
    footer: {
      style: 'dark',
      logo: {
        alt: 'Sonic Red Dragon Logo',
        src: 'img/logo-dark.svg',
        href: 'https://sonicreddragon.io',
      },
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/intro',
              className: 'footer__link--modern',
            },
            {
              label: 'Smart Contracts',
              to: '/smart-contracts/token',
              className: 'footer__link--modern',
            },
            {
              label: 'Randomness',
              to: '/ecosystem/drand-network',
              className: 'footer__link--modern',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/w75vaxDXuE',
              className: 'footer__link--modern footer__link--discord',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/sonicreddragon',
              className: 'footer__link--modern footer__link--twitter',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/SonicRedDragon',
              className: 'footer__link--modern footer__link--telegram',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wenakita/sonicreddragon',
              className: 'footer__link--modern footer__link--github',
            },
            {
              label: 'Blog',
              href: 'https://blog.sonicreddragon.io',
              className: 'footer__link--modern',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sonic Red Dragon. Built with Docusaurus.`,
    },

    // Enhanced code block styling
    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['solidity'],
    },

      // Mermaid diagram configuration
  mermaid: {
    theme: {light: 'neutral', dark: 'dark'},
    options: {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSize: 14,
      securityLevel: 'loose',
      themeVariables: {
        darkMode: true,
        // Dark theme variables with blue-orange accent
        primaryColor: '#2A2A2A',
        primaryTextColor: '#FFFFFF',
        primaryBorderColor: '#3b82f6',
        lineColor: '#3b82f6',
        secondaryColor: '#1A1A1A',
        tertiaryColor: '#0A0A0A',
        background: '#0A0A0A',
        mainBkg: '#2A2A2A',
        secondBkg: '#1A1A1A',
        textColor: '#FFFFFF',
        labelColor: '#FFFFFF',
        errorBkgColor: '#7f1d1d',
        errorTextColor: '#fca5a5',
        nodeTextColor: '#FFFFFF',
        edgeLabelBackground: '#1A1A1A',
        clusterBkg: 'rgba(59, 130, 246, 0.1)',
        clusterBorder: '#3b82f6',
        defaultLinkColor: '#3b82f6',
        // Light theme overrides
        primaryColorLight: '#f8fafc',
        primaryTextColorLight: '#1e293b',
        primaryBorderColorLight: '#2563eb',
        lineColorLight: '#94a3b8',
        secondaryColorLight: '#e2e8f0',
        tertiaryColorLight: '#f8fafc',
      },
    },
  },

    // Modern metadata
    metadata: [
      {name: 'theme-color', content: '#1a1a1a'},
      {name: 'mobile-web-app-capable', content: 'yes'},
      {name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
    ],

    // Enable table of contents
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },

    // Modern announcement bar
    announcementBar: {
      id: 'support_us',
      content: 'Next-Gen DeFi on Sonic • Revolutionary cross-chain lottery mechanics • Join the dragon revolution <a href="https://t.me/SonicRedDragon">Telegram</a>',
      backgroundColor: '#3b82f6',
      textColor: '#fff',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
