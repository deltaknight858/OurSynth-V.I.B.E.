// Dummy authentication for dashboard API
import type { NextApiRequest } from 'next';

export async function verifyAuth(req: NextApiRequest): Promise<{ id: string; name: string } | null> {
  // Example: check for a header or cookie
  const token = req.headers['authorization'] || req.cookies?.token;
  if (token === 'valid-token') {
    return { id: 'user-1', name: 'Admin' };
  }
  return null;
}
