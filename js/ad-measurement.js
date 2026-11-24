/* Optional ChatGPT Ads measurement; no SDK request before affirmative consent. */
(function () {
  'use strict';
  var KEY = 'am-ad-measurement-v1';
  var MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  var panel = document.getElementById('measurement-panel');
  var settings = document.getElementById('measurement-settings');
  var accept = document.getElementById('measurement-accept');
  var decline = document.getElementById('measurement-decline');
  if (!panel || !settings || !accept || !decline) return;
  settings.hidden = false;
  var allowed = false, initialized = false, viewed = false;

  function readChoice() {
    try {
      var value = JSON.parse(localStorage.getItem(KEY));
      if (value && typeof value.at === 'number' && Date.now() >= value.at &&
          Date.now() - value.at < MAX_AGE && (value.choice === 'yes' || value.choice === 'no')) return value.choice;
    } catch (e) { /* blocked storage or invalid value */ }
    return null;
  }
  function saveChoice(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({choice: choice, at: Date.now()})); }
    catch (e) { /* choice still applies to the current page */ }
  }
  function clearPixelCookies() {
    ['__oppref', '__obref'].forEach(function (name) {
      document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax; Secure';
    });
  }
  function measure(name, type) {
    if (!allowed || !initialized || typeof window.oaiq !== 'function') return;
    try { window.oaiq('measure', name, {type: type}, {opt_out: true}); }
    catch (e) { /* measurement must not interfere with the site */ }
  }
  function enable() {
    allowed = true;
    if (!initialized) {
      if (!window.oaiq) {
        var q = function () { q.q.push(arguments); };
        q.q = [];
        window.oaiq = q;
      }
      window.oaiq('consent', false);
      window.oaiq('init', {pixelId: 'LTxuYL1eY6uyuCboSENLQR', debug: false});
      initialized = true;
      var sdk = document.createElement('script');
      sdk.async = true;
      sdk.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
      document.head.appendChild(sdk);
    }
    window.oaiq('consent', true);
    if (!viewed) {
      viewed = true;
      measure('page_viewed', 'contents');
    }
  }
  function disable() {
    allowed = false;
    if (initialized && typeof window.oaiq === 'function') {
      try { window.oaiq('consent', false); } catch (e) { /* clear local cookies below */ }
    }
    clearPixelCookies();
  }
  function showPanel(focus) {
    panel.hidden = false;
    settings.setAttribute('aria-expanded', 'true');
    if (focus) panel.focus();
  }
  function hidePanel() {
    panel.hidden = true;
    settings.setAttribute('aria-expanded', 'false');
  }
  function apply(choice) {
    if (choice === 'yes') enable(); else disable();
    if (choice === null) showPanel(false); else hidePanel();
  }
  function choose(choice) {
    saveChoice(choice);
    apply(choice);
    if (document.activeElement === accept || document.activeElement === decline) settings.focus({preventScroll: true});
  }
  settings.addEventListener('click', function () { showPanel(true); });
  accept.addEventListener('click', function () { choose('yes'); });
  decline.addEventListener('click', function () { choose('no'); });
  window.addEventListener('storage', function (e) {
    if (e.key === KEY || e.key === null) apply(readChoice());
  });
  window.addEventListener('hashchange', function () {
    if (location.hash === '#measurement-settings') showPanel(true);
  });
  window.alphaAdsMeasurement = {
    lead: function () { measure('lead_created', 'customer_action'); }
  };
  apply(readChoice());
  if (location.hash === '#measurement-settings') showPanel(false);
})();
