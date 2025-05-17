'use client';

import React from 'react';
import styled from 'styled-components';
import { UseFormRegister } from 'react-hook-form';
import { ArbitrageData } from '../../types/bot';

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
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ hasError, theme }) => (hasError ? theme.colors.error : theme.colors.border)};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.normal};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.primary};
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  option {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ hasError, theme }) => (hasError ? theme.colors.error : theme.colors.border)};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.normal};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.primary};
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Description = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

interface ArbitrageConfigProps {
  data: Partial<ArbitrageData>;
  errors: Record<string, string>;
  disabled?: boolean;
  exchanges: string[];
  register: UseFormRegister<ArbitrageData>;
}

export const ArbitrageConfig: React.FC<ArbitrageConfigProps> = ({
  data,
  errors,
  disabled = false,
  exchanges,
  register,
}) => {
  return (
    <ConfigContainer>
      <ConfigRow>
        <FormGroup>
          <Label id="primary-exchange-label" htmlFor="primaryExchange">Primary Exchange</Label>
          <Select
            id="primaryExchange"
            {...register('primaryExchange')}
            disabled={disabled}
            title="Primary Exchange"
            aria-label="Select Primary Exchange"
            aria-invalid={!!errors.primaryExchange ? 'true' : 'false'}
            aria-describedby={errors.primaryExchange ? 'primaryExchange-error' : 'primaryExchange-description'}
          >
            <option value="">Select Exchange</option>
            {exchanges.map((exchange) => (
              <option key={exchange} value={exchange}>
                {exchange}
              </option>
            ))}
          </Select>
          {errors.primaryExchange ? (
            <ErrorMessage id="primary-exchange-error" role="alert">
              {errors.primaryExchange}
            </ErrorMessage>
          ) : (
            <Description id="primary-exchange-description">
              Main exchange for arbitrage trading
            </Description>
          )}
        </FormGroup>

        <FormGroup>
          <Label id="secondary-exchange-label" htmlFor="secondaryExchange">Secondary Exchange</Label>
          <Select
            id="secondaryExchange"
            {...register('secondaryExchange')}
            disabled={disabled}
            hasError={!!errors.secondaryExchange}
            aria-labelledby="secondary-exchange-label"
            aria-invalid={!!errors.secondaryExchange ? 'true' : 'false'}
            aria-describedby={errors.secondaryExchange ? 'secondary-exchange-error' : 'secondary-exchange-description'}
            role="combobox"
            aria-expanded={false}
            aria-label="Secondary exchange selection"
            title="Select secondary exchange"
          >
            <option value="">Select Exchange</option>
            {exchanges.map((exchange) => (
              <option key={exchange} value={exchange}>
                {exchange}
              </option>
            ))}
          </Select>
          {errors.secondaryExchange ? (
            <ErrorMessage id="secondary-exchange-error" role="alert">
              {errors.secondaryExchange}
            </ErrorMessage>
          ) : (
            <Description id="secondary-exchange-description">
              Secondary exchange for arbitrage opportunities
            </Description>
          )}
        </FormGroup>
      </ConfigRow>

      <ConfigRow>
        <FormGroup>
          <Label id="slippage-label" htmlFor="slippage">Slippage Tolerance (%)</Label>
          <Input
            type="number"
            id="slippage"
            {...register('slippage')}
            disabled={disabled}
            hasError={!!errors.slippage}
            min="0"
            step="0.1"
            aria-labelledby="slippage-label"
            aria-invalid={!!errors.slippage ? 'true' : 'false'}
            aria-describedby={errors.slippage ? 'slippage-error' : 'slippage-description'}
          />
          {errors.slippage ? (
            <ErrorMessage id="slippage-error" role="alert">
              {errors.slippage}
            </ErrorMessage>
          ) : (
            <Description id="slippage-description">
              Maximum acceptable price deviation (0.1-5%)
            </Description>
          )}
        </FormGroup>

        <FormGroup>
          <Label id="min-profit-label" htmlFor="minProfitability">Minimum Profit (%)</Label>
          <Input
            type="number"
            id="minProfitability"
            {...register('minProfitability')}
            disabled={disabled}
            hasError={!!errors.minProfitability}
            min="0"
            step="0.1"
            aria-labelledby="min-profit-label"
            aria-invalid={!!errors.minProfitability ? 'true' : 'false'}
            aria-describedby={errors.minProfitability ? 'min-profit-error' : 'min-profit-description'}
          />
          {errors.minProfitability ? (
            <ErrorMessage id="min-profit-error" role="alert">
              {errors.minProfitability}
            </ErrorMessage>
          ) : (
            <Description id="min-profit-description">
              Minimum profit threshold for executing trades
            </Description>
          )}
        </FormGroup>
      </ConfigRow>
    </ConfigContainer>
  );
};
