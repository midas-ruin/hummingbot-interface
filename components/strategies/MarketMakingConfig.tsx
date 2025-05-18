'use client';

import React from 'react';
import styled from 'styled-components';
import { UseFormRegister } from 'react-hook-form';
import { MarketMakingData } from '../../types/bot';

interface MarketMakingConfigProps {
  data: Partial<MarketMakingData>;
  errors: Record<string, string>;
  disabled?: boolean;
  register: UseFormRegister<MarketMakingData>;
}

const ConfigContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ConfigRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ $hasError, theme }) => ($hasError ? theme.colors.error : theme.colors.border)};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Description = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const MarketMakingConfig: React.FC<MarketMakingConfigProps> = ({
  data,
  errors,
  disabled = false,
  register,
}) => {
  return (
    <ConfigContainer>
      <ConfigRow>
        <FormGroup>
          <Label htmlFor="bidSpread">Bid Spread (%)</Label>
          <Input
            type="number"
            id="bidSpread"
            {...register('bidSpread')}
            disabled={disabled}
            $hasError={!!errors.bidSpread}
            min="0"
            step="0.1"
          />
          {errors.bidSpread ? (
            <ErrorMessage>{errors.bidSpread}</ErrorMessage>
          ) : (
            <Description>Spread below market price for buy orders</Description>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="askSpread">Ask Spread (%)</Label>
          <Input
            type="number"
            id="askSpread"
            {...register('askSpread')}
            disabled={disabled}
            $hasError={!!errors.askSpread}
            min="0"
            step="0.1"
          />
          {errors.askSpread ? (
            <ErrorMessage>{errors.askSpread}</ErrorMessage>
          ) : (
            <Description>Spread above market price for sell orders</Description>
          )}
        </FormGroup>
      </ConfigRow>

      <ConfigRow>
        <FormGroup>
          <Label htmlFor="orderSize">Order Size</Label>
          <Input
            type="number"
            id="orderSize"
            {...register('orderSize')}
            disabled={disabled}
            $hasError={!!errors.orderSize}
            min="0"
            step="0.0001"
          />
          {errors.orderSize ? (
            <ErrorMessage>{errors.orderSize}</ErrorMessage>
          ) : (
            <Description>Base asset amount per order</Description>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="orderAmount">Order Amount</Label>
          <Input
            type="number"
            id="orderAmount"
            {...register('orderAmount')}
            disabled={disabled}
            $hasError={!!errors.orderAmount}
            min="0"
            step="0.01"
          />
          {errors.orderAmount ? (
            <ErrorMessage>{errors.orderAmount}</ErrorMessage>
          ) : (
            <Description>Quote asset amount per order</Description>
          )}
        </FormGroup>
      </ConfigRow>

      <ConfigRow>
        <FormGroup>
          <Label htmlFor="minOrderSize">Min Order Size</Label>
          <Input
            type="number"
            id="minOrderSize"
            {...register('minOrderSize')}
            disabled={disabled}
            $hasError={!!errors.minOrderSize}
            min="0"
            step="0.0001"
          />
          {errors.minOrderSize ? (
            <ErrorMessage>{errors.minOrderSize}</ErrorMessage>
          ) : (
            <Description>Minimum order size in base asset</Description>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="maxOrderSize">Max Order Size</Label>
          <Input
            type="number"
            id="maxOrderSize"
            {...register('maxOrderSize')}
            disabled={disabled}
            $hasError={!!errors.maxOrderSize}
            min="0"
            step="0.0001"
          />
          {errors.maxOrderSize ? (
            <ErrorMessage>{errors.maxOrderSize}</ErrorMessage>
          ) : (
            <Description>Maximum order size in base asset</Description>
          )}
        </FormGroup>
      </ConfigRow>

      <ConfigRow>
        <FormGroup>
          <Label htmlFor="orderInterval">Order Interval (seconds)</Label>
          <Input
            type="number"
            id="orderInterval"
            {...register('orderInterval')}
            disabled={disabled}
            $hasError={!!errors.orderInterval}
            min="1"
            step="1"
          />
          {errors.orderInterval ? (
            <ErrorMessage>{errors.orderInterval}</ErrorMessage>
          ) : (
            <Description>Time between order updates</Description>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="minProfitability">Min Profitability (%)</Label>
          <Input
            type="number"
            id="minProfitability"
            {...register('minProfitability')}
            disabled={disabled}
            $hasError={!!errors.minProfitability}
            min="0"
            step="0.1"
          />
          {errors.minProfitability ? (
            <ErrorMessage>{errors.minProfitability}</ErrorMessage>
          ) : (
            <Description>Minimum profit threshold for executing trades</Description>
          )}
        </FormGroup>
      </ConfigRow>
    </ConfigContainer>
  );
};
