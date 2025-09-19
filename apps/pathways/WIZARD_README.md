# OurSynth Pathways Wizard

A modern, AI-powered project creation interface built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Framer Motion. Transform your vision into deployable applications through intelligent conversation and code generation.

## ✨ Features

- **AI-Powered Blueprint Creation**: Intelligent project vision capture with detailed prompting
- **Real-time Code Generation**: Live preview and generation of project files
- **Glass Morphism Design**: Modern UI with backdrop blur effects and neon accents
- **Smooth Animations**: Powered by Framer Motion with flicker effects and transitions
- **Mobile Responsive**: Optimized for all screen sizes
- **TypeScript**: Full type safety throughout
- **OpenAI Integration**: Advanced AI-driven code generation and suggestions
- **Supabase Integration**: Backend services and database connectivity

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.2 with App Router
- **React**: 19.1.0 with TypeScript
- **Styling**: Tailwind CSS 4.x with custom glass morphism effects
- **Animations**: Framer Motion 12.23.12
- **AI**: OpenAI API integration
- **Backend**: Supabase for data persistence
- **Code Highlighting**: React Syntax Highlighter
- **Notifications**: react-hot-toast
- **State Management**: React Context + useReducer

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server (default port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run tsc:noEmit

# Linting
npm run lint
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme
│   ├── page.tsx            # Main entry point
│   └── globals.css         # Global styles & animations
├── components/
│   ├── FullScreenPrompt.tsx    # Main AI prompt interface
│   ├── StepIndicator.tsx       # Progress indicator
│   ├── TemplateSelector.tsx    # Template selection component
│   ├── ConfigForm.tsx          # Configuration form
│   ├── ReviewSummary.tsx       # Review summary
│   ├── ConfirmationScreen.tsx  # Completion screen
│   ├── UnifiedCodeGenerator.tsx # AI code generation
│   ├── NextArrowButton.tsx     # Navigation component
│   └── SimpleTest.tsx          # Testing component
├── contexts/
│   └── WizardContext.tsx       # Global state management
├── services/
│   └── ProjectGenerator.ts     # AI project generation logic
└── styles/
    ├── wizard.css              # Wizard-specific styles
    └── glass.css               # Glass morphism effects
```

## 🎯 Current Interface

### Main Prompt Interface
- **Full-screen immersive experience** with animated glass morphism
- **Intelligent prompting** that encourages detailed project descriptions
- **Real-time AI processing** with OpenAI integration
- **Live code preview** and generation capabilities
- **Neon-themed design** with gradient accents and flicker effects

### Wizard Components (Available)
- Template selection with visual previews
- Configuration forms with validation
- Review and summary screens
- Confirmation with animated feedback
- Progress indicators and navigation

## 🎨 Design System

- **Primary Colors**: Cyan (#22d3ee), Pink (#ec4899), Lime (#84cc16) gradients
- **Background**: White base with glass morphism overlays
- **Accents**: Neon-themed with flicker animations and glow effects
- **Typography**:
  - Gradient text effects with neon styling
  - Responsive font scaling (3xl to 6xl)
  - Custom "neon-etched" and "neon-accent" classes
- **Effects**:
  - Glass morphism with backdrop blur
  - Animated underlines and borders
  - Hover transformations and glow effects
  - Smooth transitions and entrance animations

## 🌐 Development Server

The application runs on `http://localhost:3000` by default when using `npm run dev`.

For custom ports, use: `npm run dev -- --port <port-number>`

## 🔧 Key Dependencies

- **@emotion/react** & **@emotion/styled**: CSS-in-JS styling
- **@mui/material** & **@mui/icons-material**: Material-UI components
- **@supabase/supabase-js**: Backend services and database
- **openai**: AI-powered code generation
- **framer-motion**: Advanced animations and transitions
- **react-syntax-highlighter**: Code preview and highlighting
- **js-beautify**: Code formatting and prettification

## 📝 Development Notes

- **Standalone AI Interface**: No external auth dependencies required for core functionality
- **Modern Browser Optimized**: Uses cutting-edge React 19 and Next.js 15 features
- **SEO-Friendly**: Proper metadata and semantic structure
- **Type-Safe**: Complete TypeScript coverage with strict compilation
- **Performance Optimized**: Client-side rendering with efficient state management
- **Responsive Design**: Mobile-first approach with adaptive layouts
