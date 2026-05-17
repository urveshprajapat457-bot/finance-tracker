const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-1.5-flash";

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is missing");
}

const buildPrompt = () => {
  return `
Analyze this receipt/bill image and return ONLY valid JSON.

Format:
{
  "shopName": "",
  "purchaseDate": "",
  "totalAmount": 0,
  "category": "",
  "items": [
    {
      "name": "",
      "price": 0,
      "category": ""
    }
  ],
  "notes": "",
  "insights": []
}

Rules:
- Return ONLY JSON
- No markdown
- No explanation
- Detect shop/store name
- Detect items and prices
- Detect total bill amount
- Detect date
- Auto categorize expenses
`;
};

exports.analyzeReceiptWithGemini = async (
  imageBuffer,
  mimeType
) => {
  try {
    const base64Image = imageBuffer.toString("base64");

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: buildPrompt(),
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    };

    const response = await axios.post(
      GEMINI_ENDPOINT,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to analyze receipt");
  }
};

exports.parseGeminiResponse = (response) => {
  try {
    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("JSON Parse Error:", error.message);

    return {
      shopName: "",
      purchaseDate: "",
      totalAmount: 0,
      category: "",
      items: [],
      notes: "Failed to parse AI response",
      insights: [],
    };
  }
};