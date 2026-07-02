const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function listModels() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, apiVersion: 'v1' });
    console.log("Listing models with v1...");
    
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ role: 'user', parts: [{ text: 'hi' }] }]
    });
    console.log("Success with gemini-1.5-flash:", response.text);
  } catch (err) {
    console.error("Error with gemini-1.5-flash:", err.message);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-pro',
            contents: [{ role: 'user', parts: [{ text: 'hi' }] }]
        });
        console.log("Success with gemini-pro:", response.text);
    } catch (err2) {
        console.error("Error with gemini-pro:", err2.message);
    }
  }
}

listModels();
