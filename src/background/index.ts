// src/background/index.ts
import { queryOllama } from "../llm/ollama_client";
import { buildPrompt } from "../llm/prompt_builder";
import { SudokuGrid } from "../common/types"; // Make sure this path is correct

chrome.runtime.onInstalled.addListener(() => {
  console.log("Sudoku Agent installed.");
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "queryLLM") {
    console.log("Received query from side panel:", request.query);

    // 1. Get the grid from storage
    chrome.storage.local.get(["sudokuGrid"], async (result) => {
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
      sendResponse({ success: true, response: llmResponse });
    });

    // Return true to indicate we will send a response asynchronously
    return true;
  }
});

console.log("Background script loaded (v2).");
