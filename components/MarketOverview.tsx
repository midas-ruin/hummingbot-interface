'use client';

import React from 'react';
import styled from 'styled-components';

const MarketOverviewContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0 0 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const MarketList = styled.div`
  display: grid;
  gap: 1rem;
`;

const MarketItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const MarketOverview = () => {
  return (
    <MarketOverviewContainer>
      <Title>Market Overview</Title>
      <MarketList>
        {/* Market items will be added here */}
      </MarketList>
    </MarketOverviewContainer>
  );
};

export default MarketOverview;
