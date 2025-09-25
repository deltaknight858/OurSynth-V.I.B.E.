# @oursynth/analyzer

## Overview
A package for analyzing React components, recognizing reusable design patterns, and automating contributions to the design system.

## Features
- AST-based component analysis (props, styles, structure)
- Pattern recognition against existing design system components
- Automated contribution workflow (branch, move, Storybook, PR)

## Usage
```ts
import { ComponentAnalyzer } from '@oursynth/analyzer';
const analysis = ComponentAnalyzer.analyze(componentCode);
```

## Directory Structure
- `services/ComponentAnalyzer.ts`: AST analysis of React components
- `services/PatternRecognitionService.ts`: Pattern matching and consistency checks
- `services/ContributionWorkflow.ts`: Automated contribution workflow

## Setup
- Install dependencies: `npm install`
- Requires Babel parser and traverse
- For PR automation, install GitHub CLI (`gh`)

## Future Ideas ⭐️
- Support more style systems (emotion, SCSS)
- Advanced structure matching
- Real-time Studio integration

## License
MIT
