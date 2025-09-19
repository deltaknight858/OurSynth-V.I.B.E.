// PROMOTED from import-staging/apps/app/pathways/CapsuleExportButton.tsx on 2025-09-08T20:34:32.019Z
// TODO: Review for token + design lint compliance.
import React from 'react';
import { Button } from '../ui/Button';
import { exportCapsule } from './capsuleExport';

interface CapsuleExportButtonProps {
  dir: string;
  manifest: any;
  outFile: string;
  user: string;
  onExported?: (result: any) => void;
}

export const CapsuleExportButton: React.FC<CapsuleExportButtonProps> = ({ dir, manifest, outFile, user, onExported }) => {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);

  const handleExport = async () => {
    setLoading(true);
    try {
      const capsule = await exportCapsule({ dir, manifest, outFile, user });
      setResult(capsule);
      if (onExported) onExported(capsule);
    } catch (err) {
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="primary" onClick={handleExport} disabled={loading}>
      {loading ? 'Exporting Capsule...' : 'Export Capsule'}
    </Button>
  );
};
