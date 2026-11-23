// Shared deterministic renderer: used by both the Worker and offline tap buttons.
export const INTENTS = ['availability', 'price', 'parking', 'pets', 'checkin', 'rules', 'amenities', 'contact'];
export const SAFE = 'Please contact the host through the Lodgify inquiry or booking flow. Use Lodgify checkout for reservations, payments, and current terms.';
export const CARD = /(?:\d[ -]*?){13,19}/;
export function detectIntent(message = '') {
  const m = message.normalize('NFKC').toLowerCase();
  if (CARD.test(m) || /prompt|system|developer|ignore|override|jailbreak|refund|discount|exception|confirm|\bbook\b|payment|credit.?card|base64|roleplay|pretend|instruction/.test(m)) return 'contact';
  if (/price|cost|total|tax|fee|deposit|cancel|rate|\$|dollar|usd/.test(m)) return 'price';
  if (/availab|dates|vacan/.test(m)) return 'availability';
  if (/park/.test(m)) return 'parking';
  if (/pet|dog|cat\b/.test(m)) return 'pets';
  if (/check.?in|check.?out|arrival/.test(m)) return 'checkin';
  if (/rule|quiet|smok|parties|visitors/.test(m)) return 'rules';
  if (/amenit|wifi|wi-fi|kitchen|laundry|bedroom/.test(m)) return 'amenities';
  return null;
}
export function safeReply(text, allowedAmounts = []) {
  if (typeof text !== 'string' || text.length > 5000 || CARD.test(text)) return SAFE;
  // Never relay phone numbers, including guest-supplied or upstream content.
  if (/(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s().-]*\d{4}/.test(text.normalize('NFKC'))) return SAFE;
  if (/\b(?:confirmed|booked|refund|discount|guarantee)\b|system prompt|system instruction|developer message|api.?key|secret|<\|im_|```/i.test(text)) return SAFE;
  const amounts = text.match(/\$\s*\d[\d,]*(?:\.\d+)?/g) || [];
  if (amounts.some(a => !allowedAmounts.includes(a.replace(/\s/g, '')))) return SAFE;
  return text;
}
export function answer(knowledge, propertyId, intent, live = null) {
  const p = knowledge.properties[propertyId];
  if (!p) return SAFE;
  let text = p[intent] || knowledge.common[intent] || SAFE;
  if (intent === 'price') text = live?.quoteText || 'Select your dates and guest count to request a live Lodgify quote. If pricing is unavailable, open the Lodgify booking widget or contact the host. No price is estimated.';
  if (intent === 'availability') text = live?.availabilityText || 'Select your dates and guest count to check live Lodgify availability. If unavailable here, use the Lodgify booking widget. Dates are never held by chat.';
  return safeReply(text, live?.allowedAmounts || []);
}
