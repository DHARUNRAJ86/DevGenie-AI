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
  const [theme, setTheme] = useState(() => localStorage.getItem('devgenie-theme') || 'dark');
  const messagesEndRef = useRef(null);

  const { user } = useAuth();

  // Apply theme on mount and on change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devgenie-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

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
  const [activePanel, setActivePanel] = useState(null);

  const handlePanelSelect = (panel) => {
    setActivePanel(panel);
    if (panel) setShowAgentPanel(false);
  };

  /* ── Library Panel ────────────────────────────── */
  const TEMPLATES = [
    { emoji: '🚀', title: 'REST API Boilerplate', prompt: 'Generate a production-ready REST API using Node.js and Express with JWT auth, rate limiting, and MongoDB integration.' },
    { emoji: '🐞', title: 'Debug this Error', prompt: 'Help me debug the following error and explain the root cause with a fix:' },
    { emoji: '🔍', title: 'Code Review', prompt: 'Please review the following code for best practices, security issues, and performance improvements:' },
    { emoji: '⚡', title: 'Optimize Performance', prompt: 'Analyze and optimize the following code for better performance and lower memory usage:' },
    { emoji: '🧪', title: 'Write Unit Tests', prompt: 'Write comprehensive unit tests for the following function using Jest:' },
    { emoji: '📚', title: 'Explain Concept', prompt: 'Explain the following programming concept in simple terms with a practical example:' },
    { emoji: '🔒', title: 'Security Audit', prompt: 'Perform a security audit on the following code and list all vulnerabilities:' },
    { emoji: '🎨', title: 'Refactor Code', prompt: 'Refactor the following code to be cleaner, more readable, and follow SOLID principles:' },
    { emoji: '🗄️', title: 'SQL Query Builder', prompt: 'Write an optimized SQL query to:' },
    { emoji: '🐳', title: 'Dockerize App', prompt: 'Create a production-ready Dockerfile and docker-compose.yml for a Node.js/React application.' },
    { emoji: '📝', title: 'Write Documentation', prompt: 'Generate comprehensive JSDoc documentation for the following functions:' },
    { emoji: '🔧', title: 'Fix TypeScript Errors', prompt: 'Fix all TypeScript type errors in the following code:' },
  ];

  /* ── Projects Panel ───────────────────────────── */
  const [projects, setProjects] = useState([
    { id: 1, name: 'DevGenie AI', lang: 'React / Node.js', updated: '2 mins ago', status: 'active', emoji: '🤖' },
    { id: 2, name: 'E-Commerce API', lang: 'Node.js / MongoDB', updated: '1 hour ago', status: 'idle', emoji: '🛒' },
    { id: 3, name: 'Portfolio Site', lang: 'Next.js / TailwindCSS', updated: 'Yesterday', status: 'idle', emoji: '🌐' },
    { id: 4, name: 'ML Pipeline', lang: 'Python / FastAPI', updated: '3 days ago', status: 'paused', emoji: '🧠' },
  ]);
  const [activeProject, setActiveProject] = useState(1);
  const [newProjectName, setNewProjectName] = useState('');

  const addProject = () => {
    if (!newProjectName.trim()) return;
    const newP = { id: Date.now(), name: newProjectName.trim(), lang: 'New Project', updated: 'Just now', status: 'active', emoji: '📁' };
    setProjects(prev => [...prev, newP]);
    setActiveProject(newP.id);
    setNewProjectName('');
  };

  /* ── Apps Panel ────────────────────────────────── */
  const [mdInput, setMdInput] = useState('# Welcome to Markdown Previewer\n\nType your **markdown** here and see it rendered live.\n\n- List item 1\n- List item 2\n\n```js\nconsole.log("Hello, DevGenie!");\n```');
  const [regexPattern, setRegexPattern] = useState('[A-Za-z]+');
  const [regexInput, setRegexInput] = useState('Hello World from DevGenie AI');
  const [regexFlags, setRegexFlags] = useState('g');
  const [activeApp, setActiveApp] = useState('markdown');

  const getRegexMatches = () => {
    try {
      const re = new RegExp(regexPattern, regexFlags);
      return regexInput.replace(re, m => `<mark>${m}</mark>`);
    } catch { return regexInput; }
  };

  /* ── Playground Panel ─────────────────────────── */
  const [playCode, setPlayCode] = useState(`// DevGenie Playground
// Write JavaScript and click Run ▶

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const results = [];
for (let i = 0; i < 10; i++) {
  results.push(fibonacci(i));
}

console.log("Fibonacci sequence:", results.join(", "));
console.log("Done! 🚀");`);
  const [playOutput, setPlayOutput] = useState('');
  const [playRunning, setPlayRunning] = useState(false);
  const [playLang, setPlayLang] = useState('javascript');

  const runCode = () => {
    setPlayRunning(true);
    setPlayOutput('');
    setTimeout(() => {
      const logs = [];
      const origLog = console.log;
      console.log = (...args) => logs.push(args.map(String).join(' '));
      try {
        // eslint-disable-next-line no-new-func
        new Function(playCode)();
        setPlayOutput(logs.join('\n') || '✅ Code ran successfully with no output.');
      } catch (e) {
        setPlayOutput(`❌ Error: ${e.message}`);
      }
      console.log = origLog;
      setPlayRunning(false);
    }, 600);
  };

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
        onSearchToggle={() => { setIsSearchOpen(!isSearchOpen); }}
        isSearchOpen={isSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onProfileClick={() => navigate('/profile')}
        activePanel={activePanel}
        onPanelSelect={handlePanelSelect}
      />

      <main className="main-content">
        {/* ── Library Panel ── */}
        {activePanel === 'library' && (
          <div className="panel-container">
            <div className="panel-header">
              <div className="panel-header-left">
                <span className="panel-icon">📚</span>
                <div>
                  <h2>Prompt Library</h2>
                  <p>Click any template to instantly send it to the AI</p>
                </div>
              </div>
              <button className="panel-close-btn" onClick={() => handlePanelSelect(null)}>✕ Close</button>
            </div>
            <div className="panel-grid">
              {TEMPLATES.map((t, i) => (
                <button key={i} className="template-card" onClick={() => {
                  handlePanelSelect(null);
                  handleSubmit(t.prompt);
                }}>
                  <span className="template-emoji">{t.emoji}</span>
                  <h4>{t.title}</h4>
                  <p>{t.prompt.slice(0, 80)}…</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Projects Panel ── */}
        {activePanel === 'projects' && (
          <div className="panel-container">
            <div className="panel-header">
              <div className="panel-header-left">
                <span className="panel-icon">📁</span>
                <div>
                  <h2>Projects</h2>
                  <p>Manage and switch between your developer workspaces</p>
                </div>
              </div>
              <button className="panel-close-btn" onClick={() => handlePanelSelect(null)}>✕ Close</button>
            </div>
            <div className="projects-layout">
              <div className="projects-list">
                {projects.map(p => (
                  <div key={p.id} className={`project-card ${activeProject === p.id ? 'project-card--active' : ''}`} onClick={() => setActiveProject(p.id)}>
                    <span className="project-emoji">{p.emoji}</span>
                    <div className="project-info">
                      <h4>{p.name}</h4>
                      <span className="project-lang">{p.lang}</span>
                    </div>
                    <div className="project-meta">
                      <span className={`project-status project-status--${p.status}`}>{p.status}</span>
                      <span className="project-updated">{p.updated}</span>
                    </div>
                  </div>
                ))}
                <div className="project-add-row">
                  <input
                    className="project-add-input"
                    placeholder="New project name..."
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addProject()}
                  />
                  <button className="project-add-btn" onClick={addProject}>+ Add</button>
                </div>
              </div>
              <div className="project-detail">
                {(() => {
                  const p = projects.find(x => x.id === activeProject);
                  if (!p) return null;
                  return (
                    <>
                      <div className="project-detail-header">
                        <span style={{ fontSize: '2.5rem' }}>{p.emoji}</span>
                        <div>
                          <h3>{p.name}</h3>
                          <span className="project-lang">{p.lang}</span>
                        </div>
                      </div>
                      <div className="project-detail-stats">
                        <div className="pds-card"><span className="pds-val">24</span><span className="pds-lbl">Sessions</span></div>
                        <div className="pds-card"><span className="pds-val">1.2k</span><span className="pds-lbl">Lines Gen.</span></div>
                        <div className="pds-card"><span className={`pds-val pds-val--${p.status}`}>{p.status}</span><span className="pds-lbl">Status</span></div>
                        <div className="pds-card"><span className="pds-val">{p.updated}</span><span className="pds-lbl">Last Active</span></div>
                      </div>
                      <button className="project-chat-btn" onClick={() => {
                        handlePanelSelect(null);
                        handleSubmit(`I'm working on the "${p.name}" project (${p.lang}). Let's continue where we left off.`);
                      }}>💬 Chat about this project</button>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ── Apps Panel ── */}
        {activePanel === 'apps' && (
          <div className="panel-container">
            <div className="panel-header">
              <div className="panel-header-left">
                <span className="panel-icon">🧩</span>
                <div>
                  <h2>Mini Apps</h2>
                  <p>Handy developer utilities built right in</p>
                </div>
              </div>
              <button className="panel-close-btn" onClick={() => handlePanelSelect(null)}>✕ Close</button>
            </div>
            <div className="apps-tabs">
              {[{id:'markdown',label:'📝 Markdown Previewer'},{id:'regex',label:'🔍 Regex Tester'}].map(a=>(
                <button key={a.id} className={`apps-tab-btn ${activeApp===a.id?'apps-tab-btn--active':''}`} onClick={()=>setActiveApp(a.id)}>{a.label}</button>
              ))}
            </div>
            {activeApp === 'markdown' && (
              <div className="app-split">
                <div className="app-split-pane">
                  <div className="app-pane-label">Markdown Input</div>
                  <textarea className="app-textarea" value={mdInput} onChange={e=>setMdInput(e.target.value)} spellCheck={false} />
                </div>
                <div className="app-split-pane">
                  <div className="app-pane-label">Live Preview</div>
                  <div className="app-md-preview" dangerouslySetInnerHTML={{ __html: mdInput
                    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
                    .replace(/^## (.+)$/gm,'<h2>$1</h2>')
                    .replace(/^# (.+)$/gm,'<h1>$1</h1>')
                    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g,'<em>$1</em>')
                    .replace(/`{3}[\w]*\n?([\s\S]*?)`{3}/g,'<pre><code>$1</code></pre>')
                    .replace(/`([^`]+)`/g,'<code>$1</code>')
                    .replace(/^- (.+)$/gm,'<li>$1</li>')
                    .replace(/<li>[\s\S]*?<\/li>/g, m=>`<ul>${m}</ul>`)
                    .replace(/\n\n/g,'<br/><br/>')
                  }} />
                </div>
              </div>
            )}
            {activeApp === 'regex' && (
              <div className="regex-app">
                <div className="regex-row">
                  <div className="regex-field">
                    <label>Pattern</label>
                    <input className="regex-input" value={regexPattern} onChange={e=>setRegexPattern(e.target.value)} placeholder="e.g. [A-Za-z]+" />
                  </div>
                  <div className="regex-field regex-flags-field">
                    <label>Flags</label>
                    <input className="regex-input" value={regexFlags} onChange={e=>setRegexFlags(e.target.value)} placeholder="g, i, m" maxLength={5} />
                  </div>
                </div>
                <div className="regex-field" style={{marginTop:'1rem'}}>
                  <label>Test String</label>
                  <textarea className="app-textarea" style={{height:'120px'}} value={regexInput} onChange={e=>setRegexInput(e.target.value)} />
                </div>
                <div className="regex-field" style={{marginTop:'1rem'}}>
                  <label>Matches Highlighted</label>
                  <div className="regex-output" dangerouslySetInnerHTML={{ __html: getRegexMatches() }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Playground Panel ── */}
        {activePanel === 'playground' && (
          <div className="panel-container">
            <div className="panel-header">
              <div className="panel-header-left">
                <span className="panel-icon">⚡</span>
                <div>
                  <h2>Playground</h2>
                  <p>Write, run, and experiment with code in real time</p>
                </div>
              </div>
              <button className="panel-close-btn" onClick={() => handlePanelSelect(null)}>✕ Close</button>
            </div>
            <div className="playground-layout">
              <div className="playground-toolbar">
                <select className="playground-lang-select" value={playLang} onChange={e=>setPlayLang(e.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript (preview)</option>
                </select>
                <button className={`playground-run-btn ${playRunning?'playground-run-btn--running':''}`} onClick={runCode} disabled={playRunning}>
                  {playRunning ? '⏳ Running...' : '▶ Run'}
                </button>
                <button className="playground-clear-btn" onClick={()=>setPlayOutput('')}>🗑 Clear Output</button>
                <button className="playground-ai-btn" onClick={()=>{
                  handlePanelSelect(null);
                  handleSubmit(`Please review and improve the following ${playLang} code:\n\n\`\`\`${playLang}\n${playCode}\n\`\`\``);
                }}>🤖 Review with AI</button>
              </div>
              <div className="playground-split">
                <div className="playground-editor-pane">
                  <div className="pane-label">📝 Editor</div>
                  <textarea
                    className="playground-editor"
                    value={playCode}
                    onChange={e=>setPlayCode(e.target.value)}
                    spellCheck={false}
                  />
                </div>
                <div className="playground-output-pane">
                  <div className="pane-label">🖥 Console Output</div>
                  <pre className="playground-console">
                    {playOutput || <span className="console-placeholder">// Output will appear here when you click ▶ Run</span>}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Normal Chat View ── */}
        {!activePanel && (
          <>
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
          </>
        )}
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
