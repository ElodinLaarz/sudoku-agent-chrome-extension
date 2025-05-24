// src/content_script/index.ts
// TODO: ElodinLaarz - Implement the content script logic
// 1. Detect the Sudoku grid (SVG elements)
// 2. Parse the grid numbers and structure
// 3. Listen for messages from the side_panel/background script
// 4. Send messages (e.g., the parsed grid) back to the side_panel/background
// 5. Highlight cells based on LLM suggestions

import { parseSudokuPadGrid } from './parser';

console.log('Sudoku Agent content script loaded on:', window.location.href);

// Give the page a moment to fully load its SVG content
window.addEventListener('load', () => {
    setTimeout(() => {
        const puzzleState = parseSudokuPadGrid();

        if (puzzleState) {
            console.log("Successfully parsed grid:", puzzleState.grid);
            // TODO: Send this puzzleState to the background or sidebar
        } else {
            console.error("Failed to parse the Sudoku grid.");
        }
    }, 1000); // 1-second delay, might need adjustment or a better trigger
});
