const { GoogleGenAI } = require('@google/genai');
const Query = require('../models/Query');
const Chat = require('../models/Chat');

// Initialize Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, apiVersion: 'v1beta' });

// ─── System Prompts per Agent ────────────────────────────────────────────────
const AGENT_PERSONAS = {
  code: {
    role: 'Software Architect & Full-Stack Developer',
    instruction: `You are DevGenie AI acting as a Software Architect. 
Write clean, production-ready code with proper comments. 
If asked a simple greeting, respond naturally. Only write code when explicitly requested.`,
  },
  debug: {
    role: 'Expert Debugger & Error Analyst',
    instruction: `You are DevGenie AI acting as an Expert Debugger.
Analyze bugs, trace root causes, and provide clear fix explanations with corrected code snippets.
If asked a simple greeting, respond naturally.`,
  },
  review: {
    role: 'Senior Code Reviewer',
    instruction: `You are DevGenie AI acting as a Senior Code Reviewer.
Review code for correctness, performance, security, and best practices. 
Give constructive feedback in structured sections: Issues, Suggestions, Summary.
If asked a simple greeting, respond naturally.`,
  },
  optimize: {
    role: 'Performance Optimization Specialist',
    instruction: `You are DevGenie AI acting as a Performance Optimization Specialist.
Analyze code for time/space complexity, memory usage, and bottlenecks.
Provide optimized alternatives with before/after comparisons and Big-O analysis.
If asked a simple greeting, respond naturally.`,
  },
};

// ─── Multi-model fallback list (verified from API) ──────────────────────────
const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

async function callGemini(contents) {
  let lastError = null;
  for (const modelId of CANDIDATE_MODELS) {
    for (let retry = 0; retry <= 1; retry++) {
      try {
        const response = await ai.models.generateContent({ model: modelId, contents });
        return response.text;
      } catch (error) {
        lastError = error;
        const isTransient =
          error.message?.toLowerCase().includes('demand') ||
          error.message?.toLowerCase().includes('busy') ||
          error.message?.includes('503') ||
          error.message?.includes('429');
        if (isTransient && retry === 0) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        break;
      }
    }
  }
  throw lastError;
}

// ─── POST /api/ask ───────────────────────────────────────────────────────────
exports.askAgent = async (req, res) => {
  try {
    const { type, input, sessionId } = req.body;

    if (!type || !input || !sessionId) {
      return res.status(400).json({ error: 'sessionId, type, and input are required' });
    }

    const persona = AGENT_PERSONAS[type] || AGENT_PERSONAS.code;

    // Fetch previous messages in this session
    const previousMessages = await Query.find({
      sessionId,
      userId: req.user.id,
    }).sort({ createdAt: 1 });

    // Build Gemini multi-turn contents
    const contents = [
      {
        role: 'user',
        parts: [{ text: `SYSTEM: ${persona.instruction}` }],
      },
      {
        role: 'model',
        parts: [{ text: `Understood. I am DevGenie AI — ${persona.role}. Ready to help!` }],
      },
    ];

    previousMessages.forEach((msg) => {
      contents.push({ role: 'user', parts: [{ text: msg.input }] });
      contents.push({ role: 'model', parts: [{ text: msg.output }] });
    });

    contents.push({ role: 'user', parts: [{ text: input }] });

    const aiOutput = await callGemini(contents);

    // ── Determine chat title ────────────────────────────────────────────────
    let title = 'New Chat';
    const existingChat = await Chat.findOne({ sessionId, userId: req.user.id });

    if (existingChat) {
      title = existingChat.title;
    } else {
      const words = input.trim().split(/\s+/);
      const isSmallTalk =
        words.length <= 2 && /^(hi|hello|hey|yo|help|test)$/i.test(words[0]);

      if (isSmallTalk) {
        const typeLabel =
          type === 'code'
            ? 'Development'
            : type === 'debug'
            ? 'Debugging'
            : type === 'review'
            ? 'Review'
            : 'Optimization';
        title = `New ${typeLabel} Chat`;
      } else {
        title = words.slice(0, 6).join(' ');
        if (words.length > 6) title += '...';
      }
    }

    // ── Upsert Chat session document ────────────────────────────────────────
    await Chat.findOneAndUpdate(
      { sessionId, userId: req.user.id },
      { $setOnInsert: { sessionId, userId: req.user.id, title, type } },
      { upsert: true, new: true }
    );

    // ── Save message ────────────────────────────────────────────────────────
    const newQuery = new Query({
      sessionId,
      userId: req.user.id,
      title,
      type,
      input,
      output: aiOutput,
    });

    await newQuery.save();

    return res.status(200).json({ success: true, data: { output: aiOutput, sessionId, title } });
  } catch (error) {
    console.error('Error in askAgent:', error);
    let cleanDetail = error.message;
    try {
      const parsed = JSON.parse(error.message);
      if (parsed.error?.message) cleanDetail = parsed.error.message;
    } catch (_) {}

    if (cleanDetail.includes('429') || cleanDetail.toLowerCase().includes('quota')) {
      cleanDetail = 'The AI is currently at maximum capacity. Please wait about 30 seconds.';
    } else if (
      cleanDetail.toLowerCase().includes('demand') ||
      cleanDetail.toLowerCase().includes('busy')
    ) {
      cleanDetail = 'Models are busy. Please try one more time.';
    }

    return res.status(500).json({ error: 'Internal server error', details: cleanDetail });
  }
};

// ─── GET /api/history ────────────────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).sort({
      isPinned: -1,
      updatedAt: -1,
    });

    return res.status(200).json({ success: true, data: chats });
  } catch (error) {
    console.error('Error in getHistory:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── GET /api/thread/:sessionId ──────────────────────────────────────────────
exports.getChatThread = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const thread = await Query.find({ sessionId, userId: req.user.id }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, data: thread });
  } catch (error) {
    console.error('Error in getChatThread:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── DELETE /api/history/:sessionId ─────────────────────────────────────────
exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    await Promise.all([
      Chat.deleteOne({ sessionId: id, userId: req.user.id }),
      Query.deleteMany({ sessionId: id, userId: req.user.id }),
    ]);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in deleteHistory:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── PATCH /api/chat/:sessionId/rename ──────────────────────────────────────
exports.renameChat = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const chat = await Chat.findOneAndUpdate(
      { sessionId, userId: req.user.id },
      { title: title.trim() },
      { new: true }
    );

    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    return res.status(200).json({ success: true, data: chat });
  } catch (error) {
    console.error('Error in renameChat:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── PATCH /api/chat/:sessionId/pin ─────────────────────────────────────────
exports.pinChat = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const chat = await Chat.findOne({ sessionId, userId: req.user.id });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    chat.isPinned = !chat.isPinned;
    await chat.save();

    return res.status(200).json({ success: true, data: chat });
  } catch (error) {
    console.error('Error in pinChat:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
