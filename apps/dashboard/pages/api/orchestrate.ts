import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth } from '../../lib/auth';
import { orchestrateService } from '../../lib/orchestrator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  // Authentication check
  const user = await verifyAuth(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { action, name } = req.body;
  if (!action || !name) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }
  try {
    // Real orchestration logic
    const result = await orchestrateService(action, name, user);
    res.status(200).json({ result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Orchestration failed' });
  }
}
