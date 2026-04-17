/**
 * Media primitives. Exports Image — a styled <img> element with a
 * placeholder-div fallback (initials from alt) if loading fails.
 */

function initialsFrom(alt) {
  if (!alt) return "?";
  return alt
    .split(/[\s/]+/)
    .filter(Boolean)
    .map(w => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function buildPlaceholder(alt, width, height, borderRadius) {
  const div = document.createElement("div");
  div.textContent = initialsFrom(alt);
  div.style.width = typeof width === "number" ? `${width}px` : (width || "160px");
  div.style.height = typeof height === "number" ? `${height}px` : (height || "160px");
  div.style.borderRadius = borderRadius || "50%";
  div.style.background = "var(--color-bg)";
  div.style.border = "2px solid var(--color-border)";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.fontFamily = "var(--font-title)";
  div.style.color = "var(--color-text-secondary)";
  div.style.fontSize = "2.5rem";
  div.style.fontWeight = "700";
  return div;
}

export function Image(src, alt, options = {}) {
  const { width, height, borderRadius } = options;

  const img = document.createElement("img");
  img.src = src;
  img.alt = alt || "";
  if (width != null) img.style.maxWidth = typeof width === "number" ? `${width}px` : width;
  if (height != null) img.style.maxHeight = typeof height === "number" ? `${height}px` : height;
  if (borderRadius != null) img.style.borderRadius = typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;
  img.style.objectFit = "contain";
  img.style.display = "block";

  img.addEventListener("error", () => {
    const fallback = buildPlaceholder(alt, width, height, borderRadius);
    if (img.parentNode) img.parentNode.replaceChild(fallback, img);
  });

  return img;
}
