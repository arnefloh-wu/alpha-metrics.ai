/* Page behaviour: menu, theme, reveal-on-scroll, active link, contact form. */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---------- theme (explicit choice is remembered; default follows the OS) ---------- */
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* storage may be blocked */ } }
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  }
  var tbtn = document.getElementById('theme-btn');
  function syncThemeBtn() {
    if (!tbtn) return;
    tbtn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
    tbtn.setAttribute('aria-pressed', String(isDark()));
  }
  if (tbtn) {
    tbtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next); store('am-theme', next); syncThemeBtn();
    });
    syncThemeBtn();
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(syncThemeBtn);
    }
  }

  /* ---------- mobile menu ---------- */
  var mbtn = document.getElementById('menu-btn'), links = document.getElementById('nav-links');
  function setMenu(open) {
    if (!mbtn || !links) return;
    links.classList.toggle('open', open); mbtn.setAttribute('aria-expanded', String(open));
    mbtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (mbtn && links) {
    mbtn.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- reveal on scroll + chart entrance ---------- */
  var reveal = document.querySelectorAll('.reveal, .bars, .funnel');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    Array.prototype.forEach.call(reveal, function (n) { io.observe(n); });
  } else {
    Array.prototype.forEach.call(reveal, function (n) { n.classList.add('in'); });
  }

  /* ---------- active section in the menu ---------- */
  var sections = ['market-research', 'ai-advertising', 'ai-consulting', 'ai-training', 'approach', 'showcase', 'standards', 'about', 'contact'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var navA = {};
  Array.prototype.forEach.call(document.querySelectorAll('.nav-links a[href^="#"]'), function (a) { navA[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window && sections.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(navA).forEach(function (k) { navA[k].removeAttribute('aria-current'); });
        var sectionId = ['approach', 'showcase', 'standards'].indexOf(en.target.id) !== -1 ? 'market-research' : en.target.id;
        if (navA[sectionId]) navA[sectionId].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { so.observe(s); });
  }

  /* ---------- contact form ---------- */
  var form = document.getElementById('contact-form');
  if (!form) return;
  var ok = document.getElementById('form-ok'), fail = document.getElementById('form-fail');
  function setErr(name, msg) {
    var f = form.elements[name], e = document.getElementById('err-' + name);
    if (e) e.textContent = msg || '';
    if (f) { if (msg) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid'); }
  }
  function validate() {
    var bad = null;
    function need(name, test, msg) { var v = (form.elements[name].value || '').trim(); if (!test(v)) { setErr(name, msg); bad = bad || form.elements[name]; } else setErr(name, ''); }
    need('name', function (v) { return v.length > 1; }, 'Please enter your name.');
    need('email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'Please enter a valid email address.');
    need('message', function (v) { return v.length > 9; }, 'Please tell us a little about your question.');
    if (!form.elements.consent.checked) { setErr('consent', 'Please confirm so that we may reply to you.'); bad = bad || form.elements.consent; } else setErr('consent', '');
    return bad;
  }
  var sending = false;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    ok.classList.remove('on'); fail.hidden = true;
    if (form.elements._gotcha && form.elements._gotcha.value) return;   // honeypot
    var bad = validate();
    if (bad) { bad.focus(); return; }
    var btn = form.querySelector('button[type="submit"]'), label = btn.querySelector('span');
    var submitLabel = label.textContent;
    sending = true; btn.disabled = true; label.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('status ' + r.status);
        return r.json();
      })
      .then(function (response) {
        if (!response || response.success !== true) throw new Error('submission not accepted');
        // Only accepted submissions count; measurement must never break the form.
        try { if (window.alphaAdsMeasurement) window.alphaAdsMeasurement.lead(); } catch (e) { /* optional measurement */ }
        form.reset(); ok.classList.add('on'); ok.focus();
      })
      .catch(function () { fail.hidden = false; })
      .then(function () { sending = false; btn.disabled = false; label.textContent = submitLabel; });
  });
  Array.prototype.forEach.call(form.querySelectorAll('input, textarea'), function (f) {
    f.addEventListener('input', function () { if (f.getAttribute('aria-invalid')) setErr(f.name, ''); });
  });
})();
