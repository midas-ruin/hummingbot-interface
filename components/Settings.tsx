'use client';

import React from 'react';
import styled from 'styled-components';
import ApiKeyManager from './exchange/ApiKeyManager';

const SettingsContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0 0 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Settings = () => {
  return (
    <SettingsContainer>
      <Title>Settings</Title>
      
      <Section>
        <SectionTitle>API Keys</SectionTitle>
        <ApiKeyManager />
      </Section>
      
      {/* Additional settings sections will be added here */}
    </SettingsContainer>
  );
};

export default Settings;
