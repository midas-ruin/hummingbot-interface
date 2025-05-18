import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import CreateBotForm from '../CreateBotForm';
import useBotStore from '../../store/botStore';
import '@testing-library/jest-dom';

interface ApiResponse {
  success: boolean;
  error?: string;
  data: {
    success: boolean;
    message: string;
    data: {
      name: string;
      strategy: string;
      exchange: string;
      baseAsset: string;
      quoteAsset: string;
    };
  } | null;
}

interface MockBotStore {
  isLoading: boolean;
  error: string | null;
  bots: any[];
  setError: jest.Mock;
  clearError: jest.Mock;
  createBot: jest.Mock<Promise<ApiResponse>, [any]>;
}

// Mock dependencies
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('react-confirm-alert', () => ({
  confirmAlert: jest.fn((options: any) => {
    // Immediately call onClickYes to simulate confirmation
    options.onClickYes();
  })
}));

jest.mock('../../store/botStore');

describe('CreateBotForm', () => {
  let mockStore: MockBotStore;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockStore = {
      bots: [],
      isLoading: false,
      error: null,
      setError: jest.fn(),
      clearError: jest.fn(),
      createBot: jest.fn().mockResolvedValue({
        success: true,
        data: {
          success: true,
          message: 'Bot created successfully',
          data: {
            name: 'Test Bot',
            strategy: 'pure_market_making',
            exchange: 'binance',
            baseAsset: 'BTC',
            quoteAsset: 'USDT'
          }
        }
      })
    };

    (useBotStore as unknown as jest.Mock).mockImplementation((selector) => selector(mockStore));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<CreateBotForm />);
    
    expect(screen.getByLabelText('Bot Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Trading Strategy')).toBeInTheDocument();
    expect(screen.getByLabelText('Exchange')).toBeInTheDocument();
    expect(screen.getByLabelText('Base Asset')).toBeInTheDocument();
    expect(screen.getByLabelText('Quote Asset')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<CreateBotForm />);
    
    const submitButton = screen.getByRole('button', { name: /create bot/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Exchange is required')).toBeInTheDocument();
      expect(screen.getByText('Base asset is required')).toBeInTheDocument();
      expect(screen.getByText('Quote asset is required')).toBeInTheDocument();
    });
  });

  it('shows strategy-specific fields when strategy is changed', async () => {
    render(<CreateBotForm />);
    
    const strategySelect = screen.getByLabelText('Trading Strategy');

    // Test Market Making strategy fields
    await userEvent.selectOptions(strategySelect, 'pure_market_making');
    expect(screen.getByLabelText('Bid Spread (%)')).toBeInTheDocument();
    expect(screen.getByLabelText('Ask Spread (%)')).toBeInTheDocument();

    // Test Arbitrage strategy fields
    await userEvent.selectOptions(strategySelect, 'arbitrage');
    expect(screen.getByLabelText('Primary Exchange')).toBeInTheDocument();
    expect(screen.getByLabelText('Secondary Exchange')).toBeInTheDocument();

    // Test Grid Trading strategy fields
    await userEvent.selectOptions(strategySelect, 'grid_trading');
    expect(screen.getByLabelText('Upper Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Lower Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Grid Levels')).toBeInTheDocument();
  });

  it('submits form data successfully', async () => {
    render(<CreateBotForm />);

    // Fill out form
    await userEvent.type(screen.getByLabelText(/bot name/i), 'Test Bot');
    await userEvent.selectOptions(screen.getByLabelText(/trading strategy/i), 'pure_market_making');
    await userEvent.selectOptions(screen.getByLabelText(/exchange/i), 'binance');
    await userEvent.type(screen.getByLabelText(/base asset/i), 'BTC');
    await userEvent.type(screen.getByLabelText(/quote asset/i), 'USDT');

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create bot/i }));

    await waitFor(() => {
      expect(mockStore.createBot).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Bot created successfully!');
    });
  });

  it('handles API error', async () => {
    const mockError = 'API Error';
    mockStore.createBot.mockResolvedValueOnce({ success: false, error: mockError, data: null });

    render(<CreateBotForm />);

    // Fill out form
    await userEvent.type(screen.getByLabelText(/bot name/i), 'Test Bot');
    await userEvent.selectOptions(screen.getByLabelText(/trading strategy/i), 'pure_market_making');
    await userEvent.selectOptions(screen.getByLabelText(/exchange/i), 'binance');
    await userEvent.type(screen.getByLabelText(/base asset/i), 'BTC');
    await userEvent.type(screen.getByLabelText(/quote asset/i), 'USDT');

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create bot/i }));

    await waitFor(() => {
      expect(mockStore.setError).toHaveBeenCalledWith(mockError);
      expect(toast.error).toHaveBeenCalledWith(mockError);
    });
  });
});
