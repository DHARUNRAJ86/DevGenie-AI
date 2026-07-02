import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HistorySidebar from './components/HistorySidebar';
import ChatInterface from './components/ChatInterface';
import AgentSelector from './components/AgentSelector';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [selectedAgent, setSelectedAgent] = useState('code');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const GREETINGS = [
    "What's on your mind today?",
    "Ready when you are.",
    "How can I help you build today?",
    "Let's create something amazing.",
    "Describe your next big project.",
    "Need a hand with some code?",
    "Tell me what you're thinking about."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 300000); // 5 minutes (300,000 ms)
    return () => clearInterval(interval);
  }, [GREETINGS.length]);

  useEffect(() => { fetchHistory(); }, []);

  useEffect(() => {
    if (messages.length > 0 || loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`);
      if (res.data.success) setHistory(res.data.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleSubmit = async (input) => {
    setLoading(true);
    // Add user message and a placeholder for bot response
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);

    const sessionId = currentSessionId || Date.now().toString();
    if (!currentSessionId) setCurrentSessionId(sessionId);

    try {
      const res = await axios.post(`${API_URL}/ask`, { 
        type: selectedAgent, 
        input, 
        sessionId 
      });
      if (res.data.success) {
        const botMsg = { role: 'assistant', content: res.data.data.output };
        setMessages(prev => [...prev, botMsg]);
        
        // Refetch history to get grouped sessions correctly
        fetchHistory();
      }
    } catch (err) {
      const errorMsg = { 
        role: 'assistant', 
        content: err.response?.data?.details || 'An error occurred. Make sure the backend is running.' 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item) => {
    setSelectedAgent(item.type);
    setCurrentSessionId(item.sessionId); // Load session
    setMessages([
      { role: 'user', content: item.input },
      { role: 'assistant', content: item.output }
    ]);
  };

  const handleHistoryDelete = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/history/${id}`);
      if (res.data.success) setHistory(history.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  // New chat resets everything
  const handleNewChat = () => {
    setMessages([]);
    setSelectedAgent('code');
    setCurrentSessionId(null); // Reset session to generate new one on first msg
  };

  const hasContent = messages.length > 0;

  return (
    <div className="app-container">
      <HistorySidebar
        history={history}
        onHistorySelect={handleHistorySelect}
        onHistoryDelete={handleHistoryDelete}
        onNewChat={handleNewChat}
      />

      <main className="main-content">
        <div className="chat-scroll-area">
          {!hasContent ? (
            <div className="empty-state">
              <div className="hero-header">
                <h1 key={greetingIndex} className="fade-in-up">
                  {GREETINGS[greetingIndex]}
                </h1>
              </div>
              <ChatInterface
                onSubmit={handleSubmit}
                loading={loading}
                messages={messages}
                placeholder="Ask anything..."
              />
              <AgentSelector
                selected={selectedAgent}
                onSelect={setSelectedAgent}
              />
            </div>
          ) : (
            <>
              <ChatInterface
                onSubmit={handleSubmit}
                loading={loading}
                messages={messages}
                placeholder="Ask a follow-up..."
              />
              <div ref={messagesEndRef} style={{ height: '1px' }} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
