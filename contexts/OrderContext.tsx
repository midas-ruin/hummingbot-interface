import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ExchangeOrder, Trade } from '../types/exchange';
import { OrderService, CreateOrderParams, CancelOrderParams } from '../services/orders';
import { HummingbotGateway, gateway } from '../services/gateway';
import { useExchangeContext } from './ExchangeContext';

interface OrderContextType {
  orders: ExchangeOrder[];
  trades: Trade[];
  loading: boolean;
  error: string | null;
  createOrder: (params: CreateOrderParams) => Promise<ExchangeOrder>;
  cancelOrder: (params: CancelOrderParams) => Promise<void>;
  refreshOrders: (exchange: string, symbol?: string) => Promise<void>;
  refreshTrades: (exchange: string, symbol?: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: React.ReactNode;
  gateway: HummingbotGateway;
}

export function OrderProvider({ children, gateway }: OrderProviderProps) {
  const [orders, setOrders] = useState<ExchangeOrder[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apiKeys } = useExchangeContext();
  const orderService = new OrderService(gateway);

  const refreshOrders = useCallback(async (exchange: string, symbol?: string) => {
    try {
      setLoading(true);
      const fetchedOrders = await orderService.getOrders(exchange, symbol);
      setOrders(fetchedOrders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orderService]);

  const refreshTrades = useCallback(async (exchange: string, symbol?: string) => {
    try {
      setLoading(true);
      const fetchedTrades = await orderService.getTrades(exchange, symbol);
      setTrades(fetchedTrades);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trades');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orderService]);

  const createOrder = useCallback(async (params: CreateOrderParams) => {
    try {
      setLoading(true);
      const order = await orderService.createOrder(params);
      await refreshOrders(params.exchange, params.symbol);
      setError(null);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orderService, refreshOrders]);

  const cancelOrder = useCallback(async (params: CancelOrderParams) => {
    try {
      setLoading(true);
      await orderService.cancelOrder(params);
      await refreshOrders(params.exchange, params.symbol);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orderService, refreshOrders]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (apiKeys.length > 0) {
        const activeKey = apiKeys.find(key => key.isActive);
        if (activeKey) {
          try {
            await refreshOrders(activeKey.exchange);
            await refreshTrades(activeKey.exchange);
          } catch (err) {
            console.error('Failed to load initial order data:', err);
          }
        }
      }
    };

    loadInitialData();
  }, [apiKeys, refreshOrders, refreshTrades]);

  const value = {
    orders,
    trades,
    loading,
    error,
    createOrder,
    cancelOrder,
    refreshOrders,
    refreshTrades
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  
  if (context === undefined) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  
  return context;
}
