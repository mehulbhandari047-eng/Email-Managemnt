
import { GoogleGenAI } from "@google/genai";

export const auditBackendCode = async (code: string, query: string): Promise<string> => {
  // Initialize Gemini client using API key from environment variable as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a world-class backend security and architecture auditor. 
  You will be provided with pieces of Node.js/Express/MySQL code. 
  Your goal is to explain the architecture, identify security best practices, and answer specific developer questions.
  Keep answers professional, concise, and technical. Use Markdown formatting.`;

  const prompt = `
    CODE TO AUDIT:
    \`\`\`javascript
    ${code}
    \`\`\`

    USER QUESTION:
    ${query}
  `;

  try {
    // Using gemini-3-pro-preview for complex reasoning and technical code analysis tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Directly access the .text property from the GenerateContentResponse object
    return response.text || "I was unable to analyze the code at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Failed to connect to the AI Auditor. Please check your API configuration.";
  }
};
