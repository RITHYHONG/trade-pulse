import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API client once at the top level
const getGenAI = (() => {
  let instance: GoogleGenerativeAI | null = null;
  return () => {
    if (instance) return instance;

    const rawKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
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

    // fallback to gemini-pro as 1.5-flash reports method restrictions for this key
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    // Graceful fallback for key-specific model restrictions
    if (
      error instanceof Error &&
      (error.message.includes("API key") || error.message.includes("not found"))
    ) {
      throw new Error("MISSING_API_KEY");
    }
    console.error("Gemini AI Error:", error);
    throw error;
  }
}
