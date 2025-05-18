'use client';

import React from 'react';
import styled from 'styled-components';

const MarketListContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const MarketList = () => {
  return (
    <MarketListContainer>
      <Header>
        <Title>Markets</Title>
      </Header>
      <Table>
        <thead>
          <tr>
            <Th>Market</Th>
            <Th>Price</Th>
            <Th>24h Change</Th>
            <Th>Volume</Th>
          </tr>
        </thead>
        <tbody>
          {/* Market rows will be added here */}
        </tbody>
      </Table>
    </MarketListContainer>
  );
};

export default MarketList;
