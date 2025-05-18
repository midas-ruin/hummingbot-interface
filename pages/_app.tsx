import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { PrivyProvider as PrivyAuthProvider } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Function to handle accessibility navigation announcements
const handleRouteChangeComplete = (url: string) => {
  // Announce page transitions for screen readers
  const pageTitle = document.title || 'Hummingbot Interface';
  const announcer = document.getElementById('route-announcer');
  
  if (announcer) {
    announcer.innerText = `Navigated to ${pageTitle}`;
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Set up route change handlers for accessibility
  React.useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Hummingbot Interface - Manage and assess trading bots" />
        <meta name="theme-color" content="#3B82F6" />
        {/* Add CSP for enhanced security */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' https://privy.io; connect-src 'self' https://api.privy.io; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
        />
      </Head>
      
      {/* Accessibility route announcer */}
      <div 
        id="route-announcer" 
        role="status" 
        aria-live="assertive" 
        aria-atomic="true"
        style={{ 
          position: 'absolute', 
          width: '1px', 
          height: '1px', 
          padding: '0', 
          overflow: 'hidden', 
          clip: 'rect(0, 0, 0, 0)', 
          whiteSpace: 'nowrap', 
          border: '0' 
        }}
      />
      
      <PrivyAuthProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
        config={{
          loginMethods: ['email', 'wallet', 'google', 'twitter', 'discord', 'github'],
          appearance: {
            theme: 'light',
            accentColor: '#3B82F6',
            logo: '/logo.png',
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
            requireUserPasswordOnCreate: true,
          },
          // Enforce stronger security practices
          security: {
            enforceMFA: true, // Require multi-factor authentication
          },
        }}
      >
        <Component {...pageProps} />
      </PrivyAuthProvider>
    </>
  );
}

export default MyApp;
