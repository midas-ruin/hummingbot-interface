import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-toastify';
import { Bot, ApiResponse, BotCreationResponse, BotFormData } from '../types/bot';

interface BotStore {
  // State
  bots: Bot[];
  isLoading: boolean;
  error: string | null;
  selectedBot: Bot | null;

  // Actions
  setError: (error: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setSelectedBot: (bot: Bot | null) => void;
  
  // API Methods
  createBot: (data: BotFormData) => Promise<ApiResponse<BotCreationResponse>>;
  fetchBots: () => Promise<void>;
  updateBot: (id: string, data: Partial<BotFormData>) => Promise<ApiResponse<Bot>>;
  deleteBot: (id: string) => Promise<ApiResponse<void>>;
  startBot: (id: string) => Promise<ApiResponse<Bot>>;
  stopBot: (id: string) => Promise<ApiResponse<Bot>>;
}

const useBotStore = create<BotStore>()(
  persist(
    (set, get) => ({
      // Initial state
      bots: [],
      isLoading: false,
      error: null,
      selectedBot: null,

      // Actions
      setError: (error) => {
        set({ error });
        toast.error(error);
      },
      clearError: () => set({ error: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSelectedBot: (bot) => set({ selectedBot: bot }),

      // API Methods
      createBot: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/bots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || 'Failed to create bot');
          }

          set((state) => ({
            bots: [...state.bots, result.data],
            isLoading: false,
          }));

          toast.success('Bot created successfully');
          return { success: true, data: result };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create bot';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return { success: false, error: errorMessage, data: null };
        }
      },

      fetchBots: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/bots');
          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch bots');
          }

          set({ bots: result.data, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bots';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        }
      },

      updateBot: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/bots/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || 'Failed to update bot');
          }

          set((state) => ({
            bots: state.bots.map((bot) => (bot.id === id ? result.data : bot)),
            isLoading: false,
          }));

          toast.success('Bot updated successfully');
          return { success: true, data: result.data };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update bot';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return { success: false, error: errorMessage, data: null };
        }
      },

      deleteBot: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/bots/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Failed to delete bot');
          }

          set((state) => ({
            bots: state.bots.filter((bot) => bot.id !== id),
            isLoading: false,
          }));

          toast.success('Bot deleted successfully');
          return { success: true, data: null };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete bot';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return { success: false, error: errorMessage, data: null };
        }
      },

      startBot: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/bots/${id}/start`, {
            method: 'POST',
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || 'Failed to start bot');
          }

          set((state) => ({
            bots: state.bots.map((bot) => (bot.id === id ? result.data : bot)),
            isLoading: false,
          }));

          toast.success('Bot started successfully');
          return { success: true, data: result.data };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to start bot';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return { success: false, error: errorMessage, data: null };
        }
      },

      stopBot: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/bots/${id}/stop`, {
            method: 'POST',
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || 'Failed to stop bot');
          }

          set((state) => ({
            bots: state.bots.map((bot) => (bot.id === id ? result.data : bot)),
            isLoading: false,
          }));

          toast.success('Bot stopped successfully');
          return { success: true, data: result.data };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to stop bot';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return { success: false, error: errorMessage, data: null };
        }
      },
    }),
    {
      name: 'bot-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useBotStore;
