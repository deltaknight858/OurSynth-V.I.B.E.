"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppThemeContextValue, ThemeMode, ThemeTokens } from './types';

const LIGHT_TOKENS: ThemeTokens = {
  colors: {
    bg: '#0b0b10',
    fg: '#e9e9f1',
    muted: '#9aa0a6',
    primary: '#8b5cf6',
    border: '#23232a',
  },
  radius: { sm: '4px', md: '8px', lg: '12px', xl: '20px' },
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.15)',
    md: '0 4px 12px rgba(0,0,0,0.2)',
    lg: '0 12px 32px rgba(0,0,0,0.25)',
  },
};

const DARK_TOKENS: ThemeTokens = {
  colors: {
    bg: '#0b0b10',
    fg: '#e9e9f1',
    muted: '#9aa0a6',
    primary: '#8b5cf6',
    border: '#23232a',
  },
  radius: { sm: '4px', md: '8px', lg: '12px', xl: '20px' },
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.4)',
    md: '0 4px 12px rgba(0,0,0,0.45)',
    lg: '0 12px 32px rgba(0,0,0,0.5)',
  },
};

const THEME_STORAGE_KEY = 'oursynth.theme.mode';

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function applyCssVars(tokens: ThemeTokens) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--bg', tokens.colors.bg);
  root.style.setProperty('--fg', tokens.colors.fg);
  root.style.setProperty('--muted', tokens.colors.muted);
  root.style.setProperty('--primary', tokens.colors.primary);
  root.style.setProperty('--border', tokens.colors.border);

  root.style.setProperty('--radius-sm', tokens.radius.sm);
  root.style.setProperty('--radius-md', tokens.radius.md);
  root.style.setProperty('--radius-lg', tokens.radius.lg);
  root.style.setProperty('--radius-xl', tokens.radius.xl);

  root.style.setProperty('--space-xs', tokens.spacing.xs);
  root.style.setProperty('--space-sm', tokens.spacing.sm);
  root.style.setProperty('--space-md', tokens.spacing.md);
  root.style.setProperty('--space-lg', tokens.spacing.lg);
  root.style.setProperty('--space-xl', tokens.spacing.xl);

  root.style.setProperty('--shadow-sm', tokens.shadow.sm);
  root.style.setProperty('--shadow-md', tokens.shadow.md);
  root.style.setProperty('--shadow-lg', tokens.shadow.lg);
}

export type AppThemeProviderProps = {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
};

export function AppThemeProvider({ children, defaultMode }: AppThemeProviderProps) {
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const initialMode: ThemeMode = useMemo(() => {
    if (typeof window === 'undefined') return defaultMode ?? 'dark';
    const stored = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null);
    if (stored === 'light' || stored === 'dark') return stored;
    return defaultMode ?? (prefersDark ? 'dark' : 'light');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const tokens = mode === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;

  const setModeSafe = useCallback((next: ThemeMode) => {
    setMode(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    }
  }, []);

  const toggle = useCallback(() => setModeSafe(mode === 'dark' ? 'light' : 'dark'), [mode, setModeSafe]);

  useEffect(() => {
    applyCssVars(tokens);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode, tokens]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    const onScheme = (e: MediaQueryListEvent) => {
      // Only auto-change if there is no explicit user preference in localStorage
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) setModeSafe(e.matches ? 'dark' : 'light');
    };
    scheme.addEventListener?.('change', onScheme);

    return () => scheme.removeEventListener?.('change', onScheme);
  }, [setModeSafe]);

  const value: AppThemeContextValue = useMemo(() => ({
    mode,
    reducedMotion: !!prefersReducedMotion,
    tokens,
    toggle,
    setMode: setModeSafe,
  }), [mode, prefersReducedMotion, tokens, toggle, setModeSafe]);

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within AppThemeProvider');
  return ctx;
}
