/**
 * Oilgate Vacation Rentals v3 interactive layer:
 *  1. Accessible rental picker (WAI-ARIA combobox/listbox) with photo preview on hover & focus.
 *  2. Combined Proceed booking form (stay + check-in + check-out + guests -> direct checkout URL).
 *  3. Live 7-night average price hydration from data/prices.json with 48-hour freshness enforcement.
 */
(function () {
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // 1. Accessible rental picker with photo preview on hover & keyboard focus
  document.querySelectorAll('[data-stay-picker]').forEach(picker => {
    const trigger = picker.querySelector('.stay-trigger');
    const popover = picker.querySelector('.stay-popover');
    const listbox = picker.querySelector('[role="listbox"]');
    const options = [...picker.querySelectorAll('[role="option"]')];
    const hiddenInput = picker.querySelector('input[name="stay"]');
    const triggerThumb = picker.querySelector('.stay-trigger-thumb');
    const triggerName = picker.querySelector('.stay-trigger-name');
    const triggerMeta = picker.querySelector('.stay-trigger-meta');
    const previewImg = picker.querySelector('[data-preview-img]');
    const previewTitle = picker.querySelector('[data-preview-title]');
    const previewDesc = picker.querySelector('[data-preview-desc]');

    if (!trigger || !popover || !listbox || !options.length || !hiddenInput) return;

    let activeIndex = Math.max(0, options.findIndex(o => o.getAttribute('aria-selected') === 'true'));

    const updatePreview = (opt) => {
      if (!opt) return;
      if (previewImg) {
        previewImg.src = opt.dataset.img;
        previewImg.alt = opt.dataset.alt || opt.dataset.name || '';
      }
      if (previewTitle) previewTitle.textContent = opt.dataset.name || '';
      if (previewDesc) previewDesc.textContent = opt.dataset.summary || '';
    };

    const setActive = (idx) => {
      activeIndex = (idx + options.length) % options.length;
      options.forEach((opt, i) => {
        opt.classList.toggle('is-active', i === activeIndex);
      });
      const current = options[activeIndex];
      listbox.setAttribute('aria-activedescendant', current.id);
      updatePreview(current);
    };

    const selectOption = (idx, closeAfter = true) => {
      setActive(idx);
      const opt = options[activeIndex];
      options.forEach((o, i) => o.setAttribute('aria-selected', String(i === activeIndex)));
      hiddenInput.value = opt.dataset.id;
      if (triggerThumb) {
        triggerThumb.src = opt.dataset.img;
        triggerThumb.alt = opt.dataset.alt || opt.dataset.name || '';
      }
      if (triggerName) triggerName.textContent = opt.dataset.name || '';
      if (triggerMeta) triggerMeta.textContent = opt.dataset.facts || '';
      if (closeAfter) close();
    };

    const open = () => {
      popover.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      setActive(activeIndex);
      listbox.focus();
    };

    const close = (refocusTrigger = false) => {
      popover.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (refocusTrigger) trigger.focus();
    };

    trigger.addEventListener('click', () => {
      if (popover.hidden) open();
      else close();
    });

    trigger.addEventListener('keydown', (e) => {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        open();
      }
    });

    options.forEach((opt, idx) => {
      opt.addEventListener('mouseenter', () => setActive(idx));
      opt.addEventListener('focus', () => setActive(idx));
      opt.addEventListener('click', () => {
        selectOption(idx, true);
        trigger.focus();
      });
    });

    listbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(activeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(activeIndex - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActive(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setActive(options.length - 1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOption(activeIndex, true);
        trigger.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close(true);
      } else if (e.key === 'Tab') {
        close(false);
      }
    });

    document.addEventListener('click', (e) => {
      if (!popover.hidden && !picker.contains(e.target)) close(false);
    });

    updatePreview(options[activeIndex]);
  });

  // 2. Combined Proceed booking form (stay + dates + guests -> direct checkout URL)
  document.querySelectorAll('form[data-book]').forEach(form => {
    const inEl = form.querySelector('[name="arrival"]');
    const outEl = form.querySelector('[name="departure"]');
    const msg = form.querySelector('[data-book-msg]');
    const today = new Date();
    const minIn = iso(today);
    if (inEl) inEl.min = minIn;
    if (outEl) outEl.min = minIn;

    if (inEl && outEl) {
      inEl.addEventListener('change', () => {
        if (!inEl.value) return;
        const next = new Date(`${inEl.value}T12:00:00`);
        next.setDate(next.getDate() + 1);
        const nextIso = iso(next);
        outEl.min = nextIso;
        if (!outEl.value || outEl.value <= inEl.value) outEl.value = nextIso;
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const stayEl = form.querySelector('[name="stay"]');
      const guestsEl = form.querySelector('[name="guests"]');
      const stay = stayEl ? stayEl.value : '603326';
      const guests = guestsEl ? guestsEl.value : '2';
      const arrival = inEl ? inEl.value : '';
      const departure = outEl ? outEl.value : '';

      if (msg) msg.textContent = '';
      if (!arrival || !departure) {
        if (msg) msg.textContent = 'Select check-in and check-out dates to proceed.';
        (arrival ? outEl : inEl)?.focus();
        return;
      }
      if (departure <= arrival) {
        if (msg) msg.textContent = 'Check-out must be after check-in.';
        outEl?.focus();
        return;
      }

      const url = new URL(`https://checkout.lodgify.com/en/ogr/${encodeURIComponent(stay)}/reservation`);
      url.searchParams.set('currency', 'USD');
      url.searchParams.set('adults', guests);
      url.searchParams.set('arrival', arrival);
      url.searchParams.set('departure', departure);
      window.open(url.toString(), '_blank', 'noopener');
    });
  });

  // 3. Live 7-night average price hydration + strict 48-hour freshness rule
  const priceRoot = document.querySelector('[data-prices-url]');
  if (priceRoot) {
    const pricesUrl = priceRoot.getAttribute('data-prices-url');
    const clearAllCells = () => {
      priceRoot.querySelectorAll('[data-price-cell]').forEach(cell => {
        cell.innerHTML = '<span class="price-val">—</span>';
      });
      const dateEl = priceRoot.querySelector('[data-prices-checked]');
      if (dateEl) dateEl.textContent = '';
    };

    const formatMoney = (val) => {
      if (typeof val !== 'number' || !Number.isFinite(val) || val <= 0) return null;
      return `$${Math.round(val)}`;
    };

    fetch(pricesUrl, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data || !data.checkedAt) {
          clearAllCells();
          return;
        }
        const checkedMs = Date.parse(data.checkedAt);
        const maxAgeMs = (Number(data.freshnessHours) || 48) * 3600 * 1000;
        if (Number.isNaN(checkedMs) || Date.now() - checkedMs > maxAgeMs) {
          clearAllCells();
          return;
        }
        const dateEl = priceRoot.querySelector('[data-prices-checked]');
        if (dateEl && data.checkedDate) {
          const pretty = new Date(`${data.checkedDate}T12:00:00Z`).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
          });
          dateEl.textContent = `Checked ${pretty}`;
        }
        const winEl = priceRoot.querySelector('[data-prices-window]');
        if (winEl && data.window?.startDate && data.window?.endDate) {
          winEl.textContent = `${data.window.startDate} to ${data.window.endDate}`;
        }
        priceRoot.querySelectorAll('[data-price-cell]').forEach(cell => {
          const propId = cell.getAttribute('data-prop');
          const channel = cell.getAttribute('data-channel');
          const entry = data.properties?.[propId]?.channels?.[channel];
          const formatted = formatMoney(entry?.averageNightly);
          if (formatted) {
            cell.innerHTML = `<span class="price-val">${formatted}</span><span class="price-unit">7-night avg / night</span>`;
            if (entry.method) cell.title = entry.method;
          } else {
            cell.innerHTML = '<span class="price-val">—</span>';
            cell.removeAttribute('title');
          }
        });
      })
      .catch(() => {
        // Check baked-in timestamp for 48-hour staleness if fetch fails
        const baked = priceRoot.getAttribute('data-baked-checked-at');
        if (!baked || Date.now() - Date.parse(baked) > 48 * 3600 * 1000) {
          clearAllCells();
        }
      });
  }
})();
