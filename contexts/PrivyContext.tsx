import React, { createContext, useContext, ReactNode } from 'react';
import { PrivyClient, PrivyClientConfig } from '@privy-io/react-auth';

// Define the environment variables types for TypeScript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PRIVY_APP_ID: string;
    }
  }
}

// Privy client configuration with accessibility and security enhancements
const privyConfig: PrivyClientConfig = {
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  loginMethods: ['email', 'wallet', 'google', 'twitter', 'discord', 'github'],
  appearance: {
    theme: 'light',
    accentColor: '#3B82F6', // Tailwind blue-500
    logo: '/logo.png',
    showWalletLoginFirst: false,
  },
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true, // Enhance security with password requirement
    noPromptOnSignature: false, // Always show signature prompts for security
  },
  // Enhanced security and accessibility settings
  accessibilitySettings: {
    useHighContrastMode: false,
    fontSize: 'medium',
    motionReduced: false,
  },
  // Custom UI text for better accessibility
  uiConfig: {
    loginScreen: {
      title: 'Login to Hummingbot Interface',
      subtitle: 'Manage and assess your trading bots securely',
      walletsSubtitle: 'Connect with a crypto wallet',
      socialLoginSubtitle: 'Or continue with',
    },
  },
  // Secure cookie settings
  cookies: {
    domain: process.env.NODE_ENV === 'production' ? 'your-domain.com' : 'localhost',
    secure: process.env.NODE_ENV === 'production', // Force secure cookies in production
    sameSite: 'lax',
  },
};

interface PrivyContextType {
  privy: PrivyClient;
}

const PrivyContext = createContext<PrivyContextType | undefined>(undefined);

export const PrivyProvider = ({ children }: { children: ReactNode }) => {
  const privy = new PrivyClient(privyConfig);

  return (
    <PrivyContext.Provider value={{ privy }}>
      {children}
    </PrivyContext.Provider>
  );
};

export const usePrivy = () => {
  const context = useContext(PrivyContext);
  if (context === undefined) {
    throw new Error('usePrivy must be used within a PrivyProvider');
  }
  return context;
};
