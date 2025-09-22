// PROMOTED from import-staging/apps/app/command-center/page.tsx on 2025-09-08T20:34:32.031Z
// TODO: Review for token + design lint compliance.
"use client";
import React from "react";
import CommandCenter from "../../ai/CommandCenter";
const DashboardLayout: React.FC<{ title?: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="layout-edge">
    {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
    {children}
  </div>
);

export default function CommandCenterPage() {
  return (
    <DashboardLayout title="OAI Orchestrator Command Center">
      <CommandCenter />
    </DashboardLayout>
  );
}
