// src/common/constants.ts

// --- Message Types ---
// Used for communication between extension components.
export const MSG_QUERY_LLM = "queryLLM";
export const MSG_HIGHLIGHT_CELLS = "highlightCells";
export const MSG_CLEAR_HIGHLIGHTS = "clearHighlights";
export const MSG_GET_GRID = "getGrid"; // We might need this later
export const MSG_GRID_DATA = "gridData"; // We might need this later

// --- Storage Keys ---
// Used for chrome.storage.local.
export const STORAGE_GRID_KEY = "sudokuGrid";

// --- SVG & DOM Selectors/Constants ---
// Used by content_script/parser.ts and content_script/highlighter.ts.
export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
export const SVG_SELECTOR = "svg#svgrenderer";
export const HIGHLIGHT_GROUP_ID = "cell-highlights";
export const GIVEN_GROUP_SELECTOR = "g#cell-givens";
export const PEN_GROUP_SELECTOR = "g#cell-pen";
export const VALUES_GROUP_SELECTOR = "g#cell-values";
export const CELL_SIZE = 64;
export const HIGHLIGHT_CLASS = "sudoku-agent-highlight";

// --- LLM & Ollama ---
// Used by llm/ollama_client.ts.
export const OLLAMA_API_URL = "http://localhost:11434/api/generate";
export const MODEL_NAME = "llama3.1:8b"; // Or your preferred model
