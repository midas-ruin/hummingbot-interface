import React from 'react';
import styled from 'styled-components';
import { mediaQueries } from '../utils/theme';

interface ContainerProps {
  maxWidth?: keyof typeof breakpoints;
  padding?: string;
}

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

const StyledContainer = styled.div<ContainerProps>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${({ padding }) => padding || '1rem'};
  padding-right: ${({ padding }) => padding || '1rem'};
  max-width: ${({ maxWidth }) => maxWidth ? breakpoints[maxWidth] : '100%'};

  ${mediaQueries.sm} {
    padding-left: ${({ padding }) => padding || '1.5rem'};
    padding-right: ${({ padding }) => padding || '1.5rem'};
  }

  ${mediaQueries.lg} {
    padding-left: ${({ padding }) => padding || '2rem'};
    padding-right: ${({ padding }) => padding || '2rem'};
  }
`;

export const ResponsiveContainer: React.FC<ContainerProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  maxWidth,
  padding,
  ...props
}) => {
  return (
    <StyledContainer
      maxWidth={maxWidth}
      padding={padding}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};
