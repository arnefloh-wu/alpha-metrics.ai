/* Runs before first paint: marks the page as script-enabled and restores the saved theme. */
document.documentElement.className += ' js';
try {
  var t = localStorage.getItem('am-theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) { /* storage may be blocked; the OS preference then applies */ }
