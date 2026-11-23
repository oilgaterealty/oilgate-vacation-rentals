import {
  answer,
  detectIntentWithHistory,
  detectPropertyMention,
  safeReply,
  sanitizeHistory,
} from './pepper-core.js';

const HISTORY_KEY = 'ovr-pepper-history-v5';
const SESSION_KEY = 'ovr-pepper-session-v5';

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
        <span class="pepper-fab-sphere">
          <span class="pepper-fab-aura" aria-hidden="true"></span>
          <img class="pepper-fab-head" src="${mediaBase}pepper-head-3d.webp" width="128" height="128" alt="Pepper 3D concierge head">
          <span class="pepper-fab-specular" aria-hidden="true"></span>
        </span>
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
              <img class="pepper-still" src="${mediaBase}pepper-idle.webp" alt="Pepper concierge in navy, silver, and gold">
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
    const stateLabel = root.querySelector('.pepper-state-label');
    const stillImg = root.querySelector('.pepper-still');
    const videoEl = root.querySelector('.pepper-video');
    const taps = root.querySelector('.pepper-taps');
    const form = root.querySelector('.pepper-form');

    // Interactive 3D tilt + parallax specular highlight on hover
    if (fab && !reducedMotion) {
      fab.addEventListener('pointermove', (e) => {
        const rect = fab.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
        const ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
        fab.classList.add('is-tilting');
        fab.style.setProperty('--rx', `${(-ny * 16).toFixed(2)}deg`);
        fab.style.setProperty('--ry', `${(nx * 16).toFixed(2)}deg`);
        fab.style.setProperty('--tx', `${(nx * 4.5).toFixed(2)}px`);
        fab.style.setProperty('--ty', `${(ny * 4.5).toFixed(2)}px`);
        fab.style.setProperty('--px', `${((nx + 1) * 50).toFixed(1)}%`);
        fab.style.setProperty('--py', `${((ny + 1) * 50).toFixed(1)}%`);
      });
      fab.addEventListener('pointerleave', () => {
        fab.classList.remove('is-tilting');
        fab.style.setProperty('--rx', '0deg');
        fab.style.setProperty('--ry', '0deg');
        fab.style.setProperty('--tx', '0px');
        fab.style.setProperty('--ty', '0px');
        fab.style.setProperty('--px', '50%');
        fab.style.setProperty('--py', '35%');
      });
    }

    // Populate properties
    const propEntries = Object.entries(knowledge.properties || {});
    propEntries.forEach(([id, info]) => {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = info.name;
      select.appendChild(opt);
    });
    const pageProp = root.getAttribute('data-property');
    if (pageProp && knowledge.properties?.[pageProp]) {
      select.value = pageProp;
    }

    // Populate quick question taps
    const quickQuestions = [
      ['Units', 'Tell me about your three Akron homes'],
      ['Check-in', 'When do I get my door code and check in?'],
      ['Cleaning fees', 'Are there any cleaning fees?'],
      ['Parking', 'Where do we park?'],
      ['Nearby spots', 'What is nearby in Akron?'],
      ['Pets', 'Are pets allowed?'],
    ];
    quickQuestions.forEach(([label, prompt]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.addEventListener('click', () => handleUserText(prompt));
      taps.appendChild(btn);
    });

    // Video state switcher (idle / thinking / talking)
    let revertTimer = null;
    const setAvatarState = (state) => {
      if (!stage) return;
      stage.setAttribute('data-state', state);
      const labels = { idle: 'Ready', thinking: 'Thinking...', talking: 'Answering' };
      if (stateLabel) stateLabel.textContent = labels[state] || 'Ready';
      if (stillImg) stillImg.src = `${mediaBase}pepper-${state}.webp`;
      if (videoEl && !reducedMotion) {
        const nextSrc = `${mediaBase}pepper-${state}.mp4`;
        if (!videoEl.getAttribute('data-src') || videoEl.getAttribute('data-src') !== nextSrc) {
          videoEl.setAttribute('data-src', nextSrc);
          videoEl.poster = `${mediaBase}pepper-${state}.webp`;
          videoEl.src = nextSrc;
          videoEl.load();
          videoEl.play().catch(() => {});
        }
      }
    };

    const renderThread = () => {
      thread.innerHTML = '';
      history.forEach(item => {
        const div = document.createElement('div');
        div.className = `pepper-msg pepper-msg--${item.role === 'user' ? 'user' : 'assistant'}`;
        div.textContent = item.text;
        thread.appendChild(div);
      });
      thread.scrollTop = thread.scrollHeight;
    };
    renderThread();

    const setOpen = (open) => {
      drawer.hidden = !open;
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        setAvatarState('idle');
        renderThread();
        setTimeout(() => input?.focus(), 40);
      }
    };

    fab.addEventListener('click', () => setOpen(drawer.hidden));
    closeBtn.addEventListener('click', () => setOpen(false));
    clearBtn.addEventListener('click', () => {
      history = [{
        role: 'assistant',
        text: "Chat cleared! I'm Pepper — ask me anything about our three private 3-bedroom Akron homes.",
        intent: 'welcome',
      }];
      saveHistory(history);
      renderThread();
      setAvatarState('idle');
    });

    // Custom top-left drag resize
    let resizing = false;
    let rStartX = 0, rStartY = 0, rStartW = 0, rStartH = 0;
    resizeHandle?.addEventListener('pointerdown', (e) => {
      resizing = true;
      rStartX = e.clientX;
      rStartY = e.clientY;
      const rect = drawer.getBoundingClientRect();
      rStartW = rect.width;
      rStartH = rect.height;
      resizeHandle.setPointerCapture(e.pointerId);
    });
    window.addEventListener('pointermove', (e) => {
      if (!resizing) return;
      const dw = rStartX - e.clientX;
      const dh = rStartY - e.clientY;
      drawer.style.width = `${Math.max(340, Math.min(window.innerWidth - 24, rStartW + dw))}px`;
      drawer.style.height = `${Math.max(400, Math.min(window.innerHeight - 110, rStartH + dh))}px`;
    });
    window.addEventListener('pointerup', () => { resizing = false; });

    const handleUserText = async (rawText) => {
      const text = String(rawText || '').trim();
      if (!text) return;
      const mentioned = detectPropertyMention(text);
      if (mentioned && knowledge.properties?.[mentioned]) {
        select.value = mentioned;
      }
      const propId = select.value || '603326';
      history.push({ role: 'user', text });
      saveHistory(history);
      renderThread();

      clearTimeout(revertTimer);
      setAvatarState('thinking');

      const cleaned = sanitizeHistory(history.slice(0, -1));
      const intent = detectIntentWithHistory(text, cleaned);
      const reply = safeReply(answer(knowledge, propId, intent));

      await new Promise(r => setTimeout(r, reducedMotion ? 20 : 280));
      history.push({ role: 'assistant', text: reply, intent });
      saveHistory(history);
      renderThread();
      setAvatarState('talking');
      revertTimer = setTimeout(() => setAvatarState('idle'), 3200);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value;
      input.value = '';
      handleUserText(val);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.hidden) setOpen(false);
    });
  } catch (err) {
    console.warn('Pepper concierge could not initialize:', err);
  }
}
