// Shared deterministic concierge renderer & follow-up intent resolver (v3).
// AI only classifies intent; every guest-facing reply is assembled here in code.
export const INTENTS = ['availability', 'price', 'parking', 'pets', 'checkin', 'rules', 'amenities', 'contact'];
export const SAFE = 'Please contact the host by email at oilgaterealty@gmail.com or through the checkout inquiry link below. Complete reservations, payments, and current terms in checkout.';
export const CARD = /(?:\d[ -]*?){13,19}/;
export const MAX_HISTORY_TURNS = 10;
export const MAX_TURN_CHARS = 500;

export function detectIntent(message = '') {
  const m = String(message || '').normalize('NFKC').toLowerCase();
  if (CARD.test(m) || /prompt|system|developer|ignore|override|jailbreak|refund|discount|exception|confirm|\bbook\b|payment|credit.?card|base64|roleplay|pretend|instruction/.test(m)) return 'contact';
  if (/price|cost|total|tax|fee|deposit|cancel|rate|\$|dollar|usd/.test(m)) return 'price';
  if (/availab|dates|vacan/.test(m)) return 'availability';
  if (/park|driveway|street|garage|car\b|cars\b|vehicle/.test(m)) return 'parking';
  if (/pet|dog|cat\b|animal|service animal|furry/.test(m)) return 'pets';
  if (/check.?in|check.?out|arrival|depart|early|late/.test(m)) return 'checkin';
  if (/rule|quiet|smok|parties|party|visitor|guest|age|18\+|trash|noise|damage/.test(m)) return 'rules';
  if (/amenit|wifi|wi-fi|internet|kitchen|laundry|washer|dryer|bedroom|bed\b|beds\b|bath|tv|cable|desk|workspace|dishwasher|deck|yard|grill/.test(m)) return 'amenities';
  return null;
}

export function detectPropertyMention(message = '') {
  const m = String(message || '').normalize('NFKC').toLowerCase();
  if (/parkgate/.test(m)) return '728474';
  if (/unit\s*2|oakdale\s*2|upper/.test(m)) return '603323';
  if (/unit\s*1|oakdale\s*1|first\s*floor/.test(m)) return '603326';
  return null;
}

export function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  const clean = [];
  for (const item of history.slice(-MAX_HISTORY_TURNS)) {
    if (!item || typeof item !== 'object') continue;
    const role = item.role === 'assistant' ? 'assistant' : item.role === 'user' ? 'user' : null;
    if (!role || typeof item.text !== 'string') continue;
    const text = item.text.normalize('NFKC').trim().slice(0, MAX_TURN_CHARS);
    if (!text || CARD.test(text)) continue;
    const intent = INTENTS.includes(item.intent) ? item.intent : undefined;
    clean.push(intent ? { role, text, intent } : { role, text });
  }
  return clean;
}

export function detectIntentWithHistory(message = '', history = []) {
  const direct = detectIntent(message);
  if (direct) return direct;
  const clean = sanitizeHistory(history);
  // Look backward for the most recent non-contact topic turn so follow-ups
  // like "What about Unit 2?", "Even a small one?", or "How many cars?" resolve cleanly.
  for (let i = clean.length - 1; i >= 0; i--) {
    const turn = clean[i];
    if (turn.intent && turn.intent !== 'contact') return turn.intent;
    if (turn.role === 'user') {
      const prev = detectIntent(turn.text);
      if (prev && prev !== 'contact') return prev;
    }
  }
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
  if (intent === 'price') {
    text = live?.quoteText || 'Select your dates and guest count above and tap Live quote, or use the booking form and click Proceed to see the live total in checkout. No price is estimated.';
  }
  if (intent === 'availability') {
    text = live?.availabilityText || 'Select your dates and guest count above and tap Check dates, or use the booking form and click Proceed to see open dates. Dates are never held by chat.';
  }
  return safeReply(text, live?.allowedAmounts || []);
}
