/**
 * StackedBarChart — horizontal stacked bar built with Chart.js.
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
  const { height = 720 } = options;

  const categoryColors = {
    freshness: readVar("--color-freshness", "#f5c842"),
    saltiness: readVar("--color-saltiness", "#e8a020"),
    crunchiness: readVar("--color-crunchiness", "#d4701a"),
    butter: readVar("--color-butter", "#f0e080"),
    presentation: readVar("--color-presentation", "#c85a10")
  };
  const textPrimary = readVar("--color-text-primary", "#f5e6c8");
  const borderColor = readVar("--color-border", "#5c3d1e");
  const fontBody = readVar("--font-body", "Inter, sans-serif");

  const sorted = [...data].sort((a, b) => a.total - b.total); // ascending so largest is at the top when y-axis reversed
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

  new Chart(canvas, {
    type: "bar",
    data: { labels, datasets },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 0 },
      scales: {
        x: {
          stacked: true,
          min: 8,
          max: 25,
          ticks: { color: textPrimary, font: { family: fontBody } },
          grid: { color: borderColor },
          title: {
            display: true,
            text: "Total popcorn score",
            color: textPrimary,
            font: { family: fontBody, size: 12 }
          }
        },
        y: {
          stacked: true,
          reverse: true,
          ticks: { color: textPrimary, font: { family: fontBody } },
          grid: { color: borderColor, display: false }
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
