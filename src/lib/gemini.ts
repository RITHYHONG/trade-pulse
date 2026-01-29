import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API client once at the top level
const getGenAI = (() => {
  let instance: GoogleGenerativeAI | null = null;
  return () => {
    if (instance) return instance;

    let rawKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    if (rawKey.startsWith('"') && rawKey.endsWith('"')) {
      rawKey = rawKey.substring(1, rawKey.length - 1);
    }
    const apiKey = rawKey.trim();

    if (!apiKey) return null;

    instance = new GoogleGenerativeAI(apiKey);
    return instance;
  };
})();

/**
 * Standard function to generate content using Gemini.
 */
export async function generateContent(prompt: string) {
  try {
    const genAI = getGenAI();

    if (!genAI) {
      console.warn(
        "GOOGLE_GENERATIVE_AI_API_KEY is not set. Using institutional reasoning engine fallback.",
      );
      throw new Error("MISSING_API_KEY");
    }

    // Use a more modern model that is widely available
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (
        msg.includes("api key") ||
        msg.includes("not found") ||
        msg.includes("apikey") ||
        msg.includes("unauthorized")
      ) {
        console.warn("Gemini Auth/Model Error:", error.message);
        throw new Error("MISSING_API_KEY");
      }
    }
    console.error("Gemini AI Error:", error);
    throw error;
  }
}
