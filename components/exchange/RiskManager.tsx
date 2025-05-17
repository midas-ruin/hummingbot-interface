import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

interface RiskParams {
  maxPositionSize: number;
  maxLeverage: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  maxDrawdown: number;
  maxDailyLoss: number;
}

interface RiskManagerProps {
  exchange: string;
  onSave: (params: RiskParams) => Promise<void>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #E5E7EB;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${({ hasError }) => (hasError ? '#EF4444' : '#D1D5DB')};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 100%;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 1px #3B82F6;
  }

  &:disabled {
    background-color: #F3F4F6;
    cursor: not-allowed;
  }
`;

const Description = styled.p`
  font-size: 0.75rem;
  color: #6B7280;
  margin: 0;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #3B82F6;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563EB;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #DBEAFE;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const initialRiskParams: RiskParams = {
  maxPositionSize: 1000,
  maxLeverage: 3,
  stopLossPercentage: 5,
  takeProfitPercentage: 10,
  maxDrawdown: 20,
  maxDailyLoss: 100
};

export function RiskManager({ exchange, onSave }: RiskManagerProps) {
  const [params, setParams] = useState<RiskParams>(initialRiskParams);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (params.maxPositionSize <= 0) {
      newErrors.maxPositionSize = 'Must be greater than 0';
    }

    if (params.maxLeverage <= 0) {
      newErrors.maxLeverage = 'Must be greater than 0';
    }

    if (params.stopLossPercentage <= 0 || params.stopLossPercentage >= 100) {
      newErrors.stopLossPercentage = 'Must be between 0 and 100';
    }

    if (params.takeProfitPercentage <= 0 || params.takeProfitPercentage >= 100) {
      newErrors.takeProfitPercentage = 'Must be between 0 and 100';
    }

    if (params.maxDrawdown <= 0 || params.maxDrawdown >= 100) {
      newErrors.maxDrawdown = 'Must be between 0 and 100';
    }

    if (params.maxDailyLoss <= 0) {
      newErrors.maxDailyLoss = 'Must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(params);
      toast.success('Risk parameters updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update risk parameters');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Risk Management</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="maxPositionSize">Maximum Position Size</Label>
          <Input
            type="number"
            id="maxPositionSize"
            name="maxPositionSize"
            value={params.maxPositionSize}
            onChange={handleInputChange}
            disabled={isSubmitting}
            hasError={!!errors.maxPositionSize}
            aria-invalid={!!errors.maxPositionSize}
            aria-describedby={errors.maxPositionSize ? 'maxPositionSize-error' : undefined}
            step="0.00000001"
            min="0"
          />
          <Description>Maximum size for any single position</Description>
          {errors.maxPositionSize && (
            <ErrorMessage id="maxPositionSize-error" role="alert">
              {errors.maxPositionSize}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="maxLeverage">Maximum Leverage</Label>
          <Input
            type="number"
            id="maxLeverage"
            name="maxLeverage"
            value={params.maxLeverage}
            onChange={handleInputChange}
            disabled={isSubmitting}
            hasError={!!errors.maxLeverage}
            aria-invalid={!!errors.maxLeverage}
            aria-describedby={errors.maxLeverage ? 'maxLeverage-error' : undefined}
            step="1"
            min="1"
          />
          <Description>Maximum allowed leverage for positions</Description>
          {errors.maxLeverage && (
            <ErrorMessage id="maxLeverage-error" role="alert">
              {errors.maxLeverage}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="stopLossPercentage">Stop Loss Percentage</Label>
          <Input
            type="number"
            id="stopLossPercentage"
            name="stopLossPercentage"
            value={params.stopLossPercentage}
            onChange={handleInputChange}
            disabled={isSubmitting}
            hasError={!!errors.stopLossPercentage}
            aria-invalid={!!errors.stopLossPercentage}
            aria-describedby={errors.stopLossPercentage ? 'stopLossPercentage-error' : undefined}
            step="0.1"
            min="0"
            max="100"
          />
          <Description>Default stop loss percentage for positions</Description>
          {errors.stopLossPercentage && (
            <ErrorMessage id="stopLossPercentage-error" role="alert">
              {errors.stopLossPercentage}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="takeProfitPercentage">Take Profit Percentage</Label>
          <Input
            type="number"
            id="takeProfitPercentage"
            name="takeProfitPercentage"
            value={params.takeProfitPercentage}
            onChange={handleInputChange}
            disabled={isSubmitting}
            hasError={!!errors.takeProfitPercentage}
            aria-invalid={!!errors.takeProfitPercentage}
            aria-describedby={errors.takeProfitPercentage ? 'takeProfitPercentage-error' : undefined}
            step="0.1"
            min="0"
            max="100"
          />
          <Description>Default take profit percentage for positions</Description>
          {errors.takeProfitPercentage && (
            <ErrorMessage id="takeProfitPercentage-error" role="alert">
              {errors.takeProfitPercentage}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="maxDrawdown">Maximum Drawdown</Label>
          <Input
            type="number"
            id="maxDrawdown"
            name="maxDrawdown"
            value={params.maxDrawdown}
            onChange={handleInputChange}
            disabled={isSubmitting}
            hasError={!!errors.maxDrawdown}
            aria-invalid={!!errors.maxDrawdown}
            aria-describedby={errors.maxDrawdown ? 'maxDrawdown-error' : undefined}
            step="0.1"
            min="0"
            max="100"
          />
          <Description>Maximum allowed drawdown percentage</Description>
          {errors.maxDrawdown && (
            <ErrorMessage id="maxDrawdown-error" role="alert">
              {errors.maxDrawdown}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="maxDailyLoss">Maximum Daily Loss</Label>
          <Input
            type="number"
            id="maxDailyLoss"
            name="maxDailyLoss"
            value={params.maxDailyLoss}
            onChange={handleInputChange}
            disabled={isSubmitting}
            hasError={!!errors.maxDailyLoss}
            aria-invalid={!!errors.maxDailyLoss}
            aria-describedby={errors.maxDailyLoss ? 'maxDailyLoss-error' : undefined}
            step="0.1"
            min="0"
          />
          <Description>Maximum allowed loss per day</Description>
          {errors.maxDailyLoss && (
            <ErrorMessage id="maxDailyLoss-error" role="alert">
              {errors.maxDailyLoss}
            </ErrorMessage>
          )}
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          Save Risk Parameters
        </Button>
      </Form>
    </Container>
  );
}
