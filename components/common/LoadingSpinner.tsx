'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  display: inline-block;
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '1.5rem';
      case 'large':
        return '3rem';
      default:
        return '2rem';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'small':
        return '1.5rem';
      case 'large':
        return '3rem';
      default:
        return '2rem';
    }
  }};
`;

const SpinnerSvg = styled.svg`
  animation: ${spin} 1s linear infinite;
  width: 100%;
  height: 100%;
`;

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => (
  <SpinnerContainer size={size}>
    <SpinnerSvg viewBox="0 0 50 50" aria-label="Loading">
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#2563eb"
        strokeWidth="4"
        strokeDasharray="80, 200"
      />
    </SpinnerSvg>
  </SpinnerContainer>
);
