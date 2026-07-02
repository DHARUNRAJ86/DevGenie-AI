import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HistorySidebar from './components/HistorySidebar';
import ChatInterface from './components/ChatInterface';
import AgentSelector from './components/AgentSelector';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [selectedAgent, setSelectedAgent] = useState('code');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchHistory(); }, []);

  useEffect(() => {
    if (output || loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, loading]);

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
    setCurrentQuery(input);
    setOutput('');
    try {
      const res = await axios.post(`${API_URL}/ask`, { type: selectedAgent, input });
      if (res.data.success) {
        setOutput(res.data.data.output);
        fetchHistory();
      }
    } catch (err) {
      setOutput(err.response?.data?.details || 'An error occurred. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item) => {
    setSelectedAgent(item.type);
    setCurrentQuery(item.input);
    setOutput(item.output);
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
    setOutput('');
    setCurrentQuery('');
    setSelectedAgent('code');
  };

  const hasContent = output || loading;

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
                <h1>What's on your mind today?</h1>
              </div>
              <ChatInterface
                onSubmit={handleSubmit}
                loading={loading}
                output={output}
                currentQuery={currentQuery}
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
                output={output}
                currentQuery={currentQuery}
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
