/**
 * Typography primitives. Exports H1Title, H2Title, Description, and Text —
 * each returns a styled HTMLElement using CSS variables from theme.css.
 */

function cssVar(name) {
  return `var(${name})`;
}

export function H1Title(text) {
  const el = document.createElement("h1");
  el.textContent = text;
  el.style.fontFamily = cssVar("--font-title");
  el.style.color = cssVar("--color-text-primary");
  el.style.fontSize = "3rem";
  el.style.fontWeight = "700";
  el.style.letterSpacing = "-0.02em";
  el.style.margin = "0 0 var(--gap-md) 0";
  el.style.lineHeight = "1.1";
  return el;
}

export function H2Title(text) {
  const el = document.createElement("h2");
  el.textContent = text;
  el.style.fontFamily = cssVar("--font-title");
  el.style.color = cssVar("--color-text-secondary");
  el.style.fontSize = "1.6rem";
  el.style.fontWeight = "700";
  el.style.margin = "0";
  el.style.lineHeight = "1.2";
  return el;
}

export function Description(text) {
  const el = document.createElement("p");
  el.textContent = text;
  el.style.fontFamily = cssVar("--font-body");
  el.style.color = cssVar("--color-text-secondary");
  el.style.fontSize = "1.1rem";
  el.style.lineHeight = "1.5";
  el.style.opacity = "0.9";
  el.style.margin = "0";
  el.style.maxWidth = "720px";
  return el;
}

export function Text(text) {
  const el = document.createElement("p");
  el.textContent = text;
  el.style.fontFamily = cssVar("--font-body");
  el.style.color = cssVar("--color-text-primary");
  el.style.fontSize = "0.95rem";
  el.style.lineHeight = "1.5";
  el.style.margin = "0";
  return el;
}
