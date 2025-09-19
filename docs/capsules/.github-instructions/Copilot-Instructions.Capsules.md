# OurSynth Capsules - Copilot Guide

This file guides Copilot in helping with OurSynth Capsules - our portable app bundle format with time-travel provenance.

## Core Capabilities

Capsules enable:
- Deterministic, signed app bundles with full rebuild capability
- Time-travel history with branching and promotion to deploy
- Offline portability in a single file
- Trust and rights management for premium capsules
- Peer-to-peer mesh distribution

## Key Components

1. **packages/capsule** - Core manifest and cryptographic functions
   - manifest.ts: Zod schema for capsule contents
   - crypto.ts: Ed25519 signing and verification
   - cli.ts: Pack/unpack functionality

2. **Studio Integration**
   - TimeMachine.tsx: UI for timeline events and deploy promotion
   - MeshCapsules.tsx: Local network capsule discovery

3. **Deploy Integration**
   - api/deploy/capsule.ts: Endpoint that accepts and processes Capsules

4. **OAI Tools**
   - tools.capsule.ts: Orchestrator integration for packing and deploying

## Common Operations

- Generate keypair: `capsule keygen`
- Pack app: `capsule pack ./apps/appA --manifest ./capsule.json --out ./out/appA.caps`
- Verify capsule: `capsule unpack ./out/appA.caps --pub <base64-key>`
- Deploy capsule: Use OAI tools or the deploy API endpoint

## Development Patterns

When implementing Capsules functionality:
1. Always validate manifests with Zod
2. Verify signatures before unpacking or deploying
3. Update the Timeline UI when operations complete
4. Ensure rights metadata is properly preserved

## Typical Workflows

- **Developer creates Capsule**: Generate code → Edit → Create Capsule → Sign → Share
- **User installs Capsule**: Verify signature → Extract → Run build steps → Start
- **Timeline promotion**: Select point in time → Create Capsule → Deploy