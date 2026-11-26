/* AI Advertising use case: fills the campaign figures from the same CSV the
   live dashboard reads (showcase/chatgpt-ads/results.csv, updated daily).
   The HTML carries the last known figures, so the section works without it. */
(function () {
  var box = document.getElementById('ad-kpis');
  if (!box || !window.fetch) return;

  function parseCSV(text) {
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); cell = '';
        if (row.join('') !== '') rows.push(row);
        row = [];
      } else cell += c;
    }
    row.push(cell); if (row.join('') !== '') rows.push(row);
    var head = rows.shift().map(function (h) { return h.trim(); });
    return rows.map(function (r) {
      var o = {}; head.forEach(function (h, j) { o[h] = (r[j] || '').trim(); }); return o;
    });
  }
  function num(s) { var v = parseFloat(String(s || '').replace('%', '')); return isNaN(v) ? null : v; }
  var nf = new Intl.NumberFormat('en-GB');

  fetch('showcase/chatgpt-ads/results.csv', { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (text) {
      var rows = parseCSV(text).filter(function (r) { return r.date; })
        .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      if (!rows.length) return;
      var cur = rows[rows.length - 1];
      var imp = num(cur.impressions), clk = num(cur.clicks), spend = num(cur.spend_eur), reach = num(cur.reach);
      if (imp == null || clk == null) return;
      var vals = {
        impressions: nf.format(imp),
        reach: reach == null ? '–' : nf.format(reach),
        clicks: nf.format(clk),
        ctr: imp ? (clk / imp * 100).toFixed(2) + '%' : '–',
        spend: spend == null ? '–' : '€' + spend.toFixed(2),
        cpm: spend && imp ? '€' + nf.format(Math.round(spend / imp * 1000)) : '–'
      };
      box.querySelectorAll('[data-k]').forEach(function (el) {
        var k = el.getAttribute('data-k'); if (vals[k] != null) el.textContent = vals[k];
      });
      var d = new Date(cur.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      var asof = document.getElementById('ad-asof');
      if (asof) asof.textContent = 'Totals since launch, OpenAI Ads Manager. Last check: ' + d + ', ' + cur.time +
        ' (Vienna). A small base: read these as early delivery figures, not benchmarks.';
    })
    .catch(function () { /* keep the figures in the HTML */ });
})();
