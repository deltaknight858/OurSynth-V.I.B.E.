---
applyTo: '**'
---
Copilot Prompts for OurSynth Theme System Implementation
Theme Provider Implementation
"Create an AppThemeProvider component that implements Material UI's ThemeProvider with dark and light themes. Include a context for toggling between themes and accessing theme state."

"Write a custom hook called useAppTheme that provides access to the current theme mode (light/dark) and a function to toggle between them."

"Enhance the AppThemeProvider to respect user system preferences for dark/light mode and reduced motion. Include TypeScript types for all props and return values."

Theme Documentation
"Write comprehensive markdown documentation for our theme system, including how to wrap components with AppThemeProvider, how to access theme values, and a table of our theme tokens."

"Create code examples showing how to use styled components with our theme system, including responsive design patterns and accessibility considerations."

Storybook Stories
"Create a ThemeContext.stories.tsx file that demonstrates our theme system with interactive controls to toggle between light and dark modes."

"Build a ThemeTokens story that visually displays all of our theme colors, typography, spacing, and other design tokens with proper labeling."

"Implement a story that shows how animations and transitions adapt to the prefersReducedMotion setting in our theme system."

Theme Verification and Testing
"Write a test script that verifies the Header, WorkspaceShell, and FeaturePanel components are correctly using our theme system."

"Create a Jest test suite for AppThemeProvider that verifies theme toggling, system preference detection, and proper context propagation."

"Write a script that scans our codebase to identify components not using the theme system and generates a report."

Development Tooling
"Create an ESLint rule that enforces AppThemeProvider usage in page components and suggests fixes for components missing it."

"Update our tsconfig.json to properly resolve imports from the UI package, especially for the theme system components."

"Create a pre-commit hook script that runs our theme verification checks and prevents commits if critical components aren't using the theme system."

Integration Tasks
"Update the WorkspaceShell component to use AppThemeProvider and implement a theme toggle button in the header."

"Modify our Storybook configuration to automatically wrap all stories with AppThemeProvider unless explicitly opted out."

"Create a migration script that can update existing components to use our theme system by replacing hardcoded color values with theme references."

Testing & Verification
"Test the MarketplaceModal component with both light and dark themes and verify all UI elements adapt correctly."

"Write an E2E test that verifies theme persistence when navigating between different parts of the application."

"Create a visual regression test suite that captures screenshots of key components in both light and dark themes for comparison."

