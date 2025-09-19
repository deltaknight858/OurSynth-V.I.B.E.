
import { useQuery } from '@tanstack/react-query';
import domainService from '@/services/domainService';
import { useAuth } from '@/contexts/AuthContext';

export const useDomains = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['domains', user?.id],
    queryFn: domainService.getDomains,
    enabled: !!user, // Only fetch domains if the user is logged in
  });
};
