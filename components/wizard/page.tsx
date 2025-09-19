// PROMOTED from import-staging/apps/app/pathways/page.tsx on 2025-09-08T20:34:32.025Z
// TODO: Review for token + design lint compliance.
"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '../ui/DashboardLayout';
import { SharedCard } from '../ui/SharedCard';
import PathwaysWizard from './PathwaysWizard';
import { Button } from '../ui/Button';
import '../ui/ui.css';

export default function PathwaysPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  return (
    <DashboardLayout title="Pathways">
  <div className="dashboardLayout dashboardLayout--noPad">
        <SharedCard title="Visual App Generation" sx={{ mb: 4 }}>
          <p>
            Compose, automate, and deploy workflows in seconds. Drag, drop, and connect services with instant feedback and provenance.
          </p>
        </SharedCard>
        {/* Add more Pathways features here */}
  <Button
          variant="primary"
          size="lg"
          onClick={() => setWizardOpen(true)}
          style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 1200, borderRadius: 9999 }}
        >
          + New App
        </Button>
  <PathwaysWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onComplete={() => {}} />
      </div>
    </DashboardLayout>
  );
}
