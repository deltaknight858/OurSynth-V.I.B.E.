
import { useMutation, useQueryClient } from '@tanstack/react-query';
import domainService, { Domain } from '@/services/domainService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useDomainActions = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = ['domains', user?.id];

  const onSettled = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  // Purchase Domain Mutation
  const purchaseDomainMutation = useMutation<Domain, Error, { name: string; years: number }>({
    mutationFn: ({ name, years }) => domainService.purchaseDomain(name, years),
    onSuccess: (data) => {
        toast.success(`Domain "${data.name}" purchased successfully!`);
    },
    onError: (error: Error) => {
        toast.error(error.message || 'Failed to purchase domain.');
    },
    onSettled,
  });

  // Renew Domain Mutation
  const renewDomainMutation = useMutation<Domain, Error, { domainId: string; years: number }, { previousDomains: Domain[] | undefined }>({
    mutationFn: ({ domainId, years }) => domainService.renewDomain(domainId, years),
    onMutate: async ({ domainId, years }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousDomains = queryClient.getQueryData<Domain[]>(queryKey);

      queryClient.setQueryData<Domain[]>(queryKey, (old) =>
        old?.map((domain) => {
          if (domain.id === domainId) {
            toast.info(`Optimistically renewing ${domain.name}...`);
            const newExpiry = new Date(domain.expires_at);
            newExpiry.setFullYear(newExpiry.getFullYear() + years);
            return { ...domain, expires_at: newExpiry.toISOString(), status: 'active' };
          }
          return domain;
        })
      );

      return { previousDomains };
    },
    onSuccess: (data) => {
        toast.success(`Domain "${data.name}" renewed successfully!`);
    },
    onError: (error, variables, context) => {
      if (context?.previousDomains) {
        queryClient.setQueryData(queryKey, context.previousDomains);
      }
      toast.error(error.message || 'Failed to renew domain.');
    },
    onSettled,
  });

  // Delete Domain Mutation
  const deleteDomainMutation = useMutation<Domain, Error, string, { previousDomains: Domain[] | undefined; deletedDomainName: string }>({
    mutationFn: (domainId: string) => domainService.deleteDomain(domainId),
    onMutate: async (domainId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousDomains = queryClient.getQueryData<Domain[]>(queryKey);
      
      let deletedDomainName = '';
      queryClient.setQueryData<Domain[]>(queryKey, (old) => {
        const domainToDelete = old?.find(d => d.id === domainId);
        if (domainToDelete) {
            deletedDomainName = domainToDelete.name;
            toast.info(`Optimistically deleting ${deletedDomainName}...`);
        }
        return old?.filter((domain) => domain.id !== domainId)
      });

      return { previousDomains, deletedDomainName };
    },
    onSuccess: (data, _variables, context) => {
        const name = context?.deletedDomainName || data.name || 'Domain';
        toast.success(`${name} deleted successfully!`);
    },
    onError: (error, _variables, context) => {
      if (context?.previousDomains) {
        queryClient.setQueryData(queryKey, context.previousDomains);
      }
      toast.error(error.message || 'Failed to delete domain.');
    },
    onSettled,
  });

  return {
    purchaseDomain: purchaseDomainMutation,
    renewDomain: renewDomainMutation,
    deleteDomain: deleteDomainMutation,
  };
};
