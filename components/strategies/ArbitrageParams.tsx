import React from 'react';
import styled from 'styled-components';
import { FormGroup, Input, Select } from '../common/FormElements';
import { validateText, validateNumber, tooltips } from '../../utils/validation';

const StyledSection = styled.section`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

const ExchangeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ParametersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

interface ArbitrageParamsProps {
  formData: {
    primaryExchange: string;
    secondaryExchange: string;
    minProfitability: string;
    maxOrderSize: string;
    minOrderSize: string;
    slippage: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors?: Record<string, string>;
}

const ArbitrageParams: React.FC<ArbitrageParamsProps> = ({ formData, onChange, errors = {} }) => {
  const validateExchanges = (value: string, fieldName: string) => {
    if (fieldName === 'primaryExchange' && value === formData.secondaryExchange) {
      return 'Primary and secondary exchanges must be different';
    }
    if (fieldName === 'secondaryExchange' && value === formData.primaryExchange) {
      return 'Secondary and primary exchanges must be different';
    }
    return '';
  };
  const validateProfitability = (value: string) => {
    const error = validateNumber(value, { required: true, min: 0, max: 100 });
    if (error) return error;
    const num = parseFloat(value);
    if (num > 20) return 'Profitability target should not exceed 20%';
    return '';
  };

  const validateSlippage = (value: string) => {
    const error = validateNumber(value, { required: true, min: 0, max: 100 });
    if (error) return error;
    const num = parseFloat(value);
    if (num > 5) return 'Slippage should not exceed 5%';
    return '';
  };

  const validateOrderSize = (value: string, isMax = false) => {
    const error = validateNumber(value, { required: true, min: 0.00000001 });
    if (error) return error;
    const num = parseFloat(value);
    const otherValue = isMax ? formData.minOrderSize : formData.maxOrderSize;
    if (otherValue && isMax && num <= parseFloat(otherValue)) {
      return 'Maximum order size must be greater than minimum order size';
    }
    if (otherValue && !isMax && num >= parseFloat(otherValue)) {
      return 'Minimum order size must be less than maximum order size';
    }
    return '';
  };

  return (
    <StyledSection>
      <SectionTitle>Arbitrage Parameters</SectionTitle>

      <ExchangeGrid>
        <FormGroup
          label="Primary Exchange"
          tooltip={tooltips.primaryExchange}
          error={errors.primaryExchange}
        >
          <Select
            id="primaryExchange"
            name="primaryExchange"
            aria-label="Primary Exchange"
            value={formData.primaryExchange}
            onChange={onChange}
            hasError={!!errors.primaryExchange}
            validate={(value) => {
              const textError = validateText(value, { required: true });
              if (textError) return textError;
              return validateExchanges(value, 'primaryExchange');
            }}
          >
            <option value="">Select Exchange</option>
            <option value="binance">Binance</option>
            <option value="coinbase">Coinbase</option>
            <option value="kraken">Kraken</option>
            <option value="kucoin">KuCoin</option>
          </Select>
        </FormGroup>

        <FormGroup
          label="Secondary Exchange"
          tooltip={tooltips.secondaryExchange}
          error={errors.secondaryExchange}
        >
          <Select
            id="secondaryExchange"
            name="secondaryExchange"
            aria-label="Secondary Exchange"
            value={formData.secondaryExchange}
            onChange={onChange}
            hasError={!!errors.secondaryExchange}
            validate={(value) => {
              const textError = validateText(value, { required: true });
              if (textError) return textError;
              return validateExchanges(value, 'secondaryExchange');
            }}
          >
            <option value="">Select Exchange</option>
            <option value="binance">Binance</option>
            <option value="coinbase">Coinbase</option>
            <option value="kraken">Kraken</option>
            <option value="kucoin">KuCoin</option>
          </Select>
        </FormGroup>
      </ExchangeGrid>

      <ParametersGrid>
        <FormGroup
          label="Minimum Profitability (%)"
          tooltip={tooltips.minProfitability}
          error={errors.minProfitability}
        >
          <Input
            type="number"
            id="minProfitability"
            name="minProfitability"
            value={formData.minProfitability}
            onChange={onChange}
            hasError={!!errors.minProfitability}
            min="0"
            step="0.1"
            aria-label="Minimum Profitability Percentage"
            validate={validateProfitability}
          />
        </FormGroup>

        <FormGroup
          label="Slippage (%)"
          tooltip={tooltips.slippage}
          error={errors.slippage}
        >
          <Input
            type="number"
            id="slippage"
            name="slippage"
            value={formData.slippage}
            onChange={onChange}
            hasError={!!errors.slippage}
            min="0"
            step="0.1"
            aria-label="Slippage Percentage"
            validate={validateSlippage}
          />
        </FormGroup>

        <FormGroup
          label="Minimum Order Size"
          tooltip={tooltips.minOrderSize}
          error={errors.minOrderSize}
        >
          <Input
            type="number"
            id="minOrderSize"
            name="minOrderSize"
            value={formData.minOrderSize}
            onChange={onChange}
            hasError={!!errors.minOrderSize}
            min="0"
            step="0.00000001"
            aria-label="Minimum Order Size"
            validate={(value) => validateOrderSize(value, false)}
          />
        </FormGroup>

        <FormGroup
          label="Maximum Order Size"
          tooltip={tooltips.maxOrderSize}
          error={errors.maxOrderSize}
        >
          <Input
            type="number"
            id="maxOrderSize"
            name="maxOrderSize"
            value={formData.maxOrderSize}
            onChange={onChange}
            hasError={!!errors.maxOrderSize}
            min="0"
            step="0.00000001"
            aria-label="Maximum Order Size"
            validate={(value) => validateOrderSize(value, true)}
          />
        </FormGroup>
      </ParametersGrid>
    </StyledSection>
  );
};

export default ArbitrageParams;
