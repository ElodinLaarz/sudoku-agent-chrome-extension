// src/llm/prompt_builder.ts
import { SudokuGrid } from "../common/types";

function formatGrid(grid: SudokuGrid): string {
  let gridString = "Current Sudoku Grid (0 or . for empty):\n";
  for (let r = 0; r < 9; r++) {
    if (r % 3 === 0) gridString += "+-------+-------+-------+\n";
    let row = "| ";
    for (let c = 0; c < 9; c++) {
      row += (grid[r][c].value === null ? "." : grid[r][c].value) + " ";
      if ((c + 1) % 3 === 0) row += "| ";
    }
    gridString += row.trim() + "\n";
  }
  gridString += "+-------+-------+-------+\n";
  return gridString;
}

export function buildPrompt(grid: SudokuGrid, userQuery: string): string {
  const systemPrompt = `You are a helpful Sudoku assistant. You analyze Sudoku grids and provide hints based on standard Sudoku rules. Be concise and focus on suggesting a specific technique or finding.`;

  const formattedGrid = formatGrid(grid);

  // Using Llama 3 Instruct format
  const prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>

${formattedGrid}
My question: ${userQuery}<|eot_id|><|start_header_id|>assistant<|end_header_id|>
`;

  return prompt;
}
