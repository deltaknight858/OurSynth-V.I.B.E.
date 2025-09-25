// PROMOTED from import-staging/apps/app/pathways/capsuleExport.ts on 2025-09-08T20:34:32.015Z
// TODO: Review for token + design lint compliance.
// Capsule export utility for Studio/Pathways integration
import { packCapsule, generateKeypair, generateProvenance, generateSBOM, generateAttestation } from '@oursynth/capsule';
import fs from 'fs';
import path from 'path';

export async function exportCapsule({
  dir,
  manifest,
  outFile,
  user
}: {
  dir: string;
  manifest: any;
  outFile: string;
  user: string;
}) {
  // Generate keypair (in real app, use user or project keys)
  const { publicKey, secretKey } = await generateKeypair();
  // Add provenance, SBOM, attestation to manifest
  const provenance = generateProvenance('export', user);
  const sbom = generateSBOM(dir);
  const attestation = generateAttestation(manifest, ''); // Signature added by packCapsule
  const fullManifest = {
    ...manifest,
    provenance,
    sbom,
    attestation,
    publicKey
  };
  // Pack capsule
  const capsule = await packCapsule(dir, fullManifest, secretKey, outFile);
  return capsule;
}
