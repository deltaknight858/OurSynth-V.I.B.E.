import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import path from 'path';

type ResponseData = {
  success: boolean;
  message: string;
  data?: any;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { sourcePath } = req.body;

  if (!sourcePath) {
    return res.status(400).json({ success: false, message: 'sourcePath is required' });
  }

  const scriptPath = path.join(process.cwd(), 'scripts', 'agents', 'quarantine.mjs');
  const command = `node ${scriptPath} --source=${sourcePath}`;

  exec(command, (error, stdout, stderr) => {
    if (error || stderr) {
      return res.status(500).json({ success: false, message: `Agent execution failed: ${stderr || error?.message}` });
    }
    res.status(200).json(JSON.parse(stdout));
  });
}