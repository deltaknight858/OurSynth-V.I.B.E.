
# 🎨 Theme System

The theme system ensures consistent design tokens and adaptive theming across all apps.  
Central theme provider and tokens are defined in `packages/core`.

## Components

- **AppThemeProvider**: wraps apps; respects system dark/light and reduced motion
- **useAppTheme**: hook returning current mode and toggle function
- **Tokens**: color palette, typography, spacing, radii, motion

## Usage

```tsx
<AppThemeProvider>
  <AppLayout />
</AppThemeProvider>
```

Access tokens via styled components or CSS variables

Use prefersReducedMotion gates for animations

## Storybook

- ThemeContext stories: toggle light/dark
- ThemeTokens story: visualize tokens
- Motion story: demonstrate reduced motion and accessibility

## Token Visualization

| Token Type   | Example Value                | Usage                |
|--------------|-----------------------------|----------------------|
| Primary Color| #7C4DFF                     | Buttons, highlights  |
| Surface      | #12121A                     | Card backgrounds     |
| Spacing S    | 8px                         | Padding/margin small |
| Spacing M    | 16px                        | Padding/margin med   |
| Radius       | 6px                         | Border radius        |
| Headline Font| Orbitron                    | Headings             |
| Body Font    | Inter, Segoe UI, Arial      | Paragraphs, UI text  |

---

So yes — your draft is good, but with a few tweaks (purpose line, code snippet, token example) it will feel more like a **living reference** and less like a checklist.
