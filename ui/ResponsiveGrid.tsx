import React from 'react';
import styled from 'styled-components';
import { mediaQueries } from '../utils/theme';

interface GridProps {
  columns?: { [key: string]: number };
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  alignItems?: string;
  justifyItems?: string;
}

const StyledGrid = styled.div<GridProps>`
  display: grid;
  gap: ${({ gap }) => gap || '1rem'};
  row-gap: ${({ rowGap }) => rowGap};
  column-gap: ${({ columnGap }) => columnGap};
  align-items: ${({ alignItems }) => alignItems};
  justify-items: ${({ justifyItems }) => justifyItems};
  grid-template-columns: repeat(${({ columns }) => columns?.xs || 1}, 1fr);

  ${({ columns }) => columns?.sm && mediaQueries.sm} {
    grid-template-columns: repeat(${({ columns }) => columns?.sm}, 1fr);
  }

  ${({ columns }) => columns?.md && mediaQueries.md} {
    grid-template-columns: repeat(${({ columns }) => columns?.md}, 1fr);
  }

  ${({ columns }) => columns?.lg && mediaQueries.lg} {
    grid-template-columns: repeat(${({ columns }) => columns?.lg}, 1fr);
  }

  ${({ columns }) => columns?.xl && mediaQueries.xl} {
    grid-template-columns: repeat(${({ columns }) => columns?.xl}, 1fr);
  }

  ${({ columns }) => columns?.['2xl'] && mediaQueries['2xl']} {
    grid-template-columns: repeat(${({ columns }) => columns?.['2xl']}, 1fr);
  }
`;

export const ResponsiveGrid: React.FC<GridProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  columns,
  gap,
  rowGap,
  columnGap,
  alignItems,
  justifyItems,
  ...props
}) => {
  return (
    <StyledGrid
      columns={columns}
      gap={gap}
      rowGap={rowGap}
      columnGap={columnGap}
      alignItems={alignItems}
      justifyItems={justifyItems}
      {...props}
    >
      {children}
    </StyledGrid>
  );
};
