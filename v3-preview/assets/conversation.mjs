export const isUnsafe = (value) => /(?:\d[ -]?){13,19}|(?:\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b)|(?:\+?1[ .-]?)?\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}/i.test(value);
const fallback = 'Ask about beds, guest counts, check-in, pets, or amenities. For live dates and the final price, use Proceed.';
function rental(text) {
  if (/\bunit\s*2\b|upper unit|^2[.! ]*$/.test(text)) return '603323';
  if (/\bunit\s*1\b|first floor|^1[.! ]*$/.test(text)) return '603326';
  if (/parkgate/.test(text)) return '728474';
}
export function context(message, history) {
  const allowed = (Array.isArray(history) ? history : []).filter(x => x && x.role === 'user' && typeof x.text === 'string' && x.text.length <= 400 && !isUnsafe(x.text)).slice(-100);
  return rental(message.toLowerCase()) || allowed.slice().reverse().map(x => rental(x.text.toLowerCase())).find(Boolean);
}
export function localReply(message, history, data, start) {
  if (isUnsafe(message)) return 'Please don’t send personal or payment information here.';
  const t=message.toLowerCase(), id=context(message,history) || start, item=data[id];
  if (/price|cost|available|availability|book|reserve/.test(t)) return 'Choose your dates and guests and use Proceed to see live availability, the total, and booking terms.';
  if (!item) return /oakdale|rental|home/.test(t) ? 'We offer Oakdale Unit 1, Oakdale Unit 2, and Parkgate. Which rental would you like to know about?' : fallback;
  const n=item.name;
  if (/bed|sleep|guest|people|bath|capacity/.test(t)) return n + ': ' + item.facts + '. ' + item.bedTypes.join(' · ') + '.';
  if (/check.?in|check.?out|arriv|depart/.test(t)) return n + ': check-in ' + item.checkin + '; check-out ' + item.checkout + '.';
  if (/pet|dog|cat/.test(t) && typeof item.pets === 'boolean') return n + (item.pets ? ': ask about pet terms before booking.' : ' does not allow pets.');
  if (/cancel|refund/.test(t)) return n + ': ' + item.cancellation + ' See checkout for current terms.';
  if (context(message,[]) || /parking|wifi|kitchen|amenit|washer|laundry|dishwash/.test(t)) return n + ': ' + item.facts + '. ' + item.highlights + '.';
  return fallback;
}
