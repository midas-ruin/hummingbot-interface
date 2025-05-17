'use client';

import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const getVariantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.secondary};
        color: ${({ theme }) => theme.colors.white};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.secondary}dd`};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.primary};
        border: 1px solid ${({ theme }) => theme.colors.primary};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.primary}11`};
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.text.primary};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.text.primary}11`};
        }
      `;
    default:
      return css`
        background-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.white};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.primary}dd`};
        }
      `;
  }
};

const getSizeStyles = (size: ButtonProps['size']) => {
  switch (size) {
    case 'small':
      return css`
        padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
      `;
    case 'large':
      return css`
        padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
        font-size: ${({ theme }) => theme.typography.fontSize.lg};
      `;
    default:
      return css`
        padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
        font-size: ${({ theme }) => theme.typography.fontSize.base};
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  position: relative;

  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'medium' }) => getSizeStyles(size)}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </StyledButton>
  );
}; 