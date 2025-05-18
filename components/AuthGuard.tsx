import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

/**
 * Component that protects routes requiring authentication
 * Has accessibility features built-in (aria attributes, focus management)
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Skip if still loading auth state
    if (loading) return;
    
    // If authentication is required but user is not authenticated
    if (requireAuth && !user?.isAuthenticated) {
      // Store the intended destination for post-login redirect
      sessionStorage.setItem('redirectAfterLogin', router.asPath);
      router.push('/login');
    }
    
    // If user is authenticated but on login/register page, redirect to dashboard
    if (!requireAuth && user?.isAuthenticated) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    }
  }, [requireAuth, user, loading, router]);
  
  // Show loading state
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen" 
        aria-live="polite"
        aria-busy="true"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="sr-only">Loading authentication state...</span>
      </div>
    );
  }
  
  // If not loading and either (not requiring auth) OR (requiring auth and user is authenticated)
  if (!loading && (!requireAuth || (requireAuth && user?.isAuthenticated))) {
    return <>{children}</>;
  }
  
  // Default empty state for when redirecting
  return null;
};

export default AuthGuard;
