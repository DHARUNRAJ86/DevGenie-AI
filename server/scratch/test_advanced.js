const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function testAdvanced() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, apiVersion: 'v1beta' });
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [{ role: 'user', parts: [{ text: 'hi' }] }]
    });
    console.log("Success with 3.5:", response.text);
  } catch (err) {
    console.error("Error with 3.5:", err.message);
  }
}

testAdvanced();
