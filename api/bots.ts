export interface BotCreationResponse {
  success: boolean;
  error?: string;
  data?: {
    id: string;
    name: string;
    strategy: string;
    status: string;
    createdAt: string;
  };
}

export const createBot = async (payload: any): Promise<BotCreationResponse> => {
  try {
    const response = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create bot');
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create bot'
    };
  }
};
