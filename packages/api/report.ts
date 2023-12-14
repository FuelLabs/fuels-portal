import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  console.log(request.body);
  return response.status(200).json({ data: 'ok' });
}
