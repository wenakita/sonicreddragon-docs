import React from 'react';
import ScrollRevealWrapper from './ScrollRevealWrapper';

interface ModernPageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  gradient?: boolean;
}

export default function ModernPageHeader({
  title,
  subtitle,
  description,
  badge,
  gradient = true
}: ModernPageHeaderProps) {
  return (
    <div className="modern-page-header">
      <ScrollRevealWrapper animation="fadeInUp" duration={600} delay={100}>
        {badge && (
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>{badge}</span>
          </div>
        )}
        
        <h1 className={gradient ? "gradient-text-modern" : ""}>
          {title}
        </h1>
        
        {subtitle && (
          <p className="modern-subtitle">
            {subtitle}
          </p>
        )}
        
        {description && (
          <p className="modern-description">
            {description}
          </p>
        )}
      </ScrollRevealWrapper>
    </div>
  );
} 