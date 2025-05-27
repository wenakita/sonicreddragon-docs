import React from 'react';

export interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Icon definitions
const iconPaths = {
  // Zoom and control icons
  zoomIn: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7",
  zoomOut: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6",
  reset: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  play: "M8 5v14l11-7z",
  
  // Navigation icons
  arrowRight: "M7.5 15L12.5 10L7.5 5",
  arrowLeft: "M16.5 15L11.5 10L16.5 5",
  arrowUp: "M15 7.5L10 2.5L5 7.5",
  arrowDown: "M15 16.5L10 21.5L5 16.5",
  
  // Feature icons
  layers: "M12 2L2 7L12 12L22 7L12 2Z M2 17L12 22L22 17 M2 12L12 17L22 12",
  gift: "M20 12V22H4V12 M22 7H2V12H22V7Z M12 22V7",
  diamond: "M12 2L2 12L12 22L22 12L12 2Z M12 22V12",
  
  // Social icons
  github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  twitter: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
  discord: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z",
  
  // Utility icons
  external: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3",
  copy: "M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0V2a2 2 0 00-2-2H8a2 2 0 00-2 2v2m8 0H8",
  check: "M20 6L9 17l-5-5",
  close: "M18 6L6 18 M6 6l12 12",
  
  // Status icons
  info: "M12 16v-4 M12 8h.01",
  warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  error: "M12 9v4 M12 17h.01 M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
  success: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3"
};

export default function Icon({ 
  name, 
  size = 24, 
  color = 'currentColor', 
  className = '', 
  style = {} 
}: IconProps) {
  const path = iconPaths[name as keyof typeof iconPaths];
  
  if (!path) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconPaths));
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon icon-${name} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

// Export icon names for TypeScript autocomplete
export const iconNames = Object.keys(iconPaths) as Array<keyof typeof iconPaths>;

// Convenience components for commonly used icons
export const ZoomInIcon = (props: Omit<IconProps, 'name'>) => <Icon name="zoomIn" {...props} />;
export const ZoomOutIcon = (props: Omit<IconProps, 'name'>) => <Icon name="zoomOut" {...props} />;
export const ResetIcon = (props: Omit<IconProps, 'name'>) => <Icon name="reset" {...props} />;
export const PlayIcon = (props: Omit<IconProps, 'name'>) => <Icon name="play" {...props} />;
export const ArrowRightIcon = (props: Omit<IconProps, 'name'>) => <Icon name="arrowRight" {...props} />;
export const GitHubIcon = (props: Omit<IconProps, 'name'>) => <Icon name="github" {...props} />;
export const TwitterIcon = (props: Omit<IconProps, 'name'>) => <Icon name="twitter" {...props} />;
export const DiscordIcon = (props: Omit<IconProps, 'name'>) => <Icon name="discord" {...props} />; 