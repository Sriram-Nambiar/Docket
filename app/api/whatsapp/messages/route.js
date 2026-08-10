import { getMessages } from '../../../../lib/whatsappStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ messages: getMessages() });
}
