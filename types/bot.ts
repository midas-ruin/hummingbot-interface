export interface BotMetrics {
  profitLoss: number;
  totalTrades: number;
  successRate: number;
  uptime: string;
  lastUpdated: string;
}

export interface Bot {
  id: string;
  name: string;
  strategy: 'pure_market_making' | 'arbitrage' | 'grid_trading';
  exchange: string;
  baseAsset: string;
  quoteAsset: string;
  status: 'running' | 'stopped' | 'error';
  createdAt: string;
  updatedAt: string;
  metrics?: BotMetrics;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  data: T | null;
}

export interface BotCreationResponse {
  success: boolean;
  message: string;
  data: Bot;
}

export interface FormErrors {
  name?: string;
  strategy?: string;
  exchange?: string;
  baseAsset?: string;
  quoteAsset?: string;
  marketMaking?: {
    bidSpread?: string;
    askSpread?: string;
  };
  arbitrage?: {
    primaryExchange?: string;
    secondaryExchange?: string;
  };
  gridTrading?: {
    upperPrice?: string;
    lowerPrice?: string;
    gridLevels?: string;
    gridSpacing?: string;
    orderSize?: string;
    rebalanceInterval?: string;
    minOrderSize?: string;
    maxOrderSize?: string;
    minProfitability?: string;
    externalPriceUrl?: string;
  };
  submit?: string;
}

export interface BaseFormData {
  name: string;
  strategy: 'pure_market_making' | 'arbitrage' | 'grid_trading';
  exchange: string;
  baseAsset: string;
  quoteAsset: string;
  submit?: string;
  root?: { message: string };
}

export interface MarketMakingData extends BaseFormData {
  strategy: 'pure_market_making';
  bidSpread: string;
  askSpread: string;
  orderSize: string;
  minOrderSize: string;
  maxOrderSize: string;
  orderAmount: string;
  orderInterval: string;
  minProfitability: string;
}

export interface ArbitrageData extends BaseFormData {
  strategy: 'arbitrage';
  primaryExchange: string;
  secondaryExchange: string;
  minProfitability: string;
  slippage: string;
  maxOrderSize: string;
  minOrderSize: string;
}

export interface GridTradingData extends BaseFormData {
  strategy: 'grid_trading';
  upperPrice: string;
  lowerPrice: string;
  gridLevels: string;
  gridSpacing: string;
  orderSize: string;
  rebalanceInterval: string;
  minOrderSize: string;
  maxOrderSize: string;
  minProfitability: string;
  externalPriceUrl?: string;
}

export type FormData = MarketMakingData | ArbitrageData | GridTradingData;
