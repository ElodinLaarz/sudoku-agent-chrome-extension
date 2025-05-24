// src/common/types.ts

/** Represents a single cell in the Sudoku grid */
export interface SudokuCell {
  row: number;         // 0-8
  col: number;         // 0-8
  value: number | null; // 1-9, or null if empty
  isGiven: boolean;    // Was this number part of the initial puzzle?
}

/** Represents the entire Sudoku grid */
export type SudokuGrid = SudokuCell[][]; // A 2D array of cells

/** Represents potential variant information */
export interface SudokuVariant {
  name: string;
  rules: string;
}

/** Represents the full puzzle state */
export interface PuzzleState {
  grid: SudokuGrid;
  variant?: SudokuVariant;
}
