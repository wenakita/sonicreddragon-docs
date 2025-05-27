import React from 'react';
import ScrollRevealWrapper from './ScrollRevealWrapper';

interface ModernCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  link?: string;
  linkText?: string;
  delay?: number;
}

export default function ModernCard({
  title,
  description,
  icon,
  link,
  linkText = "Learn More",
  delay = 0
}: ModernCardProps) {
  const CardContent = (
    <>
      {icon && (
        <div className="feature-icon">
          {icon}
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      {link && (
        <a href={link} className="modern-card-link">
          {linkText} →
        </a>
      )}
    </>
  );

  return (
    <ScrollRevealWrapper animation="fadeInUp" duration={800} delay={delay}>
      <div className="feature-card-modern">
        {CardContent}
      </div>
    </ScrollRevealWrapper>
  );
} 