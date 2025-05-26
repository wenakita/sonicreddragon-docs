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
      { label: 'Getting Started', href: '/getting-started' },
      { label: 'System Overview', href: '/comprehensive-system' },
      { label: 'Architecture', href: '/architecture' },
    ]
  },
  {
    label: 'Smart Contracts',
    items: [
      { label: 'Overview', href: '/contracts/overview' },
      { label: 'Core Contracts', href: '/contracts/core' },
      { label: 'VRF System', href: '/contracts/vrf' },
      { label: 'Oracles', href: '/contracts/oracles' },
      { label: 'Math Libraries', href: '/contracts/math' },
      { label: 'Governance', href: '/contracts/governance' },
      { label: 'Utilities', href: '/contracts/utils' },
    ]
  },
  {
    label: 'VRF & Randomness',
    items: [
      { label: 'VRF Overview', href: '/vrf/overview' },
      { label: 'Chainlink Integration', href: '/integrations/chainlink' },
      { label: 'Drand Integration', href: '/integrations/drand' },
      { label: 'Cross-Chain VRF', href: '/vrf/cross-chain' },
    ]
  },
  {
    label: 'Security & Audit',
    items: [
      { label: 'Security Overview', href: '/audit/overview' },
      { label: 'Audit Reports', href: '/audit/reports' },
      { label: 'Security Recommendations', href: '/audit/security-audit-recommendations' },
      { label: 'DragonMath Fixes', href: '/audit/dragonmath-security-fixes' },
    ]
  },
  {
    label: 'Integrations',
    items: [
      { label: 'LayerZero', href: '/integrations/layerzero' },
      { label: 'Chainlink', href: '/integrations/chainlink' },
      { label: 'Drand Network', href: '/integrations/drand' },
      { label: 'Partners', href: '/integrations/partners' },
    ]
  },
  {
    label: 'Developer Guides',
    items: [
      { label: 'Development Setup', href: '/guides/development' },
      { label: 'Testing Framework', href: '/guides/testing' },
      { label: 'Deployment Guide', href: '/guides/deployment' },
      { label: 'Integration Examples', href: '/guides/examples' },
    ]
  },
  {
    label: 'Reference',
    items: [
      { label: 'API Reference', href: '/reference/api' },
      { label: 'Contract Addresses', href: '/reference/addresses' },
      { label: 'ABIs', href: '/reference/abis' },
      { label: 'Updates & Changes', href: '/updates' },
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