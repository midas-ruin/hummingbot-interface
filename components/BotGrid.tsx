import React from 'react';
import styled from 'styled-components';
import { useBotContext } from '../contexts/BotContext';
import { BotStatus } from './BotStatus';
import { LoadingSpinner } from './common/LoadingSpinner';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #6B7280;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

export function BotGrid() {
  const { state } = useBotContext();
  const { bots, loading, error } = state;

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner size="large" />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <EmptyState>
        <p>Error: {error}</p>
      </EmptyState>
    );
  }

  if (!bots || bots.length === 0) {
    return (
      <EmptyState>
        <p>No bots found. Create a new bot to get started.</p>
      </EmptyState>
    );
  }

  return (
    <Grid>
      {bots.map((bot) => (
        <BotStatus key={bot.id} bot={bot} />
      ))}
    </Grid>
  );
}
