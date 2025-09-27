
import type { NextApiResponse } from 'next';
import { withAuth, NextApiRequestWithUser } from '@/lib/api/withAuth';
import domainService from '@/services/domainService';
import { purchaseDomainSchema } from '@/lib/schemas/domainSchemas';
import { z } from 'zod';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const validatedData = purchaseDomainSchema.parse(req.body);
    const newDomain = await domainService.purchaseDomain(
      validatedData.name,
      validatedData.duration
    );
    return res.status(201).json(newDomain);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input.', details: error.errors });
    }
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return res.status(500).json({ error: 'Failed to purchase domain.', details: errorMessage });
  }
}

export default withAuth(handler);
