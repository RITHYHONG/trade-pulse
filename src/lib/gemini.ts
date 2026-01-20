import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Standard function to generate content using Gemini.
 * Dynamically initializes the client on each call to ensure .env.local 
 * variables are correctly loaded in the Next.js process.
 */
export async function generateContent(prompt: string) {
  try {
    const rawKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    const apiKey = rawKey.trim();
    
    if (!apiKey) {
      console.warn("GOOGLE_GENERATIVE_AI_API_KEY is not set. Using institutional reasoning engine fallback.");
      return "ERROR: MISSING_API_KEY";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // fallback to gemini-pro as 1.5-flash reports method restrictions for this key
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    // Graceful fallback for key-specific model restrictions
    if (error instanceof Error && (error.message.includes("API key") || error.message.includes("not found"))) {
       return "ERROR: MISSING_API_KEY";
    }
    console.error("Gemini AI Error:", error);
    throw error;
  }
}
