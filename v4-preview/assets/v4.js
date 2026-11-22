/**
 * Oilgate Vacation Rentals v4 Interactive Layer
 *  1. 21st.dev Beams Background (inspired by Kokonut UI) — animated navy/cyan/gold volumetric beams
 *  2. 21st.dev Kinetic Scroll Gallery (inspired by @dhileepkumargm) — horizontal velocity-skew galleries
 *  3. Accessible Rental Picker with hover/focus photo preview
 *  4. Combined Reserve booking form -> direct checkout URL with prefilled dates & guests
 *  5. Live 7-night average price hydration (homepage all-units average + per-unit page table)
 *  6. "See all photos" modal + Lightbox viewer
 */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // =========================================================================
  // 1. 21st.dev Volumetric Beams Background (Navy / Sapphire / Gold)
  // =========================================================================
  const canvas = document.getElementById('beams-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let width = 0;
      let height = 0;
      const BEAM_COUNT = window.innerWidth < 768 ? 10 : 18;
      const beams = [];

      const createBeam = (i, total) => {
        const isGold = i % 4 === 0;
        return {
          x: (i / total) * width + (Math.random() - 0.5) * 140,
          y: Math.random() * height,
          w: (isGold ? 36 : 55) + Math.random() * 85,
          len: height * (1.2 + Math.random() * 0.6),
          angle: -26 + (Math.random() - 0.5) * 14,
          speed: 0.25 + Math.random() * 0.45,
          opacity: isGold ? (0.12 + Math.random() * 0.12) : (0.14 + Math.random() * 0.18),
          hue: isGold ? 39 : (205 + Math.random() * 22),
          sat: isGold ? 96 : 82,
          light: isGold ? 54 : 52,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.012 + Math.random() * 0.016,
        };
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!beams.length) {
          for (let i = 0; i < BEAM_COUNT; i++) beams.push(createBeam(i, BEAM_COUNT));
        }
      };

      const drawFrame = () => {
        ctx.clearRect(0, 0, width, height);
        for (const b of beams) {
          if (!reducedMotion) {
            b.y -= b.speed;
            b.pulse += b.pulseSpeed;
            if (b.y + b.len < -120) {
              b.y = height + 140;
              b.x = Math.random() * width;
            }
          }
          const alpha = b.opacity * (0.78 + 0.22 * Math.sin(b.pulse));
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate((b.angle * Math.PI) / 180);
          const grad = ctx.createLinearGradient(0, 0, 0, b.len);
          grad.addColorStop(0, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, 0)`);
          grad.addColorStop(0.25, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, ${alpha})`);
          grad.addColorStop(0.75, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, ${alpha * 0.85})`);
          grad.addColorStop(1, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, 0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(-b.w / 2, 0, b.w, b.len);
          ctx.restore();
        }
        if (!reducedMotion) requestAnimationFrame(drawFrame);
      };

      resize();
      window.addEventListener('resize', resize, { passive: true });
      drawFrame();
    }
  }

  // =========================================================================
  // 2. 21st.dev Kinetic Scroll Gallery (Horizontal Velocity-Skew Spring)
  // =========================================================================
  document.querySelectorAll('[data-kinetic-gallery]').forEach(gallery => {
    const track = gallery.querySelector('[data-kinetic-track]');
    const cards = [...gallery.querySelectorAll('.kinetic-card')];
    const prevBtn = gallery.querySelector('[data-kinetic-prev]');
    const nextBtn = gallery.querySelector('[data-kinetic-next]');
    if (!track) return;

    let lastScrollLeft = track.scrollLeft;
    let lastTime = performance.now();
    let targetSkew = 0;
    let currentSkew = 0;
    let rafId = null;

    const animateSkew = () => {
      currentSkew += (targetSkew - currentSkew) * 0.16;
      targetSkew *= 0.84;
      if (Math.abs(currentSkew) < 0.04 && Math.abs(targetSkew) < 0.04) {
        currentSkew = 0;
        cards.forEach(c => { c.style.transform = ''; });
        rafId = null;
        return;
      }
      const scale = 1 - Math.min(0.035, Math.abs(currentSkew) * 0.004);
      const tf = `skewX(${currentSkew.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      cards.forEach(c => { c.style.transform = tf; });
      rafId = requestAnimationFrame(animateSkew);
    };

    track.addEventListener('scroll', () => {
      if (reducedMotion) return;
      const now = performance.now();
      const dt = Math.max(8, now - lastTime);
      const dx = track.scrollLeft - lastScrollLeft;
      const vel = dx / dt; // px/ms
      targetSkew = Math.max(-9, Math.min(9, -vel * 4.2));
      lastScrollLeft = track.scrollLeft;
      lastTime = now;
      if (!rafId) rafId = requestAnimationFrame(animateSkew);
    }, { passive: true });

    // Smooth mouse-drag left/right scrolling
    let isDown = false;
    let startX = 0;
    let startLeft = 0;
    let dragged = false;

    track.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDown = true;
      dragged = false;
      startX = e.pageX;
      startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const delta = e.pageX - startX;
      if (Math.abs(delta) > 5) dragged = true;
      track.scrollLeft = startLeft - delta * 1.15;
    });
    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
      setTimeout(() => { dragged = false; }, 60);
    });
    track.addEventListener('click', (e) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    const step = () => Math.max(280, track.clientWidth * 0.72);
    prevBtn?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    nextBtn?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });

  // =========================================================================
  // 3. "See All Photos" Modal & Lightbox Viewer
  // =========================================================================
  const allPhotosModal = document.getElementById('all-photos-modal');
  const lightboxModal = document.getElementById('lightbox-modal');
  const allTriggers = [...document.querySelectorAll('[data-lightbox-src]')];

  if (allPhotosModal) {
    document.querySelectorAll('[data-open-all-photos]').forEach(btn => {
      btn.addEventListener('click', () => {
        allPhotosModal.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    });
    allPhotosModal.querySelector('[data-close-modal]')?.addEventListener('click', () => {
      allPhotosModal.hidden = true;
      document.body.style.overflow = '';
    });
  }

  if (lightboxModal && allTriggers.length) {
    const lbImg = lightboxModal.querySelector('[data-lb-img]');
    const lbCap = lightboxModal.querySelector('[data-lb-cap]');
    const lbCount = lightboxModal.querySelector('[data-lb-count]');
    const uniquePhotos = [];
    const seenSrc = new Set();
    allTriggers.forEach(el => {
      const src = el.getAttribute('data-lightbox-src');
      const alt = el.getAttribute('data-lightbox-alt') || '';
      const cat = el.getAttribute('data-lightbox-cat') || '';
      if (src && !seenSrc.has(src)) {
        seenSrc.add(src);
        uniquePhotos.push({ src, alt, cat });
      }
    });

    let currentIdx = 0;
    const renderLb = () => {
      const item = uniquePhotos[currentIdx];
      if (!item) return;
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      lbCap.textContent = item.cat ? `${item.cat} — ${item.alt}` : item.alt;
      if (lbCount) lbCount.textContent = `${currentIdx + 1} / ${uniquePhotos.length}`;
    };
    const openLb = (src) => {
      const idx = uniquePhotos.findIndex(p => p.src === src);
      currentIdx = idx >= 0 ? idx : 0;
      renderLb();
      lightboxModal.hidden = false;
      document.body.style.overflow = 'hidden';
    };
    const closeLb = () => {
      lightboxModal.hidden = true;
      if (!allPhotosModal || allPhotosModal.hidden) document.body.style.overflow = '';
    };

    allTriggers.forEach(el => {
      el.addEventListener('click', () => openLb(el.getAttribute('data-lightbox-src')));
    });
    lightboxModal.querySelector('[data-lb-close]')?.addEventListener('click', closeLb);
    lightboxModal.querySelector('[data-lb-prev]')?.addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + uniquePhotos.length) % uniquePhotos.length;
      renderLb();
    });
    lightboxModal.querySelector('[data-lb-next]')?.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % uniquePhotos.length;
      renderLb();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.hidden) {
        if (e.key === 'Escape') closeLb();
        else if (e.key === 'ArrowLeft') { currentIdx = (currentIdx - 1 + uniquePhotos.length) % uniquePhotos.length; renderLb(); }
        else if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % uniquePhotos.length; renderLb(); }
      } else if (allPhotosModal && !allPhotosModal.hidden && e.key === 'Escape') {
        allPhotosModal.hidden = true;
        document.body.style.overflow = '';
      }
    });
  }

  // =========================================================================
  // 4. Accessible Rental Picker (WAI-ARIA combobox/listbox with photo preview)
  // =========================================================================
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
      options.forEach((opt, i) => opt.classList.toggle('is-active', i === activeIndex));
      listbox.setAttribute('aria-activedescendant', options[activeIndex].id);
      updatePreview(options[activeIndex]);
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
    const close = (refocus = false) => {
      popover.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (refocus) trigger.focus();
    };

    trigger.addEventListener('click', () => (popover.hidden ? open() : close()));
    trigger.addEventListener('keydown', (e) => {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); open(); }
    });
    options.forEach((opt, idx) => {
      opt.addEventListener('mouseenter', () => setActive(idx));
      opt.addEventListener('focus', () => setActive(idx));
      opt.addEventListener('click', () => { selectOption(idx, true); trigger.focus(); });
    });
    listbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIndex + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIndex - 1); }
      else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
      else if (e.key === 'End') { e.preventDefault(); setActive(options.length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectOption(activeIndex, true); trigger.focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') { close(false); }
    });
    document.addEventListener('click', (e) => {
      if (!popover.hidden && !picker.contains(e.target)) close(false);
    });
    updatePreview(options[activeIndex]);
  });

  // =========================================================================
  // 5. Combined Reserve Booking Form
  // =========================================================================
  document.querySelectorAll('form[data-book]').forEach(form => {
    const inEl = form.querySelector('[name="arrival"]');
    const outEl = form.querySelector('[name="departure"]');
    const msg = form.querySelector('[data-book-msg]');
    const minIn = iso(new Date());
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
      const stay = form.querySelector('[name="stay"]')?.value || '603326';
      const guests = form.querySelector('[name="guests"]')?.value || '2';
      const arrival = inEl?.value || '';
      const departure = outEl?.value || '';
      if (msg) msg.textContent = '';
      if (!arrival || !departure) {
        if (msg) msg.textContent = 'Select check-in and check-out dates to reserve.';
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

  // =========================================================================
  // 6. Live 7-Night Average Price Hydration (No Subtext, Strict 48h Freshness)
  // =========================================================================
  const priceRoot = document.querySelector('[data-prices-url]');
  if (priceRoot) {
    const pricesUrl = priceRoot.getAttribute('data-prices-url');
    const clearAll = () => {
      priceRoot.querySelectorAll('[data-price-val]').forEach(el => { el.textContent = '—'; });
    };
    const fmt = v => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? `$${Math.round(v)}` : '—');

    fetch(pricesUrl, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data || !data.checkedAt) { clearAll(); return; }
        const checkedMs = Date.parse(data.checkedAt);
        const maxAgeMs = (Number(data.freshnessHours) || 48) * 3600 * 1000;
        if (Number.isNaN(checkedMs) || Date.now() - checkedMs > maxAgeMs) { clearAll(); return; }

        const dateEl = priceRoot.querySelector('[data-prices-checked]');
        if (dateEl && data.checkedDate) {
          const pretty = new Date(`${data.checkedDate}T12:00:00Z`).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
          });
          dateEl.textContent = `Updated ${pretty}`;
        }

        priceRoot.querySelectorAll('[data-price-val]').forEach(el => {
          const propId = el.getAttribute('data-prop');
          const ch = el.getAttribute('data-channel');
          if (propId === 'all') {
            let val = data.averages?.[ch]?.averageNightly;
            if (typeof val !== 'number') {
              const vals = Object.values(data.properties || {})
                .map(p => p.channels?.[ch]?.averageNightly)
                .filter(v => typeof v === 'number' && Number.isFinite(v) && v > 0);
              val = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
            }
            el.textContent = fmt(val);
          } else {
            el.textContent = fmt(data.properties?.[propId]?.channels?.[ch]?.averageNightly);
          }
        });
      })
      .catch(() => {
        const baked = priceRoot.getAttribute('data-baked-checked-at');
        if (!baked || Date.now() - Date.parse(baked) > 48 * 3600 * 1000) clearAll();
      });
  }
})();
