// Central Type Exports (Phase 1)
// Add shared interfaces gradually as modules are promoted.

export interface AuthUser {
  id: string;
  email?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
}

export interface Deployment {
  id: string;
  name: string;
  url: string;
  status: 'Queued' | 'Building' | 'Success' | 'Error' | 'Cancelled';
  lastDeployed: string;
  repoUrl: string;
  branch: string;
}
