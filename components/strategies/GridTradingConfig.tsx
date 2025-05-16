'use client';

import React from 'react';
import styled from 'styled-components';
import { UseFormRegister } from 'react-hook-form';
import { GridTradingData } from '../../types/bot';

interface GridTradingConfigProps {
  data: Partial<GridTradingData>;
  errors: Record<string, string>;
  disabled?: boolean;
  register: UseFormRegister<GridTradingData>;
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

export const GridTradingConfig: React.FC<GridTradingConfigProps> = ({
  data,
  errors,
  disabled = false,
  register,
}) => {
  return (
    <ConfigContainer>
      <ConfigRow>
        <FormGroup>
          <Label htmlFor="upperPrice">Upper Price</Label>
          <Input
            type="number"
            id="upperPrice"
            {...register('upperPrice')}
            disabled={disabled}
            $hasError={!!errors.upperPrice}
            min="0"
            step="0.0001"
          />
          {errors.upperPrice ? (
            <ErrorMessage>{errors.upperPrice}</ErrorMessage>
          ) : (
            <Description>Upper price limit for grid</Description>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="lowerPrice">Lower Price</Label>
          <Input
            type="number"
            id="lowerPrice"
            {...register('lowerPrice')}
            disabled={disabled}
            $hasError={!!errors.lowerPrice}
            min="0"
            step="0.0001"
          />
          {errors.lowerPrice ? (
            <ErrorMessage>{errors.lowerPrice}</ErrorMessage>
          ) : (
            <Description>Lower price limit for grid</Description>
          )}
        </FormGroup>
      </ConfigRow>

      <ConfigRow>
        <FormGroup>
          <Label htmlFor="gridLevels">Grid Levels</Label>
          <Input
            type="number"
            id="gridLevels"
            {...register('gridLevels')}
            disabled={disabled}
            $hasError={!!errors.gridLevels}
            min="2"
            step="1"
          />
          {errors.gridLevels ? (
            <ErrorMessage>{errors.gridLevels}</ErrorMessage>
          ) : (
            <Description>Number of price levels in grid</Description>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="gridSpacing">Grid Spacing (%)</Label>
          <Input
            type="number"
            id="gridSpacing"
            {...register('gridSpacing')}
            disabled={disabled}
            $hasError={!!errors.gridSpacing}
            min="0.1"
            step="0.1"
          />
          {errors.gridSpacing ? (
            <ErrorMessage>{errors.gridSpacing}</ErrorMessage>
          ) : (
            <Description>Percentage between grid levels</Description>
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
          <Label htmlFor="rebalanceInterval">Rebalance Interval (seconds)</Label>
          <Input
            type="number"
            id="rebalanceInterval"
            {...register('rebalanceInterval')}
            disabled={disabled}
            $hasError={!!errors.rebalanceInterval}
            min="1"
            step="1"
          />
          {errors.rebalanceInterval ? (
            <ErrorMessage>{errors.rebalanceInterval}</ErrorMessage>
          ) : (
            <Description>Time between grid rebalancing</Description>
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

        <FormGroup>
          <Label htmlFor="externalPriceUrl">External Price URL (Optional)</Label>
          <Input
            type="text"
            id="externalPriceUrl"
            {...register('externalPriceUrl')}
            disabled={disabled}
            $hasError={!!errors.externalPriceUrl}
            placeholder="https://api.example.com/price"
          />
          {errors.externalPriceUrl ? (
            <ErrorMessage>{errors.externalPriceUrl}</ErrorMessage>
          ) : (
            <Description>External price feed URL for reference</Description>
          )}
        </FormGroup>
      </ConfigRow>
    </ConfigContainer>
  );
}; 