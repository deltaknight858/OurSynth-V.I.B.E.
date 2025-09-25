import { Suspense } from 'react';
import WorkspaceShell from '../components/workspace/WorkspaceShell';
import { WorkspaceFeature } from '../types/workspace';

interface StudioPageProps {
  searchParams: { feature?: string };
}

export default function StudioPage({ searchParams }: StudioPageProps) {
  const feature = searchParams.feature as WorkspaceFeature;
  
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-slate-600 dark:text-slate-400">Loading studio...</div>
          </div>
        </div>
      }
    >
      <WorkspaceShell initialFeature={feature} />
    </Suspense>
  );
}