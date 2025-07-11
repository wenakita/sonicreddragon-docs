/**
 * AnimatedButton Component
 * 
 * A button component with animation effects.
 */

import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../utils/accessibilityUtils';
import anime from 'animejs';
import styles from './AnimatedButton.module.css';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'small' | 'medium' | 'large';
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scale' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  icon?: boolean;
  ripple?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  animation = 'fadeIn',
  delay = 0,
  duration = 600,
  className = '',
  disabled = false,
  ariaLabel,
  type = 'button',
  fullWidth = false,
  icon = false,
  ripple = true,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hasAnimated = useRef<boolean>(false);
  
  // Apply entrance animation
  useEffect(() => {
    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion()) return;
    
    // Skip if already animated
    if (hasAnimated.current) return;
    
    const button = buttonRef.current;
    if (!button) return;
    
    // Set has animated flag
    hasAnimated.current = true;
    
    // Skip if animation is none
    if (animation === 'none') return;
    
    // Set initial opacity
    button.style.opacity = '0';
    
    // Create animation based on type
    let animationProps: any = {};
    
    switch (animation) {
      case 'fadeIn':
        animationProps = {
          opacity: [0, 1],
        };
        break;
      case 'fadeInUp':
        animationProps = {
          opacity: [0, 1],
          translateY: [20, 0],
        };
        break;
      case 'fadeInDown':
        animationProps = {
          opacity: [0, 1],
          translateY: [-20, 0],
        };
        break;
      case 'fadeInLeft':
        animationProps = {
          opacity: [0, 1],
          translateX: [-20, 0],
        };
        break;
      case 'fadeInRight':
        animationProps = {
          opacity: [0, 1],
          translateX: [20, 0],
        };
        break;
      case 'scale':
        animationProps = {
          opacity: [0, 1],
          scale: [0.9, 1],
        };
        break;
      default:
        animationProps = {
          opacity: [0, 1],
        };
    }
    
    // Create animation
    anime({
      targets: button,
      ...animationProps,
      duration,
      delay,
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  }, [animation, delay, duration]);
  
  // Handle ripple effect
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Skip if ripple is disabled or user prefers reduced motion
    if (!ripple || prefersReducedMotion() || disabled) return;
    
    const button = buttonRef.current;
    if (!button) return;
    
    // Create ripple element
    const rippleElement = document.createElement('span');
    rippleElement.className = styles.ripple;
    
    // Get button dimensions and position
    const rect = button.getBoundingClientRect();
    
    // Calculate ripple size (should be at least as large as the button)
    const size = Math.max(rect.width, rect.height) * 2;
    
    // Set ripple size
    rippleElement.style.width = `${size}px`;
    rippleElement.style.height = `${size}px`;
    
    // Calculate ripple position
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    // Set ripple position
    rippleElement.style.left = `${x}px`;
    rippleElement.style.top = `${y}px`;
    
    // Add ripple to button
    button.appendChild(rippleElement);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (rippleElement.parentNode === button) {
        button.removeChild(rippleElement);
      }
    }, 600);
  };
  
  // Handle click with ripple
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add ripple effect
    handleRipple(e);
    
    // Call onClick handler
    if (onClick && !disabled) {
      onClick();
    }
  };
  
  // Combine classes
  const buttonClassName = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${fullWidth ? styles.fullWidth : ''}
    ${icon ? styles.icon : ''}
    ${disabled ? styles.disabled : ''}
    ${className}
  `;
  
  return (
    <button
      ref={buttonRef}
      className={buttonClassName}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type={type}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
