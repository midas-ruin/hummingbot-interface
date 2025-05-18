import React, { useState } from 'react';
import styled from 'styled-components';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{ position: string; isVisible: boolean }>`
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  position: absolute;
  z-index: 1;
  background-color: #333;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.2s;

  ${props => {
    switch (props.position) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 0.5rem;
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 0.5rem;
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-right: 0.5rem;
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 0.5rem;
        `;
      default:
        return '';
    }
  }}

  &::after {
    content: '';
    position: absolute;
    border: 0.25rem solid transparent;

    ${props => {
      switch (props.position) {
        case 'top':
          return `
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-top-color: #333;
          `;
        case 'bottom':
          return `
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-bottom-color: #333;
          `;
        case 'left':
          return `
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-left-color: #333;
          `;
        case 'right':
          return `
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-right-color: #333;
          `;
        default:
          return '';
      }
    }}
  }
`;

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #e2e8f0;
  color: #4a5568;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  cursor: help;
`;

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TooltipContainer
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <InfoIcon>?</InfoIcon>
      <TooltipContent position={position} isVisible={isVisible}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;
