/**
 * StackedBarChart — vertical stacked bar built with Chart.js.
 * Expects rows with {team, freshness, saltiness, crunchiness, butter,
 * presentation, total} and renders one stacked bar per team, sorted by total.
 */

import Chart from "npm:chart.js/auto";

const CATEGORIES = ["freshness", "saltiness", "crunchiness", "butter", "presentation"];

function readVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export function StackedBarChart(data, options = {}) {
  const { height = 350 } = options;

  const categoryColors = {
    freshness: readVar("--color-freshness", "#f5c842"),
    saltiness: readVar("--color-saltiness", "#e8a020"),
    crunchiness: readVar("--color-crunchiness", "#d4701a"),
    butter: readVar("--color-butter", "#f0e080"),
    presentation: readVar("--color-presentation", "#c85a10")
  };
  const textPrimary = readVar("--color-text-primary", "#f5e6c8");
  const borderColor = readVar("--color-border", "#5c3d1e");
  const surfaceColor = readVar("--color-surface", "#2a1a0a");
  const fontBody = readVar("--font-body", "Inter, sans-serif");

  const sorted = [...data].sort((a, b) => b.total - a.total);
  const labels = sorted.map(d => d.team);

  const datasets = CATEGORIES.map(cat => ({
    label: cat,
    data: sorted.map(d => d[cat]),
    backgroundColor: categoryColors[cat],
    borderColor: categoryColors[cat],
    borderWidth: 0,
    _teams: sorted
  }));

  const container = document.createElement("div");
  container.style.background = "var(--color-surface)";
  container.style.border = "1px solid var(--color-border)";
  container.style.borderRadius = "var(--radius)";
  container.style.padding = "var(--gap-md)";
  container.style.width = "100%";
  container.style.boxSizing = "border-box";

  const canvasWrap = document.createElement("div");
  canvasWrap.style.position = "relative";
  canvasWrap.style.width = "100%";
  canvasWrap.style.height = typeof height === "number" ? `${height}px` : height;

  const canvas = document.createElement("canvas");
  canvasWrap.appendChild(canvas);
  container.appendChild(canvasWrap);

  const totalLabelsPlugin = {
    id: "totalLabels",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const count = sorted.length;
      const px = 5, py = 3, fontSize = 11, radius = 3;

      ctx.font = `bold ${fontSize}px ${fontBody}`;

      for (let i = 0; i < count; i++) {
        // Find the true top of the full visible stack and sum visible categories
        let topY = Infinity;
        let visibleSum = 0;
        for (let d = 0; d < CATEGORIES.length; d++) {
          const meta = chart.getDatasetMeta(d);
          if (meta.data[i]) topY = Math.min(topY, meta.data[i].y);
          if (chart.isDatasetVisible(d)) visibleSum += sorted[i][CATEGORIES[d]];
        }

        const barX = chart.getDatasetMeta(0).data[i].x;
        const text = String(visibleSum);
        const tw = ctx.measureText(text).width;
        const bw = tw + px * 2, bh = fontSize + py * 2;
        const bx = barX - bw / 2, by = topY - bh - 5;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, radius);
        ctx.fillStyle = surfaceColor;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = textPrimary;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, barX, by + bh / 2);
        ctx.restore();
      }
    }
  };

  new Chart(canvas, {
    type: "bar",
    data: { labels, datasets },
    plugins: [totalLabelsPlugin],
    options: {
      indexAxis: "x",
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 28, bottom: 0, left: 0, right: 0 } },
      scales: {
        x: {
          stacked: true,
          ticks: { color: textPrimary, font: { family: fontBody } },
          grid: { color: borderColor, display: false }
        },
        y: {
          stacked: true,
          min: 0,
          max: 25,
          ticks: { color: textPrimary, font: { family: fontBody } },
          grid: { color: borderColor },
          title: {
            display: false,
            text: "Total popcorn score",
            color: textPrimary,
            font: { family: fontBody, size: 12 }
          }
        }
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: textPrimary,
            font: { family: fontBody, size: 12 },
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            title: (items) => {
              if (!items.length) return "";
              const i = items[0].dataIndex;
              return sorted[i].team;
            },
            label: (ctx) => {
              const row = sorted[ctx.dataIndex];
              const cat = ctx.dataset.label;
              return `${cat}: ${row[cat]}`;
            },
            afterBody: (items) => {
              if (!items.length) return "";
              const i = items[0].dataIndex;
              return `total: ${sorted[i].total}`;
            }
          }
        }
      }
    }
  });

  return container;
}
