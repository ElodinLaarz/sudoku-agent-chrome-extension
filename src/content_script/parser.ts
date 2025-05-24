// src/content_script/parser.ts
import {
  SVG_SELECTOR,
  CELL_SIZE,
  GIVEN_GROUP_SELECTOR,
  PEN_GROUP_SELECTOR,
  VALUES_GROUP_SELECTOR,
} from "../common/constants";
import { SudokuGrid, PuzzleState } from "../common/types";

/**
 * Calculates the row and column based on SVG coordinates.
 * @param x - The x coordinate.
 * @param y - The y coordinate.
 * @returns {row: number, col: number} or null.
 */
function getRowColFromCoords(
  x: number,
  y: number,
): { row: number; col: number } | null {
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);

  if (row >= 0 && row < 9 && col >= 0 && col < 9) {
    return { row, col };
  }
  console.warn(`Could not map coords (${x}, ${y}) to a grid cell.`);
  return null;
}

/**
 * Parses <text> elements within a given SVG group, looking for numbers.
 * @param groupSelector - CSS selector for the group (e.g., 'g#cell-givens').
 * @param svgElement - The main SVG element.
 * @param grid - The SudokuGrid to populate.
 * @param isGiven - Whether numbers found here should be marked as 'given'.
 */
function parseGroup(
  groupSelector: string,
  svgElement: SVGSVGElement,
  grid: SudokuGrid,
  isGiven: boolean,
) {
  const groupElement = svgElement.querySelector(groupSelector);
  if (!groupElement) {
    // It's okay if a group (like 'givens' or 'pen') doesn't exist
    console.log(`Group ${groupSelector} not found.`);
    return;
  }

  // Select all <text> elements within this group
  const textElements = groupElement.querySelectorAll("text");

  textElements.forEach((textEl: SVGTextElement) => {
    const value = parseInt(textEl.textContent || "", 10);
    const x = parseFloat(textEl.getAttribute("x") || "-1");
    const y = parseFloat(textEl.getAttribute("y") || "-1");

    // Ensure we have a valid number and coordinates
    if (!isNaN(value) && value >= 1 && value <= 9 && x >= 0 && y >= 0) {
      const coords = getRowColFromCoords(x, y);

      if (coords) {
        const { row, col } = coords;

        // Add the value. We prioritize 'givens'. If it's not a 'given',
        // only add it if the cell is currently empty or not a 'given'.
        if (isGiven || !grid[row][col].isGiven) {
          grid[row][col].value = value;
          grid[row][col].isGiven = isGiven;

          const className = textEl.getAttribute("class") || "";
          console.log(
            `Found ${value} (Given: ${isGiven}, Class: '${className}') at R${row + 1}C${col + 1}`,
          );
        }
      }
    }
  });
}

/**
 * Parses the Sudoku grid from the sudokupad.app SVG.
 * @returns {PuzzleState | null} The parsed grid state, or null if not found.
 */
export function parseSudokuPadGrid(): PuzzleState | null {
  const svgElement = document.querySelector(
    SVG_SELECTOR,
  ) as SVGSVGElement | null;
  if (!svgElement) {
    console.error("Could not find the Sudoku SVG element (#svgrenderer).");
    return null;
  }

  // Initialize an empty 9x9 grid
  const grid: SudokuGrid = Array(9)
    .fill(null)
    .map((_, r_idx) =>
      Array(9)
        .fill(null)
        .map((_, c_idx) => ({
          row: r_idx,
          col: c_idx,
          value: null,
          isGiven: false,
        })),
    );

  // Parse 'givens' first. Look for 'text' elements within 'g#cell-givens'.
  parseGroup(GIVEN_GROUP_SELECTOR, svgElement, grid, true);
  parseGroup(PEN_GROUP_SELECTOR, svgElement, grid, false);
  parseGroup(VALUES_GROUP_SELECTOR, svgElement, grid, false);

  console.log("Parsing complete.");
  return { grid };
}
