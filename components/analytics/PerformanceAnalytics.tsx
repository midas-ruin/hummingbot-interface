import React from 'react';
import styled from 'styled-components';
import { BotMetrics } from '../../types/bot';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TimeframeButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.border};
  border-radius: 0.375rem;
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors.textInverted : theme.colors.textPrimary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const MetricCard = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MetricValue = styled.div<{ positive?: boolean; negative?: boolean }>`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ positive, negative, theme }) =>
    positive ? theme.colors.success :
    negative ? theme.colors.error :
    theme.colors.textPrimary};
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 1rem;
`;

export interface PerformanceMetrics extends BotMetrics {
  tradeCount: number;
  winRate: number;
  averageProfit: number;
  maxDrawdown: number;
  sharpeRatio: number;
  volatility: number;
}

interface PerformanceAnalyticsProps {
  botId: string;
  metrics: PerformanceMetrics;
  onTimeframeChange: (timeframe: string) => void;
}

export function PerformanceAnalytics({
  botId,
  metrics,
  onTimeframeChange
}: PerformanceAnalyticsProps) {
  const [timeframe, setTimeframe] = React.useState('1d');

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    onTimeframeChange(newTimeframe);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatNumber = (value: number, decimals = 2) => {
    return value.toFixed(decimals);
  };

  return (
    <Container role="region" aria-label="Performance Analytics">
      <Header>
        <Title>Performance Analytics</Title>
        <TimeframeSelector role="group" aria-label="Select timeframe">
          <TimeframeButton
            active={timeframe === '1d'}
            onClick={() => handleTimeframeChange('1d')}
            aria-pressed={timeframe === '1d'}
          >
            1D
          </TimeframeButton>
          <TimeframeButton
            active={timeframe === '1w'}
            onClick={() => handleTimeframeChange('1w')}
            aria-pressed={timeframe === '1w'}
          >
            1W
          </TimeframeButton>
          <TimeframeButton
            active={timeframe === '1m'}
            onClick={() => handleTimeframeChange('1m')}
            aria-pressed={timeframe === '1m'}
          >
            1M
          </TimeframeButton>
          <TimeframeButton
            active={timeframe === 'all'}
            onClick={() => handleTimeframeChange('all')}
            aria-pressed={timeframe === 'all'}
          >
            All
          </TimeframeButton>
        </TimeframeSelector>
      </Header>

      <MetricsGrid>
        <MetricCard role="status" aria-label="Profit/Loss">
          <MetricLabel>Profit/Loss</MetricLabel>
          <MetricValue positive={metrics.profitLoss > 0} negative={metrics.profitLoss < 0}>
            {formatPercentage(metrics.profitLoss)}
          </MetricValue>
        </MetricCard>

        <MetricCard role="status" aria-label="Win Rate">
          <MetricLabel>Win Rate</MetricLabel>
          <MetricValue positive={metrics.winRate > 0.5}>
            {formatPercentage(metrics.winRate)}
          </MetricValue>
        </MetricCard>

        <MetricCard role="status" aria-label="Trade Count">
          <MetricLabel>Trade Count</MetricLabel>
          <MetricValue>
            {metrics.tradeCount}
          </MetricValue>
        </MetricCard>

        <MetricCard role="status" aria-label="Average Profit">
          <MetricLabel>Average Profit</MetricLabel>
          <MetricValue positive={metrics.averageProfit > 0} negative={metrics.averageProfit < 0}>
            {formatPercentage(metrics.averageProfit)}
          </MetricValue>
        </MetricCard>

        <MetricCard role="status" aria-label="Maximum Drawdown">
          <MetricLabel>Max Drawdown</MetricLabel>
          <MetricValue negative={true}>
            {formatPercentage(metrics.maxDrawdown)}
          </MetricValue>
        </MetricCard>

        <MetricCard role="status" aria-label="Sharpe Ratio">
          <MetricLabel>Sharpe Ratio</MetricLabel>
          <MetricValue positive={metrics.sharpeRatio > 1}>
            {formatNumber(metrics.sharpeRatio)}
          </MetricValue>
        </MetricCard>

        <MetricCard role="status" aria-label="Volatility">
          <MetricLabel>Volatility</MetricLabel>
          <MetricValue>
            {formatPercentage(metrics.volatility)}
          </MetricValue>
        </MetricCard>
      </MetricsGrid>

      <ChartContainer
        role="img"
        aria-label="Performance chart"
      >
        {/* Chart component will be integrated here */}
      </ChartContainer>
    </Container>
  );
}
