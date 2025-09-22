import { NextApiRequest, NextApiResponse } from "next";

// Deprecated: Firebase Admin has been removed.
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  return res.status(410).json({
    success: false,
    message: "Firebase Admin is removed from this project. This endpoint is deprecated.",
  });
}
