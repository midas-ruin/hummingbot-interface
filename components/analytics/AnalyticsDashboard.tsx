import React, { useState } from 'react';
import styled from 'styled-components';
import { PerformanceAnalytics } from './PerformanceAnalytics';
import { calculatePnL, calculateRiskMetrics } from '../../utils/analytics';
import { BotMetrics } from '../../types/bot';
import { PerformanceMetrics } from './PerformanceAnalytics';
import { Trade, Position } from '../../utils/analytics';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

interface AnalyticsDashboardProps {
  botId: string;
  trades: Trade[];
  position: Position;
  marketData: { price: number; timestamp: number }[];
  onExport: () => void;
}

export function AnalyticsDashboard({
  botId,
  trades,
  position,
  marketData,
  onExport
}: AnalyticsDashboardProps) {
  const [timeframe, setTimeframe] = useState('1d');

  // Calculate metrics
  const pnl = calculatePnL(trades);
  const riskMetrics = calculateRiskMetrics(position, trades, marketData);

  const metrics: PerformanceMetrics = {
    profitLoss: pnl.total,
    totalTrades: trades.length,
    successRate: trades.filter(t => t.price * t.amount - t.fee > 0).length / trades.length,
    uptime: '0', // This should be calculated from bot status history
    lastUpdated: new Date().toISOString(),
    tradeCount: trades.length,
    winRate: trades.filter(t => t.price * t.amount - t.fee > 0).length / trades.length,
    averageProfit: pnl.total / trades.length,
    maxDrawdown: riskMetrics.maxDrawdown,
    sharpeRatio: riskMetrics.sharpeRatio,
    volatility: riskMetrics.volatility
  };

  const handleExport = () => {
    // Generate report data
    const reportData = {
      botId,
      timeframe,
      metrics,
      trades,
      position,
      riskMetrics
    };

    // Convert to CSV
    const csv = generateCsv(reportData);

    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `bot-${botId}-report-${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCsv = (data: any): string => {
    // Convert object to CSV format
    const headers = [
      'Bot ID',
      'Timeframe',
      'Total PnL',
      'Trade Count',
      'Win Rate',
      'Average Profit',
      'Max Drawdown',
      'Sharpe Ratio',
      'Volatility',
      'Beta',
      'Alpha',
      'Sortino Ratio',
      'VaR (95%)',
      'VaR (99%)'
    ];

    const values = [
      data.botId,
      data.timeframe,
      data.metrics.profitLoss.toFixed(8),
      data.metrics.tradeCount,
      (data.metrics.winRate * 100).toFixed(2) + '%',
      data.metrics.averageProfit.toFixed(8),
      (data.metrics.maxDrawdown * 100).toFixed(2) + '%',
      data.riskMetrics.sharpeRatio.toFixed(4),
      (data.riskMetrics.volatility * 100).toFixed(2) + '%',
      data.riskMetrics.beta.toFixed(4),
      data.riskMetrics.alpha.toFixed(4),
      data.riskMetrics.sortino.toFixed(4),
      (data.riskMetrics.var95 * 100).toFixed(2) + '%',
      (data.riskMetrics.var99 * 100).toFixed(2) + '%'
    ];

    return headers.join(',') + '\n' + values.join(',');
  };

  return (
    <Container role="region" aria-label="Analytics Dashboard">
      <Header>
        <Title>Analytics Dashboard</Title>
        <Controls>
          <Button
            onClick={handleExport}
            aria-label="Export report"
            title="Export analytics report as CSV"
          >
            Export Report
          </Button>
        </Controls>
      </Header>

      <Grid>
        <Card>
          <PerformanceAnalytics
            botId={botId}
            metrics={metrics}
            onTimeframeChange={setTimeframe}
          />
        </Card>
      </Grid>
    </Container>
  );
}
