import React from 'react';
import type { ReactElement } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface NavSection {
  title: string;
  description: string;
  icon: string;
  items: NavItem[];
  color: string;
}

interface NavItem {
  title: string;
  description: string;
  link: string;
  badge?: string;
}

const navigationSections: NavSection[] = [
  {
    title: 'Concepts',
    description: 'Understand the fundamentals',
    icon: '🧠',
    color: 'var(--omni-cloud-burst)',
    items: [
      {
        title: 'Protocol Overview',
        description: 'High-level introduction to OmniDragon',
        link: '/concepts/overview'
      },
      {
        title: 'Architecture',
        description: 'System design and components',
        link: '/concepts/architecture'
      },
      {
        title: 'Tokenomics',
        description: 'Token economics and fee structure',
        link: '/concepts/tokenomics'
      },
      {
        title: 'Jackpot System',
        description: 'Automatic jackpot mechanics',
        link: '/concepts/jackpot-system',
        badge: 'Popular'
      }
    ]
  },
  {
    title: 'Guides',
    description: 'Step-by-step tutorials',
    icon: '📚',
    color: 'var(--omni-raw-sienna)',
    items: [
      {
        title: 'Quick Start',
        description: 'Get started in 5 minutes',
        link: '/guides/getting-started/quick-start',
        badge: 'Start Here'
      },
      {
        title: 'Developer Setup',
        description: 'Development environment setup',
        link: '/guides/getting-started/developer-setup'
      },
      {
        title: 'User Guides',
        description: 'How to use OmniDragon features',
        link: '/guides/user-guides/buying-tokens'
      },
      {
        title: 'Integration Guide',
        description: 'Integrate with your application',
        link: '/guides/developer-guides/integration-guide'
      }
    ]
  },
  {
    title: 'Build',
    description: 'Developer resources',
    icon: '🔧',
    color: 'var(--omni-janna)',
    items: [
      {
        title: 'Smart Contracts',
        description: 'Core and periphery contracts',
        link: '/build/smart-contracts/core/token'
      },
      {
        title: 'SDK',
        description: 'JavaScript/TypeScript SDK',
        link: '/build/sdk/overview',
        badge: 'New'
      },
      {
        title: 'Tools',
        description: 'Development and deployment tools',
        link: '/build/tools/deployment'
      },
      {
        title: 'Examples',
        description: 'Code examples and snippets',
        link: '/build/sdk/examples'
      }
    ]
  },
  {
    title: 'Reference',
    description: 'Technical specifications',
    icon: '📖',
    color: '#7A9B7A',
    items: [
      {
        title: 'Contract Addresses',
        description: 'Deployed contract addresses',
        link: '/reference/contracts/addresses'
      },
      {
        title: 'API Reference',
        description: 'Complete API documentation',
        link: '/reference/api/rest-api'
      },
      {
        title: 'Network Details',
        description: 'Multi-chain deployment info',
        link: '/reference/networks/ethereum'
      },
      {
        title: 'ABIs & Events',
        description: 'Contract interfaces and events',
        link: '/reference/contracts/abis'
      }
    ]
  },
  {
    title: 'Partner',
    description: 'Integration & partnerships',
    icon: '🤝',
    color: '#B85A5A',
    items: [
      {
        title: 'Partner Onboarding',
        description: 'Get started as a partner',
        link: '/partner/onboarding/overview'
      },
      {
        title: 'Integration Types',
        description: 'DEX, wallet, and dApp integrations',
        link: '/partner/integrations/dex-aggregators'
      },
      {
        title: 'Case Studies',
        description: 'Real-world integration examples',
        link: '/partner/case-studies/layerzero'
      },
      {
        title: 'Support',
        description: 'Partner support resources',
        link: '/partner/onboarding/support'
      }
    ]
  },
  {
    title: 'Resources',
    description: 'Additional materials',
    icon: '📋',
    color: 'var(--omni-primary-dark)',
    items: [
      {
        title: 'Security Audits',
        description: 'Security reports and audits',
        link: '/resources/security/audits'
      },
      {
        title: 'Community',
        description: 'Forums and governance',
        link: '/resources/community/governance'
      },
      {
        title: 'Bug Bounty',
        description: 'Security bug bounty program',
        link: '/resources/security/bug-bounty'
      },
      {
        title: 'Legal',
        description: 'Terms, privacy, and compliance',
        link: '/resources/legal/terms'
      }
    ]
  }
];

export default function BalancerStyleNav(): ReactElement {
  return (
    <div className={styles.navigationContainer}>
      <div className={styles.header}>
        <h2>Explore OmniDragon Documentation</h2>
        <p>Choose your path based on your role and goals</p>
      </div>
      
      <div className={styles.sectionsGrid}>
        {navigationSections.map((section, index) => (
          <div 
            key={section.title} 
            className={styles.section}
            style={{ '--section-color': section.color } as React.CSSProperties}
          >
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>{section.icon}</span>
              <div>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <p className={styles.sectionDescription}>{section.description}</p>
              </div>
            </div>
            
            <div className={styles.sectionItems}>
              {section.items.map((item) => (
                <Link
                  key={item.title}
                  to={item.link}
                  className={styles.navItem}
                >
                  <div className={styles.navItemContent}>
                    <div className={styles.navItemHeader}>
                      <span className={styles.navItemTitle}>{item.title}</span>
                      {item.badge && (
                        <span className={styles.badge}>{item.badge}</span>
                      )}
                    </div>
                    <p className={styles.navItemDescription}>{item.description}</p>
                  </div>
                  <span className={styles.navItemArrow}>→</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.quickLinks}>
        <h3>Quick Links</h3>
        <div className={styles.quickLinksGrid}>
          <Link to="/guides/getting-started/quick-start" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}>🚀</span>
            <span>Quick Start</span>
          </Link>
          <Link to="/build/sdk/examples" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}>💻</span>
            <span>Code Examples</span>
          </Link>
          <Link to="/reference/contracts/addresses" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}>📍</span>
            <span>Contract Addresses</span>
          </Link>
          <Link to="/partner/onboarding/overview" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}>🤝</span>
            <span>Partner Program</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 