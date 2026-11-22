import {
  answer,
  detectIntentWithHistory,
  detectPropertyMention,
  safeReply,
  sanitizeHistory,
} from './pepper-core.js';

const HISTORY_KEY = 'ovr-pepper-history-v4';
const SESSION_KEY = 'ovr-pepper-session-v4';

const root = document.querySelector('[data-concierge]');
if (root) {
  try {
    const knowledgeResp = await fetch(new URL('./pepper-knowledge.json', import.meta.url));
    if (!knowledgeResp.ok) throw new Error('knowledge unavailable');
    const knowledge = await knowledgeResp.json();

    const mediaBase = new URL('../media/', import.meta.url).href;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        /* ignore storage quota */
      }
    };

    let history = loadHistory();
    if (!history.length) {
      history = [{
        role: 'assistant',
        text: "Welcome! I'm Pepper, your Akron stay concierge. Say hi or ask about our three private 3-bedroom homes, amenities, check-in, parking, or nearby spots.",
        intent: 'welcome',
      }];
      saveHistory(history);
    }

    root.className = 'pepper-root';
    root.innerHTML = `
      <button type="button" class="pepper-fab" aria-expanded="false" aria-controls="pepper-drawer" aria-label="Chat with Pepper concierge">
        <img src="${mediaBase}pepper-head.webp" width="120" height="120" alt="Pepper concierge">
        <span class="pepper-fab-badge" aria-hidden="true"></span>
      </button>
      <section id="pepper-drawer" class="pepper-drawer" role="dialog" aria-label="Pepper Concierge" hidden>
        <div class="pepper-resize-handle" data-pepper-resize title="Drag to resize" aria-hidden="true">⤢</div>
        <header class="pepper-head">
          <div>
            <h2 class="pepper-head-title">Pepper · Akron Concierge</h2>
            <span class="pepper-head-sub">Oilgate Vacation Rentals</span>
          </div>
          <div class="pepper-head-actions">
            <button type="button" class="pepper-clear" aria-label="Clear chat history">Clear</button>
            <button type="button" class="pepper-close" aria-label="Close Pepper chat">&times;</button>
          </div>
        </header>
        <div class="pepper-body">
          <div class="pepper-stage" data-state="idle">
            <div class="pepper-avatar-frame">
              <img class="pepper-still" src="${mediaBase}pepper-idle.webp" alt="Pepper Potts concierge in blue, silver, and gold suit">
              <video class="pepper-video" autoplay loop muted playsinline preload="metadata" poster="${mediaBase}pepper-idle.webp" aria-hidden="true">
                <source src="${mediaBase}pepper-idle.mp4" type="video/mp4">
              </video>
            </div>
            <div class="pepper-state-pill">
              <span class="pepper-state-dot" aria-hidden="true"></span>
              <span class="pepper-state-label">Ready</span>
            </div>
          </div>
          <div class="pepper-chat-col">
            <div class="pepper-top-bar">
              <label class="pepper-unit-select">
                <span>Home:</span>
                <select id="pepper-property" name="property"></select>
              </label>
            </div>
            <details class="pepper-chips-box">
              <summary>Quick questions</summary>
              <div class="pepper-taps" aria-label="Quick questions"></div>
            </details>
            <div class="pepper-thread" role="log" aria-live="polite" aria-label="Conversation history"></div>
            <form class="pepper-form">
              <label class="sr" for="pepper-message">Ask Pepper a question</label>
              <div class="pepper-send">
                <input id="pepper-message" maxlength="1000" autocomplete="off" placeholder="Say hi or ask about units, beds, parking, nearby spots...">
                <button type="submit">Send</button>
              </div>
            </form>
            <div class="pepper-foot">
              <div class="pepper-links">
                <a class="pepper-book" href="#availability">Reserve dates</a>
                <a class="pepper-contact" href="mailto:oilgaterealty@gmail.com">Contact</a>
              </div>
              <details class="pepper-safety">
                <summary>Safety</summary>
                <p>Don’t share card details or sensitive personal information in chat. Complete reservations and payments only through Reserve checkout. Chat stays only in this browser tab.</p>
              </details>
            </div>
          </div>
        </div>
      </section>
    `;

    const fab = root.querySelector('.pepper-fab');
    const drawer = root.querySelector('#pepper-drawer');
    const resizeHandle = root.querySelector('[data-pepper-resize]');
    const closeBtn = root.querySelector('.pepper-close');
    const clearBtn = root.querySelector('.pepper-clear');
    const select = root.querySelector('#pepper-property');
    const thread = root.querySelector('.pepper-thread');
    const input = root.querySelector('#pepper-message');
    const stage = root.querySelector('.pepper-stage');
    const stillImg = root.querySelector('.pepper-still');
    const videoEl = root.querySelector('.pepper-video');
    const stateLabel = root.querySelector('.pepper-state-label');

    const MEDIA_STATES = {
      idle: { mp4: `${mediaBase}pepper-idle.mp4`, img: `${mediaBase}pepper-idle.webp`, label: 'Ready' },
      thinking: { mp4: `${mediaBase}pepper-thinking.mp4`, img: `${mediaBase}pepper-thinking.webp`, label: 'Thinking' },
      talking: { mp4: `${mediaBase}pepper-talking.mp4`, img: `${mediaBase}pepper-talking.webp`, label: 'Answering' },
    };

    let currentState = 'idle';
    let talkTimer = null;

    const setAvatarState = (state) => {
      const cfg = MEDIA_STATES[state] || MEDIA_STATES.idle;
      currentState = state;
      stage.dataset.state = state;
      stateLabel.textContent = cfg.label;
      stillImg.src = cfg.img;
      if (reducedMotion) {
        videoEl.style.display = 'none';
        return;
      }
      const source = videoEl.querySelector('source');
      if (source && source.getAttribute('src') !== cfg.mp4) {
        source.setAttribute('src', cfg.mp4);
        videoEl.poster = cfg.img;
        videoEl.load();
      }
      videoEl.play().catch(() => {
        videoEl.style.display = 'none';
      });
    };

    for (const [id, p] of Object.entries(knowledge.properties)) {
      select.add(new Option(p.name, id));
    }
    select.value = root.dataset.property && knowledge.properties[root.dataset.property]
      ? root.dataset.property
      : '603326';

    // Resizable panel from top-left drag handle
    if (resizeHandle) {
      let resizing = false;
      let startX = 0;
      let startY = 0;
      let startW = 0;
      let startH = 0;
      resizeHandle.addEventListener('pointerdown', (e) => {
        resizing = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = drawer.getBoundingClientRect();
        startW = rect.width;
        startH = rect.height;
        resizeHandle.setPointerCapture(e.pointerId);
      });
      resizeHandle.addEventListener('pointermove', (e) => {
        if (!resizing) return;
        const dx = startX - e.clientX;
        const dy = startY - e.clientY;
        const newW = Math.max(360, Math.min(window.innerWidth - 28, startW + dx));
        const newH = Math.max(400, Math.min(window.innerHeight - 110, startH + dy));
        drawer.style.width = `${newW}px`;
        drawer.style.height = `${newH}px`;
      });
      const stopResize = () => { resizing = false; };
      resizeHandle.addEventListener('pointerup', stopResize);
      resizeHandle.addEventListener('pointercancel', stopResize);
    }

    const renderThread = () => {
      thread.innerHTML = '';
      for (const item of history) {
        const p = document.createElement('p');
        p.className = `pepper-msg pepper-msg--${item.role === 'user' ? 'user' : 'assistant'}`;
        const meta = document.createElement('span');
        meta.className = 'pepper-msg-meta';
        meta.textContent = item.role === 'user' ? 'You' : 'Pepper';
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

    const toggle = (open) => {
      const next = typeof open === 'boolean' ? open : drawer.hidden;
      drawer.hidden = !next;
      fab.setAttribute('aria-expanded', String(next));
      if (next) {
        renderThread();
        setAvatarState('idle');
        input.focus();
      } else {
        videoEl.pause();
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

    clearBtn.addEventListener('click', () => {
      history = [{
        role: 'assistant',
        text: "Chat cleared! Ask me anything about Oakdale Unit 1, Unit 2 (and the Penthouse Suite!), or Parkgate.",
        intent: 'greeting',
      }];
      saveHistory(history);
      renderThread();
      setAvatarState('idle');
    });

    const pulseTalking = () => {
      clearTimeout(talkTimer);
      setAvatarState('talking');
      talkTimer = setTimeout(() => {
        if (!drawer.hidden) setAvatarState('idle');
      }, 4200);
    };

    let sequence = 0;
    async function ask(intent, message = '', displayLabel = '') {
      const current = ++sequence;
      const mentioned = detectPropertyMention(message);
      if (mentioned && knowledge.properties[mentioned]) {
        select.value = mentioned;
      }
      const propertyId = select.value;
      const priorContext = sanitizeHistory(history);
      const userText = (message || displayLabel || intent || '').trim();
      if (userText) {
        history.push({ role: 'user', text: userText, propertyId });
      }
      renderThread();
      setAvatarState('thinking');

      const resolvedIntent = intent || detectIntentWithHistory(message, priorContext) || 'units';
      const immediateReply = answer(knowledge, propertyId, resolvedIntent);

      // Brief natural thinking beat so Pepper's thinking animation shows cleanly
      await new Promise(r => setTimeout(r, 260));
      if (current !== sequence) return;

      const replyTurn = { role: 'assistant', text: immediateReply, intent: resolvedIntent, propertyId };
      history.push(replyTurn);
      saveHistory(history);
      renderThread();
      pulseTalking();
    }

    const taps = [
      ['Our 3 homes', 'units'],
      ['No cleaning fees', 'cleaning'],
      ['Beds & baths', 'beds'],
      ['Check-in & door code', 'checkin'],
      ['Parking', 'parking'],
      ['Pets', 'pets'],
      ['Nearby spots', 'nearby'],
      ['How to book', 'booking'],
    ];
    const tapsBox = root.querySelector('.pepper-taps');
    for (const [label, intent] of taps) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', () => {
        root.querySelector('.pepper-chips-box').open = false;
        ask(intent, '', label);
      });
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
