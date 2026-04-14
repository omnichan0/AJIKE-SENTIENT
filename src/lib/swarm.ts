/// <reference types="vite/client" />
import { CreateMLCEngine } from '@mlc-ai/web-llm';
import { generateGeminiResponse } from './gemini';
import { connectToPetals } from './petals';

let localEngine: any = null;

export async function generateSwarmResponse(
  prompt: string, 
  history: any[] = [], 
  onChunk: (chunk: string) => void
): Promise<void> {
  try {
    // 1. Try Petals Decentralized Swarm
    const response = await connectToPetals(prompt, history);
    onChunk(response);
  } catch (error) {
    console.error("Swarm connection failed or skipped, pivoting to local 4-bit Llama-3-8B model...", error);
    
    // 2. Fallback to Local WebLLM (Llama-3-8B)
    try {
      if (!localEngine) {
        console.log("Initializing local WebLLM engine...");
        localEngine = await CreateMLCEngine(
          "Llama-3-8B-Instruct-q4f32_1-MLC",
          { initProgressCallback: (info) => console.log(info) }
        );
      }

      const messages = history.map(m => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.parts ? m.parts[0].text : m.content
      }));
      messages.push({ role: 'user', content: prompt });

      const reply = await localEngine.chat.completions.create({
        messages,
        stream: true
      });

      for await (const chunk of reply) {
        const chunkText = chunk.choices[0].delta.content;
        if (chunkText) {
          onChunk(chunkText);
        }
      }
    } catch (localError) {
      console.error("Local fallback also failed:", localError);
      
      // 3. Final Fallback to Gemini API
      try {
        const geminiHistory = history.map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));
        await generateGeminiResponse(prompt, geminiHistory, onChunk);
      } catch (geminiError) {
        console.error("Gemini fallback also failed:", geminiError);
        onChunk("Neural disruption critical. Swarm, Local, and Gemini fallback failed.");
      }
    }
  }
}
