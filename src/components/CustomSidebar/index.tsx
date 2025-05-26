import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import './styles.css';

interface SidebarItem {
  label: string;
  href?: string;
  items?: SidebarItem[];
  collapsed?: boolean;
}

const sidebarData: SidebarItem[] = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/intro' },
      { label: 'Quick Start', href: '/getting-started' },
      { label: 'System Architecture', href: '/comprehensive-system' },
      { label: 'Technical Overview', href: '/architecture' },
    ]
  },
  {
    label: 'Core Contracts',
    items: [
      { label: 'OmniDragon Token', href: '/contracts/core/omnidragon' },
      { label: 'Randomness Provider', href: '/contracts/core/randomness-provider' },
      { label: 'Lottery Manager', href: '/contracts/core/lottery-manager' },
      { label: 'Deployer', href: '/contracts/core/deployer' },
      { label: 'Periphery', href: '/contracts/core/periphery' },
    ]
  },
  {
    label: 'VRF System',
    items: [
      { label: 'VRF Overview', href: '/contracts/randomness/overview' },
      { label: 'Chainlink VRF', href: '/contracts/randomness/chainlink' },
      { label: 'Drand Integration', href: '/contracts/randomness/drand' },
      { label: 'VRF Interfaces', href: '/contracts/randomness/interfaces' },
      { label: 'VRF Utils', href: '/contracts/randomness/utils' },
    ]
  },
  {
    label: 'Math & Libraries',
    items: [
      { label: 'DragonMath', href: '/contracts/math/dragon-math' },
      { label: 'Dragon Libraries', href: '/contracts/libraries/dragon' },
      { label: 'Access Control', href: '/contracts/libraries/access' },
      { label: 'Security', href: '/contracts/libraries/security' },
      { label: 'Utilities', href: '/contracts/libraries/utils' },
    ]
  },
  {
    label: 'Governance',
    items: [
      { label: 'Fee Management', href: '/contracts/governance/fees' },
      { label: 'Partner System', href: '/contracts/governance/partners' },
      { label: 'Voting Mechanisms', href: '/contracts/governance/voting' },
      { label: 'Governance Interfaces', href: '/contracts/governance/interfaces' },
    ]
  },
  {
    label: 'Vault System',
    items: [
      { label: 'Jackpot Vault', href: '/contracts/vault/jackpot-vault' },
      { label: 'Vault Interfaces', href: '/contracts/vault/interfaces' },
      { label: 'Vault Management', href: '/contracts/vault/management' },
    ]
  },
  {
    label: 'Oracles & Pricing',
    items: [
      { label: 'Price Oracle', href: '/contracts/oracles/price-oracle' },
      { label: 'Oracle Interfaces', href: '/contracts/oracles/interfaces' },
      { label: 'Oracle Utils', href: '/contracts/oracles/utils' },
    ]
  },
  {
    label: 'Interfaces',
    items: [
      { label: 'Core Interfaces', href: '/contracts/interfaces/core' },
      { label: 'External Interfaces', href: '/contracts/interfaces/external' },
      { label: 'Token Interfaces', href: '/contracts/interfaces/tokens' },
      { label: 'Misc Interfaces', href: '/contracts/interfaces/misc' },
    ]
  },
  {
    label: 'Security & Audit',
    items: [
      { label: 'Audit Summary', href: '/audit/AUDIT_DOCUMENTATION_SUMMARY' },
      { label: 'Security Recommendations', href: '/audit/security-audit-recommendations' },
      { label: 'DragonMath Fixes', href: '/audit/dragonmath-security-fixes' },
      { label: 'Critical Fixes V2', href: '/audit/dragonmath-critical-fixes-v2' },
      { label: 'Vulnerability Analysis', href: '/052525updates/moreupdates/RANDOMNESS_VULNERABILITY_ANALYSIS' },
      { label: 'Security Improvements', href: '/052525updates/moreupdates/SECURITY_IMPROVEMENTS_IMPLEMENTED' },
      { label: 'Lessons Learned', href: '/052525updates/moreupdates/VULNERABILITY_LESSONS_LEARNED' },
    ]
  },
  {
    label: 'Latest Updates',
    items: [
      { label: 'Critical Fixes Summary', href: '/052525updates/moreupdates/CRITICAL_FIXES_COMPLETED_SUMMARY' },
      { label: 'Implementation Details', href: '/052525updates/moreupdates/CRITICAL_FIXES_IMPLEMENTATION' },
      { label: 'Audit Response', href: '/052525updates/moreupdates/AUDIT_FINDINGS_RESPONSE' },
      { label: 'Chain Configuration', href: '/052525updates/moreupdates/CHAIN_CONFIG' },
      { label: 'Project Updates', href: '/052525updates/summary/PROJECT_UPDATES_SUMMARY' },
      { label: 'Quick Reference', href: '/052525updates/summary/QUICK_REFERENCE_UPDATES' },
    ]
  },
  {
    label: 'Cross-Chain',
    items: [
      { label: 'LayerZero Integration', href: '/integrations/layerzero' },
      { label: 'Cross-Chain VRF', href: '/integrations/cross-chain-vrf' },
      { label: 'Chain Registry', href: '/integrations/chain-registry' },
      { label: 'Bridge Security', href: '/integrations/bridge-security' },
    ]
  },
  {
    label: 'Developer Guides',
    items: [
      { label: 'Development Setup', href: '/guides/development' },
      { label: 'Testing Framework', href: '/guides/testing' },
      { label: 'Deployment Guide', href: '/guides/deployment' },
      { label: 'Integration Examples', href: '/guides/examples' },
      { label: 'Contract Examples', href: '/guides/contract-examples' },
    ]
  },
  {
    label: 'Reference',
    items: [
      { label: 'API Reference', href: '/reference/api' },
      { label: 'Contract Addresses', href: '/reference/addresses' },
      { label: 'ABIs', href: '/reference/abis' },
      { label: 'SDK Documentation', href: '/reference/sdk' },
      { label: 'Technical Architecture', href: '/technical-architecture/overview' },
    ]
  }
];

const CustomSidebar: React.FC = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Auto-expand the section containing the current page
    const currentPath = location.pathname;
    sidebarData.forEach((section, index) => {
      if (section.items?.some(item => item.href === currentPath)) {
        setExpandedItems(prev => new Set([...prev, section.label]));
      }
    });
  }, [location.pathname]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.label);
    const hasChildren = item.items && item.items.length > 0;

    return (
      <div key={item.label} className={`sidebar-item level-${level}`}>
        {item.href ? (
          <Link
            to={item.href}
            className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ) : (
          <div
            className={`sidebar-category ${hasChildren ? 'expandable' : ''}`}
            onClick={() => hasChildren && toggleExpanded(item.label)}
          >
            <span className="category-label">{item.label}</span>
            {hasChildren && (
              <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                ▶
              </span>
            )}
          </div>
        )}
        
        {hasChildren && isExpanded && (
          <div className="sidebar-children">
            {item.items!.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="custom-sidebar">
      <div className="sidebar-content">
        {sidebarData.map(item => renderSidebarItem(item))}
      </div>
    </div>
  );
};

export default CustomSidebar; 