import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface NextApiRequestWithUser extends NextApiRequest {
  user: User;
}

type ApiHandler = (
  req: NextApiRequestWithUser,
  res: NextApiResponse
) => unknown | Promise<unknown>;

export const withAuth = (handler: ApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token not provided.' });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid authentication token.' });
    }

    const reqWithUser = req as NextApiRequestWithUser;
    reqWithUser.user = user;

    return handler(reqWithUser, res);
  };
};