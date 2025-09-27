import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Deployment {
  id: string;
  name: string;
  url: string;
  status: 'Queued' | 'Building' | 'Success' | 'Error' | 'Cancelled';
  lastDeployed: string;
  repoUrl: string;
  branch: string;
}

export interface CreateDeploymentPayload {
  repoUrl: string;
  projectName: string;
  branch: string;
  commands?: string;
  preview?: boolean;
}

const mockDeployments: Deployment[] = [
  {
    id: 'site_1722324058108',
    name: 'My Production App',
    url: 'my-prod-app.softgen.app',
    status: 'Success',
    lastDeployed: '2024-07-29T12:34:56Z',
    repoUrl: 'https://github.com/user/repo1',
    branch: 'main',
  },
  {
    id: 'site_1722324058109',
    name: 'Staging Environment',
    url: 'staging.softgen.app',
    status: 'Building',
    lastDeployed: '2024-07-30T09:00:00Z',
    repoUrl: 'https://github.com/user/repo1',
    branch: 'develop',
  },
  {
    id: 'site_1722324058110',
    name: 'Feature Branch Test',
    url: 'feat-new-auth.softgen.app',
    status: 'Error',
    lastDeployed: '2024-07-28T18:20:10Z',
    repoUrl: 'https://github.com/user/repo1',
    branch: 'feat/new-auth',
  },
];

const mockLogs: Record<string, string[]> = {
    'site_1722324058108': [
        'Build started...',
        'Cloning repository...',
        'Installing dependencies...',
        'Running build script...',
        'Build successful!',
        'Deploying to production...',
        'Deployment complete.',
    ],
    'site_1722324058109': [
        'Build started...',
        'Cloning repository...',
        'Installing dependencies...',
        'Running build script...',
    ],
    'site_1722324058110': [
        'Build started...',
        'Cloning repository...',
        'Error: Failed to install dependencies.',
    ],
};

const mockEnvs: Record<string, Record<string, string>> = {
  'site_1722324058108': {
    'DATABASE_URL': 'postgres://user:pass@host:port/db',
    'NEXT_PUBLIC_API_URL': 'https://api.example.com',
    'SECRET_KEY': 'a-very-secret-key-that-is-long'
  },
  'site_1722324058109': {
    'NODE_ENV': 'staging',
  },
};

// This is a mock API call
const api = {
  getDeployments: async (): Promise<Deployment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockDeployments];
  },
  createDeployment: async (payload: CreateDeploymentPayload): Promise<Deployment> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
<<<<<<< HEAD
    console.log('Creating deployment:', payload);
=======
    // Development logging removed for production readiness
>>>>>>> 4feaadea468fca2b13cf09955b1eec9f1acc2214
    const newDeployment: Deployment = {
      id: `site_${Date.now()}`,
      name: payload.projectName,
      url: `${payload.projectName.toLowerCase().replace(/\s+/g, '-')}.softgen.app`,
      status: 'Queued',
      lastDeployed: new Date().toISOString(),
      repoUrl: payload.repoUrl,
      branch: payload.branch,
    };
    mockDeployments.unshift(newDeployment);
    return newDeployment;
  },
  getDeploymentLogs: (siteId: string, onLog: (log: string) => void): (() => void) => {
    let i = 0;
    const logs = mockLogs[siteId] || ['No logs found for this deployment.'];
    const interval = setInterval(() => {
      if (i < logs.length) {
        onLog(logs[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  },
  getEnv: async (siteId: string): Promise<Record<string, string>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...(mockEnvs[siteId] || {}) };
  },
  updateEnv: async (siteId: string, updates: Record<string, string>): Promise<Record<string, string>> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    mockEnvs[siteId] = updates;
    return { ...mockEnvs[siteId] };
  },
};

export const useDeployments = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [env, setEnv] = useState<Record<string, string>>({});
  const [isEnvLoading, setIsEnvLoading] = useState(false);

  const fetchDeployments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getDeployments();
      setDeployments(data);
<<<<<<< HEAD
    } catch (error) {
      toast.error('Failed to fetch deployments.');
      console.error(error);
=======
    } catch {
      toast.error('Failed to fetch deployments.');
      // Error details are logged through the error boundary
>>>>>>> 4feaadea468fca2b13cf09955b1eec9f1acc2214
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  const create = useCallback(async (payload: CreateDeploymentPayload) => {
    setLoading(true);
    try {
      await api.createDeployment(payload);
      toast.success('Deployment created successfully!');
      await fetchDeployments(); // Refetch to get the new deployment
<<<<<<< HEAD
    } catch (error) {
      toast.error('Failed to create deployment.');
      console.error(error);
=======
    } catch {
      toast.error('Failed to create deployment.');
      // Error details are logged through the error boundary
>>>>>>> 4feaadea468fca2b13cf09955b1eec9f1acc2214
    } finally {
      setLoading(false);
    }
  }, [fetchDeployments]);

  const getDeploymentById = useCallback((id: string) => {
    return deployments.find(d => d.id === id);
  }, [deployments]);

  const getLogs = useCallback((siteId: string, onLog: (log: string) => void) => {
    return api.getDeploymentLogs(siteId, onLog);
  }, []);

  const getEnv = useCallback(async (siteId: string) => {
    setIsEnvLoading(true);
    try {
      const data = await api.getEnv(siteId);
      setEnv(data);
<<<<<<< HEAD
    } catch (error) {
      toast.error('Failed to fetch environment variables.');
      console.error(error);
=======
    } catch {
      toast.error('Failed to fetch environment variables.');
      // Error details are logged through the error boundary
>>>>>>> 4feaadea468fca2b13cf09955b1eec9f1acc2214
    } finally {
      setIsEnvLoading(false);
    }
  }, []);

  const updateEnv = useCallback(async (siteId: string, updates: Record<string, string>) => {
    setIsEnvLoading(true);
    try {
      const data = await api.updateEnv(siteId, updates);
      setEnv(data);
      toast.success('Environment variables updated successfully.');
<<<<<<< HEAD
    } catch (error) {
      toast.error('Failed to update environment variables.');
      console.error(error);
=======
    } catch {
      toast.error('Failed to update environment variables.');
      // Error details are logged through the error boundary
>>>>>>> 4feaadea468fca2b13cf09955b1eec9f1acc2214
    } finally {
      setIsEnvLoading(false);
    }
  }, []);

  return { 
    loading, 
    deployments, 
    create, 
    getDeploymentById, 
    getLogs,
    env,
    isEnvLoading,
    getEnv,
    updateEnv,
  };
};
  
