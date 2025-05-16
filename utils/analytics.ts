export interface Trade {
  timestamp: number;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  fee: number;
  feeCurrency: string;
}

export interface Position {
  entryPrice: number;
  currentPrice: number;
  amount: number;
  leverage: number;
}

export interface RiskMetrics {
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
  sortino: number;
  var95: number; // Value at Risk (95% confidence)
  var99: number; // Value at Risk (99% confidence)
}

/**
 * Calculate Profit and Loss (PnL) for a list of trades
 * @param trades List of trades
 * @returns Object containing realized and unrealized PnL
 */
export function calculatePnL(trades: Trade[]): { realized: number; unrealized: number; total: number } {
  let realized = 0;
  let totalBought = 0;
  let totalSold = 0;
  let avgBuyPrice = 0;
  let avgSellPrice = 0;

  trades.forEach(trade => {
    const volume = trade.price * trade.amount;
    if (trade.side === 'buy') {
      totalBought += trade.amount;
      avgBuyPrice = (avgBuyPrice * (totalBought - trade.amount) + volume) / totalBought;
    } else {
      totalSold += trade.amount;
      avgSellPrice = (avgSellPrice * (totalSold - trade.amount) + volume) / totalSold;
      realized += (trade.price - avgBuyPrice) * trade.amount;
    }
  });

  const unrealized = (totalBought - totalSold) * (trades[trades.length - 1]?.price || 0);
  return { realized, unrealized, total: realized + unrealized };
}

/**
 * Calculate risk metrics for a position
 * @param position Current position
 * @param trades Historical trades
 * @param marketData Market price data for beta calculation
 * @returns Risk metrics
 */
export function calculateRiskMetrics(
  position: Position,
  trades: Trade[],
  marketData: { price: number; timestamp: number }[]
): RiskMetrics {
  // Calculate daily returns
  const dailyReturns = calculateDailyReturns(trades);
  const marketReturns = calculateMarketReturns(marketData);

  // Calculate volatility (standard deviation of returns)
  const volatility = calculateVolatility(dailyReturns);

  // Calculate Sharpe Ratio (assuming risk-free rate of 2%)
  const riskFreeRate = 0.02;
  const averageReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const sharpeRatio = (averageReturn - riskFreeRate) / volatility;

  // Calculate Maximum Drawdown
  const maxDrawdown = calculateMaxDrawdown(trades);

  // Calculate Beta (market sensitivity)
  const beta = calculateBeta(dailyReturns, marketReturns);

  // Calculate Alpha (excess return)
  const alpha = averageReturn - (riskFreeRate + beta * (marketReturns[marketReturns.length - 1] - riskFreeRate));

  // Calculate Sortino Ratio (downside deviation)
  const downsideReturns = dailyReturns.filter(r => r < 0);
  const downsideDeviation = Math.sqrt(
    downsideReturns.reduce((sum, r) => sum + r * r, 0) / downsideReturns.length
  );
  const sortino = (averageReturn - riskFreeRate) / downsideDeviation;

  // Calculate Value at Risk (VaR)
  const var95 = calculateVaR(dailyReturns, 0.95);
  const var99 = calculateVaR(dailyReturns, 0.99);

  return {
    sharpeRatio,
    maxDrawdown,
    volatility,
    beta,
    alpha,
    sortino,
    var95,
    var99
  };
}

function calculateDailyReturns(trades: Trade[]): number[] {
  const dailyPrices = new Map<string, number>();
  trades.forEach(trade => {
    const date = new Date(trade.timestamp).toISOString().split('T')[0];
    dailyPrices.set(date, trade.price);
  });

  const prices = Array.from(dailyPrices.values());
  return prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
}

function calculateMarketReturns(marketData: { price: number; timestamp: number }[]): number[] {
  const dailyPrices = new Map<string, number>();
  marketData.forEach(data => {
    const date = new Date(data.timestamp).toISOString().split('T')[0];
    dailyPrices.set(date, data.price);
  });

  const prices = Array.from(dailyPrices.values());
  return prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
}

function calculateVolatility(returns: number[]): number {
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / returns.length);
}

function calculateMaxDrawdown(trades: Trade[]): number {
  let peak = -Infinity;
  let maxDrawdown = 0;

  trades.forEach(trade => {
    if (trade.price > peak) {
      peak = trade.price;
    }
    const drawdown = (peak - trade.price) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return maxDrawdown;
}

function calculateBeta(returns: number[], marketReturns: number[]): number {
  const covariance = calculateCovariance(returns, marketReturns);
  const marketVariance = calculateVariance(marketReturns);
  return covariance / marketVariance;
}

function calculateCovariance(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  const meanA = a.reduce((sum, val) => sum + val, 0) / length;
  const meanB = b.reduce((sum, val) => sum + val, 0) / length;
  
  return a.slice(0, length).reduce((sum, val, i) => {
    return sum + (val - meanA) * (b[i] - meanB);
  }, 0) / length;
}

function calculateVariance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
}

function calculateVaR(returns: number[], confidence: number): number {
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const index = Math.floor(returns.length * (1 - confidence));
  return -sortedReturns[index];
}
