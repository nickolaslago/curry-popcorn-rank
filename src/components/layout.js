/**
 * Layout primitives. Exports CardContainer — a styled card div that wraps
 * an array of child DOM nodes, using --color-surface, --color-border,
 * --radius, and --gap-md tokens from theme.css.
 */

export function CardContainer(children, options = {}) {
  const { padding, width } = options;

  const card = document.createElement("div");
  card.style.background = "var(--color-surface)";
  card.style.border = "1px solid var(--color-border)";
  card.style.borderRadius = "var(--radius)";
  card.style.padding = padding != null
    ? (typeof padding === "number" ? `${padding}px` : padding)
    : "var(--gap-md)";
  card.style.display = "flex";
  card.style.flexDirection = "column";
  card.style.gap = "var(--gap-md)";
  if (width != null) {
    card.style.width = typeof width === "number" ? `${width}px` : width;
  }

  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child instanceof Node) card.appendChild(child);
  }

  return card;
}
