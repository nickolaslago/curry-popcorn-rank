---
theme: dashboard
---

<link rel="stylesheet" href="theme.css">

```js
import { H1Title, H2Title, Description } from "./components/typography.js";
import { Image as TeamImage } from "./components/media.js";
import { CardContainer } from "./components/layout.js";
import { StackedBarChart } from "./components/charts/StackedBarChart.js";
import { RadarChart } from "./components/charts/RadarChart.js";
import { Dropdown } from "./components/filters/Dropdown.js";
```

```js
const popcorn = await FileAttachment("data/popcorn.csv").csv({typed: true});
const teamsByName = new Map(popcorn.map(d => [d.team, d]));
const teamNames = [...popcorn].sort((a, b) => a.team.localeCompare(b.team)).map(d => d.team);

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

function logoSrc(teamName) {
  const id = nbaTeamIds[teamName];
  return id ? `https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg` : "";
}
```

```js
// Row 1: title + description
const row1 = document.createElement("div");
row1.style.textAlign = "center";
row1.style.padding = "var(--gap-lg) 0";
row1.style.borderBottom = "1px solid var(--color-border)";
row1.style.marginBottom = "var(--gap-lg)";
row1.style.display = "flex";
row1.style.flexDirection = "column";
row1.style.alignItems = "center";
row1.style.gap = "var(--gap-md)";
row1.appendChild(H1Title("Steph Curry's NBA Popcorn Rankings"));
row1.appendChild(Description("Every NBA arena rated by the man himself — freshness, saltiness, crunchiness, butter, and presentation."));
display(row1);
```

```js
// Row 2: stacked bar chart with all teams
display(StackedBarChart(popcorn));
```

```js
// Row 3: three-column comparison layout (45% / 10% / 45%)
function buildCompareColumn(defaultTeam, mirrored) {
  const col = document.createElement("div");
  col.style.display = "flex";
  col.style.flexDirection = "column";
  col.style.gap = "var(--gap-md)";

  const titleSlot = document.createElement("div");
  titleSlot.appendChild(H2Title(defaultTeam));
  titleSlot.appendChild(Description(teamsByName.get(defaultTeam).arena));

  const radarSlot = document.createElement("div");
  radarSlot.style.display = "flex";
  radarSlot.style.alignItems = "center";
  radarSlot.style.justifyContent = "center";
  radarSlot.style.minHeight = "220px";
  radarSlot.appendChild(RadarChart(teamsByName.get(defaultTeam)));

  const imageSlot = document.createElement("div");
  imageSlot.style.display = "flex";
  imageSlot.style.alignItems = "center";
  imageSlot.style.justifyContent = "center";
  imageSlot.style.minHeight = "220px";
  imageSlot.appendChild(TeamImage(logoSrc(defaultTeam), defaultTeam, {height: 180, width: "100%"}));

  const cardRow = document.createElement("div");
  cardRow.style.display = "grid";
  cardRow.style.gridTemplateColumns = "1fr 1fr";
  cardRow.style.gap = "var(--gap-md)";
  cardRow.style.alignItems = "center";
  if (mirrored) {
    cardRow.appendChild(imageSlot);
    cardRow.appendChild(radarSlot);
  } else {
    cardRow.appendChild(radarSlot);
    cardRow.appendChild(imageSlot);
  }

  const card = CardContainer([cardRow]);

  const dropdown = Dropdown(teamNames, defaultTeam, (team) => {
    const data = teamsByName.get(team);
    titleSlot.replaceChildren(H2Title(team), Description(data.arena));
    radarSlot.replaceChildren(RadarChart(data));
    imageSlot.replaceChildren(TeamImage(logoSrc(team), team, {height: 180, width: "100%"}));
  });

  col.appendChild(dropdown);
  col.appendChild(titleSlot);
  col.appendChild(card);
  return col;
}

const grid = document.createElement("div");
grid.style.display = "grid";
grid.style.gridTemplateColumns = "45fr 10fr 45fr";
grid.style.gap = "var(--gap-md)";
grid.style.alignItems = "start";

const center = document.createElement("div");
center.textContent = "×";
center.style.display = "flex";
center.style.alignItems = "center";
center.style.justifyContent = "center";
center.style.minHeight = "400px";
center.style.fontFamily = "var(--font-title)";
center.style.color = "var(--color-text-secondary)";
center.style.fontSize = "4rem";
center.style.fontWeight = "300";

grid.appendChild(buildCompareColumn("Dallas Mavericks", false));
grid.appendChild(center);
grid.appendChild(buildCompareColumn("Los Angeles Clippers/Lakers", true));

display(grid);
```
