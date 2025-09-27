# OurSynth Theme (No MUI)

A lightweight theme system using React Context + CSS variables.

- Tokens applied to `:root` as CSS vars (e.g., `--bg`, `--fg`, `--primary`).
- `data-theme="light|dark"` on `<html>` for easy selectors.
- Respects prefers-color-scheme and prefers-reduced-motion.

## Usage

Wrap your app:

```tsx
import { AppThemeProvider } from '@/components/theme/AppThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}
```


Read values:

```tsx
import { useAppTheme } from '@/components/theme/AppThemeProvider';

export function ThemeToggle() {
  const { mode, toggle } = useAppTheme();
  return <button onClick={toggle}>Theme: {mode}</button>;
}
```

Style with vars:

```css
:root {
  color-scheme: light dark;
  background: var(--bg);
  color: var(--fg);
}

.button-primary {
  background: var(--primary);
  color: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```