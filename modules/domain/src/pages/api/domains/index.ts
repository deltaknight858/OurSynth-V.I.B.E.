
import type { NextApiResponse } from 'next';
import { withAuth, NextApiRequestWithUser } from '@/lib/api/withAuth';
import domainService from '@/services/domainService';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const domains = await domainService.getDomains();
    return res.status(200).json(domains);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return res.status(500).json({ error: 'Failed to fetch domains.', details: errorMessage });
  }
}

export default withAuth(handler);
