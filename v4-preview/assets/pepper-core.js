// Pepper Concierge v4 — Smart Knowledge Bank + Greeting + Follow-up Resolver + Zero Phone/Card Safety
export const INTENTS = [
  'greeting',
  'units',
  'availability',
  'price',
  'cleaning',
  'parking',
  'pets',
  'checkin',
  'rules',
  'amenities',
  'beds',
  'nearby',
  'booking',
  'contact',
];

export const SAFE =
  'Reach us anytime by email at oilgaterealty@gmail.com, or pick your dates and click Reserve to view live availability and checkout. We never share personal phone numbers.';

export const CARD = /(?:\d[ -]*?){13,19}/;
export const MAX_HISTORY_TURNS = 10;
export const MAX_TURN_CHARS = 500;

export function detectIntent(message = '') {
  const m = String(message || '').normalize('NFKC').trim().toLowerCase();
  if (!m) return 'greeting';
  if (CARD.test(m) || /prompt|system|developer|ignore|override|jailbreak|refund|discount|exception|payment|credit.?card|base64|roleplay|pretend|instruction/.test(m)) {
    return 'contact';
  }
  if (/^(hi+|hey+|hello+|yo+|sup|hiya|howdy|good\s*(morning|afternoon|evening)|greetings|what'?s\s*up)[\s!.,?]*$/.test(m)) {
    return 'greeting';
  }
  if (/clean(?:ing)?\s*fee|extra\s*fee|hidden\s*fee|chore|no\s*cleaning/.test(m)) return 'cleaning';
  if (/nearby|close\s*to|around|swenson|highland\s*square|lebron|i\s*promise|home\s*court|blossom|restaurant|things\s*to\s*do|attractions|location|akron/.test(m)) return 'nearby';
  if (/how\s*(?:do\s*i|to)\s*(?:book|reserve)|booking\s*process|direct\s*book|reserve\b/.test(m)) return 'booking';
  if (/penthouse|which\s*(?:unit|home|place)|tell\s*me\s*about|units|homes|rentals|compare|difference|parkgate|oakdale/.test(m) && !/park(?:ing)?|pet|dog|cat|price|cost|availab|bed|bath|check|rule|wifi|tv|cable/.test(m)) {
    return 'units';
  }
  if (/bed(?:room|s)?|queen|full\s*bed|double|bath(?:room)?|sleep|how\s*many\s*(?:guests|people|rooms)/.test(m)) return 'beds';
  if (/price|cost|total|tax|fee|deposit|cancel|rate|\$|dollar|usd|cheap|nightly/.test(m)) return 'price';
  if (/availab|dates|vacan|open\b/.test(m)) return 'availability';
  if (/park(?:ing)?|driveway|street|garage|car\b|cars\b|vehicle/.test(m)) return 'parking';
  if (/pet|dog|cat\b|animal|service\s*animal|furry/.test(m)) return 'pets';
  if (/check.?in|check.?out|door\s*code|smart\s*(?:lock|entry|home)|code\b|arrival|depart|early|late|time/.test(m)) return 'checkin';
  if (/rule|quiet|smok|parties|party|visitor|age|18\+|trash|noise|damage/.test(m)) return 'rules';
  if (/amenit|wifi|wi-fi|internet|kitchen|laundry|washer|dryer|tv|cable|ppv|pay.?per.?view|desk|workspace|dishwasher|deck|yard|grill|dining|piano/.test(m)) return 'amenities';
  if (/contact|email|phone|number|call|reach|host/.test(m)) return 'contact';
  return null;
}

export function detectPropertyMention(message = '') {
  const m = String(message || '').normalize('NFKC').toLowerCase();
  if (/parkgate/.test(m)) return '728474';
  if (/unit\s*2|oakdale\s*2|upper|penthouse/.test(m)) return '603323';
  if (/unit\s*1|oakdale\s*1|first\s*floor|coffered/.test(m)) return '603326';
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
  for (let i = clean.length - 1; i >= 0; i--) {
    const turn = clean[i];
    if (turn.intent && !['contact', 'greeting'].includes(turn.intent)) return turn.intent;
    if (turn.role === 'user') {
      const prev = detectIntent(turn.text);
      if (prev && !['contact', 'greeting'].includes(prev)) return prev;
    }
  }
  return null;
}

export function safeReply(text, allowedAmounts = []) {
  if (typeof text !== 'string' || text.length > 5000 || CARD.test(text)) return SAFE;
  if (/(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s().-]*\d{4}/.test(text.normalize('NFKC'))) return SAFE;
  if (/\b(?:confirmed|booked|refund|discount|guarantee)\b|system prompt|system instruction|developer message|api.?key|secret|<\|im_|```/i.test(text)) {
    return SAFE;
  }
  const amounts = text.match(/\$\s*\d[\d,]*(?:\.\d+)?/g) || [];
  if (amounts.some(a => !allowedAmounts.includes(a.replace(/\s/g, '')))) return SAFE;
  return text;
}

export function answer(knowledge, propertyId, intent, live = null) {
  const p = knowledge.properties?.[propertyId];
  const common = knowledge.common || {};
  if (!p) return SAFE;

  if (intent === 'greeting') {
    return safeReply(
      common.greeting ||
        "Hi! I'm Pepper, your Oilgate Vacation Rentals concierge. Ask me anything about our three private 3-bedroom Akron homes — beds, amenities, check-in times, parking, nearby spots, or how to reserve!"
    );
  }
  if (intent === 'price') {
    const text =
      live?.quoteText ||
      'Choose your stay, check-in/check-out dates, and guests in the booking box and click Reserve to see your exact live total. And remember — No cleaning fees, ever (unless house rules are broken).';
    return safeReply(text, live?.allowedAmounts || []);
  }
  if (intent === 'availability') {
    const text =
      live?.availabilityText ||
      'Pick your check-in and check-out dates above and click Reserve to view live open dates right away. Dates are never held by chat.';
    return safeReply(text, live?.allowedAmounts || []);
  }

  const text = p[intent] || common[intent] || SAFE;
  return safeReply(text, live?.allowedAmounts || []);
}
