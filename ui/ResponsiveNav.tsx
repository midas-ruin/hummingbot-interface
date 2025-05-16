import React, { useState } from 'react';
import styled from 'styled-components';
import { mediaQueries } from '../utils/theme';

interface NavProps {
  items: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
  orientation?: 'horizontal' | 'vertical';
  collapsible?: boolean;
}

const NavContainer = styled.nav<{ isOpen: boolean; orientation?: string; collapsible?: boolean }>`
  display: flex;
  flex-direction: ${({ orientation }) => orientation === 'horizontal' ? 'row' : 'column'};
  gap: 1rem;
  
  ${mediaQueries.md} {
    flex-direction: row;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ isOpen, collapsible }) => (collapsible && !isOpen ? 'none' : 'flex')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.backgroundPrimary};
    padding: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const NavItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focus.outline};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const MenuButton = styled.button<{ collapsible?: boolean }>`
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ collapsible }) => (collapsible ? 'flex' : 'none')};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focus.outline};
  }
`;

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const ResponsiveNav: React.FC<NavProps> = ({
  items,
  orientation = 'horizontal',
  collapsible = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {collapsible && (
        <MenuButton
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-controls="nav-menu"
          aria-label="Toggle navigation menu"
        >
          <MenuIcon />
        </MenuButton>
      )}
      <NavContainer
        id="nav-menu"
        isOpen={isOpen}
        orientation={orientation}
        role="navigation"
        aria-label="Main navigation"
      >
        {items.map((item, index) => (
          <NavItem
            key={index}
            href={item.href}
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            {item.icon}
            {item.label}
          </NavItem>
        ))}
      </NavContainer>
    </>
  );
};
