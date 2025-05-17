import React, { useState } from 'react';
import styled from 'styled-components';
import { OrderBook } from './OrderBook';
import { OrderForm } from './OrderForm';
import { HummingbotGateway, gateway } from '../../services/gateway';

interface TradingViewProps {
  exchange: string;
  symbol: string;
  gateway: HummingbotGateway;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const OrderBookContainer = styled.div`
  min-height: 600px;
  overflow-y: auto;
`;

const OrderFormContainer = styled.div`
  position: sticky;
  top: 1rem;
`;

export function TradingView({ exchange, symbol, gateway }: TradingViewProps) {
  const [selectedPrice, setSelectedPrice] = useState<number>();

  const handlePriceSelect = (price: number) => {
    setSelectedPrice(price);
  };

  return (
    <Container>
      <OrderBookContainer>
        <OrderBook
          exchange={exchange}
          symbol={symbol}
          gateway={gateway}
          onPriceSelect={handlePriceSelect}
        />
      </OrderBookContainer>
      <OrderFormContainer>
        <OrderForm
          exchange={exchange}
          symbol={symbol}
          selectedPrice={selectedPrice}
        />
      </OrderFormContainer>
    </Container>
  );
}
