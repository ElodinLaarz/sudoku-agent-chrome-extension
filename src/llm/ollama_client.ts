// src/llm/ollama_client.ts

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'llama3.1:8b';

export interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

export async function queryOllama(prompt: string): Promise<string> {
    console.log("Querying Ollama with prompt:", prompt);
    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: prompt,
                stream: false, // Set to false to get the full response at once
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama API request failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data: OllamaResponse = await response.json();
        console.log("Ollama response:", data.response);
        return data.response;

    } catch (error) {
        console.error("Error querying Ollama:", error);
        return "Sorry, I couldn't connect to the local LLM. Is Ollama running?";
    }
}
