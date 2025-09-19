import { useState, useEffect } from 'react';

const mockBranches = ['main', 'develop', 'staging', 'feat/new-ui', 'fix/login-bug', 'release/v1.2.0'];

/**
 * Mock hook to fetch branches for a given repository URL.
 * In a real application, this would make an API call to the Git provider.
 * @param repoUrl The URL of the git repository.
 */
export const useDeployBranches = (repoUrl: string | undefined) => {
  const [branches, setBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // A simple validation to trigger the "fetch"
    if (repoUrl && repoUrl.startsWith('https://') && repoUrl.endsWith('.git')) {
      setLoading(true);
      setBranches([]);
      
      // Simulate a network call to fetch branches
      const timer = setTimeout(() => {
        setBranches(mockBranches);
        setLoading(false);
      }, 700);

      return () => clearTimeout(timer);
    } else {
      // Clear branches if the URL is invalid or empty
      setBranches([]);
    }
  }, [repoUrl]);

  return { branches, loading };
};