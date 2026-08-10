import { addMessage } from '../../../../lib/whatsappStore';

export async function POST(req) {
  const body = await req.json();
  const message = addMessage({
    text: body.text || body.message || 'Compliance alert from Docket',
    from: 'bot',
    status: 'delivered'
  });
  return Response.json({ success: true, message });
}
