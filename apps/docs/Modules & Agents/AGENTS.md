# Agents Architecture

_Status: Living, authoritative_
_Last updated: September 24, 2025_

**See Also:**

- [Agents Overview](./agents-overview.md)
- [Glossary](../reference/GLOSSARY.md)
- [Engineering Standards](../reference/STANDARDS.md)
- [Component Guidelines](../components/COMPONENT_GUIDELINES.md)
- [Shell Layout](../architecture/SHELL_LAYOUT.md)
- [User Flow](../workflows/user-flow.md)

Agents are composable units that perform actions, emit events, and can be orchestrated.

## Concepts

- Agent: function/object with a clear contract (inputs, outputs, side‑effects)
- Events: typed messages emitted by agents for provenance
- Orchestrator: schedules and composes agents

## Contracts

- Define types in packages/shared-types
- Expose agent factories in packages/agents
- Emit provenance events to mesh utilities

## Testing

- Unit tests for agent logic (happy + error paths)
- Contract tests for inputs/outputs and events

## Docs

- Each agent MUST document inputs, outputs, errors, and example usage
