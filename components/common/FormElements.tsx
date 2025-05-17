import React from 'react';
import styled from 'styled-components';
import { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import Tooltip from './Tooltip';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  tooltip?: string;
  validate?: (value: string) => string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  tooltip?: string;
  validate?: (value: string) => string;
}

interface FormGroupProps {
  label: string;
  tooltip?: string;
  error?: string;
  children: React.ReactNode;
}

const FormGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLabel = styled.label`
  color: #333;
  font-weight: 500;
`;

const StyledInput = styled.input<InputProps>`
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#dc3545' : '#ced4da'};
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #333;
  width: 100%;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#0d6efd'};
    box-shadow: 0 0 0 0.2rem ${props => props.hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(13, 110, 253, 0.25)'};
  }
`;

const StyledSelect = styled.select<SelectProps>`
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#dc3545' : '#ced4da'};
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #333;
  width: 100%;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#0d6efd'};
    box-shadow: 0 0 0 0.2rem ${props => props.hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(13, 110, 253, 0.25)'};
  }
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background-color: #0d6efd;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0b5ed7;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const FormGroup: React.FC<FormGroupProps> = ({ label, tooltip, error, children }) => {
  return (
    <FormGroupContainer>
      <LabelContainer>
        {tooltip ? (
          <Tooltip content={tooltip}>
            <StyledLabel>{label}</StyledLabel>
          </Tooltip>
        ) : (
          <StyledLabel>{label}</StyledLabel>
        )}
      </LabelContainer>
      {children}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormGroupContainer>
  );
};

export const Input: React.FC<InputProps> = ({ validate, onChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validate) {
      const error = validate(e.target.value);
      e.target.setCustomValidity(error);
    }
    onChange?.(e);
  };

  return <StyledInput onChange={handleChange} {...props} />;
};

export const Select: React.FC<SelectProps> = ({ validate, onChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (validate) {
      const error = validate(e.target.value);
      e.target.setCustomValidity(error);
    }
    onChange?.(e);
  };

  return <StyledSelect onChange={handleChange} {...props} />;
};



