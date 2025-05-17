'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const BotListContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const CreateButton = styled(Link)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const BotList = () => {
  return (
    <BotListContainer>
      <Header>
        <Title>Trading Bots</Title>
        <CreateButton href="/bots/create">Create Bot</CreateButton>
      </Header>
      {/* Bot list items will be added here */}
    </BotListContainer>
  );
};

export default BotList;
