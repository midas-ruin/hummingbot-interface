import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

const Home: NextPage = () => {
  const { login, authenticated, ready } = usePrivy();
  
  return (
    <>
      <Head>
        <title>Hummingbot Interface</title>
        <meta name="description" content="Manage and assess your Hummingbot trading bots" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="max-w-4xl w-full px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Hummingbot Interface
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            A modern, user-friendly interface for managing and assessing Hummingbot trading bots
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!ready ? (
              <div className="animate-pulse w-32 h-10 bg-gray-200 rounded"></div>
            ) : authenticated ? (
              <Link href="/dashboard" 
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Go to dashboard"
              >
                Go to Dashboard
              </Link>
            ) : (
              <button
                onClick={() => login()}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Sign in to Hummingbot Interface"
              >
                Sign In
              </button>
            )}
            
            <Link href="/about"
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Learn more about Hummingbot Interface"
            >
              Learn More
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Modern Interface</h2>
              <p className="text-gray-600">Built with Next.js and TypeScript for a smooth, responsive experience</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Secure Authentication</h2>
              <p className="text-gray-600">Login with email, social accounts, or connect your crypto wallet</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Accessible Design</h2>
              <p className="text-gray-600">ARIA-compliant interface with keyboard navigation support</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Hummingbot Interface. All rights reserved.</p>
          
          {/* Accessibility footer */}
          <div className="mt-4">
            <p>
              <a href="#accessibility" 
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="View accessibility statement"
              >
                Accessibility Statement
              </a>
              {' | '}
              <a href="#privacy" 
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="View privacy policy"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
