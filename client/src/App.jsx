import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import HistorySidebar from './components/HistorySidebar';
import ChatInterface from './components/ChatInterface';
import AgentSelector from './components/AgentSelector';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import LearnMorePage from './pages/LearnMorePage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const GREETINGS = [
  "What's on your mind today?",
  "Ready when you are.",
  "How can I help you build today?",
  "Let's create something amazing.",
  "Describe your next big project.",
  "Need a hand with some code?",
  "Tell me what you're thinking about.",
];

function ChatApp() {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState('code');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAgentPanel, setShowAgentPanel] = useState(false);
  const messagesEndRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  useEffect(() => {
    if (messages.length > 0 || loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Close agent panel on outside click
  useEffect(() => {
    if (!showAgentPanel) return;
    const handler = (e) => {
      if (!e.target.closest('.agent-panel-overlay') && !e.target.closest('.switch-agent-btn')) {
        setShowAgentPanel(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showAgentPanel]);

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
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);

    const sessionId = currentSessionId || Date.now().toString();
    if (!currentSessionId) setCurrentSessionId(sessionId);

    try {
      const res = await axios.post(`${API_URL}/ask`, { type: selectedAgent, input, sessionId });
      if (res.data.success) {
        const botMsg = { role: 'assistant', content: res.data.data.output };
        setMessages((prev) => [...prev, botMsg]);
        fetchHistory();
      }
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        content: err.response?.data?.details || 'An error occurred. Please try again.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = async (item) => {
    setLoading(true);
    setSelectedAgent(item.type || 'code');
    setCurrentSessionId(item.sessionId);
    setShowAgentPanel(false);

    try {
      const res = await axios.get(`${API_URL}/thread/${item.sessionId}`);
      if (res.data.success) {
        const threadMessages = [];
        res.data.data.forEach((msg) => {
          threadMessages.push({ role: 'user', content: msg.input });
          threadMessages.push({ role: 'assistant', content: msg.output });
        });
        setMessages(threadMessages);
      }
    } catch (err) {
      console.error('Failed to fetch thread', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryDelete = async (sessionId) => {
    try {
      const res = await axios.delete(`${API_URL}/history/${sessionId}`);
      if (res.data.success) {
        setHistory((prev) => prev.filter((item) => item.sessionId !== sessionId));
        if (currentSessionId === sessionId) {
          setMessages([]);
          setCurrentSessionId(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleHistoryRename = async (sessionId, newTitle) => {
    try {
      const res = await axios.patch(`${API_URL}/chat/${sessionId}/rename`, { title: newTitle });
      if (res.data.success) {
        setHistory((prev) =>
          prev.map((item) => (item.sessionId === sessionId ? { ...item, title: newTitle } : item))
        );
      }
    } catch (err) {
      console.error('Failed to rename', err);
    }
  };

  const handleHistoryPin = async (sessionId) => {
    try {
      const res = await axios.patch(`${API_URL}/chat/${sessionId}/pin`);
      if (res.data.success) {
        const updated = res.data.data;
        setHistory((prev) =>
          prev.map((item) =>
            item.sessionId === sessionId ? { ...item, isPinned: updated.isPinned } : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to pin/unpin', err);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedAgent('code');
    setCurrentSessionId(null);
    setShowAgentPanel(false);
  };

  const hasContent = messages.length > 0;

  return (
    <div className="app-container">
      <HistorySidebar
        history={history}
        activeSessionId={currentSessionId}
        onHistorySelect={handleHistorySelect}
        onHistoryDelete={handleHistoryDelete}
        onHistoryRename={handleHistoryRename}
        onHistoryPin={handleHistoryPin}
        onNewChat={handleNewChat}
        onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
        isSearchOpen={isSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onProfileClick={() => navigate('/profile')}
      />

      <main className="main-content">
        {/* Top bar — shown during active chat */}
        {hasContent && (
          <div className="main-topbar">
            <div className="topbar-agent-info">
              <span className="topbar-agent-label">
                {selectedAgent === 'code' && '💻 Code Generator'}
                {selectedAgent === 'debug' && '🐞 Bug Fixer'}
                {selectedAgent === 'review' && '🔍 Code Reviewer'}
                {selectedAgent === 'optimize' && '⚡ Optimizer'}
              </span>
            </div>
            <button
              className="switch-agent-btn"
              onClick={() => setShowAgentPanel((v) => !v)}
              title="Switch Agent Mode"
            >
              Switch Agent
            </button>
          </div>
        )}

        {/* Agent panel overlay */}
        {showAgentPanel && (
          <div className="agent-panel-overlay">
            <AgentSelector selected={selectedAgent} onSelect={(a) => { setSelectedAgent(a); setShowAgentPanel(false); }} compact />
          </div>
        )}

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
              <AgentSelector selected={selectedAgent} onSelect={setSelectedAgent} />
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/learn-more" element={<LearnMorePage />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatApp />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
