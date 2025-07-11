import React, { useRef, useEffect } from 'react';
import { anime, useAnimationPerformance } from '../utils/animationUtils';
import useIsBrowser from '@docusaurus/useIsBrowser';
import clsx from 'clsx';

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  variant?: 'default' | 'featured' | 'coming-soon';
  className?: string;
}

export default function NavigationCard({
  title,
  description,
  href,
  icon,
  badge,
  variant = 'default',
  className
}: NavigationCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (!isBrowser || !cardRef.current) return;

    const card = cardRef.current;
    const iconElement = iconRef.current;
    const content = contentRef.current;

    // Initial entrance animation
    anime({
      targets: card,
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.95, 1],
      duration: 600,
      easing: 'easeOutExpo',
      delay: anime.random(0, 300)
    });

    // Stagger content animation
    if (content) {
      const elements = content.querySelectorAll('h3, p, .badge');
      anime({
        targets: elements,
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 400,
        delay: anime.stagger(100, { start: 200 }),
        easing: 'easeOutCubic'
      });
    }

    // Hover animations
    const handleMouseEnter = () => {
      anime({
        targets: card,
        scale: 1.03,
        duration: 300,
        easing: 'easeOutCubic'
      });

      if (iconElement) {
        anime({
          targets: iconElement,
          scale: 1.1,
          rotate: '5deg',
          duration: 300,
          easing: 'easeOutBack'
        });
      }

      // Animate content elements
      if (content) {
        const title = content.querySelector('h3');
        const desc = content.querySelector('p');
        
        if (title) {
          anime({
            targets: title,
            color: 'var(--ifm-color-primary)',
            duration: 200,
            easing: 'easeOutCubic'
          });
        }
        
        if (desc) {
          anime({
            targets: desc,
            translateX: [0, 5],
            duration: 200,
            easing: 'easeOutCubic'
          });
        }
      }
    };

    const handleMouseLeave = () => {
      anime({
        targets: card,
        scale: 1,
        duration: 300,
        easing: 'easeOutCubic'
      });

      if (iconElement) {
        anime({
          targets: iconElement,
          scale: 1,
          rotate: '0deg',
          duration: 300,
          easing: 'easeOutCubic'
        });
      }

      // Reset content elements
      if (content) {
        const title = content.querySelector('h3');
        const desc = content.querySelector('p');
        
        if (title) {
          anime({
            targets: title,
            color: 'var(--ifm-heading-color)',
            duration: 200,
            easing: 'easeOutCubic'
          });
        }
        
        if (desc) {
          anime({
            targets: desc,
            translateX: 0,
            duration: 200,
            easing: 'easeOutCubic'
          });
        }
      }
    };

    const handleClick = () => {
      // Success animation before navigation
      anime({
        targets: card,
        scale: [1.03, 1.06, 1.03],
        duration: 200,
        easing: 'easeInOutBack'
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('click', handleClick);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('click', handleClick);
    };
  }, [isBrowser]);

  const cardClasses = clsx(
    'navigation-card',
    `navigation-card--${variant}`,
    className
  );

  const cardStyle: React.CSSProperties = {
    display: 'block',
    padding: '1.5rem',
    borderRadius: '12px',
    background: 'var(--ifm-card-background-color)',
    border: '1px solid var(--ifm-toc-border-color)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    ...(variant === 'featured' && {
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.05) 100%)',
      borderColor: 'rgba(59, 130, 246, 0.2)',
      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.1)'
    }),
    ...(variant === 'coming-soon' && {
      opacity: 0.7,
      cursor: 'not-allowed',
      background: 'var(--ifm-color-emphasis-100)'
    })
  };

  const iconStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    background: variant === 'featured' 
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 197, 253, 0.1))'
      : 'var(--ifm-color-emphasis-100)',
    color: variant === 'featured' ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-700)',
    willChange: 'transform'
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    background: variant === 'featured' 
      ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
      : 'var(--ifm-color-emphasis-200)',
    color: variant === 'featured' ? 'white' : 'var(--ifm-color-emphasis-700)'
  };

  return (
    <a
      ref={cardRef}
      href={variant === 'coming-soon' ? undefined : href}
      className={cardClasses}
      style={cardStyle}
      onClick={variant === 'coming-soon' ? (e) => e.preventDefault() : undefined}
    >
      {badge && (
        <div className="badge" style={badgeStyle}>
          {badge}
        </div>
      )}
      
      {icon && (
        <div ref={iconRef} style={iconStyle}>
          {icon}
        </div>
      )}
      
      <div ref={contentRef}>
        <h3 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '1.25rem', 
          fontWeight: 600,
          transition: 'color 0.2s ease'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          margin: 0, 
          opacity: 0.8, 
          lineHeight: 1.5,
          transition: 'transform 0.2s ease'
        }}>
          {description}
        </p>
      </div>
      
      {variant === 'coming-soon' && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          fontSize: '0.875rem',
          color: 'var(--ifm-color-emphasis-600)',
          fontStyle: 'italic'
        }}>
          Coming Soon
        </div>
      )}
    </a>
  );
} 