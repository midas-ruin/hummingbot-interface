'use client';

import React from 'react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

export default function Loading() {
  return (
    <LoadingContainer>
      <LoadingSpinner size="large" />
    </LoadingContainer>
  );
}
