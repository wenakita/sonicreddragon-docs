import React, { useRef, useEffect, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import useIsBrowser from '@docusaurus/useIsBrowser';
import clsx from 'clsx';
import styles from './InteractiveCard.module.css';

interface InteractiveCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'glass';
  size?: 'small' | 'medium' | 'large';
  withGlow?: boolean;
  withParallax?: boolean;
  onClick?: () => void;
  href?: string;
}

export default function InteractiveCard({
  title,
  subtitle,
  children,
  className,
  variant = 'default',
  size = 'medium',
  withGlow = false,
  withParallax = false,
  onClick,
  href
}: InteractiveCardProps) {
  const [cardElement, setCardElement] = useState<HTMLElement | null>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isBrowser = useIsBrowser();
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = (element: HTMLElement | null) => {
    setCardElement(element);
  };

  useEffect(() => {
    if (!isBrowser || !cardElement) return;

    const card = cardElement;
    const glow = glowRef.current;
    const content = contentRef.current;

    // Initial entrance animation
    anime({
      targets: card,
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.95, 1],
      duration: 800,
      easing: 'easeOutExpo',
      delay: anime.random(0, 200)
    });

    // Hover animations
    const handleMouseEnter = (e: MouseEvent) => {
      setIsHovered(true);
      
      anime({
        targets: card,
        scale: 1.02,
        rotateX: withParallax ? 5 : 0,
        rotateY: withParallax ? 5 : 0,
        duration: 300,
        easing: 'easeOutCubic'
      });

      if (withGlow && glow) {
        anime({
          targets: glow,
          opacity: [0, 0.6],
          scale: [0.8, 1.2],
          duration: 300,
          easing: 'easeOutCubic'
        });
      }

      if (content) {
        anime({
          targets: content.children,
          translateY: [-2, 0],
          opacity: [0.9, 1],
          duration: 200,
          delay: anime.stagger(50),
          easing: 'easeOutQuad'
        });
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      
      anime({
        targets: card,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 300,
        easing: 'easeOutCubic'
      });

      if (withGlow && glow) {
        anime({
          targets: glow,
          opacity: 0,
          scale: 0.8,
          duration: 300,
          easing: 'easeOutCubic'
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!withParallax) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      anime({
        targets: card,
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 100,
        easing: 'easeOutQuad'
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    if (withParallax) {
      card.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (withParallax) {
        card.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isBrowser, withGlow, withParallax, cardElement]);

  const cardClasses = clsx(
    styles.interactiveCard,
    styles[`interactiveCard${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`interactiveCard${size.charAt(0).toUpperCase() + size.slice(1)}`],
    {
      [styles.interactiveCardClickable]: onClick || href,
      [styles.interactiveCardGlass]: variant === 'glass',
      [styles.interactiveCardHovered]: isHovered
    },
    className
  );

  const CardComponent = href ? 'a' : 'div';
  const cardProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <CardComponent
      ref={cardRef}
      className={cardClasses}
      onClick={onClick}
      {...cardProps}
      style={{
        perspective: withParallax ? '1000px' : 'none',
        transformStyle: withParallax ? 'preserve-3d' : 'flat'
      }}
    >
      {withGlow && (
        <div
          ref={glowRef}
          className="interactive-card__glow"
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: -1
          }}
        />
      )}
      
      <div ref={contentRef} className={styles.interactiveCard__content}>
        {title && (
          <h3 className={styles.interactiveCard__title}>{title}</h3>
        )}
        {subtitle && (
          <p className={styles.interactiveCard__subtitle}>{subtitle}</p>
        )}
        <div className={styles.interactiveCard__body}>
          {children}
        </div>
      </div>
    </CardComponent>
  );
} 