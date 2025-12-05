import { GoogleGenAI, Chat, Part, GenerateContentResponse } from "@google/genai";
import { Attachment } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize the client
const ai = new GoogleGenAI({ apiKey });

// Store the chat session instance
let chatSession: Chat | null = null;

// Initialize or reset the chat session
export const startChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are OpenAsk, a helpful, intelligent, and precise AI assistant. You can analyze images and answer complex questions. Keep your answers concise yet comprehensive. Use Markdown for formatting.',
    },
  });
};

// Send a message (text + optional images) to the model and yield streaming chunks
export async function* sendMessageStream(
  text: string,
  attachments: Attachment[] = []
): AsyncGenerator<string, void, unknown> {
  if (!chatSession) {
    startChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session.");
  }

  // Construct the message parts
  const parts: (string | Part)[] = [];
  
  // Add images if any
  for (const att of attachments) {
    if (att.base64Data) {
      parts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: att.base64Data
        }
      });
    }
  }

  // Add text if present
  if (text.trim()) {
    parts.push(text);
  }

  try {
    const resultStream = await chatSession.sendMessageStream({ message: parts });

    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Error in Gemini service:", error);
    throw error;
  }
}
