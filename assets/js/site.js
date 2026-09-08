/* ===========================================================================
   VAIBHAV KEDARISETTI - PRODUCT PORTFOLIO
   Behaviour layer. Vanilla JS, no dependencies, no build step.
   Every module is declarative: it binds to data-* attributes in the HTML, so
   content stays editable in the markup and nothing lives in this file.
   =========================================================================== */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* ---------- scroll reveal ---------------------------------------------- */
  function initAnim() {
    var els = $$('[data-anim]');
    if (!els.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var d = parseInt(e.target.getAttribute('data-anim'), 10) || 0;
        setTimeout(function () { e.target.classList.add('is-in'); }, d);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- cursor-follow thumbnail on work rows ------------------------ */
  function initPeek() {
    var rows = $$('[data-peek]');
    if (!rows.length || !fine || reduced) return;

    var box = document.createElement('div');
    box.className = 'peek';
    box.setAttribute('aria-hidden', 'true');
    var img = document.createElement('img');
    img.alt = '';
    box.appendChild(img);
    document.body.appendChild(box);

    var x = 0, y = 0, tx = 0, ty = 0, raf = null, on = false;

    function loop() {
      tx += (x - tx) * 0.14;
      ty += (y - ty) * 0.14;
      box.style.transform = 'translate(' + tx + 'px,' + ty + 'px) translate(-50%,-50%) scale(' + (on ? 1 : 0.96) + ')';
      raf = on || Math.abs(x - tx) > 0.5 ? requestAnimationFrame(loop) : null;
    }

    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        var src = row.getAttribute('data-peek');
        if (!src) return;
        img.src = src;
        on = true;
        box.classList.add('is-on');
        if (!raf) raf = requestAnimationFrame(loop);
      });
      row.addEventListener('mouseleave', function () {
        on = false;
        box.classList.remove('is-on');
      });
    });

    document.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      if (on && !raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* ---------- recruiter / explore mode ------------------------------------ */
  function initMode() {
    var groups = $$('[data-mode-switch]');
    var KEY = 'vk.mode';
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (err) { /* private mode */ }
    var mode = stored === 'recruiter' ? 'recruiter' : 'explore';

    function apply(next, announce) {
      mode = next;
      document.body.setAttribute('data-mode', next);
      try { localStorage.setItem(KEY, next); } catch (err) { /* ignore */ }
      groups.forEach(function (g) {
        $$('button', g).forEach(function (b) {
          b.setAttribute('aria-pressed', String(b.getAttribute('data-mode-btn') === next));
        });
      });
      var live = $('[data-mode-live]');
      if (live && announce) {
        live.textContent = next === 'recruiter'
          ? 'Recruiter mode on. Showing the short version.'
          : 'Explore mode on. Showing everything.';
      }
    }

    apply(mode, false);
    groups.forEach(function (g) {
      $$('button', g).forEach(function (b) {
        b.addEventListener('click', function () { apply(b.getAttribute('data-mode-btn'), true); });
      });
    });

    /* The homepage path picker can enter the recruiter version directly. */
    $$('[data-mode-target]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        apply(trigger.getAttribute('data-mode-target'), true);
        var destination = trigger.getAttribute('data-mode-scroll');
        if (!destination) return;
        requestAnimationFrame(function () {
          var target = $(destination);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    });
  }

  /* ---------- hero disciplines -------------------------------------------- */
  function initLenses() {
    $$('[data-lenses]').forEach(function (root) {
      var buttons = $$('[data-lens]', root);
      var copy = $('[data-lens-output]', root);
      function select(button) {
        buttons.forEach(function (item) {
          item.setAttribute('aria-pressed', String(item === button));
        });
        if (copy) copy.textContent = button.getAttribute('data-lens-copy') || '';
      }
      buttons.forEach(function (button) {
        button.addEventListener('click', function () { select(button); });
        button.addEventListener('focus', function () { select(button); });
        button.addEventListener('mouseenter', function () { select(button); });
      });
    });
  }

  /* ---------- draft badge: counts unfilled placeholders -------------------- */
  function initDraft() {
    var badge = $('[data-draft-badge]');
    if (!badge) return;
    var n = $$('.fill').length;
    if (!n) { document.documentElement.removeAttribute('data-draft'); badge.remove(); return; }
    var count = $('[data-draft-count]', badge);
    if (count) count.textContent = String(n);
    var off = $('[data-draft-off]', badge);
    if (off) off.addEventListener('click', function () {
      document.documentElement.removeAttribute('data-draft');
    });
  }

  /* ---------- case-study scrollspy ---------------------------------------- */
  function initSpy() {
    var nav = $('[data-spy]');
    if (!nav || !('IntersectionObserver' in window)) return;
    var links = $$('a[href^="#"]', nav);
    var map = {};
    var targets = links.map(function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) map[el.id] = a;
      return el;
    }).filter(Boolean);
    if (!targets.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        if (map[e.target.id]) map[e.target.id].classList.add('is-active');
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- single-choice reveal (one week / your turn) ------------------ */
  function initChoice() {
    $$('[data-choice]').forEach(function (root) {
      var btns = $$('.choice', root);
      var reveal = $('[data-reveal]', root);
      var echo = $('[data-choice-echo]', root);

      btns.forEach(function (b) {
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () {
          btns.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
          if (echo) echo.textContent = b.getAttribute('data-label') || '';
          if (reveal) {
            reveal.classList.add('is-open');
            reveal.setAttribute('aria-hidden', 'false');
          }
        });
      });
    });
  }

  /* ---------- pick-N (keep three) ----------------------------------------- */
  function initKeep() {
    $$('[data-keep]').forEach(function (root) {
      var max = parseInt(root.getAttribute('data-keep'), 10) || 3;
      var btns = $$('.choice', root);
      var reveal = $('[data-reveal]', root);
      var count = $('[data-keep-count]', root);
      var reset = $('[data-keep-reset]', root);
      var picked = [];

      function sync() {
        if (count) count.textContent = picked.length + ' / ' + max;
        btns.forEach(function (b) {
          var sel = picked.indexOf(b) > -1;
          b.setAttribute('aria-pressed', String(sel));
          b.disabled = !sel && picked.length >= max;
        });
        var done = picked.length === max;
        if (reveal) {
          reveal.classList.toggle('is-open', done);
          reveal.setAttribute('aria-hidden', String(!done));
        }
        if (reset) reset.hidden = picked.length === 0;
      }

      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          var i = picked.indexOf(b);
          if (i > -1) picked.splice(i, 1);
          else if (picked.length < max) picked.push(b);
          sync();
        });
      });

      if (reset) reset.addEventListener('click', function () { picked = []; sync(); });
      sync();
    });
  }

  /* ---------- product demo stepper ---------------------------------------- */
  function initDemo() {
    $$('[data-demo]').forEach(function (root) {
      var steps = $$('.step', root);
      var next = $('[data-demo-next]', root);
      var back = $('[data-demo-back]', root);
      var restart = $('[data-demo-restart]', root);
      var bars = $$('[data-demo-progress] i', root);
      var caption = $('[data-demo-caption]', root);
      var i = 0;

      function sync() {
        steps.forEach(function (s, n) { s.classList.toggle('is-on', n === i); });
        bars.forEach(function (b, n) { b.classList.toggle('is-on', n <= i); });
        if (back) back.disabled = i === 0;
        if (next) next.hidden = i === steps.length - 1;
        if (restart) restart.hidden = i !== steps.length - 1;
        if (caption) {
          var active = steps[i];
          caption.textContent = active ? (active.getAttribute('data-note') || '') : '';
        }
      }

      if (next) next.addEventListener('click', function () {
        // advance only while a selection exists, when the step demands one
        var active = steps[i];
        if (active && active.hasAttribute('data-requires-pick') && !$('.card--sel', active)) return;
        if (i < steps.length - 1) { i++; sync(); }
      });
      if (back) back.addEventListener('click', function () { if (i > 0) { i--; sync(); } });
      if (restart) restart.addEventListener('click', function () { i = 0; sync(); });

      // selectable cards inside a step
      $$('[data-pick]', root).forEach(function (card) {
        card.addEventListener('click', function () {
          var group = card.closest('.step');
          $$('[data-pick]', group).forEach(function (c) {
            c.classList.toggle('card--sel', c === card);
            c.setAttribute('aria-pressed', String(c === card));
          });
          var target = $('[data-pick-echo]', root);
          if (target) target.textContent = card.getAttribute('data-pick') || '';
        });
      });

      sync();
    });
  }

  /* ---------- journey tabs ------------------------------------------------ */
  function initJourney() {
    $$('[data-journey]').forEach(function (root) {
      var tabs = $$('[role="tab"]', root);
      var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

      function select(n) {
        tabs.forEach(function (t, k) {
          var on = k === n;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          if (panels[k]) panels[k].hidden = !on;
        });
      }

      tabs.forEach(function (t, n) {
        t.addEventListener('click', function () { select(n); });
        t.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          var k = (n + d + tabs.length) % tabs.length;
          select(k);
          tabs[k].focus();
        });
      });

      select(0);
    });
  }

  /* ---------- archaeology hotspots ---------------------------------------- */
  function initHotspots() {
    $$('[data-arch]').forEach(function (root) {
      var hots = $$('.hot', root);
      var panels = hots.map(function (h) { return document.getElementById(h.getAttribute('aria-controls')); });
      var empty = $('[data-arch-empty]', root);

      function open(n) {
        hots.forEach(function (h, k) {
          var on = k === n;
          h.setAttribute('aria-expanded', String(on));
          if (panels[k]) panels[k].hidden = !on;
        });
        if (empty) empty.hidden = n > -1;
      }

      hots.forEach(function (h, n) {
        h.addEventListener('click', function () {
          open(h.getAttribute('aria-expanded') === 'true' ? -1 : n);
        });
      });

      open(-1);
    });
  }

  /* ---------- before / after compare -------------------------------------- */
  function initCompare() {
    $$('[data-compare]').forEach(function (root) {
      var grab = $('.cmp__grab', root);
      // the explanation panel sits after the comparer, outside its own root
      var note = $('[data-compare-note]', root) ||
                 (root.parentElement && $('[data-compare-note]', root.parentElement));
      if (!grab) return;
      var dragging = false;
      var touched = false;

      function set(pct) {
        pct = Math.max(4, Math.min(96, pct));
        root.style.setProperty('--split', pct + '%');
        grab.setAttribute('aria-valuenow', String(Math.round(pct)));
        if (!touched && note) { touched = true; note.classList.add('is-open'); }
      }

      function fromEvent(e) {
        var r = root.getBoundingClientRect();
        var cx = e.touches ? e.touches[0].clientX : e.clientX;
        set(((cx - r.left) / r.width) * 100);
      }

      grab.addEventListener('pointerdown', function (e) {
        dragging = true;
        grab.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      grab.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
      grab.addEventListener('pointerup', function (e) {
        dragging = false;
        if (grab.hasPointerCapture(e.pointerId)) grab.releasePointerCapture(e.pointerId);
      });
      root.addEventListener('click', function (e) {
        if (e.target === grab || grab.contains(e.target)) return;
        fromEvent(e);
      });
      grab.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 4 : e.key === 'ArrowLeft' ? -4 : 0;
        if (!d) return;
        e.preventDefault();
        set((parseFloat(grab.getAttribute('aria-valuenow')) || 50) + d);
      });

      set(50);
      touched = false;
    });
  }

  /* ---------- horizontal strips: fade whichever edge has more content ------- */
  /* The nav, the case-study nav and the journey track all scroll sideways on
     narrow screens. Without an edge fade there is nothing to say more exists,
     so the last nav item simply looks absent. */
  function initStrips() {
    $$('.nav, .casenav ol, .journey__track').forEach(function (el) {
      function sync() {
        var max = el.scrollWidth - el.clientWidth;
        if (max < 4) { el.removeAttribute('data-edge'); return; }
        var atStart = el.scrollLeft <= 4;
        var atEnd = el.scrollLeft >= max - 4;
        el.setAttribute('data-edge', atStart ? 'end' : atEnd ? 'start' : 'both');
      }
      el.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
      sync();
    });
  }

  /* ---------- in-page navigation ----------------------------------------- */
  /* Native scroll behavior varies slightly between browsers for hash links.
     Own the anchor transition so the primary nav, path picker and case-study
     nav all move the same way, without intercepting wheel or touch scrolling. */
  function initAnchors() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $$('a[href^="#"]').forEach(function (link) {
      if (link.classList.contains('skip')) return;
      var hash = link.getAttribute('href');
      var target = hash && document.getElementById(hash.slice(1));
      if (!target) return;
      link.addEventListener('click', function (event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        try { history.pushState(null, '', hash); } catch (err) { /* ignore */ }
      });
    });
  }

  /* ---------- boot --------------------------------------------------------- */
  function boot() {
    initAnim(); initPeek(); initMode(); initLenses(); initDraft(); initSpy();
    initChoice(); initKeep(); initDemo(); initJourney();
    initHotspots(); initCompare(); initStrips(); initAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
