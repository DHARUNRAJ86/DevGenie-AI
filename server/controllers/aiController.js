const { GoogleGenAI } = require('@google/genai');
const Query = require('../models/Query');

// Initialize Gemini SDK
// It defaults to using process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

exports.askAgent = async (req, res) => {
  try {
    const { type, input } = req.body;

    if (!type || !input) {
      return res.status(400).json({ error: 'Type and input are required' });
    }

    let prompt = '';
    
    // Select prompt engineering based on agent type
    switch(type) {
      case 'code':
        prompt = `You are a senior software engineer. ONLY respond to exactly what the user asks. Do not add unrequested context, backstory, or lengthy explanations. If they ask for code, give the code with minimal explanation. Requirement: ${input}`;
        break;
      case 'debug':
        prompt = `You are an expert debugger. ONLY fix the specific issue in the code below. Do not explain what good code should look like in general. Just identify the bug and show the corrected code with a 1–2 sentence explanation. Code: ${input}`;
        break;
      case 'review':
        prompt = `You are a senior code reviewer. ONLY review the specific code provided. Give concise bullet-point feedback on real improvements. Do not pad the response. Code: ${input}`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid agent type' });
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const aiOutput = response.text;

    // Save to database
    const newQuery = new Query({
      type,
      input,
      output: aiOutput
    });

    await newQuery.save();

    return res.status(200).json({
      success: true,
      data: newQuery
    });
  } catch (error) {
    console.error('Error in askAgent:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Query.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error in getHistory:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    await Query.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in deleteHistory:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
