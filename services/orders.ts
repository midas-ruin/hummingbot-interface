import { HummingbotGateway, gateway } from './gateway';
import { ExchangeOrder, Trade } from '../types/exchange';

export interface CreateOrderParams {
  exchange: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  amount: number;
  price?: number;
}

export interface CancelOrderParams {
  exchange: string;
  orderId: string;
  symbol: string;
}

export class OrderService {
  private gateway: HummingbotGateway;

  constructor(gateway: HummingbotGateway) {
    this.gateway = gateway;
  }

  async createOrder(params: CreateOrderParams): Promise<ExchangeOrder> {
    const response = await this.gateway.post<ExchangeOrder>('/orders', params);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create order');
    }

    return response.data!;
  }

  async cancelOrder(params: CancelOrderParams): Promise<void> {
    const response = await this.gateway.delete<void>(`/orders/${params.exchange}/${params.symbol}/${params.orderId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel order');
    }
  }

  async getOrders(exchange: string, symbol?: string): Promise<ExchangeOrder[]> {
    const url = symbol 
      ? `/orders/${exchange}/${symbol}`
      : `/orders/${exchange}`;
      
    const response = await this.gateway.get<ExchangeOrder[]>(url);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch orders');
    }

    return response.data || [];
  }

  async getTrades(exchange: string, symbol?: string): Promise<Trade[]> {
    const url = symbol 
      ? `/trades/${exchange}/${symbol}`
      : `/trades/${exchange}`;
      
    const response = await this.gateway.get<Trade[]>(url);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch trades');
    }

    return response.data || [];
  }

  async getOrderById(exchange: string, orderId: string): Promise<ExchangeOrder> {
    const response = await this.gateway.get<ExchangeOrder>(`/orders/${exchange}/${orderId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch order');
    }

    return response.data!;
  }
}
