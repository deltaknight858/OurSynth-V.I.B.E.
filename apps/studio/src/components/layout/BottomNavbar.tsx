import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Home, GitBranch, Rocket, Globe } from 'lucide-react'; // Using placeholder icons

const navItems = [
  { href: 'http://localhost:3000', label: 'Studio', icon: Home },
  { href: 'http://localhost:3001', label: 'Pathways', icon: GitBranch },
  { href: 'http://localhost:3002', label: 'Deploy', icon: Rocket },
  { href: 'http://localhost:3003', label: 'Domains', icon: Globe },
];

const NavContainer = styled.nav`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  padding: 10px 20px;
  border-radius: 25px;
  background: rgba(25, 25, 30, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(160, 32, 240, 0.3);
  box-shadow: 0 8px 32px rgba(160, 32, 240, 0.2);
  z-index: 1000;
  display: flex;
  gap: 10px;
`;

const NavLink = styled.a<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 15px;
  color: ${({ isActive }) => (isActive ? '#a020f0' : '#fff')};
  background: ${({ isActive }) => (isActive ? 'rgba(160, 32, 240, 0.15)' : 'transparent')};
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 12px;

  &:hover {
    color: #a020f0;
    background: rgba(160, 32, 240, 0.2);
  }
`;

const BottomNavbar = () => {
  const router = useRouter();

  // A simple way to determine active state for localhost URLs
  const isLinkActive = (href: string) => {
    if (typeof window !== 'undefined') {
      return window.location.origin === href;
    }
    return false;
  };

  return (
    <NavContainer>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <NavLink isActive={isLinkActive(item.href)}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        </Link>
      ))}
    </NavContainer>
  );
};

export default BottomNavbar;
