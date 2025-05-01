import { FLASK_API, VENDOR_API, DEEPSEEK_API_KEY } from "@env";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: DEEPSEEK_API_KEY
});

// Analyze waste image
export const analyzeWaste = async (photoUri) => {
  const formData = new FormData();
  formData.append("file", {
    uri: photoUri,
    name: "photo.jpg",
    type: "image/jpeg"
  });

  // STEP 1: Predict object from Flask
  const predictRes = await fetch(FLASK_API, {
    method: "POST",
    body: formData
  });
  const predictData = await predictRes.json();
  const predictedItem = predictData.prediction;

  // STEP 2: Get recycling instructions from DeepSeek (LLM)
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a waste disposal expert in India. Give simple and actionable recycling instructions." },
      { role: "user", content: `How to dispose and recycle: ${predictedItem}` }
    ],
    model: "deepseek-chat"
  });

  const instructions = completion.choices[0].message.content;

  // STEP 3: Notify vendor
  await fetch(VENDOR_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      item: predictedItem,
      recyclable: true,
      instructions: instructions,
    }),
  });

  // Final result
  return {
    item: predictedItem,
    recyclable: true,
    instructions: instructions,
    impact: "Helps in proper recycling and reduces pollution."
  };
};
