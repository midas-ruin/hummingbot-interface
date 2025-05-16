'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { useState } from 'react';

const Nav = styled.nav`
  background: white;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.sm};
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (min-width: 640px) {
    padding: ${props => props.theme.spacing.md};
  }
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${props => props.theme.spacing.sm};

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const NavLinks = styled.div<{ $isOpen: boolean }>`
  @media (max-width: 639px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: ${props => props.theme.spacing.md};
    border-bottom: 1px solid ${props => props.theme.colors.border};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 640px) {
    display: flex;
    gap: ${props => props.theme.spacing.md};
  }
`;

const NavLink = styled.a<{ $active?: boolean }>`
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all 0.2s;
  width: 100%;

  @media (max-width: 639px) {
    padding: ${props => props.theme.spacing.sm};
    border-radius: 0;
    
    &:not(:last-child) {
      border-bottom: 1px solid ${props => props.theme.colors.border};
    }
  }

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }
`;

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/bots', label: 'Trading Bots' },
  { href: '/markets', label: 'Markets' },
  { href: '/settings', label: 'Settings' }
];

const MenuButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  padding: ${props => props.theme.spacing.xs};
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: 639px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 24px;
    height: 20px;

    span {
      display: block;
      width: 100%;
      height: 2px;
      background-color: ${props => props.theme.colors.text};
      transition: all 0.3s;

      &:nth-child(1) {
        transform: ${props => props.$isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none'};
      }

      &:nth-child(2) {
        opacity: ${props => props.$isOpen ? '0' : '1'};
      }

      &:nth-child(3) {
        transform: ${props => props.$isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none'};
      }
    }
  }
`;

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Nav>
      <NavContainer>
        <Logo>Hummingbot</Logo>
        <MenuButton onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
          <span />
          <span />
          <span />
        </MenuButton>
        <NavLinks $isOpen={isOpen}>
          {navItems.map(({ href, label }) => (
            <Link href={href} key={href} passHref legacyBehavior>
              <NavLink $active={pathname === href}>
                {label}
              </NavLink>
            </Link>
          ))}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
}
