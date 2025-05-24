// src/side_panel/index.ts
import { MSG_QUERY_LLM } from "../common/constants";

console.log("Side panel script loaded!");

const chatInput = document.getElementById(
  "chat-input",
) as HTMLInputElement | null;
const messagesDiv = document.getElementById("messages");

function addMessage(text: string, type: "user" | "bot") {
  if (!messagesDiv) return;

  const message = document.createElement("div");
  message.classList.add("message", `${type}-message`);
  message.textContent = text;
  messagesDiv.appendChild(message);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
}

if (chatInput && messagesDiv) {
  chatInput.addEventListener("keypress", async (event) => {
    if (event.key === "Enter" && chatInput.value.trim() !== "") {
      const query = chatInput.value.trim();
      addMessage(query, "user");
      chatInput.value = ""; // Clear input immediately

      addMessage("Thinking...", "bot"); // Show thinking message

      try {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          async (tabs) => {
            if (
              chrome.runtime.lastError ||
              !tabs ||
              tabs.length === 0 ||
              !tabs[0].id
            ) {
              console.error(
                "Side Panel: Could not find active tab ID.",
                chrome.runtime.lastError,
              );
              addMessage(
                "Error: Could not determine the active tab to send the message.",
                "bot",
              );
              return; // Stop here if we can't get the ID
            }

            const currentTabId = tabs[0].id;
            console.log("Side Panel: Found active tab ID:", currentTabId);

            // ---> Send message WITH tabId <---
            const response = await chrome.runtime.sendMessage({
              type: MSG_QUERY_LLM,
              query: query,
              tabId: currentTabId, // <--- Include the ID!
            });

            // Remove "Thinking..." message
            const thinkingMsg = messagesDiv.querySelector(
              ".bot-message:last-child",
            );
            if (thinkingMsg && thinkingMsg.textContent === "Thinking...") {
              messagesDiv.removeChild(thinkingMsg);
            }

            if (response.success) {
              addMessage(response.response, "bot");
            } else {
              addMessage(`Error: ${response.response}`, "bot");
            }
          },
        );
      } catch (error) {
        console.error("Error sending message to background:", error);
        const thinkingMsg = messagesDiv.querySelector(
          ".bot-message:last-child",
        );
        if (thinkingMsg && thinkingMsg.textContent === "Thinking...") {
          messagesDiv.removeChild(thinkingMsg);
        }
        addMessage(
          `Error: Could not communicate with the background script. ${error}`,
          "bot",
        );
      }
    }
  });
} else {
  console.error("Chat input or messages container not found in sidepanel.html");
}
