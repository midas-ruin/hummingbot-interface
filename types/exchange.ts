export interface ApiKey {
  exchange: string;
  apiKey: string;
  secretKey: string;
  label?: string;
  isActive: boolean;
}

export interface ExchangeBalance {
  exchange: string;
  asset: string;
  free: number;
  locked: number;
  total: number;
}

export interface ExchangeOrder {
  exchange: string;
  orderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  price: number;
  amount: number;
  filled: number;
  status: 'open' | 'closed' | 'canceled' | 'expired';
  timestamp: number;
}

export interface ExchangeInfo {
  name: string;
  id: string;
  pairs: string[];
  supported: boolean;
  testnet: boolean;
  rateLimit: number;
  fees: {
    maker: number;
    taker: number;
  };
}

export interface OrderBook {
  exchange: string;
  symbol: string;
  timestamp: number;
  bids: [number, number][]; // [price, amount]
  asks: [number, number][]; // [price, amount]
}

export interface Trade {
  exchange: string;
  symbol: string;
  id: string;
  orderId: string;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  cost: number;
  fee: {
    currency: string;
    cost: number;
  };
  timestamp: number;
}

export interface RiskParams {
  maxPositionSize: number;
  maxLeverage: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  maxDrawdown: number;
  maxDailyLoss: number;
}

export interface Position {
  exchange: string;
  symbol: string;
  side: 'long' | 'short';
  amount: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  margin: number;
  leverage: number;
  unrealizedPnl: number;
  timestamp: number;
}

export interface ExchangeError {
  code: string;
  message: string;
  exchange: string;
  timestamp: number;
}
