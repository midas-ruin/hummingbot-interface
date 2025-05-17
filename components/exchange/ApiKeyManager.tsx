'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface ApiKey {
  exchange: string;
  apiKey: string;
  secretKey: string;
  label?: string;
  isActive: boolean;
}

interface ApiKeyFormData {
  exchange: string;
  apiKey: string;
  secretKey: string;
  label: string;
}

interface ApiKeyManagerProps {
  onSave?: (apiKey: ApiKey) => Promise<void>;
  onDelete?: (exchange: string, label: string) => Promise<void>;
  initialApiKeys?: ApiKey[];
}

interface StyledComponentProps {
  theme: {
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    colors: {
      surface: string;
      text: string;
      textSecondary: string;
      primary: string;
      error: string;
      border: string;
      background: string;
    };
    shadows: {
      sm: string;
    };
    transitions: {
      normal: string;
    };
    typography: {
      fontSize: {
        small: string;
        base: string;
      };
      fontWeight: {
        medium: string;
      };
      fontFamily: string;
    };
  };
}

interface ButtonProps extends StyledComponentProps {
  variant?: 'primary' | 'danger';
}

interface InputProps extends StyledComponentProps {
  hasError?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
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

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondary};
    cursor: not-allowed;
  }
`;

const ApiKeyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ApiKeyItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ApiKeyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ApiKeyLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const ApiKeyExchange = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Description = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const initialFormData: ApiKeyFormData = {
  exchange: '',
  apiKey: '',
  secretKey: '',
  label: ''
};

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ 
  onSave: propOnSave, 
  onDelete: propOnDelete, 
  initialApiKeys = [] 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ApiKeyFormData>();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);

  const onSubmit = async (data: ApiKeyFormData) => {
    try {
      setIsSubmitting(true);
      const newApiKey: ApiKey = {
        ...data,
        isActive: true
      };

      if (propOnSave) {
        await propOnSave(newApiKey);
      }

      setApiKeys(prev => [...prev, newApiKey]);
      reset(initialFormData);
      toast.success('API key added successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (exchange: string, label: string) => {
    try {
      if (propOnDelete) {
        await propOnDelete(exchange, label);
      }

      setApiKeys(prev => prev.filter(key => !(key.exchange === exchange && key.label === label)));
      toast.success('API key deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete API key');
    }
  };

  return (
    <Container>
      <h2>API Key Management</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="exchange">Exchange</Label>
          <Input
            id="exchange"
            {...register('exchange', { required: 'Exchange is required' })}
            placeholder="Enter exchange name"
          />
          {errors.exchange && <span>{errors.exchange.message}</span>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            {...register('label', { required: 'Label is required' })}
            placeholder="Enter label"
          />
          {errors.label && <span>{errors.label.message}</span>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            {...register('apiKey', { required: 'API key is required' })}
            placeholder="Enter API key"
          />
          {errors.apiKey && <span>{errors.apiKey.message}</span>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="secretKey">Secret Key</Label>
          <Input
            id="secretKey"
            type="password"
            {...register('secretKey', { required: 'Secret key is required' })}
            placeholder="Enter secret key"
          />
          {errors.secretKey && <span>{errors.secretKey.message}</span>}
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add API Key'}
        </Button>
      </Form>

      {apiKeys.length > 0 && (
        <ApiKeyList role="list" aria-label="Saved API Keys">
          {apiKeys.map((apiKey) => (
            <ApiKeyItem 
              key={`${apiKey.exchange}-${apiKey.label || 'unlabeled'}`}
              role="listitem"
              aria-label={`API key ${apiKey.label || 'unlabeled'} for ${apiKey.exchange}`}
            >
              <ApiKeyInfo>
                <ApiKeyLabel>{apiKey.label || 'Unlabeled Key'}</ApiKeyLabel>
                <ApiKeyExchange>{apiKey.exchange}</ApiKeyExchange>
              </ApiKeyInfo>
              <Button
                variant="danger"
                onClick={() => handleDelete(apiKey.exchange, apiKey.label || '')}
                aria-label={`Delete ${apiKey.label || 'unlabeled'} API key for ${apiKey.exchange}`}
              >
                Delete
              </Button>
            </ApiKeyItem>
          ))}
        </ApiKeyList>
      )}
    </Container>
  );
};

export default ApiKeyManager;