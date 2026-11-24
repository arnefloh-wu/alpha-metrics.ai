/* Runs before first paint: marks the page as script-enabled and restores the saved theme. */
document.documentElement.className += ' js';
try {
  var t = localStorage.getItem('am-theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) { /* storage may be blocked; the OS preference then applies */ }

/* Preserve links to the former homepage service and research sections. */
(function () {
  if (location.pathname !== '/' && location.pathname !== '/index.html') return;
  var paths = {
    '#market-research': 'market-research.html',
    '#ai-advertising': 'ai-advertising.html',
    '#ai-consulting': 'ai-consulting.html',
    '#ai-training': 'ai-training.html',
    '#approach': 'market-research.html#approach',
    '#showcase': 'market-research.html#showcase',
    '#standards': 'market-research.html#standards'
  };
  var target = paths[location.hash];
  if (!target) return;
  var parts = target.split('#');
  location.replace('/' + parts[0] + location.search + (parts[1] ? '#' + parts[1] : ''));
})();
