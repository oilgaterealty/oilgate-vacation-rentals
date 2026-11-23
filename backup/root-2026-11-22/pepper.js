import { answer, detectIntent, safeReply } from './pepper-core.js';
const root = document.querySelector('[data-pepper]');
if (root) {
  try {
    const r = await fetch(new URL('./pepper-knowledge.json', import.meta.url));
    if (!r.ok) throw new Error('knowledge unavailable');
    const knowledge = await r.json();
    let session;
    try { session = sessionStorage.getItem('pepper-session') || crypto.randomUUID(); sessionStorage.setItem('pepper-session', session); } catch { session = crypto.randomUUID(); }
    root.innerHTML = `<details class="pepper-panel"><summary>Ask Pepper <span>Your Akron stay, made easier</span></summary><div class="pepper-body"><p>Quick answers work without AI. Pepper cannot reserve a stay or take payments.</p><label>Choose your stay<select name="property" aria-label="Choose your stay"></select></label><div class="pepper-dates"><label>Check-in<input type="date" name="arrival"></label><label>Check-out<input type="date" name="departure"></label><label>Guests<input type="number" name="guests" min="1" max="6" value="2"></label></div><div class="pepper-taps" aria-label="Quick questions"></div><p class="pepper-reply" role="status" aria-live="polite">Hi, I’m Pepper. Pick a question or ask about your stay.</p><form><label for="pepper-message">Ask about this stay</label><div class="pepper-send"><input id="pepper-message" maxlength="1000" autocomplete="off" placeholder="What would you like to know?"><button type="submit">Ask</button></div></form><p class="pepper-privacy">Don’t share card details or personal information. AI requests may be processed by Google or Cloudflare. Chat history is not saved here.</p><a class="pepper-book" target="_blank" rel="noopener">Open Lodgify booking</a> · <a class="pepper-contact" target="_blank" rel="noopener">Contact host</a></div></details>`;
    const select = root.querySelector('select');
    for (const [id, p] of Object.entries(knowledge.properties)) { const o = new Option(p.name, id); select.add(o); }
    select.value = root.dataset.property || '603326';
    const link = root.querySelector('.pepper-book');
    const update = () => { link.href = `https://checkout.lodgify.com/en/ogr/${select.value}/reservation?currency=USD`; root.querySelector('.pepper-contact').href = link.href; };
    update(); select.addEventListener('change', () => { update(); show('Choose a question for ' + knowledge.properties[select.value].name + '.'); });
    const today = new Date().toISOString().slice(0, 10);
    root.querySelectorAll('[type=date]').forEach(x => x.min = today);
    const output = root.querySelector('.pepper-reply');
    const show = text => { output.textContent = safeReply(text, (text.match(/\$\d[\d,]*(?:\.\d+)?/g) || [])); };
    let sequence = 0;
    async function ask(intent, message = '') {
      const current = ++sequence, propertyId = select.value;
      // Immediate local reply. Static buttons never depend on a Worker or model.
      show(answer(knowledge, propertyId, intent || detectIntent(message) || 'contact'));
      if (intent && !['price', 'availability'].includes(intent)) return;
      if (!knowledge.liveChatEnabled) { show(answer(knowledge, propertyId, intent || detectIntent(message) || 'contact') + '\nLive chat is not connected yet. Quick answers and Lodgify booking remain available.'); return; }
      const arrival = root.querySelector('[name=arrival]').value, departure = root.querySelector('[name=departure]').value;
      if (['price', 'availability'].includes(intent) && (!arrival || !departure || departure <= arrival)) { show('Choose a valid check-in and later check-out date, then tap again. The Lodgify booking widget is also available.'); return; }
      output.setAttribute('aria-busy', 'true');
      try {
        const r = await fetch(knowledge.chatEndpoint, { method: 'POST', signal: AbortSignal.timeout(45000), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ propertyId, session, message, ...(intent ? { intent } : {}), arrival, departure, guests: Number(root.querySelector('[name=guests]').value) }) });
        if (!r.ok) throw new Error('chat unavailable');
        const data = await r.json();
        if (current === sequence && select.value === propertyId && typeof data.reply === 'string') show(data.reply);
      } catch { if (current === sequence) show(answer(knowledge, propertyId, intent || detectIntent(message) || 'contact') + '\nLive chat is unavailable. Quick answers and Lodgify booking remain available.'); }
      finally { if (current === sequence) output.removeAttribute('aria-busy'); }
    }
    for (const [label, intent] of [['Check my dates', 'availability'], ['Price for my dates', 'price'], ['Parking?', 'parking'], ['Pets?', 'pets'], ['Check-in time?', 'checkin'], ['House rules', 'rules'], ['Contact host', 'contact']]) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.addEventListener('click', () => ask(intent)); root.querySelector('.pepper-taps').append(b);
    }
    root.querySelector('form').addEventListener('submit', e => { e.preventDefault(); const input = root.querySelector('#pepper-message'); if (input.value.trim()) { ask(null, input.value.trim()); input.value = ''; } });
  } catch { root.textContent = 'Pepper is unavailable. Use the Lodgify booking section to contact your host.'; }
}
