'use client';

import React from 'react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default function Loading() {
  return (
    <LoadingContainer>
      <LoadingSpinner size="large" />
    </LoadingContainer>
  );
}
