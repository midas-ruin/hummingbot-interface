import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/router';

export type AuthUser = {
  id: string;
  walletAddress?: string;
  email?: string;
  isAuthenticated: boolean;
};

// Define which routes require authentication
const PROTECTED_ROUTES = ['/dashboard', '/bots', '/settings'];
// Define public routes (do not redirect to login)
const PUBLIC_ROUTES = ['/', '/login', '/about'];

export function useAuth() {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the currently active wallet if any exists
  const activeWallet = wallets?.[0];
  
  // Set up auth state and route protection
  useEffect(() => {
    const checkAuth = async () => {
      if (!ready) return;
      
      if (authenticated && user) {
        // Create auth user object from Privy user data
        setAuthUser({
          id: user.id,
          walletAddress: activeWallet?.address,
          email: user.email?.address,
          isAuthenticated: true,
        });
        
        // If on login page but already authenticated, redirect to dashboard
        if (router.pathname === '/login') {
          router.push('/dashboard');
        }
      } else {
        // Not authenticated
        setAuthUser(null);
        
        // If on protected route and not authenticated, redirect to login
        const isProtectedRoute = PROTECTED_ROUTES.some(route => 
          router.pathname.startsWith(route)
        );
        
        if (isProtectedRoute) {
          router.push('/login');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [ready, authenticated, user, router, activeWallet]);

  // Verify token on server-side
  const verifyTokenWithServer = async (): Promise<boolean> => {
    try {
      const token = await getAccessToken();
      
      if (!token) return false;
      
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  };

  return {
    user: authUser,
    loading,
    login,
    logout,
    isAuthenticated: !!authUser?.isAuthenticated,
    verifyTokenWithServer,
    getAccessToken
  };
}
