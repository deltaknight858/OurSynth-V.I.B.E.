export type ThemeMode = 'light' | 'dark';

export type ThemeTokens = {
  colors: {
    bg: string;
    fg: string;
    muted: string;
    primary: string;
    border: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
};

export type AppThemeContextValue = {
  mode: ThemeMode;
  reducedMotion: boolean;
  tokens: ThemeTokens;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};
