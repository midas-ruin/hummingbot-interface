'use client';

import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const RetryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorContainer role="alert">
      <ErrorTitle>Something went wrong!</ErrorTitle>
      <ErrorMessage>{error.message || 'An error occurred while loading the bots.'}</ErrorMessage>
      <RetryButton onClick={reset} aria-label="Try again">
        Try again
      </RetryButton>
    </ErrorContainer>
  );
}
