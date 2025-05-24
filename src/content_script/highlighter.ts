// src/content_script/highlighter.ts
import {
  SVG_NAMESPACE,
  SVG_SELECTOR,
  HIGHLIGHT_GROUP_ID,
  CELL_SIZE,
  HIGHLIGHT_CLASS,
} from "../common/constants";

/**
 * Finds the dedicated SVG group for highlights.
 * @returns {SVGGElement | null} The <g> element or null if not found.
 */
function getHighlightGroup(): SVGGElement | null {
  const svgElement = document.querySelector(
    SVG_SELECTOR,
  ) as SVGSVGElement | null;
  if (!svgElement) {
    console.error("Highlighter: Could not find SVG element.");
    return null;
  }

  // There might be two SVGs, let's try to find one with the group
  const highlightGroups = svgElement.querySelectorAll(`#${HIGHLIGHT_GROUP_ID}`);

  if (highlightGroups.length === 0) {
    console.error(
      `Highlighter: Could not find highlight group #${HIGHLIGHT_GROUP_ID}.`,
    );
    return null;
  }

  // If there are multiple SVGs, prefer the one that's a direct child
  // or looks more like the main one
  // (this might need refinement if it grabs the wrong one)
  // For now, let's assume the first one is a good candidate, but log if > 1.
  if (highlightGroups.length > 1) {
    console.warn(
      "Highlighter: Found multiple highlight groups. Using the first one.",
    );
  }

  return highlightGroups[0] as SVGGElement;
}

/**
 * Clears any existing highlights added by the agent.
 */
export function clearHighlights() {
  const group = getHighlightGroup();
  if (!group) return;

  const existingHighlights = group.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
  existingHighlights.forEach((el) => el.remove());
  console.log("Highlights cleared.");
}

/**
 * Highlights a list of cells on the Sudoku grid.
 * @param cells - An array of { row: number, col: number }.
 * @param color - The fill color for the highlight (e.g., 'yellow', '#FFD700').
 * @param opacity - The opacity (0 to 1).
 */
export function highlightCells(
  cells: { row: number; col: number }[],
  color: string = "yellow",
  opacity: number = 0.4,
) {
  const group = getHighlightGroup();
  if (!group) return;

  clearHighlights();

  cells.forEach(({ row, col }) => {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;

    const rect = document.createElementNS(SVG_NAMESPACE, "rect");
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(CELL_SIZE));
    rect.setAttribute("height", String(CELL_SIZE));
    rect.setAttribute("fill", color);
    rect.setAttribute("opacity", String(opacity));
    rect.setAttribute("class", HIGHLIGHT_CLASS);
    rect.setAttribute("pointer-events", "none");

    group.appendChild(rect);
    console.log(`Highlighted R${row + 1}C${col + 1}`);
  });
}
