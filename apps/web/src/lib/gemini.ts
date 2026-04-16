const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

function getApiKey() {
  let rawKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
  if (rawKey.startsWith('"') && rawKey.endsWith('"')) {
    rawKey = rawKey.substring(1, rawKey.length - 1);
  }
  return rawKey.trim();
}

function extractTextFromResponse(json: any): string {
  if (!json) return "";

  const candidateText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof candidateText === "string") return candidateText;

  const candidateParts = json?.candidates?.[0]?.content?.parts;
  if (Array.isArray(candidateParts)) {
    const joined = candidateParts
      .map((part: any) => (typeof part.text === "string" ? part.text : ""))
      .join("");
    if (joined.trim()) return joined;
  }

  const outputText = json?.output_text;
  if (typeof outputText === "string") return outputText;

  const firstText = json?.output?.[0]?.content?.find((item: any) => typeof item.text === "string")?.text;
  if (typeof firstText === "string") return firstText;

  return JSON.stringify(json);
}

const RETRY_STATUS_CODES = [429, 503];
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Standard function to generate content using Gemini.
 */
export async function generateContent(prompt: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const response = await fetch(`${GEMINI_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (response.ok) {
      const json = await response.json();
      return extractTextFromResponse(json);
    }

    const errorBody = await response.text().catch(() => "");
    console.error("Gemini API error", response.status, errorBody);

    if (response.status === 401 || response.status === 403) {
      throw new Error("MISSING_API_KEY");
    }

    const errorMessage = `GEMINI_API_ERROR ${response.status}: ${errorBody}`;
    if (RETRY_STATUS_CODES.includes(response.status) && attempt < MAX_RETRIES) {
      const delay = attempt * 1000;
      console.warn(`Transient Gemini error, retrying in ${delay}ms (attempt ${attempt}/${MAX_RETRIES})`);
      await sleep(delay);
      continue;
    }

    throw new Error(errorMessage);
  }

  throw new Error("GEMINI_API_ERROR: retry limit exceeded");
}
