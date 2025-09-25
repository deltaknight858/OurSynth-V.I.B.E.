'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  AutoAwesome as GenerateIcon,
  BookmarkBorder as SavedIcon,
  Person as AccountIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeMode } from '@/theme/CustomThemeProvider';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeMode();
  
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a simple breakpoint check without useMediaQuery for SSR compatibility
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationLinks = [
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Generate', href: '/generator', icon: <GenerateIcon /> },
    { label: 'Saved', href: '/saved', icon: <SavedIcon /> },
  ];

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleAccountMenuClose();
    router.push('/');
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    handleMobileMenuClose();
  };

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      className="glass"
      sx={{
        backgroundColor: 'transparent !important',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          padding: { xs: '0 16px', md: '0 32px' },
          minHeight: '70px !important',
        }}
      >
        {/* Logo */}
        <Typography
          variant="h4"
          component={Link}
          href="/"
          sx={{
            fontWeight: 700,
            color: '#000000',
            textDecoration: 'none',
            background: 'linear-gradient(45deg, #000000, #333333)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            letterSpacing: '-0.02em',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(45deg, #a020f0, #000000)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transform: 'scale(1.02)',
            },
          }}
        >
          Pathways
        </Typography>

        {/* Desktop Navigation */}
        {mounted && !isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navigationLinks.map((link) => (
              <Button
                key={link.label}
                component={Link}
                href={link.href}
                startIcon={link.icon}
                sx={{
                  color: isActiveLink(link.href) ? '#a020f0' : '#000000',
                  fontWeight: isActiveLink(link.href) ? 600 : 500,
                  fontSize: '1rem',
                  textTransform: 'none',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  backgroundColor: isActiveLink(link.href) 
                    ? 'rgba(160, 32, 240, 0.1)' 
                    : 'transparent',
                  border: isActiveLink(link.href)
                    ? '1px solid rgba(160, 32, 240, 0.3)'
                    : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(160, 32, 240, 0.15)',
                    color: '#a020f0',
                    border: '1px solid rgba(160, 32, 240, 0.4)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(160, 32, 240, 0.3)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '12px',
                      background: 'linear-gradient(45deg, rgba(160, 32, 240, 0.2), rgba(0, 255, 0, 0.2))',
                      opacity: 0.7,
                      zIndex: -1,
                      filter: 'blur(8px)',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Right side - Account or Auth buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Theme Toggle */}
          <Button
            onClick={toggleTheme}
            sx={{
              minWidth: 'auto',
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#000000',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(160, 32, 240, 0.2)',
                color: '#a020f0',
                transform: 'rotate(180deg)',
              },
            }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </Button>

          {user ? (
            // Authenticated user menu
            <>
              <IconButton
                onClick={handleAccountMenuOpen}
                sx={{
                  padding: '4px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(160, 32, 240, 0.1)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'linear-gradient(45deg, #a020f0, #000000)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {user.email?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={accountMenuAnchor}
                open={Boolean(accountMenuAnchor)}
                onClose={handleAccountMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  className: 'glass',
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleNavigation('/account');
                    handleAccountMenuClose();
                  }}
                  sx={{
                    padding: '12px 16px',
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: 'rgba(160, 32, 240, 0.1)',
                      color: '#a020f0',
                    },
                  }}
                >
                  <AccountIcon sx={{ mr: 2 }} />
                  Account
                </MenuItem>
                <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
                <MenuItem
                  onClick={handleSignOut}
                  sx={{
                    padding: '12px 16px',
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                      color: '#d32f2f',
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 2 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            // Authentication buttons
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                href="/auth/signin"
                variant="outlined"
                sx={{
                  color: '#000000',
                  borderColor: 'rgba(0, 0, 0, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: '10px',
                  padding: '8px 16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(160, 32, 240, 0.1)',
                    borderColor: '#a020f0',
                    color: '#a020f0',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 15px rgba(160, 32, 240, 0.2)',
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                href="/auth/signup"
                variant="contained"
                sx={{
                  backgroundColor: '#000000',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '10px',
                  padding: '8px 16px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#a020f0',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(160, 32, 240, 0.4)',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}

          {/* Mobile menu button */}
          {mounted && isMobile && (
            <IconButton
              onClick={handleMobileMenuOpen}
              sx={{
                color: '#000000',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(160, 32, 240, 0.2)',
                  color: '#a020f0',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Navigation Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          className: 'glass',
          sx: {
            mt: 1,
            minWidth: 250,
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        {navigationLinks.map((link) => (
          <MenuItem
            key={link.label}
            onClick={() => handleNavigation(link.href)}
            sx={{
              padding: '16px 20px',
              color: isActiveLink(link.href) ? '#a020f0' : '#000000',
              backgroundColor: isActiveLink(link.href) 
                ? 'rgba(160, 32, 240, 0.1)' 
                : 'transparent',
              fontWeight: isActiveLink(link.href) ? 600 : 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(160, 32, 240, 0.15)',
                color: '#a020f0',
                transform: 'translateX(8px)',
              },
            }}
          >
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              {link.icon}
            </Box>
            {link.label}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}
