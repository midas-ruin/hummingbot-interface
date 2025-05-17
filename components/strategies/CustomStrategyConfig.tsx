'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

// Define theme types to ensure type safety
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    background: {
      primary: string;
      secondary: string;
      surface: string;
    };
    text: {
      primary: string;
      secondary: string;
      inverted: string;
    };
    border: string;
  };
}

// Fix styled components with proper TypeScript support
const ConfigContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }: { theme: Theme }) => theme.colors.text.primary};
`;

interface InputProps {
  hasError?: boolean;
  theme?: Theme;
}

const Input = styled.input<InputProps>`
  padding: 0.75rem;
  border: 1px solid ${({ hasError, theme }) => (hasError ? theme?.colors.error : theme?.colors.border)};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 100%;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors.text.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme?.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme?.colors.background.secondary};
    cursor: not-allowed;
  }
`;

interface TextAreaProps {
  hasError?: boolean;
  theme?: Theme;
}

const TextArea = styled.textarea<TextAreaProps>`
  padding: 0.75rem;
  border: 1px solid ${({ hasError, theme }) => (hasError ? theme?.colors.error : theme?.colors.border)};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 100%;
  min-height: 200px;
  font-family: monospace;
  transition: border-color 0.2s;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors.text.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme?.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme?.colors.background.secondary};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }: { theme: Theme }) => theme.colors.error};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const Description = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }: { theme: Theme }) => theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

interface SelectProps {
  hasError?: boolean;
  theme?: Theme;
}

const Select = styled.select<SelectProps>`
  padding: 0.75rem;
  border: 1px solid ${({ hasError, theme }) => (hasError ? theme?.colors.error : theme?.colors.border)};
  border-radius: 0.375rem;
  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme?.colors.error};
  }
  font-size: 0.875rem;
  width: 100%;
  transition: border-color 0.2s;
  background-color: ${({ theme }) => theme?.colors.background.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors.text.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme?.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme?.colors.background.secondary};
    cursor: not-allowed;
  }
`;

interface CustomStrategyData {
  name: string;
  scriptContent: string;
  scriptType: 'python' | 'javascript';
  updateInterval: string;
  maxPositionSize: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface CustomStrategyConfigProps {
  data: CustomStrategyData;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
  disabled?: boolean;
  onValidate?: (field: keyof CustomStrategyData, value: string) => Promise<boolean>;
}

export function CustomStrategyConfig({
  data,
  errors,
  onFieldChange,
  disabled = false,
  onValidate
}: CustomStrategyConfigProps) {
  const handleChange = async (field: keyof CustomStrategyData, value: string) => {
    if (onValidate) {
      const isValid = await onValidate(field, value);
      if (!isValid) return;
    }
    onFieldChange(field, value);
  };

  return (
    <ConfigContainer>
      <FormGroup>
        <Label htmlFor="name">Strategy Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={(e) => handleChange('name', e.target.value)}
          disabled={disabled}
          hasError={!!errors.name}
          aria-invalid={!!errors.name}
          aria-required="true"
          aria-describedby={errors.name ? 'name-error' : 'name-description'}
        />
        {errors.name ? (
          <ErrorMessage id="name-error" role="alert">
            {errors.name}
          </ErrorMessage>
        ) : (
          <Description id="name-description">
            A unique name for your custom strategy
          </Description>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="scriptType">Script Type</Label>
        <Select
          id="scriptType"
          name="scriptType"
          value={data.scriptType}
          onChange={(e) => handleChange('scriptType', e.target.value as 'python' | 'javascript')}
          disabled={disabled}
          hasError={!!errors.scriptType}
          aria-invalid={!!errors.scriptType}
          aria-required="true"
          aria-describedby={errors.scriptType ? 'script-type-error' : 'script-type-description'}
          title="Select the programming language for your strategy"
          aria-label="Script Type Selection"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </Select>
        {errors.scriptType ? (
          <ErrorMessage id="script-type-error" role="alert">
            {errors.scriptType}
          </ErrorMessage>
        ) : (
          <Description id="script-type-description">
            Programming language for your strategy
          </Description>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="scriptContent">Strategy Script</Label>
        <TextArea
          id="scriptContent"
          name="scriptContent"
          value={data.scriptContent}
          onChange={(e) => handleChange('scriptContent', e.target.value)}
          disabled={disabled}
          hasError={!!errors.scriptContent}
          aria-invalid={!!errors.scriptContent}
          aria-required="true"
          aria-describedby={errors.scriptContent ? 'script-content-error' : 'script-content-description'}
          title="Strategy Script"
        />
        {errors.scriptContent ? (
          <ErrorMessage id="script-content-error" role="alert">
            {errors.scriptContent}
          </ErrorMessage>
        ) : (
          <Description id="script-content-description">
            Write your strategy code here. Use the documentation for reference.
          </Description>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="updateInterval">Update Interval (sec)</Label>
          <Select
            id="parameterType"
            name="parameterType"
            title="Select parameter type"
            aria-label="Parameter Type"
            onChange={handleParameterTypeChange}
            value={parameterType}
          >
            <option value="updateInterval">Update Interval (sec)</option>
          </Select>
          <Input
            type="number"
            id="updateInterval"
            name="updateInterval"
            value={data.updateInterval}
            onChange={(e) => handleChange('updateInterval', e.target.value)}
            min="1"
            step="1"
            disabled={disabled}
            hasError={!!errors.updateInterval}
            aria-invalid={!!errors.updateInterval}
            aria-required="true"
            aria-describedby={errors.updateInterval ? 'update-interval-error' : 'update-interval-description'}
          />
        {errors.updateInterval ? (
          <ErrorMessage id="update-interval-error" role="alert">
            {errors.updateInterval}
          </ErrorMessage>
        ) : (
          <Description id="update-interval-description">
            How often to run the strategy (in seconds)
          </Description>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="maxPositionSize">Maximum Position Size</Label>
        <Input
          type="number"
          id="maxPositionSize"
          name="maxPositionSize"
          value={data.maxPositionSize}
          onChange={(e) => handleChange('maxPositionSize', e.target.value)}
          min="0"
          step="0.000001"
          disabled={disabled}
          hasError={!!errors.maxPositionSize}
          aria-invalid={!!errors.maxPositionSize}
          aria-required="true"
          aria-describedby={errors.maxPositionSize ? 'max-position-error' : 'max-position-description'}
        />
        {errors.maxPositionSize ? (
          <ErrorMessage id="max-position-error" role="alert">
            {errors.maxPositionSize}
          </ErrorMessage>
        ) : (
          <Description id="max-position-description">
            Maximum position size in base asset
          </Description>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="riskLevel">Risk Level</Label>
        <Select
          id="riskLevel"
          name="riskLevel"
          value={data.riskLevel}
          onChange={(e) => handleChange('riskLevel', e.target.value as 'low' | 'medium' | 'high')}
          disabled={disabled}
          hasError={!!errors.riskLevel}
          aria-invalid={!!errors.riskLevel}
          aria-required="true"
          aria-describedby={errors.riskLevel ? 'risk-level-error' : 'risk-level-description'}
          title="Select the risk level for your strategy"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
        {errors.riskLevel ? (
          <ErrorMessage id="risk-level-error" role="alert">
            {errors.riskLevel}
          </ErrorMessage>
        ) : (
          <Description id="risk-level-description">
            Strategy risk level for monitoring
          </Description>
        )}
      </FormGroup>
    </ConfigContainer>
  );
}