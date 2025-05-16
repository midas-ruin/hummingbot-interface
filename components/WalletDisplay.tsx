import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { announceToScreenReader } from '../utils/accessibility';

interface WalletDisplayProps {
  className?: string;
  showControls?: boolean;
}

/**
 * Accessible component for displaying wallet information with screen reader support
 */
const WalletDisplay: React.FC<WalletDisplayProps> = ({ 
  className = '', 
  showControls = true 
}) => {
  const { wallets, linkWallet, unlinkWallet } = useWallets();
  const { ready, authenticated, login } = usePrivy();
  const [isCopied, setIsCopied] = useState(false);
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);
  
  // Handle wallet address copy with accessibility announcement
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      
      // Announce to screen readers
      announceToScreenReader('Wallet address copied to clipboard');
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
      announceToScreenReader('Failed to copy wallet address');
    }
  };
  
  // Handle wallet linking
  const handleLinkWallet = async () => {
    try {
      await linkWallet();
      announceToScreenReader('Wallet linking process started');
    } catch (error) {
      console.error('Error linking wallet:', error);
      announceToScreenReader('Error linking wallet');
    }
  };
  
  // Handle wallet unlinking with confirmation
  const handleUnlinkWallet = async (walletId: string) => {
    if (window.confirm('Are you sure you want to unlink this wallet?')) {
      try {
        await unlinkWallet(walletId);
        announceToScreenReader('Wallet unlinked successfully');
      } catch (error) {
        console.error('Error unlinking wallet:', error);
        announceToScreenReader('Error unlinking wallet');
      }
    }
  };
  
  // Handle wallet details expansion
  const toggleWalletDetails = (walletId: string) => {
    if (expandedWallet === walletId) {
      setExpandedWallet(null);
    } else {
      setExpandedWallet(walletId);
    }
  };
  
  // Show loading state
  if (!ready) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div aria-live="polite">Loading wallet information...</div>
        </div>
      </div>
    );
  }
  
  // Show login prompt if not authenticated
  if (!authenticated) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Wallet Connection</h2>
        <p className="text-gray-500 mb-4">Connect your wallet to manage your trading bots</p>
        <button
          onClick={() => login()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Sign in to connect wallet"
        >
          Sign In
        </button>
      </div>
    );
  }
  
  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900" id="wallet-heading">
          Connected Wallets
        </h2>
        
        {showControls && (
          <button
            onClick={handleLinkWallet}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Link a new wallet"
          >
            Link Wallet
          </button>
        )}
      </div>
      
      <div className="space-y-4" role="list" aria-labelledby="wallet-heading">
        {wallets && wallets.length > 0 ? (
          wallets.map((wallet) => (
            <div 
              key={wallet.address} 
              className="border border-gray-200 rounded-md p-3"
              role="listitem"
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {wallet.walletClientType === 'privy' ? 'Embedded Wallet' : wallet.walletClientType}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 truncate" 
                        title={wallet.address} 
                        aria-label={`Wallet address: ${wallet.address}`}
                      >
                        {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                      </span>
                      <button
                        onClick={() => copyAddress(wallet.address)}
                        className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md p-1"
                        aria-label="Copy wallet address to clipboard"
                      >
                        {isCopied ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleWalletDetails(wallet.id)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md p-1"
                      aria-expanded={expandedWallet === wallet.id}
                      aria-controls={`wallet-details-${wallet.id}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">
                        {expandedWallet === wallet.id ? 'Hide' : 'Show'} wallet details
                      </span>
                    </button>
                    
                    {showControls && (
                      <button
                        onClick={() => handleUnlinkWallet(wallet.id)}
                        className="text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md p-1"
                        aria-label={`Unlink ${wallet.walletClientType === 'privy' ? 'Embedded Wallet' : wallet.walletClientType}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Unlink wallet</span>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Wallet details panel */}
                {expandedWallet === wallet.id && (
                  <div 
                    id={`wallet-details-${wallet.id}`}
                    className="mt-3 bg-gray-50 p-3 rounded-md"
                    role="region"
                    aria-label="Wallet details"
                  >
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-xs font-medium text-gray-500">Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {wallet.walletClientType === 'privy' ? 'Embedded Wallet' : wallet.walletClientType}
                        </dd>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <dt className="text-xs font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span className="h-2 w-2 mr-1 bg-green-400 rounded-full"></span>
                            Connected
                          </span>
                        </dd>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <dt className="text-xs font-medium text-gray-500">Full Address</dt>
                        <dd className="mt-1 text-sm text-gray-900 break-all">
                          {wallet.address}
                        </dd>
                      </div>
                      
                      <div className="sm:col-span-2 border-t border-gray-200 pt-3">
                        <h4 className="text-xs font-medium text-gray-500">Security Level</h4>
                        <div className="mt-1 flex items-center">
                          <div className="relative flex-grow h-2 bg-gray-200 rounded overflow-hidden">
                            <div 
                              className={`absolute h-full ${
                                wallet.walletClientType === 'privy' 
                                  ? 'w-1/2 bg-yellow-500' 
                                  : 'w-full bg-green-500'
                              }`}
                              role="progressbar"
                              aria-valuenow={wallet.walletClientType === 'privy' ? 50 : 100}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            {wallet.walletClientType === 'privy' ? 'Medium' : 'High'}
                          </span>
                        </div>
                      </div>
                    </dl>
                    
                    {wallet.walletClientType === 'privy' && (
                      <div className="mt-4">
                        <div className="rounded-md bg-yellow-50 p-3">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-yellow-800">
                                Backup Recommendation
                              </h3>
                              <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                  For embedded wallets, we recommend enabling multi-factor authentication for additional security.
                                </p>
                              </div>
                              <div className="mt-3">
                                <button
                                  type="button"
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                  aria-label="Enable multi-factor authentication"
                                >
                                  Enable MFA
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-gray-500">
              No wallets connected yet
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Link a wallet to manage your trading bots
            </p>
          </div>
        )}
      </div>
      
      {/* Wallet accessibility information */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <details className="text-sm text-gray-500">
          <summary className="font-medium cursor-pointer focus:outline-none focus:underline">
            Accessibility Information
          </summary>
          <div className="mt-2 space-y-2">
            <p>
              You can navigate through wallet cards using the Tab key and expand each wallet's details using the Enter or Space key when focused on the details button.
            </p>
            <p>
              To copy a wallet address, focus on the copy button next to the address and press Enter. A confirmation message will be announced when the address is copied.
            </p>
            <p>
              Wallet security levels are visually indicated by colored bars and explicitly labeled as "High" or "Medium" for non-visual users.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default WalletDisplay;
