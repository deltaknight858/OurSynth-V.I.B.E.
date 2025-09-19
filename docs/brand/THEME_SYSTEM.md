# Theme System

Central theme provider and tokens are defined in packages/core.

## Components

- AppThemeProvider: wraps apps; respects system dark/light and reduced motion
- useAppTheme: returns current mode and toggle function
- Tokens: color palette, typography, spacing, radii, motion

## Usage

- Wrap app layout with AppThemeProvider
- Access tokens via styled components or CSS variables
- Use prefersReducedMotion gates for animations

## Storybook

- ThemeContext stories to toggle light/dark
- ThemeTokens story to visualize tokens
- Motion story demonstrating reduced motion
