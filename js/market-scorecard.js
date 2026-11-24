/* Interactive market screening model from the Latin America Market Scorecard. */
(function () {
  "use strict";
  // One row per indicator. Values follow the order in COUNTRIES.
  const INDICATORS = [
    ["PO01", "Political stability and absence of violence (WGI) [Score 0-100]", "H", [68.4, 58.87, 68.6, 48.911, 54.95, 88.39]],
    ["PO02", "Government effectiveness (WGI) [Score 0-100]", "H", [58, 51.61, 73.68, 50.431, 48.65, 70]],
    ["PO03", "Corruption Perceptions Index [Score 0-100]", "H", [36, 35, 63, 37, 27, 73]],
    ["PO04", "OECD country risk classification [Category 0-7]", "L", [7, 4, 0, 4, 3, 3]],
    ["PO05", "Global Peace Index [Score 1-5]", "L", [1.922, 2.33, 1.826, 2.74, 2.65, 1.75]],
    ["EC01", "GDP per capita, PPP [Int. $]", "H", [32587, 23433.3, 37774.1, 22640.42, 25868.5, 38314.9]],
    ["EC02", "Inflation, consumer prices [Annual %]", "L", [31.5, 5, 4.2, 5.14, 3.8, 4.7]],
    ["EC03", "Real GDP growth [Annual %]", "H", [4.4, 2.3, 2.5, 2.64, 0.6, 1.8]],
    ["EC04", "GDP, current US$ [US$ bn]", "H", [683.1, 2279.92, 357.371, 457.41, 1830, 85.348]],
    ["EC05", "Exchange-rate change against US$ [Annual %]", "L", [35.7, 3.7, 0.82, -0.52, 19.24, 2.44]],
    ["EC06", "Trade openness [% of GDP]", "H", [30.4, 35, 65, 35.37, 80, 49.72]],
    ["EC07", "Unemployment rate [% of labour force]", "L", [7.1, 6, 9, 8.29, 2.7, 7.52]],
    ["EC08", "FDI, net inflows [% of GDP]", "H", [0.6, 3.4, 4.1, 2.53, 2.4, 2.28]],
    ["EC09", "Imports of roasted coffee, HS 0901.21 [US$ thousand]", "H", [50211.05, 87663.46, 71800.26, 3371.19, 72143.39, 7541.53]],
    ["EC10", "Coffee market size, retail value [US$ m]", "H", [960.1, 13041.5, 654.2, 1057.03, 3126.35, 152.7]],
    ["SO01", "Coffee consumption per capita [kg/person/year]", "H", [2.51, 5.03, 1.41, 1.44, 0.83, 2.45]],
    ["SO02", "Out-of-home coffee consumption [kg/person/year]", "H", [0.1, 0.82, 0.07, 0.23, 0.05, 0.19]],
    ["SO03", "Urban population [% of population]", "H", [92.4, 88, 89.2, 78.78, 80.04, 96]],
    ["SO04", "Population in cities above 1 million [% of population]", "H", [44.2, 44, 35.2, 44.54, 42.66, 53]],
    ["SO05", "International tourist arrivals [arrivals/year]", "H", [7399000, 6353000, 5431000, 4531000, 97406000, 3480000]],
    ["SO06", "Share of tourist arrivals from Europe [% of arrivals]", "H", [13, 22.2, 7.34, 15, 8.72, 5.52]],
    ["SO07", "European-born residents [% of population]", "H", [0.32, 0.1312, 0.26, 0.07, 0.05, 1.28]],
    ["SO08", "Human Development Index [Index 0-1]", "H", [0.865, 0.786, 0.878, 0.788, 0.789, 0.862]],
    ["SO09", "Cultural distance from Austria, Hofstede [mean abs. difference]", "L", [21.17, 21.83, 30.83, 31.67, 31.17, 30.67]],
    ["SO10", "Gini index [Index 0-100]", "L", [42.4, 50.3, 43, 54.4, 42.6, 40]],
    ["TE01", "Individuals using the Internet [% of population]", "H", [89.7, 84, 96, 79.35, 83.12, 92]],
    ["TE02", "Fixed broadband subscriptions [per 100 people]", "H", [26.1, 24.08, 23.73, 17.22, 21.74, 33.04]],
    ["TE03", "Mobile cellular subscriptions [per 100 people]", "H", [140.23, 102, 133, 174.09, 116.49, 146]],
    ["TE04", "4G mobile network coverage [% of population]", "H", [97.68, 93.3, 96, 100, 97.8, 93.9]],
    ["TE05", "Secure Internet servers [per 1 million people]", "H", [5453, 6941, 11913, 1126.21, 531.66, 4641]],
    ["TE06", "Account ownership [% of adults 15+]", "H", [81.74, 86.38, 85.07, 57.06, 53.03, 73.75]],
    ["TE07", "Logistics Performance Index, overall [Score 1-5]", "H", [2.8, 3.2, 3, 2.9, 2.9, 3]],
    ["TE08", "Container port traffic [TEU]", "H", [1471434, 13893906, 4474125, 5188127, 9284170, 1115000]],
    ["TE09", "Liner Shipping Connectivity Index [Q1 2023 = 100]", "H", [110.93, 165.08, 107.75, 211.24, 201.12, 96.41]],
    ["TE10", "Global Innovation Index [Score 0-100]", "H", [26.8, 32.9, 33.1, 28.5, 30.5, 28.8]],
    ["EN01", "ND-GAIN Country Index [Score 0-100]", "H", [49.6, 50.7, 60.1, 50.5, 47.6, 52]],
    ["EN02", "Renewable energy consumption [% of final energy]", "H", [9.2, 50.2, 24.2, 29.7, 13, 57.8]],
    ["EN03", "Environmental Performance Index [Score 0-100]", "H", [46.06, 48.27, 50.95, 48.83, 46.09, 36.91]],
    ["EN04", "Water stress [% of freshwater withdrawn]", "L", [10, 1.4, 8.98, 3.63, 44.95, 12.05]],
    ["EN05", "Forest area [% of land area]", "H", [17.1, 58.2, 24.5, 53.71, 34.2, 11.5]],
    ["LE01", "Regulatory quality (WGI) [Score 0-100]", "H", [53.9, 47.89, 66.44, 52.099, 51.5, 65]],
    ["LE02", "Rule of law (WGI) [Score 0-100]", "H", [56.9, 50.63, 69.84, 48.28, 39.4, 74.11]],
    ["LE03", "Applied tariff on roasted coffee from the EU [%]", "L", [8.1, 8.1, 0, 0, 45, 8.1]],
    ["LE04", "Intellectual property rights, IPRI [Score 0-10]", "H", [4.348, 4.99, 6.03, 4.779, 4.326, 5.636]],
    ["LE05", "Customs clearance efficiency, LPI [Score 1-5]", "H", [2.7, 2.9, 3, 2.5, 2.5, 2.9]],
  ];

  function model(weights, mode) {
    const norm = INDICATORS.map(([, , direction, values]) => {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const mean = values.reduce((sum, value) => sum + value) / values.length;
      const sd = Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
      const lowerIsBetter = direction === "L";
      const sign = lowerIsBetter ? -1 : 1;
      return {
        mm: values.map((value) => {
          if (max === min) return 50;
          const distance = lowerIsBetter ? max - value : value - min;
          return 100 * distance / (max - min);
        }),
        t: values.map((value) => sd ? 50 + 10 * sign * (value - mean) / sd : 50),
      };
    });
    const dim = DIMS.map(([code]) => {
      const indices = INDICATORS.map(([id], i) => id.startsWith(code) ? i : -1).filter((i) => i >= 0);
      return COUNTRIES.map(
        (_, country) => indices.reduce((sum, i) => sum + norm[i][mode][country], 0) / indices.length,
      );
    });
    const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
    const contrib = dim.map((scores, i) => scores.map((score) => score * weights[i] / weightTotal));
    const total = COUNTRIES.map((_, country) => contrib.reduce((sum, scores) => sum + scores[country], 0));
    const rank = total.map((score) => 1 + total.filter((other) => other > score + 1e-9).length);
    return { norm, dim, contrib, total, rank };
  }

  const COUNTRIES = ["Argentina", "Brazil", "Chile", "Colombia", "Mexico", "Uruguay"];
  const DIMS = [
    ["PO", "Political"],
    ["EC", "Economic"],
    ["SO", "Social"],
    ["TE", "Technological"],
    ["EN", "Environmental"],
    ["LE", "Legal"],
  ];
  const PRESETS = {
    Baseline: [15, 25, 25, 10, 5, 20],
    Equal: [17, 17, 17, 17, 16, 16],
    "Economy-led": [10, 40, 20, 10, 5, 15],
    "Access-led": [20, 15, 15, 5, 5, 40],
    "Society-led": [10, 20, 40, 10, 5, 15],
  };
  let weights = [...PRESETS.Baseline],
    mode = "mm",
    selectedIndicator = 42,
    focus = null;
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
  const fmt = (v) =>
    Math.abs(v) >= 1e6
      ? (v / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 2 }) + " m"
      : Math.abs(v) >= 1000
        ? v.toLocaleString("en-GB", { maximumFractionDigits: 0 })
        : v
            .toLocaleString("en-GB", { maximumFractionDigits: 3 })
            .replace("-", "−");
  const split = (n) => {
    const m = n.match(/^(.*?)\s*\[(.*)\]$/);
    return m ? [m[1], m[2]] : [n, ""];
  };
  const tip = $("tip");
  function showTip(e, h) {
    tip.innerHTML = h;
    tip.hidden = false;
    const x = Math.min(e.clientX + 14, innerWidth - 280),
      y = e.clientY + 14;
    tip.style.left = x + "px";
    tip.style.top =
      (y + tip.offsetHeight > innerHeight
        ? e.clientY - tip.offsetHeight - 10
        : y) + "px";
  }
  function hideTip() {
    tip.hidden = true;
  }
  const activePreset = () =>
    Object.keys(PRESETS).find((k) => PRESETS[k].every((v, i) => v === weights[i]));
  const effectiveWeights = () => (weights.reduce((a, b) => a + b, 0) ? weights : [1, 1, 1, 1, 1, 1]);
  $("presets").innerHTML = Object.keys(PRESETS)
    .map((k) => `<button class="seg" data-p="${k}">${k}</button>`)
    .join("");
  $("presets").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    weights = [...PRESETS[b.dataset.p]];
    DIMS.forEach(([k], i) => {
      $("w-" + k).value = weights[i];
    });
    render();
  });
  $("sliders").innerHTML = DIMS.map(
    ([k, n], i) =>
      `<div class="sl"><label for="w-${k}">${n}</label><input type="range" id="w-${k}" min="0" max="60" step="1" value="${weights[i]}" data-i="${i}"><span class="v" id="v-${k}"></span></div>`,
  ).join("");
  $("sliders").addEventListener("input", (e) => {
    if (e.target.dataset.i == null) return;
    weights[+e.target.dataset.i] = +e.target.value;
    render();
  });
  ["mm", "t"].forEach((m) =>
    $("m-" + m).addEventListener("click", () => {
      mode = m;
      render();
    }),
  );
  function render() {
    hideTip();
    const effective = effectiveWeights(),
      tot = effective.reduce((a, b) => a + b, 0);
    DIMS.forEach(([k], i) => {
      $("v-" + k).textContent = Math.round((100 * effective[i]) / tot) + "%";
    });
    const ap = activePreset();
    document
      .querySelectorAll("#presets button")
      .forEach((b) =>
        b.setAttribute("aria-pressed", b.dataset.p === ap ? "true" : "false"),
      );
    $("m-mm").setAttribute("aria-pressed", mode === "mm");
    $("m-t").setAttribute("aria-pressed", mode === "t");
    const r = model(effective, mode),
      order = [...COUNTRIES.keys()].sort((a, b) => r.total[b] - r.total[a]);
    if (focus === null) focus = order[0];
    $("verdict").innerHTML = order
      .map(
        (c, j) =>
          `<span class="pill${j === 0 ? " top" : ""}"><span class="r">#${r.rank[c]}</span>${COUNTRIES[c]}<span class="s">${r.total[c].toFixed(1)}</span></span>`,
      )
      .join("");
    const gap = r.total[order[0]] - r.total[order[1]];
    $("t-bars").textContent =
      `${COUNTRIES[order[0]]} leads ${COUNTRIES[order[1]]} by ${gap.toFixed(1)} points`;
    $("s-bars").textContent =
      `Weighted score, ${mode === "mm" ? "0–100 (min-max: 0 = weakest, 100 = best of six)" : "T-score basis (50 = average of six)"} · ${ap ? ap + " weights" : "your weights"}`;
    drawBars(r, order);
    drawTable(r, order);
    drawDrivers(r);
    drawRob();
    drawHeat(r);
    drawDetail(r);
  }
  function drawBars(r, order) {
    const w = Math.max(380, $("bars").clientWidth || 560),
      L = 88,
      R = 46,
      rowH = 36,
      top = 20,
      h = top + rowH * 6 + 6,
      max = mode === "mm" ? 100 : 70,
      x = (v) => L + ((w - L - R) * v) / max;
    const ticks = mode === "mm" ? [0, 25, 50, 75, 100] : [0, 20, 40, 60];
    let s = `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Weighted score by country">`;
    ticks.forEach((t) => {
      s += `<line class="gl" x1="${x(t)}" x2="${x(t)}" y1="${top - 4}" y2="${h - 4}"/><text x="${x(t)}" y="${top - 8}" text-anchor="middle">${t}</text>`;
    });
    order.forEach((c, j) => {
      const y = top + j * rowH + 6,
        bh = rowH - 14,
        bw = Math.max(0, x(r.total[c]) - x(0));
      s += `<text class="country" x="${L - 10}" y="${y + bh / 2 + 4}" text-anchor="end">${COUNTRIES[c]}</text><rect tabindex="0" x="${x(0)}" y="${y}" width="${bw}" height="${bh}" rx="4" class="bar mark${c === focus ? "" : " dim"}" data-c="${c}"/><text class="val" x="${x(0) + bw + 6}" y="${y + bh / 2 + 4}">${r.total[c].toFixed(1)}</text>`;
    });
    $("bars").innerHTML = s + "</svg>";
    $("bars")
      .querySelectorAll("rect.bar")
      .forEach((el) => {
        const c = +el.dataset.c;
        el.addEventListener("click", () => {
          focus = c;
          render();
        });
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            focus = c;
            render();
            $("bars").querySelector(`[data-c="${c}"]`).focus();
          }
        });
        el.addEventListener("mousemove", (e) =>
          showTip(
            e,
            `<b>${COUNTRIES[c]}</b> · rank ${r.rank[c]}<br>` +
              DIMS.map(([k, n], i) => `${n}: ${r.dim[i][c].toFixed(1)}`).join(
                "<br>",
              ),
          ),
        );
        el.addEventListener("mouseleave", hideTip);
      });
  }
  function drawDrivers(r) {
    const c = focus,
      w = Math.max(340, $("drivers").clientWidth || 420),
      L = 104,
      R = 44,
      rowH = 34,
      top = 20,
      h = top + rowH * 6 + 6,
      x = (v) => L + ((w - L - R) * v) / 100;
    const best = [...DIMS.keys()].sort(
      (a, b) => r.contrib[b][c] - r.contrib[a][c],
    )[0];
    $("t-drv").textContent = `${DIMS[best][1]} adds most to ${COUNTRIES[c]}’s score`;
    $("s-drv").textContent =
      `Score per PESTEL dimension, 0–100${mode === "t" ? " (T-score basis)" : ""}; the label gives the dimension’s weight and its points in the total`;
    const tot = effectiveWeights().reduce((a, b) => a + b, 0);
    let s = `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Dimension scores for ${COUNTRIES[c]}">`;
    [0, 50, 100].forEach((t) => {
      s += `<line class="gl" x1="${x(t)}" x2="${x(t)}" y1="${top - 4}" y2="${h - 4}"/><text x="${x(t)}" y="${top - 8}" text-anchor="middle">${t}</text>`;
    });
    DIMS.forEach(([k, n], i) => {
      const y = top + i * rowH + 6,
        bh = rowH - 14,
        v = r.dim[i][c],
        bw = Math.max(0, x(Math.min(v, 100)) - x(0));
      s += `<text class="country" x="${L - 10}" y="${y + bh / 2 + 4}" text-anchor="end">${n}</text><rect x="${x(0)}" y="${y}" width="${bw}" height="${bh}" rx="4" class="mark${i === best ? "" : " dim"}"/><text class="val" x="${x(0) + bw + 6}" y="${y + bh / 2 + 4}">${v.toFixed(0)}</text>`;
    });
    $("drivers").innerHTML = s + "</svg>";
    $("c-drv").textContent =
      `${COUNTRIES[c]}: total ${r.total[c].toFixed(1)}, rank ${r.rank[c]} of 6. Points in the total: ` +
      DIMS.map(
        ([k, n], i) =>
          `${n} ${r.contrib[i][c].toFixed(1)} (${Math.round((100 * effectiveWeights()[i]) / tot)}%)`,
      ).join(", ") +
      ".";
  }
  function drawTable(r, order) {
    $("bartable").innerHTML =
      `<thead><tr><th scope="col" class="num">Rank</th><th scope="col">Country</th>${DIMS.map((d) => `<th scope="col" class="num">${d[1]}</th>`).join("")}<th scope="col" class="num">Total</th></tr></thead><tbody>` +
      order
        .map(
          (c) =>
            `<tr><td class="num">${r.rank[c]}</td><td>${COUNTRIES[c]}</td>${DIMS.map((_, i) => `<td class="num">${r.dim[i][c].toFixed(1)}</td>`).join("")}<td class="num"><b>${r.total[c].toFixed(1)}</b></td></tr>`,
        )
        .join("") +
      "</tbody>";
  }
  const ramp = (k) =>
    ["ramp-5", "ramp-4", "ramp-3", "ramp-2", "ramp-1", "ramp-1"][k - 1];
  function drawRob() {
    const ap = activePreset(),
      cols = Object.entries(PRESETS).map(([k, w]) => [k, model(w, mode).rank]);
    if (!ap) cols.push(["Your weights", model(effectiveWeights(), mode).rank]);
    const ord0 = [...COUNTRIES.keys()].sort((a, b) => cols[0][1][a] - cols[0][1][b]);
    const lead = ord0[0],
      firsts = cols.filter((x) => x[1][lead] === 1).length;
    const fixed = COUNTRIES.map((_, c) => new Set(cols.map((x) => x[1][c])).size === 1);
    const stable = COUNTRIES.filter((_, c) => fixed[c]);
    $("h-rob").textContent =
      `${COUNTRIES[lead]} ranks first under ${firsts} of ${cols.length} weight sets` +
      (stable.length
        ? `. ${stable.join(" and ")} never move${stable.length === 1 ? "s" : ""}`
        : "");
    $("rob").innerHTML =
      `<thead><tr><th scope="col">Country</th>${cols.map(([k]) => `<th scope="col" class="num">${esc(k)}</th>`).join("")}<th scope="col" class="num">Rank range</th></tr></thead><tbody>` +
      ord0
        .map((c) => {
          const rs = cols.map((x) => x[1][c]),
            mn = Math.min(...rs),
            mx = Math.max(...rs);
          return `<tr><td><b>${COUNTRIES[c]}</b></td>${rs.map((k) => `<td class="num"><span class="rk ${ramp(k)}">${k}</span></td>`).join("")}<td class="num">${mn === mx ? mn : mn + "–" + mx}</td></tr>`;
        })
        .join("") +
      "</tbody>";
  }
  const heat = (v) => {
    const s = mode === "mm" ? v : Math.max(0, Math.min(100, (v - 30) * 2.5));
    return s >= 80
      ? "ramp-5"
      : s >= 60
        ? "ramp-4"
        : s >= 40
          ? "ramp-3"
          : s >= 20
            ? "ramp-2"
            : "ramp-1";
  };
  function drawHeat(r) {
    let h = `<thead><tr><th scope="col"></th><th scope="col"></th>${COUNTRIES.map((c) => `<th scope="col">${c.slice(0, 3).toUpperCase()}</th>`).join("")}</tr></thead><tbody>`,
      prev = "";
    INDICATORS.forEach(([id, n], i) => {
      const g = id.slice(0, 2);
      if (prev && g !== prev) h += '<tr class="gap"><td colspan="8"></td></tr>';
      prev = g;
      h +=
        `<tr class="${i === selectedIndicator ? "sel" : ""}" data-i="${i}"><td class="id">${id}</td><td class="nm" title="${esc(split(n)[0])}">${esc(split(n)[0])}</td>` +
        r.norm[i][mode]
          .map((v, c) => {
            const bg = heat(v);
            return `<td class="c ${bg}" tabindex="0" data-i="${i}" data-c="${c}">${Math.round(v)}</td>`;
          })
          .join("") +
        "</tr>";
    });
    $("hm").innerHTML = h + "</tbody>";
  }
  $("hm").addEventListener("click", (e) => {
    const tr = e.target.closest("tr[data-i]");
    if (tr) {
      selectedIndicator = +tr.dataset.i;
      render();
    }
  });
  $("hm").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const td = e.target.closest("td[data-i]");
      if (td) {
        selectedIndicator = +td.dataset.i;
        render();
        $("hm").querySelector(`td[data-i="${td.dataset.i}"][data-c="${td.dataset.c}"]`).focus();
      }
    }
  });
  $("hm").addEventListener("mousemove", (e) => {
    const td = e.target.closest("td.c");
    if (!td) return hideTip();
    const i = +td.dataset.i,
      c = +td.dataset.c,
      [nm, u] = split(INDICATORS[i][1]);
    showTip(
      e,
      `<b>${COUNTRIES[c]} · ${INDICATORS[i][0]}</b><br>${esc(nm)}<br>Value ${fmt(INDICATORS[i][3][c])} ${esc(u)}<br>${INDICATORS[i][2] === "L" ? "Lower" : "Higher"} is better · score ${td.textContent}`,
    );
  });
  $("hm").addEventListener("mouseleave", hideTip);
  function drawDetail(r) {
    const [id, n, dir, v] = INDICATORS[selectedIndicator],
      [nm, u] = split(n),
      mn = Math.min(...v),
      mx = Math.max(...v),
      w = 420,
      L = 14,
      R = 14,
      y = 46,
      x = (val) =>
        mx === mn ? w / 2 : L + ((w - L - R) * (val - mn)) / (mx - mn);
    const best = dir === "L" ? mn : mx;
    const grp = {};
    COUNTRIES.forEach((c, i) => {
      (grp[v[i]] = grp[v[i]] || []).push(c.slice(0, 3));
    });
    let s = `<svg viewBox="0 0 ${w} 96" width="100%" role="img" aria-label="Raw values of ${esc(nm)}"><line class="gl" x1="${L}" x2="${w - R}" y1="${y}" y2="${y}"/>`;
    Object.keys(grp)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((val, j) => {
        const px = x(val),
          anc = px < 60 ? "start" : px > w - 60 ? "end" : "middle";
        s += `<circle cx="${px}" cy="${y}" r="6" class="mark${val === best ? "" : " dim"} raw-dot"/><text x="${px}" y="${j % 2 ? y + 26 : y - 14}" text-anchor="${anc}">${grp[val].join(" · ")}</text>`;
      });
    s += `<text x="${L}" y="${y + 44}">${esc(fmt(mn))}</text><text x="${w - R}" y="${y + 44}" text-anchor="end">${esc(fmt(mx))}</text></svg>`;
    $("detail").innerHTML =
      `<div class="kicker">${id} · ${DIMS.find((d) => id.startsWith(d[0]))[1]}</div><div class="ctitle">${esc(nm)}</div><div class="csub">${esc(u)} · ${dir === "L" ? "lower is better" : "higher is better"} · best value in blue</div>${s}
   <div class="tw"><table><thead><tr><th scope="col">Country</th><th scope="col" class="num">Value</th><th scope="col" class="num">Min-max</th><th scope="col" class="num">T-score</th></tr></thead><tbody>${COUNTRIES.map((c, i) => `<tr><td>${c}</td><td class="num">${fmt(v[i])}</td><td class="num">${r.norm[selectedIndicator].mm[i].toFixed(0)}</td><td class="num">${r.norm[selectedIndicator].t[i].toFixed(0)}</td></tr>`).join("")}</tbody></table></div>
   <p class="note">Min-max puts the weakest of the six at 0 and the best at 100, however small the gap. T-scores keep the real distances: 50 is the average, 60 is one standard deviation better.</p>`;
  }
  let rt;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(render, 150);
  });
  render();
})();
