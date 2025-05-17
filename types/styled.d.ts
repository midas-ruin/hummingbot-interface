import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: {
        primary: string;
        secondary: string;
      };
      text: {
        primary: string;
        secondary: string;
      };
      border: string;
      error: string;
      success: string;
      white: string;
      surface: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
      };
      fontWeight: {
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    transitions: {
      fast: string;
      normal: string;
      slow: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
    mode: 'light' | 'dark';
    zIndex: {
      modal: number;
      dropdown: number;
      tooltip: number;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}

