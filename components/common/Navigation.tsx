'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

const Nav = styled.nav`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
`;

const NavItem = styled.li<{ active: boolean }>`
  a {
    color: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.textSecondary};
    text-decoration: none;
    font-weight: ${({ active }) => (active ? '600' : '400')};
    transition: color 0.2s;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Navigation = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/bots', label: 'Bots' },
    { href: '/markets', label: 'Markets' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <Nav>
      <NavList>
        {links.map(({ href, label }) => (
          <NavItem key={href} active={pathname === href}>
            <Link href={href}>{label}</Link>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
};

export default Navigation;
