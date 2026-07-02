const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function testWithPrefix() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, apiVersion: 'v1beta' });
  try {
    const response = await ai.models.generateContent({
        model: 'models/gemini-1.5-flash',
        contents: [{ role: 'user', parts: [{ text: 'hi' }] }]
    });
    console.log("Success with prefix:", response.text);
  } catch (err) {
    console.error("Error with prefix:", err.message);
  }
}

testWithPrefix();
