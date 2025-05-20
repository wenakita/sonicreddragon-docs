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
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'concepts',
          label: 'Concepts',
          className: 'navbar__item--modern',
        },
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'guides',
          label: 'Guides',
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
              href: 'https://github.com/wenakita/omnidragon',
              className: 'navbar__item--github',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/sonicreddragon',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/sonicreddragon',
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
              href: 'https://discord.gg/sonicreddragon',
              className: 'footer__link--modern footer__link--discord',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/sonicreddragon',
              className: 'footer__link--modern footer__link--twitter',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wenakita/omnidragon',
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
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: {start: 'highlight-start', end: 'highlight-end'},
        },
      ],
    },

    // Mermaid diagram configuration
    mermaid: {
      theme: {light: 'neutral', dark: 'forest'},
      options: {
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize: 16,
        flowchart: {
          curve: 'basis',
          nodeSpacing: 50,
          rankSpacing: 50,
        },
      },
    },

    // Modern metadata
    metadata: [
      {name: 'theme-color', content: '#1a1a1a'},
      {name: 'apple-mobile-web-app-capable', content: 'yes'},
      {name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
    ],

    // Enhanced table of contents
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },

    // Modern announcement bar
    announcementBar: {
      id: 'support_us',
      content: '🚀 Sonic Red Dragon is now live on mainnet! Join our <a href="https://discord.gg/sonicreddragon">Discord</a> for updates.',
      backgroundColor: '#2e8555',
      textColor: '#ffffff',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,

  // Add modern plugins
  themes: [
    '@docusaurus/theme-mermaid',
  ],

  // Remove the API plugin configuration since we're not using it yet
  // plugins: [
  //   [
  //     '@docusaurus/plugin-content-docs',
  //     {
  //       id: 'api',
  //       path: 'api',
  //       routeBasePath: 'api',
  //       sidebarPath: require.resolve('./sidebarsApi.js'),
  //     },
  //   ],
  // ],
};

export default config;
