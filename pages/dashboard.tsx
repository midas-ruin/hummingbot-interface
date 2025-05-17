import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import AuthGuard from '../components/AuthGuard';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user: privyUser, logout } = usePrivy();
  const { wallets } = useWallets();
  const { user, verifyTokenWithServer } = useAuth();
  const [verified, setVerified] = useState<boolean | null>(null);
  
  // Verify the token on component mount for additional security
  useEffect(() => {
    const verify = async () => {
      const isVerified = await verifyTokenWithServer();
      setVerified(isVerified);
    };
    
    if (user?.isAuthenticated) {
      verify();
    }
  }, [user, verifyTokenWithServer]);

  return (
    <AuthGuard requireAuth={true}>
      <Head>
        <title>Dashboard - Hummingbot Interface</title>
        <meta 
          name="description" 
          content="Dashboard for managing your Hummingbot trading bots" 
        />
      </Head>
      
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard
                </h1>
                
                <button
                  onClick={() => logout()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label="Sign out"
                >
                  Sign out
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Your Profile
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded shadow">
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="mt-1 text-gray-900">{user?.id || 'Not available'}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded shadow">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-gray-900">{user?.email || 'Not available'}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded shadow md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Wallet Address</p>
                    <p className="mt-1 text-gray-900 truncate">
                      {user?.walletAddress || 'No wallet connected'}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-white rounded shadow md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Server Verification</p>
                    <p className="mt-1 text-gray-900">
                      {verified === null ? 'Checking...' : 
                       verified ? 'Token verified ✓' : 'Token verification failed ✗'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Accessibility information */}
              <div className="mt-8 border-t pt-4">
                <h2 className="text-lg font-medium text-gray-900 mb-2" id="a11y-heading">
                  Accessibility Controls
                </h2>
                <div className="text-sm text-gray-600">
                  <p>Navigate this dashboard using:</p>
                  <ul className="list-disc pl-5 mt-2">
                    <li><kbd className="px-2 py-1 bg-gray-100 border">Tab</kbd> to move between elements</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 border">Space/Enter</kbd> to activate buttons</li>
                    <li>Press <kbd className="px-2 py-1 bg-gray-100 border">Alt+1</kbd> to navigate to the dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
};

export default Dashboard;
