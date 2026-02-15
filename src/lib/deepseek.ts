const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
}

/**
 * Generates content using the DeepSeek API.
 *
 * @param prompt The prompt to send to the AI.
 * @param model The model to use. Defaults to "deepseek-chat".
 * @param temperature Controls randomness. Defaults to 0.7.
 * @returns The generated text content.
 */
export async function generateDeepSeekContent(
  prompt: string,
  model: string = "deepseek-chat",
  temperature: number = 0.7,
): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    console.warn("DEEPSEEK_API_KEY is not set.");
    // Try to get from next public if mistakenly set there, or check process.env details
    console.log("Env check:", {
      hasDeepSeek: !!process.env.DEEPSEEK_API_KEY,
      hasNextPublic: !!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
    });
    throw new Error("MISSING_API_KEY");
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content:
              "You are a professional trading analyst and expert content writer.",
          },
          { role: "user", content: prompt },
        ],
        temperature: temperature,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("DeepSeek API Error:", response.status, errorData);
      throw new Error(`DeepSeek API failed with status ${response.status}`);
    }

    const data: DeepSeekResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("DeepSeek API returned no choices");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating content with DeepSeek:", error);
    throw error;
  }
}
