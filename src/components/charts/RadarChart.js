/**
 * RadarChart — 5-axis radar/spider chart built with Chart.js.
 * Expects a single team object {team, freshness, saltiness, crunchiness,
 * butter, presentation} and renders a 220x220 canvas inside a container div.
 */

import Chart from "npm:chart.js/auto";

const CATEGORIES = ["freshness", "saltiness", "crunchiness", "butter", "presentation"];

function readVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function hexToRgba(hex, alpha) {
  const m = hex.replace("#", "");
  const h = m.length === 3
    ? m.split("").map(c => c + c).join("")
    : m;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function RadarChart(teamData, options = {}) {
  const { size = 220 } = options;

  const categoryColors = {
    freshness: readVar("--color-freshness", "#f5c842"),
    saltiness: readVar("--color-saltiness", "#e8a020"),
    crunchiness: readVar("--color-crunchiness", "#d4701a"),
    butter: readVar("--color-butter", "#f0e080"),
    presentation: readVar("--color-presentation", "#c85a10")
  };
  const butter = categoryColors.butter;
  const presentation = categoryColors.presentation;
  const textSecondary = readVar("--color-text-secondary", "#c8a96e");
  const borderColor = readVar("--color-border", "#5c3d1e");
  const fontBody = readVar("--font-body", "Inter, sans-serif");

  const container = document.createElement("div");
  container.style.width = `${size}px`;
  container.style.height = `${size}px`;
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  container.appendChild(canvas);

  const values = CATEGORIES.map(c => teamData[c] ?? 0);
  const pointColors = CATEGORIES.map(c => categoryColors[c]);

  new Chart(canvas, {
    type: "radar",
    data: {
      labels: CATEGORIES,
      datasets: [{
        label: teamData.team || "team",
        data: values,
        backgroundColor: hexToRgba(butter, 0.2),
        borderColor: presentation,
        borderWidth: 2,
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
        pointRadius: 4,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: {
            display: false,
            stepSize: 1
          },
          grid: { color: borderColor },
          angleLines: { color: borderColor },
          pointLabels: {
            color: textSecondary,
            font: { family: fontBody, size: 11, weight: "600" }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${CATEGORIES[ctx.dataIndex]}: ${ctx.formattedValue}`
          }
        }
      }
    }
  });

  return container;
}
