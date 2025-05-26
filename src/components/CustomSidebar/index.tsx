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
    label: 'Getting Started with OmniDragon',
    items: [
      { label: 'System Overview', href: '/comprehensive-system' },
      { label: 'OmniDragon Ecosystem', href: '/ecosystem' },
      { label: 'Overview', href: '/overview' },
      { label: 'Architecture', href: '/architecture' },
      { label: 'Cross-Chain Architecture', href: '/cross-chain-architecture' },
      { label: 'Randomness System', href: '/randomness-system' },
      { label: 'Security Architecture', href: '/security-architecture' },
    ]
  },
  {
    label: 'Security & Audit',
    items: [
      { label: 'OmniDragon VRF System - Audit', href: '/audit/omnidragon-vrf-audit' },
      { label: 'OmniDragon VRF System Technical', href: '/audit/omnidragon-vrf-technical' },
      { label: 'OmniDragon VRF System Threat', href: '/audit/omnidragon-vrf-threat' },
      { label: 'Security Audit Recommendations', href: '/audit/security-audit-recommendations' },
      { label: 'DragonMath Library Security Fixes', href: '/audit/dragonmath-security-fixes' },
      { label: 'DragonMath Critical Fixes V2', href: '/audit/dragonmath-critical-fixes-v2' },
    ]
  },
  {
    label: 'Smart Contracts',
    items: [
      { label: 'Deployment & Operations', href: '/deployment' },
      { label: 'Integrations', href: '/integrations' },
    ]
  },
  {
    label: 'User Guides',
    items: [
      { label: 'Technical Architecture', href: '/technical-architecture' },
    ]
  },
  {
    label: 'Reference',
    items: [
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