# Navigation & Layout

## Bottom Navigation (Mobile‑First)
- Fixed, glassmorphic bar
- Icons + labels: Home, Labs, Pathways, Orchestrator, Analyzer, V.I.B.E., Connect, History, About, Contact
- Route‑aware highlighting
- Accessible: ARIA labels, focus states

## Desktop Top Navigation
- Sticky, glassmorphic top bar
- Same route‑aware logic as bottom nav
- Hidden on mobile

## Command Palette
- ⌘K / Ctrl+K to open
- Fuzzy search for all pages and quick actions
- Extensible for onboarding, docs, brand tokens

## Layout Example
```jsx
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import CommandPalette from '@/components/CommandPalette';

export default function Layout({ children }) {
  return (
    <>
      <TopNav />
      <CommandPalette />
      <main>{children}</main>
      <BottomNav />
    </>
  );
}
```

[Back to Index](./index.md)
