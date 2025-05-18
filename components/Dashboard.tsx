'use client';

import React from 'react';
import styled from 'styled-components';
import BotList from './BotList';
import MarketOverview from './MarketOverview';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <BotList />
      <MarketOverview />
    </DashboardContainer>
  );
};

export default Dashboard;
