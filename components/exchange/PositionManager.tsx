import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Position } from '../../types/exchange';
import { HummingbotGateway, gateway } from '../../services/gateway';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

interface PositionManagerProps {
  exchange: string;
  gateway: HummingbotGateway;
  refreshInterval?: number; // Refresh interval in milliseconds
  onError?: (error: string) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: background-color ${({ theme }) => theme.transitions.normal};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const PositionGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const PositionCard = styled.div<{ pnl: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 4px solid ${({ pnl, theme }) => (pnl >= 0 ? theme.colors.success : theme.colors.error)};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transform: translateY(-1px);
  }
`;

const PositionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Symbol = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const Side = styled.span<{ type: 'long' | 'short' }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: white;
  background-color: ${({ type, theme }) => (type === 'long' ? theme.colors.success : theme.colors.error)};
  transition: background-color ${({ theme }) => theme.transitions.normal};
`;

const PositionInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const Value = styled.span<{ highlight?: boolean }>`
  font-weight: ${({ highlight, theme }) => (highlight ? theme.typography.fontWeight.bold : theme.typography.fontWeight.normal)};
  color: ${({ highlight, theme }) => (highlight ? theme.colors.text : theme.colors.textSecondary)};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  transition: color ${({ theme }) => theme.transitions.normal};
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: none;
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: white;
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary}dd;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.xl};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  background-color: ${({ theme }) => `${theme.colors.error}11`};
  border-radius: 6px;
  border: 1px solid ${({ theme }) => `${theme.colors.error}33`};
`;

export function PositionManager({
  exchange,
  gateway,
  refreshInterval = 10000,
  onError
}: PositionManagerProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = useCallback(async (showLoading = true) => {
    try {
      setLoading(true);
      const response = await gateway.get<Position[]>(`/positions/${exchange}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch positions');
      }

      setPositions(response.data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch positions';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [exchange, gateway]);

  const closePosition = async (symbol: string) => {
    try {
      setLoading(true);
      const response = await gateway.post<void>(`/positions/${exchange}/${symbol}/close`, {});
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to close position');
      }

      await fetchPositions();
      toast.success('Position closed successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to close position');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
    const interval = setInterval(() => fetchPositions(false), refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPositions]);

  if (loading && positions.length === 0) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  if (positions.length === 0) {
    return (
      <Container>
        <Title>Positions</Title>
        <EmptyState>
          No open positions
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Positions</Title>
      </Header>

      <PositionGrid>
        {positions.map((position) => (
          <PositionCard
            key={`${position.exchange}-${position.symbol}`}
            pnl={position.unrealizedPnl}
            role="article"
            aria-label={`${position.symbol} ${position.side} position`}
          >
            <PositionHeader>
              <Symbol>{position.symbol}</Symbol>
              <Side type={position.side}>{position.side.toUpperCase()}</Side>
            </PositionHeader>

            <PositionInfo>
              <InfoItem>
                <Label>Size</Label>
                <Value>{position.amount.toFixed(8)}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Entry Price</Label>
                <Value>{position.entryPrice.toFixed(8)}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Mark Price</Label>
                <Value>{position.markPrice.toFixed(8)}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Liquidation Price</Label>
                <Value highlight>{position.liquidationPrice.toFixed(8)}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Margin</Label>
                <Value>{position.margin.toFixed(8)}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Leverage</Label>
                <Value>{position.leverage}x</Value>
              </InfoItem>
              <InfoItem>
                <Label>Unrealized PnL</Label>
                <Value highlight>
                  {position.unrealizedPnl >= 0 ? '+' : ''}
                  {position.unrealizedPnl.toFixed(8)}
                </Value>
              </InfoItem>
            </PositionInfo>

            <Button
              onClick={() => closePosition(position.symbol)}
              disabled={loading}
              aria-label={`Close ${position.symbol} position`}
              aria-busy={loading}
              aria-live="polite"
            >
              Close Position
            </Button>
          </PositionCard>
        ))}
      </PositionGrid>
    </Container>
  );
}
