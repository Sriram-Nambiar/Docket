// Shared in-memory message store for WhatsApp simulation
// Works in Next.js dev server because module state persists across requests

let messages = [];

export function addMessage(msg) {
  const message = {
    id: msg.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    text: msg.text || 'Compliance alert',
    timestamp: msg.timestamp || new Date().toISOString(),
    from: msg.from || 'bot',
    status: msg.status || 'delivered'
  };
  messages.push(message);
  if (messages.length > 50) messages = messages.slice(-50);
  return message;
}

export function getMessages() {
  return [...messages];
}

export function clearMessages() {
  messages = [];
}
