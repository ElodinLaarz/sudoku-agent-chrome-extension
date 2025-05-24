// src/content_script/index.ts
// TODO: ElodinLaarz - Implement the content script logic
// 1. Detect the Sudoku grid (SVG elements)
// 2. Parse the grid numbers and structure
// 3. Listen for messages from the side_panel/background script
// 4. Send messages (e.g., the parsed grid) back to the side_panel/background
// 5. Highlight cells based on LLM suggestions

import { parseSudokuPadGrid } from './parser';

console.log('Sudoku Agent content script loaded on:', window.location.href);

function runParserAndStore() {
    const puzzleState = parseSudokuPadGrid();

    if (puzzleState) {
        console.log("Successfully parsed grid:", puzzleState.grid);
        // Store the grid in Chrome's local storage
        chrome.storage.local.set({ sudokuGrid: puzzleState.grid }, () => {
            console.log("Grid saved to storage.");
        });
    } else {
        console.error("Failed to parse the Sudoku grid.");
    }
}

// Run once on load (with a delay)
window.addEventListener('load', () => {
    setTimeout(runParserAndStore, 1000);
});

// --- IMPORTANT ---
// We need a way to re-run the parser when the user makes changes.
// Sudokupad.app might not trigger simple 'click' or 'change' events
// on the SVG. A MutationObserver is the most robust way.
// We'll add this *later* to keep things simple now.
// For now, we'll just parse on load.
