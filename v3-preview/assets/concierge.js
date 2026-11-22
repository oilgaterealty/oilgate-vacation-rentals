import {
  answer,
  detectIntent,
  detectIntentWithHistory,
  detectPropertyMention,
  safeReply,
  sanitizeHistory,
} from './concierge-core.js';

const HISTORY_KEY = 'ovr-concierge-history-v3';
const SESSION_KEY = 'ovr-concierge-session-v3';

const root = document.querySelector('[data-concierge]');
if (root) {
  try {
    const knowledgeResp = await fetch(new URL('./concierge-knowledge.json', import.meta.url));
    if (!knowledgeResp.ok) throw new Error('knowledge unavailable');
    const knowledge = await knowledgeResp.json();

    let session;
    try {
      session = sessionStorage.getItem(SESSION_KEY) || crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, session);
    } catch {
      session = crypto.randomUUID();
    }

    const loadHistory = () => {
      try {
        const raw = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]');
        return Array.isArray(raw) ? raw.slice(-40) : [];
      } catch {
        return [];
      }
    };
    const saveHistory = (items) => {
      try {
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(-40)));
      } catch {
        /* ignore storage quota errors */
      }
    };

    let history = loadHistory();
    if (!history.length) {
      history = [{
        role: 'assistant',
        text: 'Welcome to Oilgate Vacation Rentals. Ask a question about any Akron rental, parking, check-in, house rules, or your dates.',
        intent: 'greeting',
      }];
      saveHistory(history);
    }

    root.className = 'concierge-root';
    root.innerHTML = `
      <button type="button" class="concierge-fab" aria-expanded="false" aria-controls="concierge-drawer" aria-label="Ask our concierge">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 17h16"/>
          <path d="M6 17a6 6 0 0 1 12 0"/>
          <path d="M12 11V8"/>
          <path d="M10 8h4"/>
        </svg>
        <span>Concierge</span>
      </button>
      <section id="concierge-drawer" class="concierge-drawer" role="dialog" aria-label="Ask our concierge" hidden>
        <header class="concierge-head">
          <div>
            <h2 class="concierge-head-title">Ask our concierge</h2>
            <span class="concierge-head-sub">Akron stay questions</span>
          </div>
          <div class="concierge-head-actions">
            <button type="button" class="concierge-clear" aria-label="Clear chat history">Clear</button>
            <button type="button" class="concierge-close" aria-label="Close concierge">&times;</button>
          </div>
        </header>
        <div class="concierge-controls">
          <div>
            <label for="concierge-property">Rental</label>
            <select id="concierge-property" name="property"></select>
          </div>
          <div class="concierge-dates">
            <div><label for="concierge-in">Check-in</label><input id="concierge-in" type="date" name="arrival"></div>
            <div><label for="concierge-out">Check-out</label><input id="concierge-out" type="date" name="departure"></div>
            <div><label for="concierge-guests">Guests</label><input id="concierge-guests" type="number" name="guests" min="1" max="6" value="2"></div>
          </div>
        </div>
        <div class="concierge-taps" aria-label="Quick questions"></div>
        <div class="concierge-thread" role="log" aria-live="polite" aria-label="Conversation history"></div>
        <form class="concierge-form">
          <label class="sr" for="concierge-message">Ask about this rental</label>
          <div class="concierge-send">
            <input id="concierge-message" maxlength="1000" autocomplete="off" placeholder="Ask a question or follow up...">
            <button type="submit">Ask</button>
          </div>
        </form>
        <div class="concierge-foot">
          <p class="concierge-privacy">Don’t share card details or personal information. AI requests may be processed by Google or Cloudflare. Chat history is kept only in this browser tab and cleared when it closes.</p>
          <div class="concierge-links">
            <a class="concierge-book" target="_blank" rel="noopener">Proceed to checkout</a>
            <a class="concierge-contact" href="mailto:oilgaterealty@gmail.com">Email host</a>
          </div>
        </div>
      </section>
    `;

    const fab = root.querySelector('.concierge-fab');
    const drawer = root.querySelector('#concierge-drawer');
    const closeBtn = root.querySelector('.concierge-close');
    const clearBtn = root.querySelector('.concierge-clear');
    const select = root.querySelector('#concierge-property');
    const thread = root.querySelector('.concierge-thread');
    const bookLink = root.querySelector('.concierge-book');
    const input = root.querySelector('#concierge-message');
    const arrEl = root.querySelector('#concierge-in');
    const depEl = root.querySelector('#concierge-out');
    const guestsEl = root.querySelector('#concierge-guests');

    for (const [id, p] of Object.entries(knowledge.properties)) {
      select.add(new Option(p.name, id));
    }
    select.value = root.dataset.property && knowledge.properties[root.dataset.property]
      ? root.dataset.property
      : '603326';

    const today = new Date().toISOString().slice(0, 10);
    arrEl.min = today;
    depEl.min = today;

    const updateCheckoutHref = () => {
      const url = new URL(`https://checkout.lodgify.com/en/ogr/${encodeURIComponent(select.value)}/reservation`);
      url.searchParams.set('currency', 'USD');
      url.searchParams.set('adults', String(Math.min(6, Math.max(1, Number(guestsEl.value) || 2))));
      if (arrEl.value && depEl.value && depEl.value > arrEl.value) {
        url.searchParams.set('arrival', arrEl.value);
        url.searchParams.set('departure', depEl.value);
      }
      bookLink.href = url.toString();
    };
    updateCheckoutHref();
    [select, arrEl, depEl, guestsEl].forEach(el => el.addEventListener('change', updateCheckoutHref));

    const toggle = (open) => {
      const next = typeof open === 'boolean' ? open : drawer.hidden;
      drawer.hidden = !next;
      fab.setAttribute('aria-expanded', String(next));
      if (next) {
        renderThread();
        input.focus();
      }
    };
    fab.addEventListener('click', () => toggle());
    closeBtn.addEventListener('click', () => { toggle(false); fab.focus(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.hidden) {
        toggle(false);
        fab.focus();
      }
    });

    const renderThread = () => {
      thread.innerHTML = '';
      for (const item of history) {
        const p = document.createElement('p');
        p.className = `concierge-msg concierge-msg--${item.role === 'user' ? 'user' : 'assistant'}`;
        const meta = document.createElement('span');
        meta.className = 'concierge-msg-meta';
        meta.textContent = item.role === 'user' ? 'You' : 'Concierge';
        p.append(meta);
        const safeText = item.role === 'user'
          ? item.text
          : safeReply(item.text, item.text.match(/\$\d[\d,]*(?:\.\d+)?/g) || []);
        p.append(document.createTextNode(safeText));
        thread.append(p);
      }
      thread.scrollTop = thread.scrollHeight;
    };
    renderThread();

    clearBtn.addEventListener('click', () => {
      history = [{
        role: 'assistant',
        text: 'Chat cleared. Ask anything about our Akron rentals.',
        intent: 'greeting',
      }];
      saveHistory(history);
      renderThread();
    });

    let sequence = 0;
    async function ask(intent, message = '', displayLabel = '') {
      const current = ++sequence;
      const mentioned = detectPropertyMention(message);
      if (mentioned && knowledge.properties[mentioned]) {
        select.value = mentioned;
        updateCheckoutHref();
      }
      const propertyId = select.value;
      const priorContext = sanitizeHistory(history);
      const userText = (message || displayLabel || intent || '').trim();
      if (userText) {
        history.push({ role: 'user', text: userText, propertyId });
      }

      const resolvedIntent = intent || detectIntentWithHistory(message, priorContext) || 'contact';
      const immediateReply = answer(knowledge, propertyId, resolvedIntent);
      const replyTurn = { role: 'assistant', text: immediateReply, intent: resolvedIntent, propertyId };
      history.push(replyTurn);
      saveHistory(history);
      renderThread();

      if (intent && !['price', 'availability'].includes(intent)) return;
      if (!knowledge.liveChatEnabled || !knowledge.chatEndpoint) return;

      const arrival = arrEl.value;
      const departure = depEl.value;
      if (['price', 'availability'].includes(intent) && (!arrival || !departure || departure <= arrival)) {
        replyTurn.text = 'Choose a valid check-in and later check-out date above, then tap again — or use the booking form and click Proceed.';
        saveHistory(history);
        renderThread();
        return;
      }

      thread.setAttribute('aria-busy', 'true');
      try {
        const resp = await fetch(knowledge.chatEndpoint, {
          method: 'POST',
          signal: AbortSignal.timeout(45000),
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyId,
            session,
            message,
            ...(intent ? { intent } : {}),
            history: priorContext,
            arrival,
            departure,
            guests: Number(guestsEl.value) || 2,
          }),
        });
        if (!resp.ok) throw new Error('chat unavailable');
        const data = await resp.json();
        if (current === sequence && typeof data.reply === 'string') {
          replyTurn.text = data.reply;
          if (data.intent) replyTurn.intent = data.intent;
          saveHistory(history);
          renderThread();
        }
      } catch {
        // Immediate deterministic reply already answered the question cleanly.
        if (current === sequence && ['price', 'availability'].includes(resolvedIntent)) {
          replyTurn.text = `${immediateReply}\nLive lookup is unavailable right now. Use Proceed to view live dates and totals in checkout.`;
          saveHistory(history);
          renderThread();
        }
      } finally {
        if (current === sequence) thread.removeAttribute('aria-busy');
      }
    }

    const taps = [
      ['Available dates?', 'availability'],
      ['Live quote', 'price'],
      ['Parking', 'parking'],
      ['Pets', 'pets'],
      ['Check-in', 'checkin'],
      ['House rules', 'rules'],
      ['Contact host', 'contact'],
    ];
    const tapsBox = root.querySelector('.concierge-taps');
    for (const [label, intent] of taps) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', () => ask(intent, '', label));
      tapsBox.append(b);
    }

    root.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      ask(null, text);
    });
  } catch {
    root.textContent = '';
  }
}
