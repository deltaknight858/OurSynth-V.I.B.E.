
import type { NextApiResponse } from 'next';
import { withAuth, NextApiRequestWithUser } from '@/lib/api/withAuth';
import domainService from '@/services/domainService';
import { renewDomainSchema } from '@/lib/schemas/domainSchemas';
import { z } from 'zod';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Domain ID must be a string.' });
  }

  switch (req.method) {
    case 'PATCH':
      try {
        const validatedData = renewDomainSchema.parse(req.body);
        const updatedDomain = await domainService.renewDomain(id, validatedData.duration);
        if (!updatedDomain) {
            return res.status(404).json({ error: 'Domain not found or you do not have permission to renew it.' });
        }
        return res.status(200).json(updatedDomain);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: 'Invalid input.', details: error.errors });
        }
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return res.status(500).json({ error: 'Failed to renew domain.', details: errorMessage });
      }

    case 'DELETE':
      try {
        const success = await domainService.deleteDomain(id);
        if (!success) {
            return res.status(404).json({ error: 'Domain not found or you do not have permission to delete it.' });
        }
        return res.status(204).end();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return res.status(500).json({ error: 'Failed to delete domain.', details: errorMessage });
      }

    default:
      res.setHeader('Allow', ['PATCH', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
