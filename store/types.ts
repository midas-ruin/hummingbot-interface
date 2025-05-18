export interface BaseFormData {
  name: string;
  strategy: 'pure_market_making' | 'arbitrage' | 'grid_trading';
  exchange: string;
  baseAsset: string;
  quoteAsset: string;
}

export interface MarketMakingData extends BaseFormData {
  strategy: 'pure_market_making';
  bidSpread: string;
  askSpread: string;
  orderAmount: string;
  orderInterval: string;
  minProfitability: string;
}

export interface ArbitrageData extends BaseFormData {
  strategy: 'arbitrage';
  primaryExchange: string;
  secondaryExchange: string;
  minProfitability: string;
  maxOrderSize: string;
  minOrderSize: string;
  slippage: string;
}

export interface GridTradingData extends BaseFormData {
  strategy: 'grid_trading';
  upperPrice: string;
  lowerPrice: string;
  gridLevels: string;
  gridSpacing: string;
  orderSize: string;
}

export type BotFormData = MarketMakingData | ArbitrageData | GridTradingData;

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  data: T | null;
}

export interface Bot {
  id: string;
  name: string;
  strategy: string;
  exchange: string;
  baseAsset: string;
  quoteAsset: string;
  status: 'running' | 'stopped' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface BotCreationResponse {
  success: boolean;
  message: string;
  data: Bot;
}
