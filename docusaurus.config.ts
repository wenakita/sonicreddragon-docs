import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Sonic Red Dragon',
  tagline: 'LayerZero V2 Compatible Token',
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
  // clientModules: [
  //   // require.resolve('./src/clientModules/mermaidInit.js'),
  //   require.resolve('./src/clientModules/animeModule.js'),
  // ],

  // Optimized sidebar fix - loads immediately
  scripts: [
    {
      src: '/js/optimized-sidebar-fix.js',
      async: false,
      defer: false,
    },
  ],

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
      title: 'Sonic Red Dragon',
      logo: {
        alt: 'Sonic Red Dragon Logo',
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
    // mermaid: {
    //   theme: {light: 'default', dark: 'dark'},
    //   options: {
    //     fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    //     fontSize: 16,
    //     themeVariables: {
    //       darkMode: true,
    //       primaryColor: '#4a80d1',
    //       primaryTextColor: '#f5f6fa',
    //       primaryBorderColor: '#666',
    //       lineColor: '#999',
    //       secondaryColor: '#cc5a2b',
    //       tertiaryColor: '#1e293b',
    //     },
    //   },
    // },

    // Modern metadata
    metadata: [
      {name: 'theme-color', content: '#1a1a1a'},
      {name: 'apple-mobile-web-app-capable', content: 'yes'},
      {name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
    ],

    // Compact table of contents
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },

    // Modern announcement bar
    announcementBar: {
      id: 'support_us',
      content: '🚀 Sonic Red Dragon will relaunch soon! Join our <a href="https://t.me/SonicRedDragon">Telegram</a> for updates.',
      backgroundColor: '#1e3c72',
      textColor: '#fff',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
