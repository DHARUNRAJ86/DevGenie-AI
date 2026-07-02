require('dotenv').config();

async function listAllModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const versions = ['v1', 'v1beta'];
  
  for (const v of versions) {
    console.log(`Checking version ${v}...`);
    const url = `https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.models) {
        console.log(`Models available in ${v}:`);
        data.models.forEach(m => console.log(` - ${m.name}`));
      } else {
        console.log(`No models found in ${v} or error:`, data);
      }
    } catch (err) {
      console.error(`Error in ${v}:`, err.message);
    }
  }
}

listAllModels();
