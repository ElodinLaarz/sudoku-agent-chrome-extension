// src/background/index.ts
chrome.runtime.onInstalled.addListener(() => {
  console.log('Sudoku Agent installed.');
});

// Allows users to open the side panel by clicking the action toolbar icon
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
  }
});

console.log('Background script loaded.');
