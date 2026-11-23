/**
 * Oilgate Vacation Rentals v5 — Interactive Runtime
 *  1. 21st.dev Wave Mesh Light Animated Background (inspired by @ham7a311/wave-mesh)
 *     in warm ivory (#f7f4ee) with flowing navy (#012342) and luminous gold (#FEA802) silk waves
 *  2. Categorized Kinetic Photo Tour:
 *     - When a category has > 3 photos: gently auto-scrolls continuously, pauses on hover/touch,
 *       supports touch swipe, mouse drag, wheel/trackpad, AND prev/next buttons
 *  3. "See All Photos" Modal & Lightbox Viewer
 *  4. Accessible Rental Picker (WAI-ARIA combobox/listbox with photo preview)
 *  5. Combined Reserve Booking Form -> direct checkout URL
 *  6. Live 7-Night Average Price Hydration (strict 48h freshness)
 */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // =========================================================================
  // 1. 21st.dev-Inspired Light Wave Mesh Canvas (#012342 Navy & #FEA802 Gold)
  //    Applied ONLY to plain/light bands (.wave-band) — photo backgrounds stay untouched
  // =========================================================================
  const waveCanvases = [...document.querySelectorAll('canvas.wave-mesh-canvas')];
  if (waveCanvases.length) {
    const instances = waveCanvases.map((canvas, idx) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      const state = {
        canvas,
        ctx,
        w: 0,
        h: 0,
        visible: true,
        phaseOffset: idx * 1.35,
        ribbons: [
          { amp: 28, freq: 0.0024, speed: 0.72, yFrac: 0.22, width: 88, color: 'rgba(254, 168, 2, 0.22)', stroke: 'rgba(254, 168, 2, 0.44)' },
          { amp: 36, freq: 0.0019, speed: -0.56, yFrac: 0.44, width: 110, color: 'rgba(1, 35, 66, 0.095)', stroke: 'rgba(1, 35, 66, 0.24)' },
          { amp: 24, freq: 0.0031, speed: 0.92, yFrac: 0.62, width: 76, color: 'rgba(254, 168, 2, 0.19)', stroke: 'rgba(254, 168, 2, 0.4)' },
          { amp: 32, freq: 0.0022, speed: -0.68, yFrac: 0.80, width: 96, color: 'rgba(1, 35, 66, 0.085)', stroke: 'rgba(1, 35, 66, 0.22)' },
        ],
        motes: Array.from({ length: 14 }, (_, m) => ({
          xFrac: ((m * 0.173 + idx * 0.29) % 1),
          yFrac: ((m * 0.311 + idx * 0.19) % 1),
          r: 2.2 + (m % 4) * 1.4,
          vx: (m % 2 === 0 ? 1 : -1) * (0.012 + (m % 3) * 0.006),
          vy: (m % 3 === 0 ? -0.008 : 0.007),
          isGold: m % 3 !== 0,
          pulse: m * 0.9,
        })),
      };

      const resize = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        state.w = Math.max(1, Math.floor(rect.width));
        state.h = Math.max(1, Math.floor(rect.height));
        canvas.width = Math.floor(state.w * dpr);
        canvas.height = Math.floor(state.h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      state.resize = resize;
      resize();
      return state;
    }).filter(Boolean);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(ent => {
          const inst = instances.find(s => s.canvas === ent.target);
          if (inst) inst.visible = ent.isIntersecting;
        });
      }, { rootMargin: '120px' });
      instances.forEach(s => io.observe(s.canvas));
    }

    const drawWave = (s, tSec) => {
      const { ctx, w, h, ribbons, motes, phaseOffset } = s;
      ctx.clearRect(0, 0, w, h);

      // Soft warm daylight gradient wash with drifting gold & pearl bloom
      const gx = w * (0.28 + 0.18 * Math.sin(tSec * 0.42 + phaseOffset));
      const gy = h * (0.34 + 0.14 * Math.cos(tSec * 0.35 + phaseOffset));
      const glow = ctx.createRadialGradient(gx, gy, 10, gx, gy, Math.max(w, h) * 0.65);
      glow.addColorStop(0, 'rgba(254, 168, 2, 0.16)');
      glow.addColorStop(0.55, 'rgba(1, 35, 66, 0.04)');
      glow.addColorStop(1, 'rgba(247, 244, 238, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Flowing translucent Wave Mesh silk bands
      const step = Math.max(24, Math.floor(w / 42));
      for (let r = 0; r < ribbons.length; r++) {
        const rb = ribbons[r];
        const baseY = h * rb.yFrac;
        const ph = tSec * rb.speed + phaseOffset + r * 0.9;

        ctx.beginPath();
        for (let x = -step; x <= w + step; x += step) {
          const y = baseY
            + Math.sin(x * rb.freq + ph) * rb.amp
            + Math.cos(x * rb.freq * 0.55 - ph * 0.7) * (rb.amp * 0.45);
          if (x === -step) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        // Top highlight hairline
        ctx.strokeStyle = rb.stroke;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Soft ribbon body fill
        for (let x = w + step; x >= -step; x -= step) {
          const y2 = baseY + rb.width
            + Math.sin(x * rb.freq + ph + 0.45) * (rb.amp * 0.78)
            + Math.cos(x * rb.freq * 0.5 - ph * 0.65) * (rb.amp * 0.35);
          ctx.lineTo(x, y2);
        }
        ctx.closePath();
        ctx.fillStyle = rb.color;
        ctx.fill();
      }

      // Gentle drifting gold & navy shimmer motes
      for (const m of motes) {
        const mx = ((m.xFrac + tSec * m.vx) % 1 + 1) % 1 * w;
        const my = ((m.yFrac + tSec * m.vy) % 1 + 1) % 1 * h;
        const a = 0.24 + 0.22 * Math.sin(tSec * 1.4 + m.pulse);
        ctx.beginPath();
        ctx.arc(mx, my, m.r, 0, Math.PI * 2);
        ctx.fillStyle = m.isGold
          ? `rgba(254, 168, 2, ${a.toFixed(3)})`
          : `rgba(1, 35, 66, ${(a * 0.65).toFixed(3)})`;
        ctx.fill();
      }
    };

    const onResize = () => {
      instances.forEach(s => {
        s.resize();
        drawWave(s, 0.8);
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(onResize);
      instances.forEach(s => ro.observe(s.canvas.parentElement));
    }

    if (reducedMotion) {
      instances.forEach(s => drawWave(s, 0.8));
    } else {
      const start = performance.now();
      const tick = (now) => {
        const tSec = (now - start) / 1000;
        for (const s of instances) {
          if (s.visible) drawWave(s, tSec);
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  // =========================================================================
  // 2. Categorized Kinetic Photo Tour (>3 photos auto-scroll + pause + swipe/drag/wheel + buttons)
  // =========================================================================
  document.querySelectorAll('[data-kinetic-gallery]').forEach(gallery => {
    const track = gallery.querySelector('[data-kinetic-track]');
    const origCards = [...gallery.querySelectorAll('.kinetic-card')];
    const prevBtn = gallery.querySelector('[data-kinetic-prev]');
    const nextBtn = gallery.querySelector('[data-kinetic-next]');
    if (!track || !origCards.length) return;

    const shouldAutoScroll = origCards.length > 3;

    // Seamless infinite loop for >3 photos by appending aria-hidden visual clones
    let loopHalfWidth = 0;
    if (shouldAutoScroll) {
      const frag = document.createDocumentFragment();
      origCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('data-kinetic-clone', 'true');
        clone.setAttribute('aria-hidden', 'true');
        const btn = clone.querySelector('button');
        if (btn) btn.setAttribute('tabindex', '-1');
        frag.appendChild(clone);
      });
      track.appendChild(frag);
      track.setAttribute('data-autoscroll', 'true');
    }

    const allCards = [...track.querySelectorAll('.kinetic-card')];
    const computeHalf = () => {
      if (!shouldAutoScroll) return;
      // Exact pixel distance from first original card to first clone
      const firstOrig = origCards[0];
      const firstClone = track.querySelector('[data-kinetic-clone="true"]');
      if (firstOrig && firstClone) {
        loopHalfWidth = Math.max(1, firstClone.offsetLeft - firstOrig.offsetLeft);
      } else {
        loopHalfWidth = Math.max(1, track.scrollWidth / 2);
      }
    };
    computeHalf();
    window.addEventListener('resize', computeHalf, { passive: true });
    window.addEventListener('load', computeHalf, { once: true });

    // Velocity-skew spring animation on manual scroll/drag
    let lastScrollLeft = track.scrollLeft;
    let lastTime = performance.now();
    let targetSkew = 0;
    let currentSkew = 0;
    let skewRaf = null;

    const animateSkew = () => {
      currentSkew += (targetSkew - currentSkew) * 0.16;
      targetSkew *= 0.84;
      if (Math.abs(currentSkew) < 0.04 && Math.abs(targetSkew) < 0.04) {
        currentSkew = 0;
        allCards.forEach(c => { c.style.transform = ''; });
        skewRaf = null;
        return;
      }
      const scale = 1 - Math.min(0.03, Math.abs(currentSkew) * 0.0035);
      const tf = `skewX(${currentSkew.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      allCards.forEach(c => { c.style.transform = tf; });
      skewRaf = requestAnimationFrame(animateSkew);
    };

    // Pause/resume state for gentle auto-scroll
    let hovered = false;
    let touching = false;
    let isDown = false;
    let focused = false;
    let pausedUntil = 0;
    let inView = true;

    const bumpCooldown = (ms = 1600) => {
      pausedUntil = Math.max(pausedUntil, performance.now() + ms);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      }, { rootMargin: '80px' });
      io.observe(gallery);
    }

    gallery.addEventListener('mouseenter', () => { hovered = true; });
    gallery.addEventListener('mouseleave', () => { hovered = false; });
    gallery.addEventListener('focusin', () => { focused = true; });
    gallery.addEventListener('focusout', () => { focused = false; });
    track.addEventListener('touchstart', () => { touching = true; }, { passive: true });
    track.addEventListener('touchend', () => { touching = false; bumpCooldown(1800); }, { passive: true });
    track.addEventListener('touchcancel', () => { touching = false; bumpCooldown(1200); }, { passive: true });

    // Wheel / trackpad support (horizontal trackpad scroll + Shift+wheel)
    track.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > 0) {
        bumpCooldown(1600);
      } else if (e.shiftKey && Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
        bumpCooldown(1600);
      }
    }, { passive: false });

    // Seamless infinite wrap + velocity skew on scroll
    let autoScrollingNow = false;
    track.addEventListener('scroll', () => {
      if (shouldAutoScroll && loopHalfWidth > 0) {
        if (track.scrollLeft >= loopHalfWidth) {
          track.scrollLeft -= loopHalfWidth;
          lastScrollLeft = track.scrollLeft;
        } else if (track.scrollLeft < 0) {
          track.scrollLeft += loopHalfWidth;
          lastScrollLeft = track.scrollLeft;
        }
      }
      if (reducedMotion || autoScrollingNow) {
        lastScrollLeft = track.scrollLeft;
        return;
      }
      const now = performance.now();
      const dt = Math.max(8, now - lastTime);
      const dx = track.scrollLeft - lastScrollLeft;
      const vel = dx / dt;
      if (Math.abs(vel) > 0.15) {
        targetSkew = Math.max(-8, Math.min(8, -vel * 3.8));
        if (!skewRaf) skewRaf = requestAnimationFrame(animateSkew);
      }
      lastScrollLeft = track.scrollLeft;
      lastTime = now;
    }, { passive: true });

    // Smooth mouse-drag left/right scrolling
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
      bumpCooldown(1600);
      setTimeout(() => { dragged = false; }, 60);
    });
    track.addEventListener('click', (e) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    const step = () => Math.max(270, track.clientWidth * 0.72);
    prevBtn?.addEventListener('click', () => {
      bumpCooldown(2200);
      if (shouldAutoScroll && loopHalfWidth > 0 && track.scrollLeft < 40) {
        track.scrollLeft += loopHalfWidth;
      }
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    nextBtn?.addEventListener('click', () => {
      bumpCooldown(2200);
      track.scrollBy({ left: step(), behavior: 'smooth' });
    });

    // Gentle auto-scroll loop for categories with > 3 photos
    if (shouldAutoScroll && !reducedMotion) {
      let prevTs = performance.now();
      let fracCarry = 0;
      const speedPxPerSec = 34; // calm, unmistakably moving glide
      const stepAuto = (ts) => {
        const dt = Math.min(0.06, Math.max(0, (ts - prevTs) / 1000));
        prevTs = ts;
        if (inView && !hovered && !touching && !isDown && !focused && ts >= pausedUntil && !document.hidden) {
          if (loopHalfWidth <= 1) computeHalf();
          fracCarry += speedPxPerSec * dt;
          if (fracCarry >= 1) {
            const move = Math.floor(fracCarry);
            fracCarry -= move;
            autoScrollingNow = true;
            track.scrollLeft += move;
            if (loopHalfWidth > 0 && track.scrollLeft >= loopHalfWidth) {
              track.scrollLeft -= loopHalfWidth;
            }
            autoScrollingNow = false;
          }
        }
        requestAnimationFrame(stepAuto);
      };
      requestAnimationFrame(stepAuto);
    }
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

    document.addEventListener('click', (e) => {
      const trig = e.target.closest?.('[data-lightbox-src]');
      if (!trig) return;
      openLb(trig.getAttribute('data-lightbox-src'));
    });

    lightboxModal.querySelector('[data-lb-prev]')?.addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + uniquePhotos.length) % uniquePhotos.length;
      renderLb();
    });
    lightboxModal.querySelector('[data-lb-next]')?.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % uniquePhotos.length;
      renderLb();
    });
    lightboxModal.querySelector('[data-lb-close]')?.addEventListener('click', closeLb);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLb();
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
    if (!trigger || !popover || !listbox || !options.length) return;

    let activeIndex = Math.max(0, options.findIndex(o => o.getAttribute('aria-selected') === 'true'));

    const updatePreview = (opt) => {
      if (!opt) return;
      if (previewImg) {
        previewImg.src = opt.dataset.img || '';
        previewImg.alt = opt.dataset.alt || '';
      }
      if (previewTitle) previewTitle.textContent = opt.dataset.name || '';
      if (previewDesc) previewDesc.textContent = opt.dataset.summary || '';
    };

    const setActive = (idx) => {
      activeIndex = (idx + options.length) % options.length;
      options.forEach((o, i) => o.classList.toggle('is-active', i === activeIndex));
      listbox.setAttribute('aria-activedescendant', options[activeIndex].id);
      updatePreview(options[activeIndex]);
    };

    const selectOption = (idx, closeAfter = true) => {
      setActive(idx);
      const opt = options[activeIndex];
      options.forEach((o, i) => o.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false'));
      if (hiddenInput) hiddenInput.value = opt.dataset.id || '';
      if (triggerThumb) {
        triggerThumb.src = opt.dataset.img || '';
        triggerThumb.alt = opt.dataset.alt || '';
      }
      if (triggerName) triggerName.textContent = opt.dataset.name || '';
      if (triggerMeta) triggerMeta.textContent = opt.dataset.facts || '';
      if (closeAfter) close(true);
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

    trigger.addEventListener('click', () => (popover.hidden ? open() : close(false)));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
    listbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIndex + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIndex - 1); }
      else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
      else if (e.key === 'End') { e.preventDefault(); setActive(options.length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectOption(activeIndex, true); }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') { close(false); }
    });
    options.forEach((opt, i) => {
      opt.addEventListener('mouseenter', () => setActive(i));
      opt.addEventListener('click', () => selectOption(i, true));
    });
    document.addEventListener('click', (e) => {
      if (!popover.hidden && !picker.contains(e.target)) close(false);
    });
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

    inEl?.addEventListener('change', () => {
      if (inEl.value && outEl) {
        const next = new Date(`${inEl.value}T12:00:00`);
        next.setDate(next.getDate() + 1);
        const nextIso = iso(next);
        outEl.min = nextIso;
        if (!outEl.value || outEl.value <= inEl.value) outEl.value = nextIso;
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const stay = form.querySelector('[name="stay"]')?.value || '603326';
      const guests = form.querySelector('[name="guests"]')?.value || '2';
      const arrival = inEl?.value || '';
      const departure = outEl?.value || '';
      if (!arrival || !departure) {
        if (msg) msg.textContent = 'Please select both check-in and check-out dates.';
        return;
      }
      if (departure <= arrival) {
        if (msg) msg.textContent = 'Check-out must be after check-in.';
        return;
      }
      if (msg) msg.textContent = '';
      const url = new URL(`https://checkout.lodgify.com/en/ogr/${encodeURIComponent(stay)}/reservation`);
      url.searchParams.set('currency', 'USD');
      url.searchParams.set('arrival', arrival);
      url.searchParams.set('departure', departure);
      url.searchParams.set('adults', guests);
      window.open(url.toString(), '_blank', 'noopener');
    });
  });

  // =========================================================================
  // 6. Live 7-Night Average Price Hydration (Strict 48h Freshness)
  // =========================================================================
  const priceRoot = document.querySelector('[data-prices-url]');
  if (priceRoot) {
    const pricesUrl = priceRoot.getAttribute('data-prices-url');
    const clearAll = () => {
      priceRoot.querySelectorAll('[data-price-val]').forEach(el => { el.textContent = '—'; });
    };
    const fmt = v => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? `$${Math.round(v)}` : '—');

    fetch(pricesUrl, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('prices unavailable'))))
      .then(data => {
        const checkedMs = Date.parse(data.checkedAt);
        const maxAgeMs = (Number(data.freshnessHours) || 48) * 3600 * 1000;
        if (!Number.isFinite(checkedMs) || Date.now() - checkedMs > maxAgeMs) { clearAll(); return; }

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
            let avg = data.allUnitsAverage?.[ch]?.averageNightly;
            if (typeof avg !== 'number' || !Number.isFinite(avg) || avg <= 0) {
              const vals = Object.values(data.properties || {})
                .map(p => p?.channels?.[ch]?.averageNightly)
                .filter(v => typeof v === 'number' && Number.isFinite(v) && v > 0);
              if (vals.length) avg = vals.reduce((a, b) => a + b, 0) / vals.length;
            }
            el.textContent = fmt(avg);
          } else {
            const avg = data.properties?.[propId]?.channels?.[ch]?.averageNightly;
            el.textContent = fmt(avg);
          }
        });
      })
      .catch(() => {
        const baked = priceRoot.getAttribute('data-baked-checked-at');
        if (!baked || Date.now() - Date.parse(baked) > 48 * 3600 * 1000) clearAll();
      });
  }
})();
