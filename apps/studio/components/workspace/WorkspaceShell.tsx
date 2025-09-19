'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Header from '../layout/Header';
import LeftNav from '../layout/LeftNav';
import FeaturePanel from './FeaturePanel';
import { WorkspaceFeature, DEFAULT_FEATURE } from '../../types/workspace';

interface WorkspaceShellProps {
  initialFeature?: WorkspaceFeature;
}

export default function WorkspaceShell({ initialFeature }: WorkspaceShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [activeFeature, setActiveFeature] = useState<WorkspaceFeature>(
    initialFeature || (searchParams.get('feature') as WorkspaceFeature) || DEFAULT_FEATURE
  );
  
  // Sync URL with active feature
  useEffect(() => {
    const currentFeature = searchParams.get('feature');
    if (activeFeature && activeFeature !== currentFeature) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('feature', activeFeature);
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [activeFeature, pathname, router, searchParams]);
  
  // Handle feature change
  const handleFeatureChange = (feature: WorkspaceFeature) => {
    setActiveFeature(feature);
  };
  
  return (
    <div className="workspace-shell">
      <Header />
      <div className="workspace-content">
        <LeftNav activeFeature={activeFeature} onFeatureChange={handleFeatureChange} />
        <FeaturePanel feature={activeFeature} />
      </div>
    </div>
  );
}