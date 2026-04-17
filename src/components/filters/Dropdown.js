/**
 * Dropdown — a plain <select> element, fully self-contained. No Observable
 * Inputs; wires a native change listener that calls the provided onChange
 * callback with the selected value so each instance is isolated.
 */

export function Dropdown(options, defaultValue, onChange) {
  const select = document.createElement("select");
  select.style.width = "100%";
  select.style.height = "40px";
  select.style.background = "var(--color-surface)";
  select.style.color = "var(--color-text-primary)";
  select.style.border = "1px solid var(--color-border)";
  select.style.borderRadius = "var(--radius)";
  select.style.padding = "var(--gap-sm) var(--gap-md)";
  select.style.fontFamily = "var(--font-body)";
  select.style.fontSize = "0.95rem";
  select.style.boxSizing = "border-box";
  select.style.cursor = "pointer";

  for (const value of options) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = value;
    if (value === defaultValue) opt.selected = true;
    select.appendChild(opt);
  }

  if (typeof onChange === "function") {
    select.addEventListener("change", (event) => {
      onChange(event.target.value);
    });
  }

  return select;
}
