import React, { useRef, useEffect, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import useIsBrowser from '@docusaurus/useIsBrowser';
import clsx from 'clsx';

interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rippleEffect?: boolean;
  glowEffect?: boolean;
  className?: string;
}

export default function AnimatedButton({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  href,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  rippleEffect = true,
  glowEffect = false,
  className
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const isBrowser = useIsBrowser();
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (!isBrowser || !buttonRef.current) return;

    const button = buttonRef.current;

    // Entrance animation
    anime({
      targets: button,
      scale: [0.95, 1],
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutBack'
    });

    // Hover animations
    const handleMouseEnter = () => {
      if (disabled || loading) return;
      
      anime({
        targets: button,
        scale: 1.05,
        duration: 200,
        easing: 'easeOutCubic'
      });

      if (glowEffect) {
        anime({
          targets: button,
          boxShadow: [
            '0 4px 15px rgba(59, 130, 246, 0.2)',
            '0 8px 25px rgba(59, 130, 246, 0.4)'
          ],
          duration: 200,
          easing: 'easeOutCubic'
        });
      }
    };

    const handleMouseLeave = () => {
      if (disabled || loading) return;
      
      anime({
        targets: button,
        scale: 1,
        duration: 200,
        easing: 'easeOutCubic'
      });

      if (glowEffect) {
        anime({
          targets: button,
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
          duration: 200,
          easing: 'easeOutCubic'
        });
      }
    };

    const handleMouseDown = () => {
      if (disabled || loading) return;
      
      setIsPressed(true);
      anime({
        targets: button,
        scale: 0.98,
        duration: 100,
        easing: 'easeOutCubic'
      });
    };

    const handleMouseUp = () => {
      if (disabled || loading) return;
      
      setIsPressed(false);
      anime({
        targets: button,
        scale: 1.05,
        duration: 100,
        easing: 'easeOutCubic'
      });
    };

    const handleClick = (e: MouseEvent) => {
      if (disabled || loading) return;

      // Ripple effect
      if (rippleEffect && rippleRef.current) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = rippleRef.current;
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        anime({
          targets: ripple,
          scale: [0, 4],
          opacity: [0.6, 0],
          duration: 600,
          easing: 'easeOutExpo'
        });
      }

      // Success animation
      anime({
        targets: button,
        scale: [1.05, 1.1, 1.05],
        duration: 300,
        easing: 'easeInOutBack'
      });

      if (onClick) onClick();
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);
    button.addEventListener('click', handleClick);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
      button.removeEventListener('click', handleClick);
    };
  }, [isBrowser, disabled, loading, onClick, rippleEffect, glowEffect]);

  const buttonClasses = clsx(
    'animated-button',
    `animated-button--${variant}`,
    `animated-button--${size}`,
    {
      'animated-button--disabled': disabled,
      'animated-button--loading': loading,
      'animated-button--pressed': isPressed,
      'animated-button--glow': glowEffect
    },
    className
  );

  const buttonStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    textDecoration: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    overflow: 'hidden',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    // Size variants
    ...(size === 'small' && {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      minHeight: '36px'
    }),
    ...(size === 'medium' && {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      minHeight: '44px'
    }),
    ...(size === 'large' && {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      minHeight: '52px'
    }),
    // Variant styles
    ...(variant === 'primary' && {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)'
    }),
    ...(variant === 'secondary' && {
      background: 'var(--ifm-color-emphasis-200)',
      color: 'var(--ifm-color-emphasis-800)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }),
    ...(variant === 'accent' && {
      background: 'linear-gradient(135deg, #ea580c, #dc2626)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(234, 88, 12, 0.2)'
    }),
    ...(variant === 'ghost' && {
      background: 'transparent',
      color: 'var(--ifm-color-primary)',
      border: '2px solid var(--ifm-color-primary)'
    }),
    ...(variant === 'gradient' && {
      background: 'linear-gradient(135deg, #ea580c, #3b82f6)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
    }),
    // Disabled state
    ...(disabled && {
      opacity: 0.6,
      transform: 'none !important'
    })
  };

  const ButtonComponent = href ? 'a' : 'button';
  const buttonProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { type: 'button' as const };

  return (
    <ButtonComponent
      ref={buttonRef as any}
      className={buttonClasses}
      style={buttonStyle}
      disabled={disabled || loading}
      {...buttonProps}
    >
      {rippleEffect && (
        <div
          ref={rippleRef}
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.6)',
            transform: 'scale(0)',
            pointerEvents: 'none'
          }}
        />
      )}
      
      {loading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && icon}
      
      <span style={{ opacity: loading ? 0.7 : 1 }}>
        {children}
      </span>
      
      {!loading && icon && iconPosition === 'right' && icon}
    </ButtonComponent>
  );
} 