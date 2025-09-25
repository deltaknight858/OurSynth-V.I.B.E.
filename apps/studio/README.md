# OurSynth Studio

A unified creative workspace for music generation, implementing the Phase 2 architecture with a cohesive, intuitive interface that minimizes navigation and maximizes creative flow.

## Features

### 🎵 Unified Workspace
- Single workspace with all features accessible via left navigation
- No page refreshes - smooth transitions between features
- URL-driven state for bookmarkable sessions

### 🎛️ Available Features
- **Vibe**: Create atmospheric and mood-based musical elements
- **Wizard**: Guided music creation assistant  
- **Analyzer**: Analyze and process audio content
- **Capsule**: Package and deploy music components
- **Mesh Sim**: Simulate complex audio mesh networks
- **Cards**: Card-based music composition interface
- **Orchestrator**: Coordinate multiple music generation agents
- **Ambient**: Generate ambient and atmospheric soundscapes

### 🔗 Deep Linking
Each feature supports direct URL access:
- `/` - Main studio workspace (defaults to Vibe)
- `/?feature=wizard` - Workspace with Wizard active
- `/vibe` - Direct Vibe panel
- `/wizard` - Direct Wizard panel
- `/analyzer` - Direct Analyzer panel
- `/command-center` - Admin and operations center

## Development

### Start Development Server
```bash
npm run dev:studio
```
The studio will be available at [http://localhost:3002](http://localhost:3002)

### Build for Production
```bash
npm run build:studio
```

### Start Production Server
```bash
npm run start:studio
```

## Architecture

### Phase 2 Implementation
This implements the complete Phase 2 unified layout architecture:

- **WorkspaceShell**: Core layout component with header and navigation
- **FeaturePanel**: Dynamic panel system that renders appropriate feature
- **LeftNav**: Feature navigation with active states and descriptions
- **Individual Panels**: Each feature encapsulated in its own panel component
- **Fallback Pages**: Standalone pages for each feature supporting deep linking

### File Structure
```
apps/studio/
├── app/                          # Next.js app directory
│   ├── [feature]/page.tsx       # Individual feature pages
│   ├── command-center/page.tsx  # Admin interface
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main studio page
├── components/
│   ├── features/                # Feature panel components
│   ├── layout/                  # Header and navigation
│   └── workspace/               # Core workspace components
└── types/                       # TypeScript definitions
```

### Key Components
- `WorkspaceShell` - Main workspace container with navigation
- `FeaturePanel` - Renders active feature panel
- `LeftNav` - Feature navigation sidebar
- `Header` - Top navigation and branding
- Feature panels for each music creation tool

## Technologies

- **Next.js 14** - App directory with React Server Components
- **React 18** - Component architecture
- **TypeScript** - Type safety
- **Tailwind CSS** - Responsive styling
- **Framer Motion** - Smooth animations (ready for enhancement)