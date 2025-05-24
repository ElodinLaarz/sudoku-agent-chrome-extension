// src/llm/prompt_builder.ts
import { SudokuGrid } from "../common/types";

function formatGrid(grid: SudokuGrid): string {
  let gridString = "Current Sudoku Grid (0 or . for empty):\n";
  gridString += "   1 2 3   4 5 6   7 8 9\n";
  for (let r = 0; r < 9; r++) {
    if (r % 3 === 0) gridString += " +-------+-------+-------+\n";
    let row = `${r + 1}| `;
    for (let c = 0; c < 9; c++) {
      row += (grid[r][c].value === null ? "." : grid[r][c].value) + " ";
      if ((c + 1) % 3 === 0) row += "| ";
    }
    gridString += row.trim() + "\n";
  }
  gridString += " +-------+-------+-------+\n";
  return gridString;
}

export function buildPrompt(grid: SudokuGrid, userQuery: string): string {
  const systemPrompt = `You are a helpful Sudoku assistant. 
    You analyze Sudoku grids and provide hints based on standard Sudoku rules. 
    When you mention specific cells, ALWAYS refer to them using the format R_C_ (e.g., R1C1, R3C7, R9C9). 
    If you suggest a technique, list the key cells involved.
    Be concise.`;

  const formattedGrid = formatGrid(grid);

  const prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>

${formattedGrid}
My question: ${userQuery} 
IMPORTANT: Remember to list key cells as R_C_ (e.g., R4C5).<|eot_id|><|start_header_id|>assistant<|end_header_id|>
`;

  return prompt;
}
