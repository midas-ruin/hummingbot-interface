'use client';

import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler, FieldErrors, UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';
import styled, { ThemeProvider } from 'styled-components';
import { Theme } from '../styles/theme';
import { theme } from '../styles/theme';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmDialog } from './common/ConfirmDialog';
import { MarketMakingConfig } from './strategies/MarketMakingConfig';
import { ArbitrageConfig } from './strategies/ArbitrageConfig';
import { GridTradingConfig } from './strategies/GridTradingConfig';

interface StyledProps {
  theme: Theme;
}

type Strategy = 'pure_market_making' | 'arbitrage' | 'grid_trading';

interface BaseFormData {
  name: string;
  exchange: string;
  baseAsset: string;
  quoteAsset: string;
  strategy: Strategy;
}

interface MarketMakingData extends BaseFormData {
  strategy: 'pure_market_making';
  bidSpread: string;
  askSpread: string;
  orderSize: string;
  minOrderSize: string;
  maxOrderSize: string;
  orderAmount: string;
  orderInterval: string;
  minProfitability: string;
}

interface ArbitrageData extends BaseFormData {
  strategy: 'arbitrage';
  primaryExchange: string;
  secondaryExchange: string;
  minProfitability: string;
  slippage: string;
  maxOrderSize: string;
  minOrderSize: string;
}

interface GridTradingData extends BaseFormData {
  strategy: 'grid_trading';
  upperPrice: string;
  lowerPrice: string;
  gridLevels: string;
  gridSpacing: string;
  orderSize: string;
  minOrderSize: string;
  maxOrderSize: string;
  rebalanceInterval: string;
  minProfitability: string;
  externalPriceUrl?: string;
}

type FormData = MarketMakingData | ArbitrageData | GridTradingData;

// Constants
const defaultFormData: FormData = {
  name: '',
  strategy: 'pure_market_making',
  exchange: '',
  baseAsset: '',
  quoteAsset: '',
  bidSpread: '',
  askSpread: '',
  orderSize: '',
  minOrderSize: '',
  maxOrderSize: '',
  orderAmount: '',
  orderInterval: '',
  minProfitability: '',
};

const exchanges = ['binance', 'kucoin', 'gate_io', 'huobi'];

const exchangeLabels: Record<string, string> = {
  binance: 'Binance',
  kucoin: 'KuCoin',
  gate_io: 'Gate.io',
  huobi: 'Huobi'
};

// Styled Components
const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
`;

const StyledForm = styled.form<StyledProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: background-color ${({ theme }) => theme.transitions.normal};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const FormGroup = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    &.form-row {
      flex-direction: row;
      gap: ${({ theme }) => theme.spacing.md};
      > * {
        flex: 1;
      }
    }
  }
`;

const Label = styled.label<StyledProps>`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  min-width: 120px;
`;

const StyledInput = styled.input<StyledProps>`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }

  &[aria-invalid="true"] {
    border-color: ${({ theme }) => theme.colors.error};
  }
`;

const StyledSelect = styled.select<StyledProps>`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &[aria-invalid="true"] {
    border-color: ${({ theme }) => theme.colors.error};
  }
`;

const StyledErrorMessage = styled.span<StyledProps>`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const StyledAlert = styled.div<StyledProps & { variant: 'error' | 'success' }>`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: ${(props) => 
    props.variant === 'error' ? `${props.theme.colors.error}15` : `${props.theme.colors.success}15`};
  color: ${(props) => 
    props.variant === 'error' ? props.theme.colors.error : props.theme.colors.success};
  border: 1px solid ${(props) => 
    props.variant === 'error' ? props.theme.colors.error : props.theme.colors.success};
`;

const SubmitButton = styled.button<StyledProps>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary}dd;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondary};
    cursor: not-allowed;
    opacity: 0.7;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: auto;
    min-width: 160px;
    align-self: flex-end;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    position: sticky;
    bottom: ${({ theme }) => theme.spacing.md};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
    font-size: 1.125rem;
  }
`;

const StyledLoadingIndicator = styled.div<StyledProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

const CreateBotForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [validationInProgress, setValidationInProgress] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    trigger
  } = useForm<FormData>({
    defaultValues: defaultFormData,
    mode: 'onChange',
  });

  const formData = watch();

  const handleStrategyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStrategy = event.target.value as Strategy;
    const baseData = {
      name: formData?.name || '',
      exchange: formData?.exchange || '',
      baseAsset: formData?.baseAsset || '',
      quoteAsset: formData?.quoteAsset || '',
      strategy: selectedStrategy,
    };

    let formDataUpdate: FormData;
    switch (selectedStrategy) {
      case 'pure_market_making':
        formDataUpdate = {
          ...baseData,
          strategy: 'pure_market_making',
          bidSpread: '',
          askSpread: '',
          orderSize: '',
          minOrderSize: '',
          maxOrderSize: '',
          orderAmount: '',
          orderInterval: '',
          minProfitability: '',
        };
        break;
      case 'arbitrage':
        formDataUpdate = {
          ...baseData,
          strategy: 'arbitrage',
          primaryExchange: '',
          secondaryExchange: '',
          minProfitability: '',
          slippage: '',
          maxOrderSize: '',
          minOrderSize: '',
        };
        break;
      case 'grid_trading':
        formDataUpdate = {
          ...baseData,
          strategy: 'grid_trading',
          upperPrice: '',
          lowerPrice: '',
          gridLevels: '',
          gridSpacing: '',
          orderSize: '',
          minOrderSize: '',
          maxOrderSize: '',
          rebalanceInterval: '',
          minProfitability: '',
        };
        break;
      default:
        formDataUpdate = {
          ...baseData,
          strategy: 'pure_market_making',
          bidSpread: '',
          askSpread: '',
          orderSize: '',
          minOrderSize: '',
          maxOrderSize: '',
          orderAmount: '',
          orderInterval: '',
          minProfitability: '',
        };
    }
    reset(formDataUpdate);
  };

  const validateForm = useCallback(async () => {
    try {
      await trigger();
      return Object.keys(errors).length === 0;
    } catch (error) {
      return false;
    }
  }, [errors, trigger]);

  const handleFieldChange = (field: string, value: string | number) => {
    setValue(field as any, value);
  };

  React.useEffect(() => {
    const fieldChangeHandler = (event: CustomEvent) => {
      const { field, value } = event.detail;
      setValue(field as keyof FormData, value);
      trigger(field as keyof FormData); // Make sure validation is triggered
    };
    
    window.addEventListener('field-change', fieldChangeHandler as EventListener);
    
    return () => {
      window.removeEventListener('field-change', fieldChangeHandler as EventListener);
    };
  }, [setValue, trigger]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setValidationInProgress(true);
      setIsLoading(true);
      setError(null);

      // Format data before sending to API
      const formattedData = {
        name: data.name,
        exchange: data.exchange,
        baseAsset: data.baseAsset,
        quoteAsset: data.quoteAsset,
        strategy: data.strategy,
        ...(
          data.strategy === 'pure_market_making' ? {
            bidSpread: parseFloat(data.bidSpread || '0'),
            askSpread: parseFloat(data.askSpread || '0'),
            orderSize: parseFloat(data.orderSize || '0'),
            minOrderSize: parseFloat(data.minOrderSize || '0'),
            maxOrderSize: parseFloat(data.maxOrderSize || '0'),
            orderAmount: parseFloat(data.orderAmount || '0'),
            orderInterval: parseInt(data.orderInterval || '0'),
            minProfitability: parseFloat(data.minProfitability || '0')
          } :
          data.strategy === 'arbitrage' ? {
            primaryExchange: data.primaryExchange,
            secondaryExchange: data.secondaryExchange,
            minProfitability: parseFloat(data.minProfitability || '0'),
            slippage: parseFloat(data.slippage || '0'),
            maxOrderSize: parseFloat(data.maxOrderSize || '0'),
            minOrderSize: parseFloat(data.minOrderSize || '0')
          } :
          data.strategy === 'grid_trading' ? {
            upperPrice: parseFloat(data.upperPrice || '0'),
            lowerPrice: parseFloat(data.lowerPrice || '0'),
            gridLevels: parseInt(data.gridLevels || '0'),
            gridSpacing: parseFloat(data.gridSpacing || '0'),
            orderSize: parseFloat(data.orderSize || '0'),
            minOrderSize: parseFloat(data.minOrderSize || '0'),
            maxOrderSize: parseFloat(data.maxOrderSize || '0'),
            rebalanceInterval: parseInt(data.rebalanceInterval || '0'),
            minProfitability: parseFloat(data.minProfitability || '0'),
            externalPriceUrl: data.externalPriceUrl
          } : {}
        )
      };

      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create bot');
      }

      setSuccess('Bot created successfully!');
      toast.success('Bot created successfully!');
      reset(defaultFormData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setValidationInProgress(false);
    }
  };

  const isMarketMakingData = (data: FormData): data is MarketMakingData => {
    return data.strategy === 'pure_market_making';
  };

  const isArbitrageData = (data: FormData): data is ArbitrageData => {
    return data.strategy === 'arbitrage';
  };

  const isGridTradingData = (data: FormData): data is GridTradingData => {
    return data.strategy === 'grid_trading';
  };

  const getStrategySpecificErrors = (data: FormData): Record<string, string> => {
    const result: Record<string, string> = {};

    const getErrorMessage = (field: string) => {
      if (errors[field as keyof typeof errors]?.message) {
        result[field] = errors[field as keyof typeof errors]?.message as string;
      }
    };

    if (isMarketMakingData(data)) {
      const marketMakingFields = [
        'bidSpread',
        'askSpread',
        'orderSize',
        'minProfitability',
        'maxOrderSize',
        'orderAmount',
        'orderInterval',
      ] as const;
      marketMakingFields.forEach((field) => getErrorMessage(field));
    } else if (isArbitrageData(data)) {
      const arbitrageFields = [
        'primaryExchange',
        'secondaryExchange',
        'minProfitability',
        'slippage',
        'maxOrderSize',
        'minOrderSize',
      ] as const;
      arbitrageFields.forEach((field) => getErrorMessage(field));
    } else if (isGridTradingData(data)) {
      const gridTradingFields = [
        'upperPrice',
        'lowerPrice',
        'gridLevels',
        'gridSpacing',
        'orderSize',
        'minOrderSize',
        'maxOrderSize',
        'rebalanceInterval',
        'minProfitability',
      ] as const;
      gridTradingFields.forEach((field) => getErrorMessage(field));
    }

    return result;
  };

  const renderStrategyConfig = () => {
    if (!formData) return null;

    const strategyErrors = getStrategySpecificErrors(formData);

    switch (formData.strategy) {
      case 'pure_market_making':
        return (
          <MarketMakingConfig
            data={formData as MarketMakingData}
            errors={strategyErrors}
            disabled={isSubmitting}
            register={register as UseFormRegister<MarketMakingData>}
          />
        );
      case 'arbitrage':
        return (
          <ArbitrageConfig
            data={formData as ArbitrageData}
            errors={strategyErrors}
            disabled={isSubmitting}
            exchanges={exchanges}
            register={register as UseFormRegister<ArbitrageData>}
          />
        );
      case 'grid_trading':
        return (
          <GridTradingConfig
            data={formData as GridTradingData}
            errors={strategyErrors}
            disabled={isSubmitting}
            register={register as UseFormRegister<GridTradingData>}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Create Bot Form" role="form" theme={theme}>
        {error && (
          <StyledAlert role="alert" variant="error" theme={theme}>
            <span>{error}</span>
          </StyledAlert>
        )}
        
        {success && (
          <StyledAlert role="alert" variant="success" theme={theme}>
            <span>{success}</span>
          </StyledAlert>
        )}
        
        {isLoading && (
          <StyledLoadingIndicator theme={theme}>
            <LoadingSpinner size="medium" />
            <span className="sr-only">Processing your request...</span>
          </StyledLoadingIndicator>
        )}

        <FormGroup theme={theme} role="group" aria-labelledby="bot-info-label">
          <VisuallyHidden id="bot-info-label">Basic Bot Information</VisuallyHidden>
          
          <FormGroup theme={theme}>
            <Label htmlFor="name" theme={theme}>
              Bot Name
            </Label>
            <StyledInput
              type="text"
              id="name"
              {...register('name', {
                required: 'Bot name is required',
                minLength: { value: 3, message: 'Name must be at least 3 characters' },
                maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
                pattern: {
                  value: /^[a-zA-Z0-9_-]+$/,
                  message: 'Name can only contain letters, numbers, underscores and hyphens',
                },
              })}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              theme={theme}
            />
            {errors.name && (
              <StyledErrorMessage id="name-error" role="alert" theme={theme}>
                {errors.name.message}
              </StyledErrorMessage>
            )}
          </FormGroup>

          <FormGroup theme={theme}>
            <Label htmlFor="strategy" theme={theme}>
              Trading Strategy
            </Label>
            <StyledSelect
              id="strategy"
              {...register('strategy', { required: 'Trading strategy is required' })}
              onChange={handleStrategyChange}
              aria-invalid={!!errors.strategy}
              aria-describedby={errors.strategy ? 'strategy-error' : undefined}
              theme={theme}
              title="Select trading strategy"
            >
              <option value="pure_market_making">Pure Market Making</option>
              <option value="arbitrage">Arbitrage</option>
              <option value="grid_trading">Grid Trading</option>
            </StyledSelect>
            {errors.strategy && (
              <StyledErrorMessage id="strategy-error" role="alert" theme={theme}>
                {errors.strategy.message}
              </StyledErrorMessage>
            )}
          </FormGroup>

          <FormGroup theme={theme}>
            <Label htmlFor="exchange" theme={theme}>
              Exchange
            </Label>
            <StyledSelect
              id="exchange"
              {...register('exchange', { required: 'Exchange is required' })}
              aria-invalid={!!errors.exchange}
              aria-describedby={errors.exchange ? 'exchange-error' : undefined}
              theme={theme}
              title="Select exchange"
            >
              <option value="">Select an exchange</option>
              {exchanges.map((exchange) => (
                <option key={exchange} value={exchange}>
                  {exchangeLabels[exchange] || exchange}
                </option>
              ))}
            </StyledSelect>
            {errors.exchange && (
              <StyledErrorMessage id="exchange-error" role="alert" theme={theme}>
                {errors.exchange.message}
              </StyledErrorMessage>
            )}
          </FormGroup>

          <FormGroup theme={theme} className="form-row">
            <FormGroup theme={theme}>
              <Label htmlFor="baseAsset" theme={theme}>
                Base Asset
              </Label>
              <StyledInput
                type="text"
                id="baseAsset"
                {...register('baseAsset', { required: 'Base asset is required' })}
                aria-invalid={!!errors.baseAsset}
                aria-describedby={errors.baseAsset ? 'baseAsset-error' : undefined}
                theme={theme}
                placeholder="BTC"
              />
              {errors.baseAsset && (
                <StyledErrorMessage id="baseAsset-error" role="alert" theme={theme}>
                  {errors.baseAsset.message}
                </StyledErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup theme={theme}>
              <Label htmlFor="quoteAsset" theme={theme}>
                Quote Asset
              </Label>
              <StyledInput
                type="text"
                id="quoteAsset"
                {...register('quoteAsset', { required: 'Quote asset is required' })}
                aria-invalid={!!errors.quoteAsset}
                aria-describedby={errors.quoteAsset ? 'quoteAsset-error' : undefined}
                theme={theme}
                placeholder="USDT"
              />
              {errors.quoteAsset && (
                <StyledErrorMessage id="quoteAsset-error" role="alert" theme={theme}>
                  {errors.quoteAsset.message}
                </StyledErrorMessage>
              )}
            </FormGroup>
          </FormGroup>

          {/* Strategy specific configuration */}
          {renderStrategyConfig()}

          <SubmitButton 
            type="submit" 
            disabled={isSubmitting || validationInProgress || isLoading}
            aria-label="Create Bot"
            theme={theme}
          >
            {isSubmitting || isLoading ? <LoadingSpinner size="small" /> : 'Create Bot'}
          </SubmitButton>
        </FormGroup>

        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleSubmit(onSubmit)}
          title="Confirm Bot Creation"
          message="Are you sure you want to create this bot with the specified configuration?"
        />
      </StyledForm>
    </ThemeProvider>
  );
};

export default CreateBotForm;