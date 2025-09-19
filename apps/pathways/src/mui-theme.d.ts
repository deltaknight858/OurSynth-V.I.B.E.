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
