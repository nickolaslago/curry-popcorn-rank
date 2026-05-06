---
theme: dashboard
---

<link rel="stylesheet" href="theme.css">

```js
import { RadarChart } from "./components/charts/RadarChart.js";
```

```js
const popcorn = await FileAttachment("data/popcorn.csv").csv({typed: true});
const ranked = [...popcorn].sort((a, b) => b.total - a.total);
const teamsByName = new Map(ranked.map(d => [d.team, d]));
const rankByTeam = new Map(ranked.map((d, i) => [d.team, i + 1]));
const teamNamesAlpha = [...ranked].sort((a, b) => a.team.localeCompare(b.team)).map(d => d.team);

const CATEGORIES = [
  {key: "freshness",    label: "Freshness",    color: "#F5E060"},
  {key: "saltiness",    label: "Saltiness",    color: "#F5B93C"},
  {key: "crunchiness",  label: "Crunchiness",  color: "#E07B1A"},
  {key: "butter",       label: "Butter",       color: "#C25A0F"},
  {key: "presentation", label: "Presentation", color: "#8B3010"}
];

const MAX_TOTAL = 25;

function tierClass(rank) {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return "";
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") node.className = v;
    else if (k === "style") Object.assign(node.style, v);
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}
```

```js
// ── HERO ──
const hero = el("section", {class: "hero"}, [
  el("div", {class: "hero-left"}, [
    el("div", {class: "eyebrow"}, [
      el("span", {class: "eyebrow-dot"}),
      el("span", {class: "eyebrow-text"}, "NBA Arena Report")
    ]),
    el("p", {class: "hero-pre"}, "Steph Curry rates every"),
    el("h1", {class: "hero-title", html: 'Popcorn <span class="accent">Rankings</span>'}),
    el("p", {class: "hero-sub"}, "30 arenas. 5 categories. One very important question: whose popcorn actually slaps?")
  ]),
  el("div", {class: "hero-stat"}, [
    el("div", {class: "hero-stat-num"}, "30"),
    el("div", {class: "hero-stat-label"}, "Arenas Rated")
  ])
]);
display(hero);
```

```js
// ── LEGEND ──
const legend = el("div", {class: "legend"}, [
  el("span", {class: "legend-label"}, "Categories"),
  ...CATEGORIES.map(c =>
    el("span", {class: "legend-item"}, [
      el("span", {class: "legend-dot", style: {background: c.color}}),
      c.label
    ])
  )
]);
display(legend);
```

```js
// ── RANKINGS LIST ──
const rankingsHead = el("div", {class: "section-head"}, [
  el("h2", {class: "section-title"}, "Full Rankings"),
  el("span", {class: "section-kicker"}, "All 30 · sorted by total")
]);
display(rankingsHead);

const rankings = el("div", {class: "rankings"});
ranked.forEach((d, i) => {
  const rank = i + 1;
  const tier = tierClass(rank);

  const segments = CATEGORIES.map(c =>
    el("div", {
      class: "rank-seg",
      style: {
        background: c.color,
        flexGrow: String(d[c.key] || 0)
      },
      title: `${c.label}: ${d[c.key]}`
    })
  );

  const fill = el("div", {
    class: "rank-bar-fill",
    style: {width: `${(d.total / MAX_TOTAL) * 100}%`}
  }, segments);

  const row = el("div", {class: `rank-row${tier ? " " + tier : ""}`}, [
    el("div", {class: "rank-num"}, String(rank).padStart(2, "0")),
    el("div", {class: "rank-info"}, [
      el("div", {class: "rank-name"}, d.team),
      el("div", {class: "rank-arena"}, d.arena)
    ]),
    el("div", {class: "rank-bar"}, [fill]),
    el("div", {class: "rank-score"}, String(d.total))
  ]);

  rankings.appendChild(row);
});
display(rankings);
```

```js
// ── HEAD TO HEAD ──
const compareHead = el("div", {class: "section-head"}, [
  el("h2", {class: "section-title"}, "Head-to-Head"),
  el("span", {class: "section-kicker"}, "Compare any two arenas")
]);
display(compareHead);

function makeSelect(initial, onChange) {
  const wrap = el("div", {class: "versus-select"});
  const select = document.createElement("select");
  for (const name of teamNamesAlpha) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    if (name === initial) opt.selected = true;
    select.appendChild(opt);
  }
  select.addEventListener("change", (e) => onChange(e.target.value));
  wrap.appendChild(select);
  return wrap;
}

function buildCompareCard(initialTeam) {
  const card = el("div", {class: "compare-card"});

  function render(teamName) {
    card.replaceChildren();
    const d = teamsByName.get(teamName);
    const rank = rankByTeam.get(teamName);

    const head = el("div", {class: "compare-head"}, [
      el("div", {}, [
        el("span", {class: "compare-rank"}, `Rank #${rank}`),
        el("h3", {class: "compare-name"}, d.team),
        el("p", {class: "compare-arena"}, d.arena)
      ]),
      el("div", {class: "compare-score"}, [
        el("span", {class: "compare-score-num"}, String(d.total)),
        el("span", {class: "compare-score-label"}, "of 25")
      ])
    ]);

    const radarSlot = el("div", {class: "compare-radar"});
    radarSlot.appendChild(RadarChart(d, {size: 240}));

    const mini = el("div", {class: "compare-mini"},
      CATEGORIES.map(c =>
        el("div", {class: "mini-row"}, [
          el("span", {class: "mini-label"}, c.label),
          el("div", {class: "mini-track"}, [
            el("div", {
              class: "mini-fill",
              style: {
                width: `${((d[c.key] || 0) / 5) * 100}%`,
                background: c.color
              }
            })
          ]),
          el("span", {class: "mini-val"}, String(d[c.key] ?? 0))
        ])
      )
    );

    card.append(head, radarSlot, mini);
  }

  render(initialTeam);
  return {card, render};
}

const leftInitial  = ranked[0].team;
const rightInitial = ranked[ranked.length - 1].team;

const left  = buildCompareCard(leftInitial);
const right = buildCompareCard(rightInitial);

const versus = el("div", {class: "versus"}, [
  makeSelect(leftInitial,  (v) => left.render(v)),
  el("div", {class: "versus-badge"}, "VS"),
  makeSelect(rightInitial, (v) => right.render(v))
]);
display(versus);

const grid = el("div", {class: "compare-grid"}, [left.card, right.card]);
display(grid);
```
