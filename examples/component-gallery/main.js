/**
 * CODE-TO-COURSE — COMPLETE JS ENGINE
 * Copy this file verbatim into the course output directory.
 * Never regenerate it. Every engine auto-initializes by scanning for
 * class names and data-* attributes (see interactive-elements.md).
 *
 * Shell:      theme toggle · sidebar table of contents · progress ·
 *             module completion · "up next" cards · keyboard (N / P / Esc)
 * Teaching:   glossary tooltips · copy buttons · quizzes · drag-and-drop ·
 *             group chat · flow animation · architecture diagram ·
 *             spot-the-bug · layer toggle · tabs
 * End-user:   platform-aware keys · UI tour hotspots · try-it checklists ·
 *             searchable feature map
 */
(function () {
  'use strict';

  /* ── HELPERS ──────────────────────────────────────────────── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function pad(n) { return String(n).padStart(2, '0'); }

  // Storage can throw (private windows, file:// in some browsers) — never let it break the page.
  const STORE_PREFIX = 'course:' + location.pathname + ':';
  const store = {
    get(k) { try { return localStorage.getItem(STORE_PREFIX + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(STORE_PREFIX + k, v); } catch (e) { /* ignore */ } },
    getGlobal(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    setGlobal(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  // Accept either an element id string or an element inside the container.
  function resolve(x, containerSel) {
    if (!x) return null;
    if (typeof x === 'string') return document.getElementById(x);
    if (x.closest) return x.matches(containerSel) ? x : x.closest(containerSel);
    return null;
  }

  // Bind a click handler only when the markup didn't already wire one via onclick="".
  function bindIfNoInline(btn, fn) {
    if (btn && !btn.hasAttribute('onclick')) btn.addEventListener('click', fn);
  }

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── THEME ─────────────────────────────────────────────────── */
  const root = document.documentElement;
  if (!root.dataset.theme) {
    root.dataset.theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  const themeBtn = $('#theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      store.setGlobal('course-theme', next);
    });
  }

  /* ── TABLE OF CONTENTS ─────────────────────────────────────── */
  const modules = $$('.module');
  const toc = $('#toc');
  const tocLinks = [];

  modules.forEach((mod, i) => {
    if (!mod.id) mod.id = 'module-' + (i + 1);
    const titleEl = $('.module-title', mod);
    mod._title = titleEl ? titleEl.textContent.trim() : 'Module ' + (i + 1);
    if (!toc) return;
    const li = el('li');
    const a = el('a', 'toc-link');
    a.href = '#' + mod.id;
    a.append(el('span', 'toc-num', pad(i + 1)), el('span', 'toc-title', ''));
    a.lastChild.textContent = mod._title;
    li.appendChild(a);
    toc.appendChild(li);
    tocLinks.push(a);
  });

  const sidebar = $('#sidebar');
  const tocToggle = $('#toc-toggle');
  const scrim = $('#sidebar-scrim');
  function setDrawer(open) {
    if (!sidebar) return;
    sidebar.classList.toggle('open', open);
    if (tocToggle) tocToggle.setAttribute('aria-expanded', String(open));
  }
  if (tocToggle) tocToggle.addEventListener('click', () => setDrawer(!sidebar.classList.contains('open')));
  if (scrim) scrim.addEventListener('click', () => setDrawer(false));
  tocLinks.forEach(a => a.addEventListener('click', () => setDrawer(false)));

  /* ── MODULE COMPLETION + "UP NEXT" CARDS ───────────────────── */
  const done = new Set((store.get('done') || '').split(',').filter(Boolean));
  function markDone(id) {
    if (done.has(id)) return;
    done.add(id);
    store.set('done', Array.from(done).join(','));
    renderDone();
  }
  function renderDone() {
    modules.forEach((m, i) => { if (tocLinks[i]) tocLinks[i].classList.toggle('done', done.has(m.id)); });
  }
  renderDone();

  const arrowSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  modules.forEach((mod, i) => {
    if ($('.module-next', mod) || mod.hasAttribute('data-no-next')) return;
    const host = $('.module-content', mod) || mod;
    const next = modules[i + 1];
    const a = el('a', 'module-next');
    if (next) {
      a.href = '#' + next.id;
      a.innerHTML = '<span><span class="module-next-label">Up next · Module ' + pad(i + 2) + '</span><span class="module-next-title"></span></span><span class="module-next-arrow">' + arrowSvg + '</span>';
      $('.module-next-title', a).textContent = next._title;
    } else {
      a.href = '#top';
      a.classList.add('finished');
      a.innerHTML = '<span><span class="module-next-label">Course complete</span><span class="module-next-title">You made it to the end — nice work.</span></span><span class="module-next-arrow" style="transform:rotate(-90deg)">' + arrowSvg + '</span>';
      a.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }); });
    }
    host.appendChild(a);
  });

  /* ── SCROLL: PROGRESS, ACTIVE MODULE, COMPLETION ───────────── */
  const progressBar = $('#progress-bar');
  const progressText = $('#topbar-progress');
  const topbarModule = $('#topbar-module');
  const legacyDots = $$('.nav-dot');
  let lastActive = -1;

  function currentModuleIndex() {
    const mid = window.innerHeight * 0.4;
    let idx = 0;
    modules.forEach((m, i) => { if (m.getBoundingClientRect().top <= mid) idx = i; });
    return idx;
  }

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    if (progressBar) {
      progressBar.style.width = pct + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(pct));
    }
    if (progressText) progressText.textContent = Math.round(pct) + '%';

    const active = modules.length ? currentModuleIndex() : -1;
    if (active !== lastActive) {
      lastActive = active;
      tocLinks.forEach((a, i) => {
        a.classList.toggle('active', i === active);
        if (i === active) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      if (topbarModule && modules[active]) topbarModule.textContent = modules[active]._title;
    }
    legacyDots.forEach((d, i) => {
      d.classList.toggle('active', i === active);
      d.classList.toggle('visited', i < active);
    });

    // A module counts as read once its bottom edge scrolls into view.
    modules.forEach(m => {
      if (m.getBoundingClientRect().bottom <= window.innerHeight + 40) markDone(m.id);
    });
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  legacyDots.forEach(dot => dot.addEventListener('click', () => {
    const t = document.getElementById(dot.dataset.target);
    if (t) t.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }));

  /* ── KEYBOARD ──────────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { setDrawer(false); hideAllTooltips(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    const key = e.key.toLowerCase();
    if (key !== 'n' && key !== 'p') return;
    const i = currentModuleIndex();
    const target = modules[key === 'n' ? i + 1 : i - 1];
    if (target) { target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }); e.preventDefault(); }
  });

  /* ── SCROLL-TRIGGERED REVEAL ───────────────────────────────── */
  $$('.stagger-children').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => child.style.setProperty('--stagger-index', i));
  });
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    $$('.animate-in').forEach(n => revealObserver.observe(n));
  } else {
    $$('.animate-in').forEach(n => n.classList.add('visible'));
  }

  /* ── GLOSSARY TOOLTIPS ─────────────────────────────────────── */
  let activeTooltip = null;

  function positionTooltip(term, tip) {
    const rect = term.getBoundingClientRect();
    const tipWidth = Math.min(320, Math.max(200, window.innerWidth * 0.8));
    let left = rect.left + rect.width / 2 - tipWidth / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tipWidth - 8));
    tip.style.left = left + 'px';
    tip.style.width = tipWidth + 'px';
    tip.style.setProperty('--arrow-x', Math.max(14, Math.min(tipWidth - 14, rect.left + rect.width / 2 - left)) + 'px');
    document.body.appendChild(tip);
    const h = tip.offsetHeight;
    if (rect.top - h - 12 < 0) {
      tip.style.top = (rect.bottom + 10) + 'px';
      tip.classList.add('flip');
    } else {
      tip.style.top = (rect.top - h - 10) + 'px';
      tip.classList.remove('flip');
    }
  }
  function showTooltip(term, tip) {
    if (activeTooltip && activeTooltip !== tip) hideAllTooltips();
    positionTooltip(term, tip);
    requestAnimationFrame(() => tip.classList.add('visible'));
    term.classList.add('active');
    activeTooltip = tip;
    activeTooltip._term = term;
  }
  function hideTooltip(tip) {
    tip.classList.remove('visible');
    if (tip._term) tip._term.classList.remove('active');
    setTimeout(() => { if (!tip.classList.contains('visible')) tip.remove(); }, 160);
    if (activeTooltip === tip) activeTooltip = null;
  }
  function hideAllTooltips() { if (activeTooltip) hideTooltip(activeTooltip); }

  $$('.term').forEach((term, i) => {
    const tip = el('span', 'term-tooltip');
    tip.id = 'term-tip-' + i;
    tip.setAttribute('role', 'tooltip');
    const title = el('span', 'term-tooltip-title');
    title.textContent = term.dataset.term || term.textContent.trim();
    tip.append(title, document.createTextNode(term.dataset.definition || ''));
    if (!term.hasAttribute('tabindex')) term.tabIndex = 0;
    term.setAttribute('aria-describedby', tip.id);

    term.addEventListener('mouseenter', () => showTooltip(term, tip));
    term.addEventListener('mouseleave', () => hideTooltip(tip));
    term.addEventListener('focus', () => showTooltip(term, tip));
    term.addEventListener('blur', () => hideTooltip(tip));
    term.addEventListener('click', e => {
      e.stopPropagation();
      tip.classList.contains('visible') ? hideTooltip(tip) : showTooltip(term, tip);
    });
  });
  document.addEventListener('click', hideAllTooltips);
  window.addEventListener('scroll', hideAllTooltips, { passive: true });

  /* ── COPY BUTTONS ──────────────────────────────────────────── */
  const copyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>';

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((res, rej) => {
      const ta = el('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); }
      ta.remove();
    });
  }

  $$('.code-block, .terminal, .translation-code').forEach(block => {
    if (block.hasAttribute('data-no-copy') || $('.copy-btn', block)) return;
    const pre = $('pre', block);
    if (!pre) return;
    const btn = el('button', 'copy-btn', copyIcon + '<span>Copy</span>');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy code');
    btn.addEventListener('click', () => {
      const clone = pre.cloneNode(true);
      $$('.prompt, .output', clone).forEach(n => n.remove());
      const text = clone.textContent.replace(/^\n+|\s+$/g, '');
      copyText(text).then(() => {
        btn.classList.add('copied');
        $('span', btn).textContent = 'Copied';
        setTimeout(() => { btn.classList.remove('copied'); $('span', btn).textContent = 'Copy'; }, 1600);
      }).catch(() => {});
    });
    const header = $('.code-header', block);
    if (header) header.appendChild(btn);
    else { btn.classList.add('floating'); block.appendChild(btn); }
  });

  /* ── QUIZ ENGINE ───────────────────────────────────────────── */
  function setFeedback(node, cls, html) {
    node.innerHTML = '<div>' + html + '</div>';
    node.className = (node.classList.contains('bug-feedback') ? 'bug-feedback' : 'quiz-feedback') + ' show ' + cls;
  }

  window.selectOption = function (btn) {
    const block = btn.closest('.quiz-question-block');
    if (!block) return;
    $$('.quiz-option', block).forEach(o => { o.classList.remove('selected'); o.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('selected');
    btn.setAttribute('aria-pressed', 'true');
  };

  window.checkQuiz = function (x) {
    const container = resolve(x, '.quiz-container');
    if (!container) return;
    $$('.quiz-question-block', container).forEach(q => {
      const selected = $('.quiz-option.selected', q);
      const feedback = $('.quiz-feedback', q);
      const correct = q.dataset.correct;
      if (!feedback) return;
      if (q.dataset.answered) return;
      if (!selected) { setFeedback(feedback, 'warning', 'Pick an answer first!'); return; }
      q.dataset.answered = '1';
      $$('.quiz-option', q).forEach(o => { o.disabled = true; });
      if (selected.dataset.value === correct) {
        selected.classList.add('correct');
        setFeedback(feedback, 'success', '<strong>Exactly!</strong> ' + (q.dataset.explanationRight || ''));
      } else {
        selected.classList.add('incorrect');
        const correctBtn = $('.quiz-option[data-value="' + correct + '"]', q);
        if (correctBtn) correctBtn.classList.add('correct');
        setFeedback(feedback, 'error', '<strong>Not quite.</strong> ' + (q.dataset.explanationWrong || ''));
      }
    });
  };

  window.resetQuiz = function (x) {
    const container = resolve(x, '.quiz-container');
    if (!container) return;
    $$('.quiz-question-block', container).forEach(q => { delete q.dataset.answered; });
    $$('.quiz-option', container).forEach(o => {
      o.classList.remove('selected', 'correct', 'incorrect');
      o.disabled = false;
      o.setAttribute('aria-pressed', 'false');
    });
    $$('.quiz-feedback', container).forEach(f => { f.className = 'quiz-feedback'; f.innerHTML = ''; });
  };

  $$('.quiz-container').forEach(c => {
    $$('.quiz-option', c).forEach(o => { o.type = 'button'; bindIfNoInline(o, () => window.selectOption(o)); });
    bindIfNoInline($('.quiz-check-btn', c), () => window.checkQuiz(c));
    bindIfNoInline($('.quiz-reset-btn', c), () => window.resetQuiz(c));
  });

  /* ── DRAG-AND-DROP (mouse drag + tap-to-place) ─────────────── */
  function placeChip(container, target, chip) {
    // Return a previously placed chip to the pool
    if (target.dataset.placed) {
      const prev = $('.dnd-chip[data-answer="' + target.dataset.placed + '"]', container);
      if (prev) prev.classList.remove('placed');
    }
    // If this chip was already placed elsewhere, clear that target
    $$('.dnd-zone-target', container).forEach(t => {
      if (t !== target && t.dataset.placed === chip.dataset.answer) {
        t.textContent = t.dataset.emptyText || 'Drop here';
        delete t.dataset.placed;
      }
    });
    target.textContent = chip.textContent;
    target.dataset.placed = chip.dataset.answer;
    target.classList.remove('correct-placed', 'incorrect-placed');
    chip.classList.add('placed');
    $$('.dnd-chip.picked', container).forEach(c => c.classList.remove('picked'));
    container._picked = null;
    container.classList.remove('has-pick');
  }

  function initDnD(container) {
    const chips = $$('.dnd-chip', container);
    const targets = $$('.dnd-zone-target', container);
    container._picked = null; // selected chip for tap-to-place; lives on the container so resetDnD can clear it
    targets.forEach(t => { t.dataset.emptyText = t.textContent.trim() || 'Drop here'; t.tabIndex = 0; });

    chips.forEach(chip => {
      chip.setAttribute('draggable', 'true');
      chip.tabIndex = 0;
      chip.setAttribute('role', 'button');
      chip.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', chip.dataset.answer);
        chip.classList.add('dragging');
      });
      chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
      const pick = () => {
        if (container._picked === chip) { chip.classList.remove('picked'); container._picked = null; container.classList.remove('has-pick'); return; }
        chips.forEach(c => c.classList.remove('picked'));
        container._picked = chip;
        chip.classList.add('picked');
        container.classList.add('has-pick');
      };
      chip.addEventListener('click', pick);
      chip.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });

    targets.forEach(target => {
      target.addEventListener('dragover', e => { e.preventDefault(); target.classList.add('drag-over'); });
      target.addEventListener('dragleave', () => target.classList.remove('drag-over'));
      target.addEventListener('drop', e => {
        e.preventDefault();
        target.classList.remove('drag-over');
        const chip = $('.dnd-chip[data-answer="' + e.dataTransfer.getData('text/plain') + '"]', container);
        if (chip) placeChip(container, target, chip);
      });
      const drop = () => { if (container._picked) { placeChip(container, target, container._picked); container._picked = null; } };
      target.addEventListener('click', drop);
      target.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop(); } });
    });

    bindIfNoInline($('.dnd-check-btn', container), () => window.checkDnD(container));
    bindIfNoInline($('.dnd-reset-btn', container), () => window.resetDnD(container));
  }

  window.checkDnD = function (x) {
    const container = resolve(x, '.dnd-container');
    if (!container) return;
    $$('.dnd-zone', container).forEach(zone => {
      const target = $('.dnd-zone-target', zone);
      if (!target || !target.dataset.placed) return;
      const ok = target.dataset.placed === zone.dataset.correct;
      target.classList.toggle('correct-placed', ok);
      target.classList.toggle('incorrect-placed', !ok);
    });
  };

  window.resetDnD = function (x) {
    const container = resolve(x, '.dnd-container');
    if (!container) return;
    $$('.dnd-zone-target', container).forEach(t => {
      t.textContent = t.dataset.emptyText || 'Drop here';
      delete t.dataset.placed;
      t.classList.remove('correct-placed', 'incorrect-placed');
    });
    $$('.dnd-chip', container).forEach(c => c.classList.remove('placed', 'dragging', 'picked'));
    container._picked = null;
    container.classList.remove('has-pick');
  };

  $$('.dnd-container').forEach(initDnD);

  /* ── GROUP CHAT ENGINE ─────────────────────────────────────── */
  function initChat(container) {
    const messages = $$('.chat-message', container);
    const typingEl = $('.chat-typing', container);
    const typingAv = (container.id && document.getElementById(container.id + '-typing-avatar')) || (typingEl && $('.chat-avatar', typingEl));
    const progressEl = $('.chat-progress', container);
    const nextBtn = $('.chat-next-btn', container);
    let index = 0, busy = false, timer = null;

    messages.forEach(m => { m.style.display = 'none'; });

    const actors = {};
    messages.forEach(msg => {
      const av = $('.chat-avatar', msg);
      if (av && !actors[msg.dataset.sender]) actors[msg.dataset.sender] = { initial: av.textContent.trim(), bg: av.style.background };
    });

    function update() {
      if (progressEl) progressEl.textContent = index + ' / ' + messages.length;
      if (nextBtn) nextBtn.disabled = index >= messages.length;
    }
    function showNext(cb) {
      if (busy || index >= messages.length) return;
      busy = true;
      const msg = messages[index];
      const actor = actors[msg.dataset.sender];
      if (typingEl && actor && !reducedMotion) {
        if (typingAv) { typingAv.textContent = actor.initial; typingAv.style.background = actor.bg; }
        typingEl.style.display = 'flex';
      }
      setTimeout(() => {
        if (typingEl) typingEl.style.display = 'none';
        msg.style.display = 'flex';
        msg.style.animation = 'none';
        msg.offsetHeight;
        msg.style.animation = '';
        index++;
        busy = false;
        update();
        if (typeof cb === 'function') cb();
      }, reducedMotion ? 0 : 700);
    }
    function showAll() {
      clearInterval(timer);
      timer = setInterval(() => {
        if (index >= messages.length) { clearInterval(timer); return; }
        showNext();
      }, reducedMotion ? 50 : 1100);
    }
    function reset() {
      clearInterval(timer);
      index = 0; busy = false;
      messages.forEach(m => { m.style.display = 'none'; });
      if (typingEl) typingEl.style.display = 'none';
      update();
    }
    const allBtn = $('.chat-all-btn', container);
    const resetBtn = $('.chat-reset-btn', container);
    if (nextBtn) nextBtn.addEventListener('click', () => showNext());
    if (allBtn) allBtn.addEventListener('click', showAll);
    if (resetBtn) resetBtn.addEventListener('click', reset);
    update();
  }
  $$('.chat-window').forEach(initChat);

  /* ── FLOW ANIMATION ENGINE ─────────────────────────────────── */
  function initFlow(container) {
    let steps = [];
    try { steps = JSON.parse(container.dataset.steps || '[]'); }
    catch (e) {
      console.warn('[course] Invalid data-steps JSON on .flow-animation (check for unescaped apostrophes):', e);
    }
    const labelEl = $('.flow-step-label', container);
    const progressEl = $('.flow-progress', container);
    let packet = $('.flow-packet', container);
    if (!packet) { packet = el('div', 'flow-packet'); container.appendChild(packet); }
    const startText = labelEl ? labelEl.textContent : '';
    let step = 0, timer = null;

    // Progress dots
    const controls = $('.flow-controls', container);
    let dots = null;
    if (controls && steps.length && steps.length <= 14) {
      dots = el('div', 'flow-dots');
      steps.forEach(() => dots.appendChild(el('i')));
      if (progressEl) controls.insertBefore(dots, progressEl); else controls.appendChild(dots);
    }

    function find(id) {
      if (!id) return null;
      return $('#' + id, container) || $('#flow-' + id, container) || document.getElementById(id) || document.getElementById('flow-' + id);
    }
    function update() {
      if (progressEl) progressEl.textContent = 'Step ' + step + ' / ' + steps.length;
      if (dots) Array.from(dots.children).forEach((d, i) => d.classList.toggle('on', i === step - 1));
      const nb = $('.flow-next-btn', container);
      if (nb) nb.disabled = step >= steps.length;
    }
    function animatePacket(fromEl, toEl) {
      if (!fromEl || !toEl || reducedMotion) return;
      const src = $('.flow-actor-icon', fromEl) || fromEl;
      const dst = $('.flow-actor-icon', toEl) || toEl;
      const c = container.getBoundingClientRect();
      const f = src.getBoundingClientRect();
      const t = dst.getBoundingClientRect();
      packet.style.setProperty('--packet-from-x', (f.left + f.width / 2 - c.left) + 'px');
      packet.style.setProperty('--packet-from-y', (f.top + f.height / 2 - c.top) + 'px');
      packet.style.setProperty('--packet-to-x', (t.left + t.width / 2 - c.left) + 'px');
      packet.style.setProperty('--packet-to-y', (t.top + t.height / 2 - c.top) + 'px');
      packet.style.display = 'block';
      packet.style.animation = 'none';
      packet.offsetHeight;
      packet.style.animation = 'packetMove 0.85s var(--ease-in-out) forwards';
      setTimeout(() => { packet.style.display = 'none'; }, 900);
    }
    function next() {
      if (step >= steps.length) { clearInterval(timer); return; }
      const s = steps[step];
      $$('.flow-actor', container).forEach(a => a.classList.remove('active'));
      const h = find(s.highlight);
      if (h) h.classList.add('active');
      if (s.packet && s.from && s.to) animatePacket(find(s.from), find(s.to));
      if (labelEl) {
        labelEl.textContent = s.label || '';
        labelEl.classList.remove('changed'); labelEl.offsetHeight; labelEl.classList.add('changed');
      }
      step++;
      update();
    }
    function reset() {
      clearInterval(timer);
      step = 0;
      $$('.flow-actor', container).forEach(a => a.classList.remove('active'));
      if (labelEl) labelEl.textContent = startText || 'Click "Next Step" to begin';
      packet.style.display = 'none';
      update();
    }
    function play() {
      if (step >= steps.length) reset();
      clearInterval(timer);
      next();
      timer = setInterval(() => { step >= steps.length ? clearInterval(timer) : next(); }, 1800);
    }
    const nb = $('.flow-next-btn', container), rb = $('.flow-reset-btn', container), pb = $('.flow-play-btn', container);
    if (nb) nb.addEventListener('click', () => { clearInterval(timer); next(); });
    if (rb) rb.addEventListener('click', reset);
    if (pb) pb.addEventListener('click', play);
    update();
  }
  $$('.flow-animation').forEach(initFlow);

  /* ── ARCHITECTURE / UI-MAP DIAGRAM ─────────────────────────── */
  window.showArchDesc = function (comp) {
    const diagram = comp.closest('.arch-diagram');
    if (!diagram) return;
    $$('.arch-component', diagram).forEach(c => c.classList.remove('active'));
    comp.classList.add('active');
    const desc = $('.arch-description', diagram);
    if (desc) desc.textContent = comp.dataset.desc || '';
  };
  $$('.arch-component').forEach(comp => {
    if (!comp.hasAttribute('tabindex')) comp.tabIndex = 0;
    comp.setAttribute('role', 'button');
    bindIfNoInline(comp, () => window.showArchDesc(comp));
    comp.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.showArchDesc(comp); } });
  });

  /* ── BUG / MISTAKE CHALLENGE ───────────────────────────────── */
  window.checkBugLine = function (line, isCorrect) {
    const challenge = line.closest('.bug-challenge');
    const feedback = $('.bug-feedback', challenge);
    if (isCorrect) {
      line.classList.add('correct');
      if (feedback) setFeedback(feedback, 'success', '<strong>Found it!</strong> ' + (line.dataset.explanation || ''));
      $$('.bug-line', challenge).forEach(l => { l.style.pointerEvents = 'none'; });
    } else {
      line.classList.add('incorrect');
      if (feedback) setFeedback(feedback, 'error', line.dataset.hint || 'Not this one — keep looking…');
      setTimeout(() => { line.classList.remove('incorrect'); }, 1800);
    }
  };
  $$('.bug-line').forEach(line => {
    line.tabIndex = 0;
    line.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); line.click(); } });
  });

  /* ── LAYER TOGGLE (legacy) ─────────────────────────────────── */
  window.showLayer = function (layerId, btn) {
    const demo = btn ? btn.closest('.layer-demo') : null;
    if (!demo) return;
    $$('.layer', demo).forEach(l => { l.style.display = 'none'; });
    $$('.layer-tab', demo).forEach(t => t.classList.remove('active'));
    const layer = document.getElementById(layerId) || document.getElementById('layer-' + layerId);
    if (layer) layer.style.display = 'block';
    btn.classList.add('active');
    const desc = $('.layer-description', demo);
    if (desc && btn.dataset.desc) desc.textContent = btn.dataset.desc;
  };

  /* ── TABS (generic, optionally synced by data-tab-group) ───── */
  const tabGroups = {};
  function selectTab(tabsEl, key) {
    const tabs = $$(':scope > .tab-list > .tab', tabsEl);
    const panels = $$(':scope > .tab-panel', tabsEl);
    let idx = tabs.findIndex(t => t.dataset.tab === key);
    if (idx < 0) return false;
    tabs.forEach((t, i) => { t.setAttribute('aria-selected', String(i === idx)); t.tabIndex = i === idx ? 0 : -1; });
    panels.forEach((p, i) => { p.hidden = i !== idx; });
    return true;
  }
  $$('.tabs').forEach((tabsEl, n) => {
    const tabs = $$(':scope > .tab-list > .tab', tabsEl);
    const panels = $$(':scope > .tab-panel', tabsEl);
    const list = $(':scope > .tab-list', tabsEl);
    if (list) list.setAttribute('role', 'tablist');
    tabs.forEach((t, i) => {
      if (!t.dataset.tab) t.dataset.tab = 't' + i;
      t.type = 'button';
      t.setAttribute('role', 'tab');
      t.id = t.id || 'tab-' + n + '-' + i;
      if (panels[i]) { panels[i].setAttribute('role', 'tabpanel'); panels[i].setAttribute('aria-labelledby', t.id); }
      t.addEventListener('click', () => {
        const g = tabsEl.dataset.tabGroup;
        if (g) {
          (tabGroups[g] || []).forEach(other => selectTab(other, t.dataset.tab));
          if (g === 'platform') setPlatform(t.dataset.tab, true);
        } else selectTab(tabsEl, t.dataset.tab);
      });
      t.addEventListener('keydown', e => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const j = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
        tabs[j].click(); tabs[j].focus();
      });
    });
    const g = tabsEl.dataset.tabGroup;
    if (g) (tabGroups[g] = tabGroups[g] || []).push(tabsEl);
    const initial = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
    if (initial) selectTab(tabsEl, initial.dataset.tab);
  });

  /* ── PLATFORM-AWARE KEYS & CONTENT ─────────────────────────── */
  function detectPlatform() {
    const p = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || '').toLowerCase();
    if (p.indexOf('mac') >= 0 || p.indexOf('iphone') >= 0 || p.indexOf('ipad') >= 0) return 'mac';
    if (p.indexOf('win') >= 0) return 'win';
    return 'linux';
  }
  const platformKeys = $$('[data-mac], [data-win], [data-linux]');
  const platformSwitch = $('#platform-switch');
  const hasPlatformContent = platformKeys.length || $('[data-platform-only]') || tabGroups.platform || $$('.hotspot').some(h => /data-(mac|win)=/.test(h.dataset.desc || ''));

  function applyKeys(nodes, p) {
    nodes.forEach(k => {
      if (k.dataset.orig == null) k.dataset.orig = k.textContent;
      const v = k.dataset[p] || (p === 'linux' ? k.dataset.win : null);
      k.textContent = v != null ? v : k.dataset.orig;
    });
  }
  function setPlatform(p, save) {
    root.dataset.platform = p;
    if (save) store.setGlobal('course-platform', p);
    applyKeys(platformKeys, p);
    if (platformSwitch) $$('button', platformSwitch).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.platform === p)));
    (tabGroups.platform || []).forEach(t => selectTab(t, p));
  }
  if (hasPlatformContent) {
    setPlatform(store.getGlobal('course-platform') || detectPlatform(), false);
    if (platformSwitch) {
      platformSwitch.hidden = false;
      $$('button', platformSwitch).forEach(b => b.addEventListener('click', () => setPlatform(b.dataset.platform, true)));
    }
  }

  /* ── UI TOUR (screenshot hotspots) ─────────────────────────── */
  function initTour(tour) {
    const spots = $$('.hotspot', tour);
    if (!spots.length) return;
    const body = $('.app-window-body', tour) || spots[0].parentElement;
    let region = $('.hotspot-region', body);
    if (!region) { region = el('div', 'hotspot-region'); body.appendChild(region); }

    let panel = $('.ui-tour-panel', tour);
    if (!panel) {
      panel = el('div', 'ui-tour-panel',
        '<span class="ui-tour-step">?</span>' +
        '<div><span class="ui-tour-title"></span><p class="ui-tour-desc"></p></div>' +
        '<div class="ui-tour-nav"><button type="button" class="btn tour-prev">Back</button><button type="button" class="btn btn-primary tour-next">Start tour</button></div>');
      tour.appendChild(panel);
    }
    const stepEl = $('.ui-tour-step', panel), titleEl = $('.ui-tour-title', panel), descEl = $('.ui-tour-desc', panel);
    const prevBtn = $('.tour-prev', panel), nextBtn = $('.tour-next', panel);
    let cur = -1;

    function show(i) {
      cur = i;
      spots.forEach((s, j) => s.classList.toggle('active', j === i));
      if (i < 0) {
        stepEl.textContent = spots.length;
        titleEl.textContent = tour.dataset.title || 'Take the tour';
        descEl.textContent = tour.dataset.intro || 'Click a numbered marker, or press Start to walk through each part of the screen.';
        region.classList.remove('active');
      } else {
        const s = spots[i];
        stepEl.textContent = i + 1;
        titleEl.textContent = s.dataset.title || '';
        descEl.innerHTML = s.dataset.desc || '';
        applyKeys($$('[data-mac], [data-win], [data-linux]', descEl), root.dataset.platform || detectPlatform());
        if (s.dataset.region) {
          const r = s.dataset.region.split(',').map(v => v.trim());
          region.style.setProperty('--x', r[0]); region.style.setProperty('--y', r[1]);
          region.style.setProperty('--w', r[2]); region.style.setProperty('--h', r[3]);
          region.classList.add('active');
        } else region.classList.remove('active');
      }
      if (prevBtn) prevBtn.disabled = i <= 0;
      if (nextBtn) nextBtn.textContent = i < 0 ? 'Start tour' : (i >= spots.length - 1 ? 'Restart' : 'Next');
    }
    spots.forEach((s, i) => {
      s.type = 'button';
      if (!s.textContent.trim()) s.textContent = i + 1;
      s.setAttribute('aria-label', (i + 1) + ': ' + (s.dataset.title || 'hotspot'));
      s.addEventListener('click', () => show(i));
    });
    if (prevBtn) prevBtn.addEventListener('click', () => show(Math.max(0, cur - 1)));
    if (nextBtn) nextBtn.addEventListener('click', () => show(cur >= spots.length - 1 ? 0 : cur + 1));
    show(-1);
  }
  $$('.ui-tour').forEach(initTour);
  // Hotspots outside a tour just get a native tooltip
  $$('.hotspot').forEach(s => { if (!s.closest('.ui-tour') && s.dataset.title) s.title = s.dataset.title; });

  /* ── TRY-IT CHECKLISTS (persisted per course) ──────────────── */
  $$('.try-it').forEach((box, n) => {
    const boxes = $$('input[type="checkbox"]', box);
    const key = 'tryit:' + (box.id || n);
    const saved = (store.get(key) || '').split('');
    let prog = $('.try-it-progress', box);
    const header = $('.try-it-header', box);
    if (!prog && header) { prog = el('span', 'try-it-progress'); header.appendChild(prog); }
    function update() {
      const c = boxes.filter(b => b.checked).length;
      if (prog) prog.textContent = c + ' / ' + boxes.length;
      box.classList.toggle('complete', boxes.length > 0 && c === boxes.length);
      store.set(key, boxes.map(b => (b.checked ? '1' : '0')).join(''));
    }
    boxes.forEach((b, i) => { b.checked = saved[i] === '1'; b.addEventListener('change', update); });
    update();
  });

  /* ── FEATURE MAP (search + category filter) ────────────────── */
  $$('.feature-map').forEach(map => {
    const input = $('.feature-search', map);
    const filters = $$('.feature-filter', map);
    const items = $$('.feature-item', map);
    const grid = $('.feature-grid', map) || map;
    let empty = $('.feature-empty', map);
    if (!empty) { empty = el('div', 'feature-empty', 'No features match that search.'); empty.hidden = true; grid.after(empty); }
    let cat = 'all';
    function apply() {
      const q = (input ? input.value : '').trim().toLowerCase();
      let shown = 0;
      items.forEach(it => {
        const cats = (it.dataset.category || '').split(/\s+/);
        const hay = (it.textContent + ' ' + (it.dataset.tags || '')).toLowerCase();
        const ok = (cat === 'all' || cats.indexOf(cat) >= 0) && (!q || q.split(/\s+/).every(w => hay.indexOf(w) >= 0));
        it.hidden = !ok;
        if (ok) shown++;
      });
      empty.hidden = shown > 0;
    }
    if (input) input.addEventListener('input', apply);
    filters.forEach(f => {
      f.type = 'button';
      f.setAttribute('aria-pressed', String(f.dataset.filter === 'all'));
      f.addEventListener('click', () => {
        cat = f.dataset.filter || 'all';
        filters.forEach(o => o.setAttribute('aria-pressed', String(o === f)));
        apply();
      });
    });
    apply();
  });

})();
