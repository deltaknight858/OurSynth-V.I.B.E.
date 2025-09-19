# Component Spec: HaloButton

**Status:** `STABLE`
**Path:** `components/system/HaloButton.tsx`

## 1. Purpose

The `HaloButton` is the primary call-to-action (CTA) and interactive element for the OurSynth ecosystem. It provides several visual variants to suit different levels of emphasis, from high-impact primary actions to subtle ghost buttons. It is built to be fully themeable using design tokens.

---

## 2. Props API

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary'` \| `'secondary'` \| `'ghost'` | `'primary'` | The visual style of the button. |
| `children` | `React.ReactNode` | - | The content of the button (e.g., text, icon). |
| `className` | `string` | `''` | Optional additional CSS classes to apply. |
| `...props` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | - | All other standard HTML button attributes are accepted (e.g., `onClick`, `disabled`). |

---

## 3. Variants

### Primary
- **Usage**: For the most important action on a page or in a view (e.g., "Get Started", "Deploy").
- **Style**: High-contrast `neonCyan` background with a `neonPurple` hover effect and a subtle glow.
- **Example**:
  ```tsx
  <HaloButton variant="primary">Deploy Now</HaloButton>
  ```

### Secondary
- **Usage**: For secondary actions that are less critical than the primary one (e.g., "View Details", "Cancel").
- **Style**: A semi-transparent "glass" button that fits well on glassmorphic backgrounds.
- **Example**:
  ```tsx
  <HaloButton variant="secondary">View Logs</HaloButton>
  ```

### Ghost
- **Usage**: For tertiary actions or actions that should not draw significant attention (e.g., "Dismiss", "Learn More" in a subtle context).
- **Style**: A transparent button with text that becomes more prominent on hover.
- **Example**:
  ```tsx
  <HaloButton variant="ghost">Dismiss</HaloButton>
  ```

---

## 4. Usage

Import the component and use it like a standard button.

```tsx
import { HaloButton } from '@/components/system/HaloButton';

function MyComponent() {
  const handleDeploy = () => {
    console.log('Deploying...');
  };

  return (
    <div>
      <HaloButton variant="primary" onClick={handleDeploy}>
        Deploy Project
      </HaloButton>
      <HaloButton variant="secondary" disabled>
        Save Draft
      </HaloButton>
    </div>
  );
}
```

---

## 5. Accessibility

- The component renders a standard HTML `<button>` element, inheriting all native accessibility features.
- Ensure that the `children` provide a clear and descriptive label for the button's action.
- For icon-only buttons, use an `aria-label` to describe the action for screen readers.

---

## 6. Design Tokens

The `HaloButton` exclusively uses design tokens for its styling. No hard-coded hex values are present.

- **Primary**: `bg-neonCyan`, `text-deepSpace`, `hover:bg-neonPurple`, `hover:shadow-neonPurple/50`
- **Secondary**: `bg-slateGrey/20`, `border-glass-border`
- **Ghost**: `text-slateGrey`, `hover:bg-slateGrey/20`