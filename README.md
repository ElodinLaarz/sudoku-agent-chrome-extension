# Sudoku Solving Agent 🧠

A Chrome extension designed to assist users in solving Sudoku puzzles on
[SudokuPad.app](https://sudokupad.app/) by leveraging a locally running Large
Language Model (LLM). Interact with the agent via a side panel chat to get
hints, explore techniques, or check your work.

## Features ✨

- **Side Panel Chat:** A familiar chat interface to interact with the Sudoku
  agent.
- **Grid Parsing:** Automatically detects and parses the current Sudoku grid
  from `SudokuPad.app`.
- **LLM Integration:** Queries a locally run instance of Llama 3.1 (via
  Ollama) to generate suggestions.
- **Hint Generation:** Ask for help, next steps, or specific techniques.
- **Error Checking:** Ask the agent to look over the grid for potential
  mistakes (LLM-based).

## Target Website 🎯

This extension is currently built and tested specifically for:

- **[SudokuPad.app](https://sudokupad.app/)**

_Note: Parsing is tailored to SudokuPad's SVG structure and will not work on
other Sudoku websites._

## Technology Stack 🛠️

- **Frontend/Extension:** TypeScript, HTML, CSS
- **Framework/API:** Chrome WebExtensions API (Manifest V3)
- **Build Tool:** Webpack
- **Local LLM Runner:** [Ollama](https://ollama.ai/)
- **LLM Model:**
  [Meta Llama 3.1 8B Instruct](https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct)

## Setup & Installation ⚙️

Follow these steps to get the Sudoku Solving Agent running locally:

### 1. Prerequisites

- **Node.js & npm/yarn:** Ensure you have Node.js (which includes npm)
  installed. [Download Node.js](https://nodejs.org/)
- **Ollama:** Install Ollama for your operating system.
  [Download Ollama](https://ollama.ai/)

### 2. Install & Configure Ollama

1.  **Download the LLM Model:** Once Ollama is installed and running, pull
    the Llama 3.1 8B model (or any model you want, really):

    ```bash
    ollama pull llama3.1:8b
    ```

2.  **Configure Ollama CORS:** The Chrome extension needs permission to talk
    to the Ollama server. You must configure Ollama to allow requests from
    Chrome extensions. The easiest way is often to set the `OLLAMA_ORIGINS`
    environment variable.

    - **For Manual Start/Other OS:** Set the environment variable before
      starting Ollama (e.g., `export OLLAMA_ORIGINS="*"` on Linux/macOS or set
      it in your system settings on Windows) and then start the Ollama
      server/application.
      ```bash
      export OLLAMA_ORIGINS="chrome-extension://<your-extension-id>"
      ```

3.  **Start the Ollama Server:** If you haven't already, start the Ollama
    server. This is usually done by running:

    ```bash
    ollama serve

    # <and in another terminal>
    ollama run llama3.1:8b
    ```

### 3. Install the Extension

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/ElodinLaarz/sudoku-agent-chrome-extension.git
    cd sudoku-agent-chrome-extension
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Build the Extension:**
    ```bash
    npm run build
    ```
    _(This creates the `dist/` directory, which contains the actual extension
    files)._

### 4. Load in Chrome

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  Enable **"Developer mode"** (usually a toggle in the top-right corner).
3.  Click the **"Load unpacked"** button.
4.  Select the `dist` directory inside your cloned repository
    (`sudoku-agent-chrome-extension/dist`).
5.  The Sudoku Solving Agent should now appear in your list of extensions, and
    its icon should be in your toolbar.

## Usage 🚀

1.  Navigate to a puzzle on [SudokuPad.app](https://sudokupad.app/).
2.  Click the Sudoku Solving Agent icon in your Chrome toolbar.
3.  This will open the Side Panel chat interface.
4.  Type your question (e.g., "Any hints?", "Check R1C1", "Find an X-Wing")
    and press Enter.
5.  The agent will consult the local Llama 3.1 model and display the response.

## Current Status & Limitations 🚧

- This is an early-stage project.
- The grid parser is specific to `SudokuPad.app`.
- LLM-based Sudoku solving is still bad.
  - The LLM is not trained specifically for Sudoku, so results may vary.
  - Mayhaps better prompts will help.
- Grid updates are not yet real-time (requires page reload or future
  implementation of `MutationObserver`).
- No support yet for parsing complex variant rules to pass to the LLM.

## TODOs 🔮

- Implement `MutationObserver` for real-time grid updates.
- Improve prompt engineering for better Sudoku strategies.
- Explore parsing variant rules text.
- Refine the UI/UX.

## License 📄

I just did this for fun. Feel free to use this however you wish, without the
need for attribution.

(TODO: Add that one license that says "do whatever you want".)

---
