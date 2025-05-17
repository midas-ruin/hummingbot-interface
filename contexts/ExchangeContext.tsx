import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ApiKey, ExchangeBalance, ExchangeInfo } from '../types/exchange';
import { ApiKeyService } from '../services/apiKeys';
import { HummingbotGateway } from '../services/gateway';

interface ExchangeContextType {
  apiKeys: ApiKey[];
  balances: ExchangeBalance[];
  exchanges: ExchangeInfo[];
  loading: boolean;
  error: string | null;
  addApiKey: (apiKey: ApiKey) => Promise<void>;
  deleteApiKey: (exchange: string, label: string) => Promise<void>;
  refreshBalances: () => Promise<void>;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

interface ExchangeProviderProps {
  children: React.ReactNode;
  gateway: HummingbotGateway;
}

export function ExchangeProvider({ children, gateway }: ExchangeProviderProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [balances, setBalances] = useState<ExchangeBalance[]>([]);
  const [exchanges, setExchanges] = useState<ExchangeInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKeyService = new ApiKeyService(gateway);

  const loadApiKeys = useCallback(async () => {
    try {
      setLoading(true);
      const keys = await apiKeyService.getApiKeys();
      setApiKeys(keys);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  }, [apiKeyService]);

  const addApiKey = useCallback(async (apiKey: ApiKey) => {
    try {
      setLoading(true);
      await apiKeyService.addApiKey(apiKey);
      await loadApiKeys();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add API key');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiKeyService, loadApiKeys]);

  const deleteApiKey = useCallback(async (exchange: string, label: string) => {
    try {
      setLoading(true);
      await apiKeyService.deleteApiKey(exchange, label);
      await loadApiKeys();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete API key');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiKeyService, loadApiKeys]);

  const refreshBalances = useCallback(async () => {
    try {
      setLoading(true);
      const response = await gateway.get<ExchangeBalance[]>('/balances');
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch balances');
      }

      setBalances(response.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh balances');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gateway]);

  const loadExchanges = useCallback(async () => {
    try {
      setLoading(true);
      const response = await gateway.get<ExchangeInfo[]>('/exchanges');
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch exchanges');
      }

      setExchanges(response.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exchanges');
    } finally {
      setLoading(false);
    }
  }, [gateway]);

  useEffect(() => {
    loadApiKeys();
    loadExchanges();
  }, [loadApiKeys, loadExchanges]);

  const value = {
    apiKeys,
    balances,
    exchanges,
    loading,
    error,
    addApiKey,
    deleteApiKey,
    refreshBalances
  };

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  );
}

export function useExchangeContext() {
  const context = useContext(ExchangeContext);
  
  if (context === undefined) {
    throw new Error('useExchangeContext must be used within an ExchangeProvider');
  }
  
  return context;
}
