import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Bot } from '../types/bot';
import { useBotContext } from '../contexts/BotContext';
import { LoadingSpinner } from './common/LoadingSpinner';
import { gateway } from '../services/gateway';

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BotName = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #333;
`;

const StatusBadge = styled.span<{ status: Bot['status'] }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ status }) => {
    switch (status) {
      case 'running':
        return '#10B981';
      case 'stopped':
        return '#EF4444';
      case 'error':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  }};
  color: white;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const MetricCard = styled.div`
  padding: 1rem;
  background-color: #F3F4F6;
  border-radius: 6px;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 0.25rem;
`;

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ variant }) =>
    variant === 'danger' ? '#EF4444' : '#3B82F6'};
  color: white;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

interface BotMetrics {
  profitLoss: number;
  totalTrades: number;
  successRate: number;
  uptime: string;
}

interface BotStatusProps {
  bot: Bot;
}

export function BotStatus({ bot }: BotStatusProps) {
  const { startBot, stopBot, state } = useBotContext();
  const [metrics, setMetrics] = useState<BotMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await gateway.getBotMetrics(bot.id);
        setMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch bot metrics:', error);
      }
    };

    if (bot.status === 'running') {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [bot.id, bot.status]);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      await startBot(bot.id);
    } catch (error) {
      console.error('Failed to start bot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    setIsLoading(true);
    try {
      await stopBot(bot.id);
    } catch (error) {
      console.error('Failed to stop bot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StatusContainer>
      <StatusHeader>
        <BotName>{bot.name}</BotName>
        <StatusBadge status={bot.status}>
          {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
        </StatusBadge>
      </StatusHeader>

      {metrics && (
        <MetricsGrid>
          <MetricCard>
            <MetricLabel>Profit/Loss</MetricLabel>
            <MetricValue>
              {metrics.profitLoss >= 0 ? '+' : ''}
              {metrics.profitLoss.toFixed(2)}%
            </MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Total Trades</MetricLabel>
            <MetricValue>{metrics.totalTrades}</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Success Rate</MetricLabel>
            <MetricValue>{metrics.successRate}%</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Uptime</MetricLabel>
            <MetricValue>{metrics.uptime}</MetricValue>
          </MetricCard>
        </MetricsGrid>
      )}

      <ButtonGroup>
        {bot.status === 'stopped' ? (
          <ActionButton
            onClick={handleStart}
            disabled={isLoading || state.loading}
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Start Bot'}
          </ActionButton>
        ) : (
          <ActionButton
            variant="danger"
            onClick={handleStop}
            disabled={isLoading || state.loading}
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Stop Bot'}
          </ActionButton>
        )}
      </ButtonGroup>
    </StatusContainer>
  );
}
