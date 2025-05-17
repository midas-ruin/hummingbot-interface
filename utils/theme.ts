import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  colors: {
    primary: '#2563eb',
    secondary: '#6b7280',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    backgroundPrimary: '#ffffff',
    backgroundSecondary: '#f3f4f6',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    border: '#e5e7eb',
    divider: '#d1d5db',
    surface: '#ffffff',
    text: '#111827',
    background: '#f9fafb',
    hover: {
      primary: '#1d4ed8',
      secondary: '#4b5563',
    },
    focus: {
      primary: '#1e40af',
      outline: 'rgba(37, 99, 235, 0.5)',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      xs: '0.75rem',
      small: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  },
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  zIndex: {
    behind: -1,
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export const darkTheme: DefaultTheme = {
  ...lightTheme,
  colors: {
    primary: '#3b82f6',
    secondary: '#9ca3af',
    success: '#34d399',
    error: '#f87171',
    warning: '#fbbf24',
    info: '#60a5fa',
    backgroundPrimary: '#111827',
    backgroundSecondary: '#1f2937',
    textPrimary: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    divider: '#4b5563',
    surface: '#1f2937',
    text: '#f9fafb',
    background: '#111827',
    hover: {
      primary: '#2563eb',
      secondary: '#6b7280',
    },
    focus: {
      primary: '#1d4ed8',
      outline: 'rgba(59, 130, 246, 0.5)',
    },
  },
};

export const mediaQueries = {
  xs: `@media (min-width: ${lightTheme.breakpoints.xs})`,
  sm: `@media (min-width: ${lightTheme.breakpoints.sm})`,
  md: `@media (min-width: ${lightTheme.breakpoints.md})`,
  lg: `@media (min-width: ${lightTheme.breakpoints.lg})`,
  xl: `@media (min-width: ${lightTheme.breakpoints.xl})`,
  '2xl': `@media (min-width: ${lightTheme.breakpoints['2xl']})`,
};

// Utility functions for responsive design
export const getResponsiveValue = (
  value: string | number,
  breakpoint: keyof typeof lightTheme.breakpoints
) => {
  return `${mediaQueries[breakpoint]} {
    ${typeof value === 'number' ? value + 'px' : value}
  }`;
};

// Accessibility utilities
export const focusStyles = `
  outline: 2px solid ${lightTheme.colors.focus.outline};
  outline-offset: 2px;
  box-shadow: 0 0 0 2px ${lightTheme.colors.focus.outline};
`;

export const visuallyHidden = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// High contrast mode utilities
export const highContrastStyles = `
  @media screen and (-ms-high-contrast: active) {
    border: 2px solid currentColor;
    outline: 2px solid transparent;
    outline-offset: -2px;
  }
`;

// Motion reduction utilities
export const reduceMotion = `
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
  }
`;

// Color contrast utilities
export const ensureContrast = (
  foreground: string,
  background: string,
  minContrast = 4.5
) => {
  // TODO: Implement color contrast calculation
  // For now, return the foreground color
  return foreground;
};
