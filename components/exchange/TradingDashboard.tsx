import React, { useState } from 'react';
import styled from 'styled-components';
import { TradingView } from './TradingView';
import { PositionManager } from './PositionManager';
import { RiskManager } from './RiskManager';
import { HummingbotGateway } from '../../services/gateway';
import { RiskParams } from '../../types/exchange';
import { toast } from 'react-toastify';

interface TradingDashboardProps {
  exchange: string;
  symbol: string;
  gateway: HummingbotGateway;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  max-width: 1920px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E5E7EB;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const SymbolInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: #F3F4F6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #E5E7EB;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ active }) => (active ? '#111827' : '#6B7280')};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ active }) => (active ? '#3B82F6' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #111827;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #DBEAFE;
  }
`;

export function TradingDashboard({ exchange, symbol, gateway }: TradingDashboardProps) {
  const [activeTab, setActiveTab] = useState<'trading' | 'risk'>('trading');

  const handleRiskParamsUpdate = async (params: RiskParams) => {
    try {
      const response = await gateway.post<void>(`/risk/${exchange}`, params);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update risk parameters');
      }

      toast.success('Risk parameters updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update risk parameters');
      throw error;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Trading Dashboard</Title>
        <SymbolInfo>
          <Badge>{exchange.toUpperCase()}</Badge>
          <Badge>{symbol}</Badge>
        </SymbolInfo>
      </Header>

      <MainContent>
        <Section>
          <SectionHeader>
            <Tabs>
              <Tab
                active={activeTab === 'trading'}
                onClick={() => setActiveTab('trading')}
                aria-label="Trading view tab"
              >
                Trading
              </Tab>
              <Tab
                active={activeTab === 'risk'}
                onClick={() => setActiveTab('risk')}
                aria-label="Risk management tab"
              >
                Risk Management
              </Tab>
            </Tabs>
          </SectionHeader>

          {activeTab === 'trading' ? (
            <>
              <TradingView
                exchange={exchange}
                symbol={symbol}
                gateway={gateway}
              />
              <PositionManager
                exchange={exchange}
                gateway={gateway}
              />
            </>
          ) : (
            <RiskManager
              exchange={exchange}
              onSave={handleRiskParamsUpdate}
            />
          )}
        </Section>
      </MainContent>
    </Container>
  );
}
