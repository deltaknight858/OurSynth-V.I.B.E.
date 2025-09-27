// PROMOTED from import-staging/apps/app/capsule/page.tsx on 2025-09-08T20:34:32.036Z
// TODO: Review for token + design lint compliance.
import React from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';

export default function CapsulePage() {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, p: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Capsule
      </Typography>
      <Typography variant="body1" mb={3}>
        Capsules are portable, signed, replayable app bundles with full provenance and mesh-ready distribution.
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" mb={1}>Capsule Actions</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary">Pack Capsule</Button>
          <Button variant="outlined" color="secondary">Unpack Capsule</Button>
          <Button variant="outlined" color="secondary">Verify Signature</Button>
        </Stack>
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={1}>Capsule Manifest Example</Typography>
        <pre style={{ fontSize: 13, background: '#f5f5f5', padding: 12, borderRadius: 6 }}>
{`{
  "id": "urn:oursynth:app:chat@1.0.0",
  "name": "Realtime Chat Capsule",
  "version": "1.0.0",
  "description": "A portable, mesh-ready chat app capsule with full provenance.",
  "build": "sha256-...",
  "services": ["chat", "presence"],
  "env": { "NODE_ENV": "production" },
  "rights": { "license": "OSL-3.0-or-compatible", "resaleAllowed": true, "attribution": true },
  "sbom": "...",
  "attestation": "...",
  "signature": "...",
  "publicKey": "..."
}`}
        </pre>
      </Paper>
    </Box>
  );
}
