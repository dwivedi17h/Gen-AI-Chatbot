import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const ai = new GoogleGenAI(process.env.API_KEY);

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "why is INDIA is famous",
  });
  console.log(response.text);
}

await main();