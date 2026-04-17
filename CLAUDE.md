# curry-popcorn-rank

Steph Curry's NBA arena popcorn rankings (NYT 2019), visualized with Observable Framework.

## Stack
- [Observable Framework](https://observablehq.com/framework/) — static site generator for data apps
- Observable Plot — charting (bundled with Framework)
- Data: `src/data/popcorn.csv`

## Commands
- `npm run dev` — start dev server (hot reload)
- `npm run build` — build to `dist/`

## Deploy
Cloudflare Pages — build command `npm run build`, output dir `dist`.
