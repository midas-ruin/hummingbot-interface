import React, { useState, useEffect, useCallback } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';

// Define the OrderBookType interface if it's not imported
interface OrderBookType {
  asks: [number, number][];
  bids: [number, number][];
}

// Define the gateway interface if it's not imported
interface HummingbotGateway {
  get<T>(endpoint: string): Promise<{
    success: boolean;
    data?: T;
    error?: string;
  }>;
}

interface OrderBookProps {
  exchange: string;
  symbol: string;
  gateway: HummingbotGateway;
  onPriceSelect?: (price: number) => void;
}

export function OrderBook({ exchange, symbol, gateway, onPriceSelect }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<OrderBookType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderBook = useCallback(async () => {
    try {
      setLoading(true);
      const response = await gateway.get<OrderBookType>(`/orderbook/${exchange}/${symbol}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch order book');
      }

      setOrderBook(response.data || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order book');
    } finally {
      setLoading(false);
    }
  }, [exchange, symbol, gateway]);

  useEffect(() => {
    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [fetchOrderBook]);

  const calculateSpread = () => {
    if (!orderBook || !orderBook.asks[0] || !orderBook.bids[0]) {
      return null;
    }

    const lowestAsk = orderBook.asks[0][0];
    const highestBid = orderBook.bids[0][0];
    const spread = lowestAsk - highestBid;
    const spreadPercentage = (spread / lowestAsk) * 100;

    return {
      absolute: spread.toFixed(8),
      percentage: spreadPercentage.toFixed(2)
    };
  };

  const calculateDepth = (price: number, amount: number, side: 'bid' | 'ask') => {
    if (!orderBook) return 0;

    const maxVolume = Math.max(
      ...orderBook.bids.map(([_, vol]) => vol),
      ...orderBook.asks.map(([_, vol]) => vol)
    );

    // Prevent division by zero
    return maxVolume <= 0 ? 0 : amount / maxVolume;
  };

  const handlePriceSelect = (price: number) => {
    if (onPriceSelect) {
      onPriceSelect(price);
    }
  };

  if (loading && !orderBook) {
    return (
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
        <div className="text-red-600 text-sm p-4 text-center bg-red-100 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!orderBook) {
    return null;
  }

  const spread = calculateSpread();

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 m-0">Order Book - {symbol}</h2>
        {spread && (
          <div className="flex justify-center items-center p-2 text-sm text-gray-500 bg-gray-50 rounded">
            Spread: {spread.absolute} ({spread.percentage}%)
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 text-sm">
        <div className="font-medium text-gray-500 p-2">Price</div>
        <div className="font-medium text-gray-500 p-2">Amount</div>
        <div className="font-medium text-gray-500 p-2">Total</div>
        <div className="font-medium text-gray-500 p-2">Sum ({symbol.split('/')[1]})</div>

        {orderBook.asks.slice().reverse().map(([price, amount], index) => {
          const total = price * amount;
          const sum = orderBook.asks
            .slice(0, orderBook.asks.length - index)
            .reduce((acc, [p, a]) => acc + p * a, 0);
          const depth = calculateDepth(price, amount, 'ask');

          return (
            <React.Fragment key={`ask-${price}`}>
              <div 
                className="relative p-2 cursor-pointer hover:bg-gray-100 text-red-600"
                onClick={() => handlePriceSelect(price)}
              >
                <div className="relative z-10">{price.toFixed(8)}</div>
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-red-100 opacity-10 z-0" 
                  style={{ width: `${depth * 100}%` }}
                ></div>
              </div>
              <div className="p-2 text-red-600">{amount.toFixed(8)}</div>
              <div className="p-2 text-red-600">{total.toFixed(8)}</div>
              <div className="p-2 text-red-600">{sum.toFixed(8)}</div>
            </React.Fragment>
          );
        })}

        {orderBook.bids.map(([price, amount], index) => {
          const total = price * amount;
          const sum = orderBook.bids
            .slice(0, index + 1)
            .reduce((acc, [p, a]) => acc + p * a, 0);
          const depth = calculateDepth(price, amount, 'bid');

          return (
            <React.Fragment key={`bid-${price}`}>
              <div 
                className="relative p-2 cursor-pointer hover:bg-gray-100 text-green-600"
                onClick={() => handlePriceSelect(price)}
              >
                <div className="relative z-10">{price.toFixed(8)}</div>
                <div 
                  className="absolute top-0 bottom-0 right-0 bg-green-100 opacity-10 z-0" 
                  style={{ width: `${depth * 100}%` }}
                ></div>
              </div>
              <div className="p-2 text-green-600">{amount.toFixed(8)}</div>
              <div className="p-2 text-green-600">{total.toFixed(8)}</div>
              <div className="p-2 text-green-600">{sum.toFixed(8)}</div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}