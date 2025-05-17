export const validateNumber = (value: string, options: {
  min?: number;
  max?: number;
  integer?: boolean;
  required?: boolean;
} = {}) => {
  if (!value && options.required) {
    return 'This field is required';
  }

  if (!value) {
    return '';
  }

  const num = Number(value);

  if (isNaN(num)) {
    return 'Please enter a valid number';
  }

  if (options.integer && !Number.isInteger(num)) {
    return 'Please enter a whole number';
  }

  if (typeof options.min === 'number' && num < options.min) {
    return `Value must be at least ${options.min}`;
  }

  if (typeof options.max === 'number' && num > options.max) {
    return `Value must be less than ${options.max}`;
  }

  return '';
};

export const validateText = (value: string, options: {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  pattern?: RegExp;
} = {}) => {
  if (!value && options.required) {
    return 'This field is required';
  }

  if (!value) {
    return '';
  }

  if (options.minLength && value.length < options.minLength) {
    return `Must be at least ${options.minLength} characters`;
  }

  if (options.maxLength && value.length > options.maxLength) {
    return `Must be less than ${options.maxLength} characters`;
  }

  if (options.pattern && !options.pattern.test(value)) {
    return 'Invalid format';
  }

  return '';
};

export const tooltips = {
  botName: 'Enter a unique name for your bot (at least 3 characters)',
  exchange: 'Select the primary exchange where the bot will operate',
  baseAsset: 'The cryptocurrency you want to trade (e.g., BTC)',
  quoteAsset: 'The currency used to quote prices (e.g., USDT)',
  
  // Market Making
  bidSpread: 'The percentage below market price at which buy orders will be placed',
  askSpread: 'The percentage above market price at which sell orders will be placed',
  orderAmount: 'The size of each order in base asset units',
  orderInterval: 'Time between order updates in seconds',
  minProfitability: 'Minimum expected return percentage for trades',
  
  // Grid Trading
  upperPrice: 'The highest price at which the bot will trade',
  lowerPrice: 'The lowest price at which the bot will trade',
  gridLevels: 'Number of price levels in the grid (minimum 2)',
  gridSpacing: 'Percentage difference between each grid level',
  orderSize: 'Size of orders at each grid level in base asset units',
  
  // Arbitrage
  secondaryExchange: 'The second exchange to compare prices with',
  slippage: 'Maximum acceptable price movement during order execution',
  minOrderSize: 'Minimum order size for arbitrage trades',
  maxOrderSize: 'Maximum order size for arbitrage trades'
};
