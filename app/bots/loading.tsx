'use client';

import React from 'react';
import styled from 'styled-components';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

export default function Loading() {
  return (
    <LoadingContainer>
      <LoadingSpinner size="large" />
    </LoadingContainer>
  );
}
