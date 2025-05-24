// src/content_script/index.ts
import { MSG_HIGHLIGHT_CELLS, MSG_CLEAR_HIGHLIGHTS } from "../common/constants";
import { parseSudokuPadGrid } from "./parser";
import { highlightCells, clearHighlights } from "./highlighter";

console.log("Sudoku Agent content script loaded on:", window.location.href);

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
window.addEventListener("load", () => {
  setTimeout(runParserAndStore, 1000);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);

  try {
    if (message.type === MSG_HIGHLIGHT_CELLS) {
      highlightCells(message.cells);
    } else if (message.type === MSG_CLEAR_HIGHLIGHTS) {
      clearHighlights();
    }
    sendResponse({ success: true, received: true });
  } catch (error) {
    console.error("Error processing message in content script:", error);
    sendResponse({ success: false, error: String(error) });
  }

  return false;
});

// --- TODO: Add MutationObserver here later ---
