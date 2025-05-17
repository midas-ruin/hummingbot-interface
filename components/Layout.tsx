'use client';
import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import AccessibilityMenu from './AccessibilityMenu';
import { announceToScreenReader } from '../utils/accessibility';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Hummingbot Interface',
  description = 'Manage and assess your Hummingbot trading bots'
}) => {
  const { authenticated, logout } = usePrivy();
  const router = useRouter();
  
  // Handle route changes for screen reader announcements
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Extract page name from URL for announcement
      const pageName = url.split('/').pop() || 'home';
      const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      
      // Announce page change to screen readers
      announceToScreenReader(`Navigated to ${formattedPageName} page`);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Alt+H shortcut for home
    if (e.altKey && e.key === 'h') {
      e.preventDefault();
      router.push('/');
    }
    
    // Alt+D shortcut for dashboard (if authenticated)
    if (authenticated && e.altKey && e.key === 'd') {
      e.preventDefault();
      router.push('/dashboard');
    }
    
    // Alt+L shortcut for login/logout
    if (e.altKey && e.key === 'l') {
      e.preventDefault();
      if (authenticated) {
        logout();
      } else {
        router.push('/login');
      }
    }
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col" 
      onKeyDown={handleKeyDown}
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Skip to content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-blue-600 focus:text-white focus:z-50"
      >
        Skip to content
      </a>
      
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" aria-label="Home page">
                  <span className="text-xl font-bold text-blue-600">Hummingbot</span>
                </Link>
              </div>
              
              <nav className="ml-6 flex space-x-8" aria-label="Main Navigation">
                <Link 
                  href="/" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    router.pathname === '/' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  aria-current={router.pathname === '/' ? 'page' : undefined}
                >
                  Home
                </Link>
                
                {authenticated && (
                  <>
                    <Link 
                      href="/dashboard" 
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        router.pathname === '/dashboard' 
                          ? 'border-blue-500 text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                      aria-current={router.pathname === '/dashboard' ? 'page' : undefined}
                    >
                      Dashboard
                    </Link>
                    
                    <Link 
                      href="/bots" 
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        router.pathname.startsWith('/bots') 
                          ? 'border-blue-500 text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                      aria-current={router.pathname.startsWith('/bots') ? 'page' : undefined}
                    >
                      Bots
                    </Link>
                  </>
                )}
                
                <Link 
                  href="/about" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    router.pathname === '/about' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  aria-current={router.pathname === '/about' ? 'page' : undefined}
                >
                  About
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Accessibility menu */}
              <AccessibilityMenu />
              
              {authenticated ? (
                <button
                  onClick={() => logout()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Sign in"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Hummingbot Interface. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a 
                href="#accessibility" 
                className="text-sm text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                aria-label="Accessibility statement"
              >
                Accessibility
              </a>
              <a 
                href="#privacy" 
                className="text-sm text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                aria-label="Privacy policy"
              >
                Privacy
              </a>
              <a 
                href="#terms" 
                className="text-sm text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                aria-label="Terms of service"
              >
                Terms
              </a>
            </div>
          </div>
          
          {/* Keyboard shortcuts info */}
          <div className="mt-4 border-t pt-4">
            <p className="text-xs text-gray-500 text-center">
              Keyboard shortcuts: <kbd className="px-1 bg-gray-100 border border-gray-300 rounded">Alt+H</kbd> Home, 
              <kbd className="px-1 ml-1 bg-gray-100 border border-gray-300 rounded">Alt+D</kbd> Dashboard, 
              <kbd className="px-1 ml-1 bg-gray-100 border border-gray-300 rounded">Alt+L</kbd> Login/Logout
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
import styled from 'styled-components';
import Navigation from './Navigation';

const Main = styled.main`
  min-height: calc(100vh - 64px);
  background-color: ${props => props.theme.colors.background};
  width: 100%;
  overflow-x: hidden;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.sm};

  @media (min-width: 640px) {
    padding: ${props => props.theme.spacing.md};
  }

  @media (min-width: 1024px) {
    padding: ${props => props.theme.spacing.lg};
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { usePrivy } from '@privy-io/react-auth';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Hummingbot Interface',
  description = 'Manage and assess your Hummingbot trading bots',
  className = '',
  showHeader = true,
  showFooter = true,
}) => {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();
  const { accessibilitySettings, updateAccessibility } = useTheme();
  
  const isActive = (path: string) => router.pathname === path;
  
  const handleA11yChange = (setting: keyof typeof accessibilitySettings) => {
    updateAccessibility({
      [setting]: !accessibilitySettings[setting as keyof typeof accessibilitySettings],
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Skip to content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only sr-only-focusable bg-primary text-primary-foreground px-4 py-2 absolute z-50"
      >
        Skip to content
      </a>
      
      {showHeader && (
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" aria-label="Hummingbot Interface Home" className="logo-animate">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg gradient-text">Hummingbot</span>
                  <span className="text-muted-foreground">Interface</span>
                </div>
              </Link>
              
              <nav className="hidden md:flex ml-8 space-x-4" aria-label="Main Navigation">
                <Link 
                  href="/" 
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive('/') 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  aria-current={isActive('/') ? 'page' : undefined}
                >
                  Home
                </Link>
                
                {authenticated && (
                  <Link 
                    href="/dashboard" 
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive('/dashboard') 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                    aria-current={isActive('/dashboard') ? 'page' : undefined}
                  >
                    Dashboard
                  </Link>
                )}
                
                <Link 
                  href="/about" 
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive('/about') 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  aria-current={isActive('/about') ? 'page' : undefined}
                >
                  About
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle className="mr-2" />
              
              {ready && authenticated ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => logout()}
                  aria-label="Sign out"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="hbot"
                  size="sm"
                  onClick={() => router.push('/login')}
                  aria-label="Sign in"
                  className="gsap-reveal"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </header>
      )}
      
      <main id="main-content" className={cn("flex-grow", className)}>
        {children}
      </main>
      
      {showFooter && (
        <footer className="border-t border-border bg-card py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Hummingbot Interface. All rights reserved.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Accessibility:</span>
                  <button
                    onClick={() => handleA11yChange('highContrast')}
                    className={cn(
                      "text-xs px-2 py-1 rounded-md",
                      accessibilitySettings.highContrast 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    )}
                    aria-pressed={accessibilitySettings.highContrast}
                  >
                    High Contrast
                  </button>
                  
                  <button
                    onClick={() => handleA11yChange('largeText')}
                    className={cn(
                      "text-xs px-2 py-1 rounded-md",
                      accessibilitySettings.largeText 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    )}
                    aria-pressed={accessibilitySettings.largeText}
                  >
                    Large Text
                  </button>
                  
                  <button
                    onClick={() => handleA11yChange('reducedMotion')}
                    className={cn(
                      "text-xs px-2 py-1 rounded-md",
                      accessibilitySettings.reducedMotion 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    )}
                    aria-pressed={accessibilitySettings.reducedMotion}
                  >
                    Reduced Motion
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy
                  </Link>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navigation />
      <Main>
        <Container>{children}</Container>
      </Main>
    </>
  );
}
