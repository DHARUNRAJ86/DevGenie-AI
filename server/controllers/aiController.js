const { GoogleGenAI } = require('@google/genai');
const Query = require('../models/Query');

// Initialize Gemini SDK
// It defaults to using process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, apiVersion: 'v1beta' });

exports.askAgent = async (req, res) => {
  try {
    const { type, input, sessionId } = req.body;

    if (!type || !input || !sessionId) {
      return res.status(400).json({ error: 'SessionId, type and input are required' });
    }

    // Fetch previous messages for context
    const previousMessages = await Query.find({ sessionId, userId: req.user.id }).sort({ createdAt: 1 });
    
    // Modern Gemini multi-turn format
    const contents = [];
    
    // Add system instruction as a simulated first turn for older models or 
    // just use it to guide the persona
    const systemPersona = {
      role: 'user',
      parts: [{ text: `SYSTEM INSTRUCTION: You are DevGenie AI, a professional development assistant. 
      Persona: ${type === 'code' ? 'Software Architect' : type === 'debug' ? 'Expert Debugger' : 'Code Reviewer'}.
      CRITICAL: If the user message is a simple greeting (like 'hi', 'hello', 'how are you'), respond naturally as a friendly AI assistant. 
      Only provide deep technical solutions or code if the user explicitly asks a technical question or requirement.
      Internalize this: Do not force technical solutions onto simple chat.` }]
    };
    const systemAck = {
      role: 'model',
      parts: [{ text: "Understood. I will respond naturally to greetings and provide architectural solutions only when technically requested." }]
    };

    contents.push(systemPersona, systemAck);

    // Add conversation history
    previousMessages.forEach(msg => {
      contents.push({ role: 'user', parts: [{ text: msg.input }] });
      contents.push({ role: 'model', parts: [{ text: msg.output }] });
    });

    // Add current input
    contents.push({ role: 'user', parts: [{ text: input }] });

    // Multi-model fallback list to handle quota/high-demand
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-pro-latest', 'gemini-3.5-flash', 'gemini-short-flash'];
    let aiOutput = '';
    let success = false;
    let lastError = null;

    for (const modelId of candidateModels) {
      let retryCount = 0;
      const maxRetries = 1;

      while (retryCount <= maxRetries) {
        try {
          const response = await ai.models.generateContent({
            model: modelId,
            contents: contents
          });
          aiOutput = response.text;
          success = true;
          break; 
        } catch (error) {
          lastError = error;
          const isTransient = error.message?.toLowerCase().includes('demand') || 
                              error.message?.toLowerCase().includes('busy') ||
                              error.message?.includes('503') ||
                              error.message?.includes('429');
          
          if (isTransient && retryCount < maxRetries) {
            retryCount++;
            await new Promise(res => setTimeout(res, 1000));
            continue;
          }
          break; 
        }
      }
      if (success) break;
    }

    if (!success) throw lastError;

    // Check if we already have a title for this session
    const existing = previousMessages.length > 0 ? previousMessages[0] : null;

    // Generate a descriptive title (not just one word)
    let title = 'New Chat';
    if (existing) {
      title = existing.title;
    } else {
      // Logic for better titles: 
      // Skip generic small talk for the title if it's the first message
      const words = input.trim().split(/\s+/);
      const isSmallTalk = words.length <= 2 && /^(hi|hello|hey|yo|help|test|hi di)$/i.test(words[0]);
      
      if (isSmallTalk) {
        title = "New " + (type === 'code' ? 'Development' : type === 'debug' ? 'Debugging' : 'Review') + " Chat";
      } else {
        title = words.slice(0, 5).join(' ');
        if (words.length > 5) title += '...';
      }
    }

    // Save to database
    const newQuery = new Query({
      sessionId,
      userId: req.user.id,
      title,
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
    
    let cleanDetail = error.message;
    try {
        const parsed = JSON.parse(error.message);
        if (parsed.error && parsed.error.message) cleanDetail = parsed.error.message;
    } catch (e) {}

    if (cleanDetail.includes('429') || cleanDetail.toLowerCase().includes('quota')) {
      cleanDetail = "The AI is currently at maximum capacity. Please wait about 30 seconds.";
    } else if (cleanDetail.toLowerCase().includes('demand') || cleanDetail.toLowerCase().includes('busy')) {
      cleanDetail = "Models are busy. Please try one more time.";
    }

    return res.status(500).json({ error: 'Internal server error', details: cleanDetail });
  }
};

exports.getChatThread = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const thread = await Query.find({ sessionId, userId: req.user.id }).sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      data: thread
    });
  } catch (error) {
    console.error('Error in getChatThread:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Query.aggregate([
      { $match: { userId: req.user._id } },
      { $sort: { createdAt: -1 } },
      { $group: {
          _id: "$sessionId",
          title: { $first: "$title" },
          createdAt: { $first: "$createdAt" },
          input: { $first: "$input" },
          output: { $first: "$output" },
          type: { $first: "$type" },
          sessionId: { $first: "$sessionId" }
      }},
      { $sort: { createdAt: -1 } }
    ]);

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
    await Query.deleteMany({ sessionId: id, userId: req.user.id });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in deleteHistory:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
