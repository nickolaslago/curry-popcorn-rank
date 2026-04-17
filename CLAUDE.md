# curry-popcorn-rank

Steph Curry's NBA arena popcorn rankings (NYT 2019), visualized with Observable Framework.

## Stack
- [Observable Framework](https://observablehq.com/framework/) — static site generator for data apps
- Chart.js — charting library (imported via `npm:chart.js`)
- Data: `src/data/popcorn.csv`

## Commands
- `npm run dev` — start dev server (hot reload)
- `npm run build` — build to `dist/`

## Deploy
Cloudflare Pages — build command `npm run build`, output dir `dist`.

## Component system
- All reusable UI lives in `src/components/`
- Typography: `src/components/typography.js` (H1Title, H2Title, Description, Text)
- Media: `src/components/media.js` (Image with fallback)
- Layout: `src/components/layout.js` (CardContainer)
- Charts: `src/components/charts/StackedBarChart.js` and `src/components/charts/RadarChart.js`
- Filters: `src/components/filters/Dropdown.js`
- When adding new pages, import from these components rather than writing inline styles or inline chart code
- Chart.js is the charting library (not D3, not Plot) — import via `npm:chart.js`
- `theme.css` holds all design tokens — never hardcode colors or fonts; always reference CSS variables (e.g. `var(--color-freshness)`)
- Do not use Observable's reactive `Inputs` — components use plain JS event listeners so they remain portable
