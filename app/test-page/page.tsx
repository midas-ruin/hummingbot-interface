'use client';

import React from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  margin: 2rem;
  padding: 2rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TestHeading = styled.h1`
  color: #3B82F6;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const TestParagraph = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const TestButton = styled.button`
  background-color: #3B82F6;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2563EB;
  }
`;

export default function TestPage() {
  const [count, setCount] = React.useState(0);
  
  return (
    <TestContainer>
      <TestHeading>App Router Test Page</TestHeading>
      <TestParagraph>
        This is a simple test page to verify that the App Router and styled-components are working correctly.
      </TestParagraph>
      <TestParagraph>
        Current count: {count}
      </TestParagraph>
      <TestButton onClick={() => setCount(count + 1)}>
        Increment Count
      </TestButton>
    </TestContainer>
  );
}
