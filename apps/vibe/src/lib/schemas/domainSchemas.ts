import { z } from 'zod';

export const purchaseDomainSchema = z.object({
  name: z.string().min(3, 'Domain name must be at least 3 characters long.').regex(/^(?!-)[A-Za-z0-9-]+([-.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/, 'Invalid domain name format.'),
  duration: z.number().int().min(1, 'Duration must be at least 1 year.').max(10, 'Duration cannot exceed 10 years.'),
});

export const renewDomainSchema = z.object({
  duration: z.number().int().min(1, 'Duration must be at least 1 year.').max(10, 'Duration cannot exceed 10 years.'),
});