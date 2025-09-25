# Capsules (Manifest, Packaging, Signing)

Capsules are portable workflow artifacts: manifests + code + signatures.

## Manifest

- Schema: versioned; validated via zod (packages/capsule)
- Fields: name, version, description, inputs, outputs, actions, signatures

## Packaging

- Pack code and manifest into a .capsule archive
- Include integrity hashes; support content‑addressable storage

## Signing

- Use tweetnacl/Ed25519 for signatures
- Verify on import and before execution

## Marketplace

- Capsules can be listed and sold via the Workflow Marketplace
- Revenue share: 20–30% platform fee
