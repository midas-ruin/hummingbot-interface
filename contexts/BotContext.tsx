'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Bot } from '../types/bot';
import { gateway } from '../services/gateway';

interface BotState {
  bots: Bot[];
  activeBotId: string | null;
  loading: boolean;
  error: string | null;
}

type BotAction =
  | { type: 'SET_BOTS'; payload: Bot[] }
  | { type: 'ADD_BOT'; payload: Bot }
  | { type: 'UPDATE_BOT'; payload: Bot }
  | { type: 'REMOVE_BOT'; payload: string }
  | { type: 'SET_ACTIVE_BOT'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: BotState = {
  bots: [],
  activeBotId: null,
  loading: false,
  error: null
};

const BotContext = createContext<{
  state: BotState;
  dispatch: React.Dispatch<BotAction>;
  createBot: (botConfig: Omit<Bot, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  startBot: (botId: string) => Promise<void>;
  stopBot: (botId: string) => Promise<void>;
} | undefined>(undefined);

function botReducer(state: BotState, action: BotAction): BotState {
  switch (action.type) {
    case 'SET_BOTS':
      return { ...state, bots: action.payload };
    case 'ADD_BOT':
      return { ...state, bots: [...state.bots, action.payload] };
    case 'UPDATE_BOT':
      return {
        ...state,
        bots: state.bots.map(bot =>
          bot.id === action.payload.id ? action.payload : bot
        )
      };
    case 'REMOVE_BOT':
      return {
        ...state,
        bots: state.bots.filter(bot => bot.id !== action.payload)
      };
    case 'SET_ACTIVE_BOT':
      return { ...state, activeBotId: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function BotProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(botReducer, initialState);

  useEffect(() => {
    // Connect to Hummingbot WebSocket
    gateway.connect((data) => {
      // Handle real-time updates
      if (data.type === 'bot_update') {
        dispatch({ type: 'UPDATE_BOT', payload: data.bot });
      }
    });

    return () => {
      gateway.disconnect();
    };
  }, []);

  const createBot = async (
    botConfig: Omit<Bot, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await gateway.createBot(botConfig);
      if (response.success && response.data) {
        dispatch({ type: 'ADD_BOT', payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to create bot');
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to create bot'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const startBot = async (botId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      await gateway.startBot(botId);
      // The actual bot status update will come through the WebSocket connection
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to start bot'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const stopBot = async (botId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      await gateway.stopBot(botId);
      // The actual bot status update will come through the WebSocket connection
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to stop bot'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <BotContext.Provider
      value={{ state, dispatch, createBot, startBot, stopBot }}
    >
      {children}
    </BotContext.Provider>
  );
}

export function useBotContext() {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBotContext must be used within a BotProvider');
  }
  return context;
}
