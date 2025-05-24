// src/side_panel/index.ts
console.log('Sidepanel script loaded!');

const chatInput = document.getElementById('chat-input') as HTMLInputElement | null;
const messagesDiv = document.getElementById('messages');

if (chatInput && messagesDiv) {
  chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && chatInput.value.trim() !== '') {
      const userMessage = document.createElement('div');
      userMessage.classList.add('message', 'user-message');
      userMessage.textContent = chatInput.value;
      messagesDiv.appendChild(userMessage);

      const botMessage = document.createElement('div');
      botMessage.classList.add('message', 'bot-message');
      botMessage.textContent = `Thinking about: "${chatInput.value}"...`;
      messagesDiv.appendChild(botMessage);

      messagesDiv.scrollTop = messagesDiv.scrollHeight;
      chatInput.value = '';
    }
  });
} else {
  console.error('Chat input or messages container not found in sidepanel.html');
}
