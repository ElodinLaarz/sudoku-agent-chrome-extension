// src/background/index.ts
import { queryOllama } from "../llm/ollama_client";
import { buildPrompt } from "../llm/prompt_builder";
import {
  MSG_QUERY_LLM,
  MSG_HIGHLIGHT_CELLS,
  MSG_CLEAR_HIGHLIGHTS,
  STORAGE_GRID_KEY,
} from "../common/constants";
import { SudokuGrid, SudokuCell } from "../common/types"; // Make sure this path is correct

chrome.runtime.onInstalled.addListener(() => {
  console.log("Sudoku Agent installed.");
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
  }
});

/**
 * Parses R_C_ (e.g., R1C1, R9C9) coordinates from a string.
 * @param text - The text from the LLM.
 * @returns An array of objects { row: number, col: number }.
 */
function parseCoordinates(text: string): { row: number; col: number }[] {
  const regex = /R([1-9])C([1-9])/gi; // Case-insensitive, global search
  const matches = text.matchAll(regex);
  const coordinates: { row: number; col: number }[] = [];

  for (const match of matches) {
    const row = parseInt(match[1], 10) - 1; // Convert 1-based to 0-based
    const col = parseInt(match[2], 10) - 1; // Convert 1-based to 0-based
    if (row >= 0 && row < 9 && col >= 0 && col < 9) {
      coordinates.push({ row, col });
    }
  }
  // Return unique coordinates
  return [
    ...new Map(
      coordinates.map((item) => [`${item.row}-${item.col}`, item]),
    ).values(),
  ];
}

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === MSG_QUERY_LLM) {
    console.log("Received query from side panel:", request.query);

    chrome.storage.local.get([STORAGE_GRID_KEY], async (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error getting grid from storage:",
          chrome.runtime.lastError,
        );
        sendResponse({ success: false, response: "Error getting grid." });
        return;
      }

      const grid: SudokuGrid | undefined = result.sudokuGrid;
      if (!grid) {
        console.error("Could not find grid in storage.");
        sendResponse({
          success: false,
          response: "Could not find the grid. Is a Sudoku loaded?",
        });
        return;
      }

      const prompt = buildPrompt(grid, request.query);
      const llmResponse = await queryOllama(prompt);
      const highlightedCells = parseCoordinates(llmResponse);
      console.log("BG: Parsed coordinates:", highlightedCells);

      const activeTabId = request.tabId;

      const messageToSend = {
        type:
          highlightedCells.length > 0
            ? MSG_HIGHLIGHT_CELLS
            : MSG_CLEAR_HIGHLIGHTS,
        cells: highlightedCells,
      };
      console.log("BG: Sending message:", messageToSend);

      chrome.tabs.sendMessage(activeTabId, messageToSend, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "BG: sendMessage FAILED with lastError:",
            chrome.runtime.lastError.message,
          );
        } else {
          console.log("BG: sendMessage call completed.");
        }
      });

      // Send the original response back to the side panel
      sendResponse({ success: true, response: llmResponse });
    });
    return true;
  }
});

console.log("Background script loaded.");
