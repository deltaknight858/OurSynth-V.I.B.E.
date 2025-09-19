"use client";

import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import HubIcon from '@mui/icons-material/Hub';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PublicIcon from '@mui/icons-material/Public';
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      neonPurple: string;
      neonCyan: string;
      neonBlue: string;
      neonLime: string;
      glassBg: string;
      glassBorder: string;
    };
  }
  interface ThemeOptions {
    custom?: {
      neonPurple?: string;
      neonCyan?: string;
      neonBlue?: string;
      neonLime?: string;
      glassBg?: string;
      glassBorder?: string;
    };
  }
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1300,
  background: `linear-gradient(90deg, ${theme.custom.neonPurple} 0%, #6a00f4 100%)`,
  boxShadow: `0 -2px 8px ${theme.custom.neonPurple}26`, // 15% opacity
}));

const navLinks = [
  { label: 'Studio', href: '/studio', icon: <HomeIcon /> },
  { label: 'Pathways', href: '/pathways', icon: <HubIcon /> },
  { label: 'Deploy', href: '/deploy', icon: <CloudUploadIcon /> },
  { label: 'Domains', href: '/domains', icon: <PublicIcon /> },
];

export const GlobalBottomNavBar = () => {
  const [value, setValue] = React.useState(0);

  return (
    <StyledPaper elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        sx={{ background: 'transparent' }}
      >
        {navLinks.map((link, idx) => (
          <BottomNavigationAction
            key={link.href}
            label={link.label}
            icon={link.icon}
            component={Link}
            href={link.href}
            sx={{ color: '#fff', fontWeight: 600 }}
          />
        ))}
      </BottomNavigation>
    </StyledPaper>
  );
};

export default GlobalBottomNavBar;
