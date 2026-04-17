---
theme: dashboard
---

<link rel="stylesheet" href="theme.css">

```js
import * as d3 from "npm:d3";
```

```js
const popcorn = await FileAttachment("data/popcorn.csv").csv({typed: true});
const categories = ["freshness", "saltiness", "crunchiness", "butter", "presentation"];
const categoryColors = {
  freshness: getComputedStyle(document.documentElement).getPropertyValue("--color-freshness").trim() || "#f5c842",
  saltiness: getComputedStyle(document.documentElement).getPropertyValue("--color-saltiness").trim() || "#e8a020",
  crunchiness: getComputedStyle(document.documentElement).getPropertyValue("--color-crunchiness").trim() || "#d4701a",
  butter: getComputedStyle(document.documentElement).getPropertyValue("--color-butter").trim() || "#f0e080",
  presentation: getComputedStyle(document.documentElement).getPropertyValue("--color-presentation").trim() || "#c85a10"
};
const textPrimary = getComputedStyle(document.documentElement).getPropertyValue("--color-text-primary").trim() || "#f5e6c8";
const textMuted = getComputedStyle(document.documentElement).getPropertyValue("--color-text-muted").trim() || "#8a6d3b";
const borderColor = getComputedStyle(document.documentElement).getPropertyValue("--color-border").trim() || "#5c3d1e";
```

```js
const teamsSorted = [...popcorn].sort((a, b) => d3.ascending(a.team, b.team));
const teamNames = teamsSorted.map(d => d.team);
const teamsByName = new Map(popcorn.map(d => [d.team, d]));
```

```js
const nbaTeamIds = {
  "Atlanta Hawks": "1610612737",
  "Boston Celtics": "1610612738",
  "Brooklyn Nets": "1610612751",
  "Charlotte Hornets": "1610612766",
  "Chicago Bulls": "1610612741",
  "Cleveland Cavaliers": "1610612739",
  "Dallas Mavericks": "1610612742",
  "Denver Nuggets": "1610612743",
  "Detroit Pistons": "1610612765",
  "Golden State Warriors": "1610612744",
  "Houston Rockets": "1610612745",
  "Indiana Pacers": "1610612754",
  "Los Angeles Clippers/Lakers": "1610612747",
  "Memphis Grizzlies": "1610612763",
  "Miami Heat": "1610612748",
  "Milwaukee Bucks": "1610612749",
  "Minnesota Timberwolves": "1610612750",
  "New Orleans Pelicans": "1610612740",
  "New York City Knicks": "1610612752",
  "Oklahoma City Thunder": "1610612760",
  "Orlando Magic": "1610612753",
  "Philadelphia Sixers": "1610612755",
  "Phoenix Suns": "1610612756",
  "Portland Trailblazers": "1610612757",
  "Sacramento Kings": "1610612758",
  "San Antonio Spurs": "1610612759",
  "Toronto Raptors": "1610612761",
  "Utah Jazz": "1610612762",
  "Washington Wizards": "1610612764"
};

function teamInitials(name) {
  return name
    .split(/[\s/]+/)
    .filter(Boolean)
    .map(w => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function logoHTML(teamName) {
  const id = nbaTeamIds[teamName];
  const initials = teamInitials(teamName);
  if (!id) {
    return `<div class="logo-fallback">${initials}</div>`;
  }
  const url = `https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const fallback = `this.onerror=null;this.outerHTML='<div class=\\'logo-fallback\\'>${initials}</div>';`;
  return `<img src="${url}" alt="${teamName} logo" onerror="${fallback}">`;
}
```

```js
function drawSpider(container, team) {
  const size = 220;
  const margin = 34;
  const radius = (size - margin * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const levels = 5;
  const max = 5;

  const node = typeof container === "string" ? document.getElementById(container) : container;
  node.innerHTML = "";

  const svg = d3.select(node)
    .append("svg")
    .attr("class", "spider")
    .attr("width", size)
    .attr("height", size)
    .attr("viewBox", `0 0 ${size} ${size}`);

  const angleSlice = (Math.PI * 2) / categories.length;

  // grid rings
  for (let lvl = 1; lvl <= levels; lvl++) {
    svg.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", (radius / levels) * lvl)
      .attr("fill", "none")
      .attr("stroke", borderColor)
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);
  }

  // axes
  categories.forEach((cat, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x2 = cx + Math.cos(angle) * radius;
    const y2 = cy + Math.sin(angle) * radius;
    svg.append("line")
      .attr("x1", cx).attr("y1", cy)
      .attr("x2", x2).attr("y2", y2)
      .attr("stroke", borderColor)
      .attr("stroke-width", 1)
      .attr("opacity", 0.6);
  });

  // polygon points
  const points = categories.map((cat, i) => {
    const val = Math.max(0, Math.min(max, team[cat] ?? 0));
    const angle = angleSlice * i - Math.PI / 2;
    const r = (val / max) * radius;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  });

  // filled polygon with neutral low-opacity fill, solid stroke
  svg.append("polygon")
    .attr("points", points.map(p => p.join(",")).join(" "))
    .attr("fill", textPrimary)
    .attr("fill-opacity", 0.12)
    .attr("stroke", textPrimary)
    .attr("stroke-width", 2);

  // vertex dots colored per category
  categories.forEach((cat, i) => {
    svg.append("circle")
      .attr("cx", points[i][0])
      .attr("cy", points[i][1])
      .attr("r", 4)
      .attr("fill", categoryColors[cat])
      .attr("stroke", textPrimary)
      .attr("stroke-width", 1);
  });

  // labels around outside, colored per category
  categories.forEach((cat, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const lx = cx + Math.cos(angle) * (radius + 16);
    const ly = cy + Math.sin(angle) * (radius + 16);
    let anchor = "middle";
    if (Math.cos(angle) > 0.2) anchor = "start";
    else if (Math.cos(angle) < -0.2) anchor = "end";
    svg.append("text")
      .attr("x", lx)
      .attr("y", ly)
      .attr("text-anchor", anchor)
      .attr("dominant-baseline", "middle")
      .attr("fill", categoryColors[cat])
      .attr("font-size", 11)
      .attr("font-weight", 600)
      .text(cat);
  });

  return svg.node();
}
```

<div class="viz-title">
  <h1>Steph Curry's NBA Popcorn Rankings</h1>
  <p>Every NBA arena rated by the man himself — freshness, saltiness, crunchiness, butter, and presentation.</p>
</div>

<div class="viz-bar">

```js
const barData = popcorn.flatMap(d =>
  categories.map(cat => ({team: d.team, category: cat, value: d[cat], total: d.total, row: d}))
);

const teamOrder = [...popcorn].sort((a, b) => d3.descending(a.total, b.total)).map(d => d.team);

const barChart = Plot.plot({
  width: 1100,
  height: 720,
  marginLeft: 180,
  marginRight: 20,
  marginTop: 40,
  marginBottom: 50,
  style: {
    background: "transparent",
    color: textPrimary,
    fontFamily: "Inter, sans-serif",
    fontSize: "12px"
  },
  x: {
    domain: [8, 25],
    label: "Total popcorn score →",
    grid: true,
    labelAnchor: "center"
  },
  y: {
    domain: teamOrder,
    label: null
  },
  color: {
    domain: categories,
    range: categories.map(c => categoryColors[c]),
    legend: true,
    label: "Category"
  },
  marks: [
    Plot.barX(barData, {
      y: "team",
      x: "value",
      fill: "category",
      order: categories,
      title: d => `${d.team}\nfreshness: ${d.row.freshness}\nsaltiness: ${d.row.saltiness}\ncrunchiness: ${d.row.crunchiness}\nbutter: ${d.row.butter}\npresentation: ${d.row.presentation}\ntotal: ${d.total}`,
      tip: true
    }),
    Plot.ruleX([8])
  ]
});

display(barChart);
```

</div>

```js
const leftTeamInput = Inputs.select(teamNames, {value: "Dallas Mavericks", label: null});
const rightTeamInput = Inputs.select(teamNames, {value: "Los Angeles Clippers/Lakers", label: null});
const leftTeamName = Generators.input(leftTeamInput);
const rightTeamName = Generators.input(rightTeamInput);
```

<div class="compare-grid">
  <div class="compare-col" id="left-col">
    <div class="compare-dropdown" id="left-dropdown"></div>
    <div class="team-info" id="left-info"></div>
    <div class="compare-sub">
      <div class="spider-slot" id="left-spider"></div>
      <div class="logo-slot" id="left-logo"></div>
    </div>
  </div>
  <div class="compare-center">×</div>
  <div class="compare-col" id="right-col">
    <div class="compare-dropdown" id="right-dropdown"></div>
    <div class="team-info" id="right-info"></div>
    <div class="compare-sub mirrored">
      <div class="logo-slot" id="right-logo"></div>
      <div class="spider-slot" id="right-spider"></div>
    </div>
  </div>
</div>

```js
// Mount dropdowns once
document.getElementById("left-dropdown").replaceChildren(leftTeamInput);
document.getElementById("right-dropdown").replaceChildren(rightTeamInput);
```

```js
// Left column: reacts only to leftTeamName
{
  const team = teamsByName.get(leftTeamName);
  const info = document.getElementById("left-info");
  info.innerHTML = `<div class="team-name">${team.team}</div><div class="team-arena">${team.arena}</div>`;

  drawSpider(document.getElementById("left-spider"), team);

  document.getElementById("left-logo").innerHTML = logoHTML(team.team);
}
```

```js
// Right column: reacts only to rightTeamName
{
  const team = teamsByName.get(rightTeamName);
  const info = document.getElementById("right-info");
  info.innerHTML = `<div class="team-name">${team.team}</div><div class="team-arena">${team.arena}</div>`;

  drawSpider(document.getElementById("right-spider"), team);

  document.getElementById("right-logo").innerHTML = logoHTML(team.team);
}
```
