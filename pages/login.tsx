import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Head from 'next/head';

const Login = () => {
  const router = useRouter();
  const { login, authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (ready && authenticated && user) {
      router.push('/dashboard');
    }
  }, [ready, authenticated, user, router]);

  return (
    <>
      <Head>
        <title>Login - Hummingbot Interface</title>
        <meta name="description" content="Log in to the Hummingbot Interface to manage your trading bots" />
      </Head>
      
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Hummingbot Interface</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage and assess your trading bots
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            <button
              onClick={() => login()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Sign in with Privy"
            >
              Sign in securely
            </button>
            
            <div className="text-sm text-center">
              <p className="text-gray-600">
                We use secure authentication to protect your account
              </p>
            </div>
          </div>
          
          {/* Accessibility features */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              <span className="block mb-1">Keyboard shortcuts:</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded">Tab</kbd>
              <span className="mx-1">to navigate,</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded">Enter</kbd>
              <span className="mx-1">to select</span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
