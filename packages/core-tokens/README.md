# @oursynth/core

Design tokens, AppThemeProvider, and shared contracts for the OurSynth ecosystem.

## Features

- AppThemeProvider and useAppTheme (light/dark, reduced motion)
- Tokens: colors, spacing, typography, motion
- Shared TypeScript contracts

## Install

```bash
pnpm add @oursynth/core
```

## Usage

Wrap your app:

```tsx
import { AppThemeProvider } from '@oursynth/core';

export default function RootLayout({ children }) {
	return <AppThemeProvider>{children}</AppThemeProvider>;
}
```

## Notes

- ESM build in dist/ via tsup
- React SVG components follow strokeWidth/stopColor attributes
