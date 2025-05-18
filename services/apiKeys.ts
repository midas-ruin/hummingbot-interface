import { ApiKey } from '../types/exchange';
import { HummingbotGateway } from './gateway';

export class ApiKeyService {
  private gateway: HummingbotGateway;

  constructor(gateway: HummingbotGateway) {
    this.gateway = gateway;
  }

  async addApiKey(apiKey: ApiKey): Promise<void> {
    const response = await this.gateway.post<void>('/api_keys', apiKey);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to add API key');
    }
  }

  async deleteApiKey(exchange: string, label: string): Promise<void> {
    const response = await this.gateway.delete<void>(`/api_keys/${exchange}/${encodeURIComponent(label)}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete API key');
    }
  }

  async getApiKeys(): Promise<ApiKey[]> {
    const response = await this.gateway.get<ApiKey[]>('/api_keys');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch API keys');
    }

    return response.data || [];
  }

  async validateApiKey(apiKey: ApiKey): Promise<boolean> {
    const response = await this.gateway.post<{ valid: boolean }>('/api_keys/validate', apiKey);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to validate API key');
    }

    return response.data?.valid || false;
  }
}
