'use client';

import { ThemeProvider } from 'styled-components';
import { BotProvider } from '../contexts/BotContext';
import Layout from '../components/Layout';
import { Toast } from '../components/common/Toast';
import { PrivyProvider } from '@privy-io/react-auth';
import { mainnet } from 'viem/chains';

const theme = {
  mode: 'light' as const,
  colors: {
    primary: '#02C77A',
    secondary: '#F0B90B',
    background: {
      primary: '#F3F4F6',
      secondary: '#FFFFFF'
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280'
    },
    border: '#E5E7EB',
    error: '#DC2626',
    success: '#059669',
    white: '#FFFFFF',
    surface: '#FFFFFF'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem'
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  zIndex: {
    modal: 1000,
    dropdown: 100,
    tooltip: 50
  }
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
        config={{
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#000000',
          },
          embeddedWallets: {
            createOnLogin: 'all-users',
          },
          defaultChain: mainnet,
          supportedChains: [mainnet],
        }}
      >
        <BotProvider>
          <Layout>
            {children}
            <Toast />
          </Layout>
        </BotProvider>
      </PrivyProvider>
    </ThemeProvider>
  );
}
