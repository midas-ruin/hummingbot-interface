import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useOrderContext } from '../../contexts/OrderContext';
import { useExchangeContext } from '../../contexts/ExchangeContext';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../common/LoadingSpinner';

// Types definitions - removed duplicates
type OrderType = 'limit' | 'market';
type OrderSide = 'buy' | 'sell';

interface CreateOrderParams {
  exchange: string;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  amount: number;
  price?: number;
}

interface Balances {
  [key: string]: number;
}

interface FormData {
  type: OrderType;
  price: string;
  amount: string;
}

interface OrderFormProps {
  exchange: string;
  symbol: string;
  selectedPrice?: number;
}

export function OrderForm({ exchange, symbol, selectedPrice }: OrderFormProps) {
  const {
    register,
    handleSubmit: submitForm,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    setError
  } = useForm<FormData>({
    defaultValues: {
      type: 'limit',
      price: selectedPrice?.toString() || '',
      amount: ''
    },
    mode: 'onChange'
  });

  const [isLoading, setIsLoading] = useState(false);
  const formData = watch();

  const { createOrder } = useOrderContext();
  const { balances } = useExchangeContext();

  const [base, quote] = symbol.split('/') as [string, string];

  const validateForm = useCallback(async (data: FormData, side: OrderSide) => {
    const baseBalance = balances?.[base] ?? 0;
    const quoteBalance = balances?.[quote] ?? 0;
    const total = parseFloat(data.amount) * (data.type === 'limit' ? parseFloat(data.price) : 0);

    // For sell orders, we need sufficient base currency
    if (side === 'sell' && parseFloat(data.amount) > baseBalance) {
      setError('amount', { message: `Insufficient ${base} balance` });
      return false;
    }

    // For buy orders, we need sufficient quote currency
    if (side === 'buy' && total > quoteBalance) {
      setError('price', { message: `Insufficient ${quote} balance` });
      return false;
    }

    return true;
  }, [balances, base, quote, setError]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValue(name as keyof FormData, value);
  }, [setValue]);

  const onSubmit = async (data: FormData, side: OrderSide) => {
    setIsLoading(true);
    try {
      const isValid = await validateForm(data, side);
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      const orderParams: CreateOrderParams = {
        exchange,
        symbol,
        type: data.type,
        side,
        amount: parseFloat(data.amount),
        price: data.type === 'limit' ? parseFloat(data.price) : undefined
      };

      await createOrder(orderParams);
      toast.success('Order placed successfully');
      reset({
        type: 'limit',
        price: selectedPrice?.toString() || '',
        amount: ''
      });
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order');
      setError('root', { message: error instanceof Error ? error.message : 'Failed to place order' });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!formData.amount || (formData.type === 'limit' && !formData.price)) {
      return 0;
    }

    const amount = parseFloat(formData.amount);
    const price = formData.type === 'limit' ? parseFloat(formData.price) : 0;
    return amount * price;
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow transition-colors">
      <div 
        className={`flex flex-col gap-2 p-4 rounded-md text-sm ${
          Object.keys(errors).length > 0 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
        }`}
        role="region"
        aria-label="Balance summary"
      >
        <div className="flex justify-between text-gray-700">
          <span>Available {base}</span>
          <span>{(balances?.[base] ?? 0).toFixed(8)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Available {quote}</span>
          <span>{(balances?.[quote] ?? 0).toFixed(8)}</span>
        </div>
      </div>
      
      <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="orderType" 
            id="type-label"
            className="text-base font-medium text-gray-700"
          >
            Order Type
          </label>
          <select
            id="orderType"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            title="Order Type"
            aria-invalid={errors.type ? 'true' : 'false'}
            disabled={isLoading}
            aria-labelledby="type-label"
            aria-required="true"
            className={`p-3 border rounded-md text-base w-full transition-all 
                      focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500
                      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70
                      hover:border-blue-500 
                      ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
            aria-label="Select order type"
          >
            <option value="limit">Limit</option>
            <option value="market">Market</option>
          </select>
          {errors.type ? (
            <div id="type-error" role="alert" className="text-red-500 text-xs mt-1">
              {errors.type.message}
            </div>
          ) : (
            <div id="type-description" className="text-sm text-gray-500 mt-1">
              Choose between limit or market order
            </div>
          )}
        </div>

        {formData.type === 'limit' && (
          <div className="flex flex-col gap-2">
            <label 
              id="price-label" 
              htmlFor="price"
              className="text-base font-medium text-gray-700"
            >
              Price ({quote})
            </label>
            <input
              type="number"
              id="price"
              {...register('price', {
                required: 'Price is required for limit orders',
                min: { value: 0.00000001, message: 'Price must be greater than 0' },
                validate: value => formData.type === 'market' || parseFloat(value) > 0 || 'Price must be greater than 0'
              })}
              disabled={isSubmitting || isLoading || formData.type === 'market'}
              step="0.00000001"
              min="0"
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? 'price-error' : undefined}
              className={`p-3 border rounded-md text-base w-full transition-all
                        focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500
                        disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70
                        hover:border-blue-500
                        ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.price && (
              <div id="price-error" role="alert" className="text-red-500 text-xs mt-1">
                {errors.price.message?.toString()}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label 
            id="amount-label" 
            htmlFor="amount"
            className="text-base font-medium text-gray-700"
          >
            Amount ({base})
          </label>
          <input
            type="number"
            id="amount"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.00000001, message: 'Amount must be greater than 0' },
              validate: value => parseFloat(value) > 0 || 'Amount must be greater than 0'
            })}
            disabled={isSubmitting || isLoading}
            step="0.00000001"
            min="0"
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
            className={`p-3 border rounded-md text-base w-full transition-all
                      focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500
                      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70
                      hover:border-blue-500
                      ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.amount && (
            <div id="amount-error" role="alert" className="text-red-500 text-xs mt-1">
              {errors.amount.message?.toString()}
            </div>
          )}
        </div>

        {formData.type === 'limit' && (
          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between text-gray-700">
              <span>Total ({quote})</span>
              <span>{calculateTotal().toFixed(8)}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Order actions">
          <button
            type="button"
            onClick={() => {
              const handler = submitForm((data: FormData) => onSubmit(data, 'buy'));
              handler();
            }}
            disabled={isSubmitting || isLoading}
            aria-label="Place buy order"
            className={`p-3 px-5 border-none rounded-md text-base font-medium text-white
                      bg-green-500 cursor-pointer transition-all
                      hover:bg-green-600 hover:translate-y-px hover:shadow-sm
                      active:translate-y-0 active:shadow-none
                      focus:outline-none focus:ring-2 focus:ring-green-300 focus:bg-green-600
                      disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gray-400`}
          >
            {isSubmitting || isLoading ? <LoadingSpinner size="small" aria-hidden="true" /> : 'Buy'}
          </button>
          <button
            type="button"
            onClick={() => {
              const handler = submitForm((data: FormData) => onSubmit(data, 'sell'));
              handler();
            }}
            disabled={isSubmitting || isLoading}
            aria-label="Place sell order"
            className={`p-3 px-5 border-none rounded-md text-base font-medium text-white
                      bg-red-500 cursor-pointer transition-all
                      hover:bg-red-600 hover:translate-y-px hover:shadow-sm
                      active:translate-y-0 active:shadow-none
                      focus:outline-none focus:ring-2 focus:ring-red-300 focus:bg-red-600
                      disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gray-400`}
          >
            {isSubmitting || isLoading ? <LoadingSpinner size="small" aria-hidden="true" /> : 'Sell'}
          </button>
        </div>
      </form>
    </div>
  );
}