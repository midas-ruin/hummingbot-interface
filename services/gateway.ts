'use client';

import { Bot, BotCreationResponse } from '../types/bot';

export class HummingbotGateway {
  private ws: WebSocket | null = null;
  private apiUrl: string;
  private wsUrl: string;
  private apiKey: string;

  constructor(config: { apiUrl: string; wsUrl: string; apiKey: string }) {
    this.apiUrl = config.apiUrl;
    this.wsUrl = config.wsUrl;
    this.apiKey = config.apiKey;
  }

  // Initialize WebSocket connection
  public connect(onMessage: (data: any) => void): void {
    if (typeof window === 'undefined') {
      console.warn('WebSocket connection attempted in server environment');
      return;
    }

    this.ws = new WebSocket(this.wsUrl);

    this.ws.onopen = () => {
      console.log('Connected to Hummingbot');
      this.authenticate();
    };

    this.ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        onMessage(parsedData);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('Disconnected from Hummingbot');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(onMessage), 5000);
    };
  }

  // Authenticate with the gateway
  private authenticate(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'authenticate',
        data: {
          apiKey: this.apiKey
        }
      }));
    }
  }

  // Create a new bot
  public async createBot(botConfig: Omit<Bot, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<BotCreationResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/create_bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(botConfig)
      });

      if (!response.ok) {
        throw new Error('Failed to create bot');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Start a bot
  public async startBot(botId: string): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'start_bot',
        data: { botId }
      }));
    }
  }

  // Stop a bot
  public async stopBot(botId: string): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'stop_bot',
        data: { botId }
      }));
    }
  }

  // Place a new order
  public async placeOrder(order: {
    symbol: string;
    side: 'buy' | 'sell';
    type: 'limit' | 'market';
    quantity: number;
    price?: number;
  }): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Cancel an order
  public async cancelOrder(orderId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/order/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      throw error;
    }
  }

  // Get order book
  public async getOrderBook(symbol: string): Promise<{
    bids: [string, string][];
    asks: [string, string][];
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/order_book/${symbol}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order book');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Subscribe to market data updates
  public subscribeToMarketData(symbol: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        channel: 'market_data',
        data: { symbol }
      }));
    }
  }

  // Unsubscribe from market data updates
  public unsubscribeFromMarketData(symbol: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        channel: 'market_data',
        data: { symbol }
      }));
    }
  }

  // Get bot status
  public async getBotStatus(botId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/bot_status/${botId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bot status');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Get bot metrics
  public async getBotMetrics(botId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/bot_metrics/${botId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bot metrics');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Disconnect from WebSocket
  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create a singleton instance
export const gateway = new HummingbotGateway({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000',
  apiKey: process.env.NEXT_PUBLIC_API_KEY || ''
});
