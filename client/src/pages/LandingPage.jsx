import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Shield, Zap, Code, Sparkles, Bot, CheckCircle, Terminal, GitBranch } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const learnMoreRef = useRef(null);
  const [text, setText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [loopNum, setLoopNum] = React.useState(0);
  const [typingSpeed, setTypingSpeed] = React.useState(150);

  const phrases = ['Development Partner', 'Code Architect', 'Expert Debugger', 'AI Assistant'];

  React.useEffect(() => {
    let timer = setTimeout(() => {
      handleType();
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, typingSpeed]);

  const handleType = () => {
    const i = loopNum % phrases.length;
    const fullText = phrases[i];
    setText(isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1)
    );
    setTypingSpeed(isDeleting ? 80 : 150);
    if (!isDeleting && text === fullText) {
      setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
    }
  };

  const statsData = [
    { value: '10x', label: 'Faster Coding' },
    { value: '99%', label: 'Accuracy' },
    { value: '3', label: 'AI Agents' },
  ];

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo">
          <Sparkles className="icon-gold" size={24} />
          <span>DevGenie AI</span>
        </div>
        <button className="nav-btn" onClick={() => navigate('/auth')}>Login</button>
      </nav>

      <header className="hero-section">
        {/* Left Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <Bot size={14} />
            <span>AI-Powered Development</span>
          </div>
          <h1 className="hero-title">
            Your Ultimate <span className="gradient-text">AI POWERED</span> <br />
            <span className="typewriter">{text}</span>
            <span className="cursor">|</span>
          </h1>
          <p className="hero-subtitle">
            Accelerate your workflow with specialized agents for architecting, debugging, and reviewing code.
            Experience the future of development today.
          </p>
          <div className="hero-actions">
            <button className="get-started-btn" onClick={() => navigate('/auth')}>
              Get Started <Rocket size={18} />
            </button>
            <button className="secondary-btn" onClick={() => navigate('/learn-more')}>
              Learn More
            </button>
          </div>
          <div className="stats-row">
            {statsData.map((s, i) => (
              <div className="stat-item" key={i}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content — Visual Panel */}
        <div className="hero-right-panel">
          {/* AI Chat Card */}
          <div className="ai-chat-card">
            <div className="chat-card-header">
              <Bot size={16} className="chat-bot-icon" />
              <span>DevGenie AI</span>
              <span className="live-dot"></span>
            </div>
            <div className="chat-messages">
              <div className="chat-msg user-msg">Write a REST API in Node.js</div>
              <div className="chat-msg bot-msg">
                <span className="code-line"><span className="kw">const</span> app = express();</span>
                <span className="code-line"><span className="kw">app</span>.get(<span className="str">'/api'</span>, handler);</span>
                <span className="code-line"><span className="kw">app</span>.listen(<span className="num">5000</span>);</span>
              </div>
            </div>
            <div className="chat-input-bar">
              <span>Ask DevGenie anything...</span>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="feature-highlights">
            {[
              { icon: <Code size={16} />, text: 'Smart Code Generation' },
              { icon: <Terminal size={16} />, text: 'Instant Debugging' },
              { icon: <GitBranch size={16} />, text: 'Architecture Review' },
              { icon: <CheckCircle size={16} />, text: 'Best Practice Enforcement' },
            ].map((f, i) => (
              <div className="highlight-chip" key={i}>
                <span className="chip-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="features-grid">
        <div className="feature-card">
          <Code className="feature-icon" />
          <h3>Smart Architect</h3>
          <p>Generate production-ready code structures and architectural patterns in seconds.</p>
        </div>
        <div className="feature-card">
          <Zap className="feature-icon" />
          <h3>Fast Debugger</h3>
          <p>Instantly identify bottlenecks and fix bugs with intelligent suggestions.</p>
        </div>
        <div className="feature-card">
          <Shield className="feature-icon" />
          <h3>Secure Review</h3>
          <p>Comprehensive code reviews focused on security, performance, and best practices.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 DevGenie AI. Built for the modern developer.</p>
      </footer>


      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');

        .landing-container {
          min-height: 100vh;
          background: #f0f4ff;
          color: #1a1a2e;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 5%;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(240, 244, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(99, 102, 241, 0.1);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.4rem;
          font-weight: 800;
          color: #1a1a2e;
          letter-spacing: -0.5px;
        }

        .icon-gold { color: #f59e0b; }

        .nav-btn {
          background: #6366f1;
          border: none;
          color: #fff;
          padding: 0.6rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-btn:hover {
          background: #4f46e5;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        /* Hero */
        .hero-section {
          padding: 4rem 5% 6rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 3rem;
          min-height: 85vh;
        }

        .hero-content {
          flex: 1;
          max-width: 580px;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.25);
          color: #6366f1;
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: 3.2rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.25rem;
          letter-spacing: -1.5px;
          color: #0f172a;
        }

        .gradient-text {
          color: #6366f1;
          background: none;
          -webkit-text-fill-color: initial;
        }

        .typewriter {
          color: #06b6d4;
        }

        .cursor {
          color: #06b6d4;
          animation: blink 1s infinite;
          margin-left: 2px;
        }

        @keyframes blink { 50% { opacity: 0; } }

        .hero-subtitle {
          font-size: 1.05rem;
          color: #64748b;
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .get-started-btn {
          background: #6366f1;
          color: #fff;
          padding: 0.9rem 2rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
        }

        .get-started-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.45);
        }

        .secondary-btn {
          background: transparent;
          border: 1.5px solid #cbd5e1;
          color: #475569;
          padding: 0.9rem 2rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .secondary-btn:hover {
          border-color: #6366f1;
          color: #6366f1;
          background: rgba(99, 102, 241, 0.04);
        }

        /* Stats */
        .stats-row {
          display: flex;
          gap: 2.5rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #6366f1;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.78rem;
          color: #94a3b8;
          margin-top: 2px;
          font-weight: 500;
        }

        /* Right Panel */
        .hero-right-panel {
          flex: 1;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* AI Chat Card */
        .ai-chat-card {
          background: #1e1b4b;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(99, 102, 241, 0.2), 0 0 0 1px rgba(99, 102, 241, 0.15);
        }

        .chat-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.9rem 1.25rem;
          background: rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          color: #e2e8f0;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .chat-bot-icon { color: #818cf8; }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          margin-left: auto;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
        }

        .chat-messages {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .chat-msg {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .user-msg {
          background: rgba(99, 102, 241, 0.25);
          color: #c7d2fe;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .bot-msg {
          background: rgba(255, 255, 255, 0.04);
          color: #e2e8f0;
          border-bottom-left-radius: 4px;
          font-family: 'Fira Code', monospace;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .code-line { display: block; }
        .kw { color: #818cf8; }
        .str { color: #86efac; }
        .num { color: #fbbf24; }

        .chat-input-bar {
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: #475569;
          font-size: 0.83rem;
        }

        /* Feature Highlights */
        .feature-highlights {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .highlight-chip {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #334155;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: all 0.2s ease;
        }

        .highlight-chip:hover {
          border-color: #6366f1;
          color: #6366f1;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.12);
        }

        .chip-icon {
          color: #6366f1;
          display: flex;
        }

        /* Features Grid */
        .features-grid {
          padding: 4rem 5%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          background: #eef2ff;
        }

        .feature-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          padding: 2rem;
          border-radius: 20px;
          transition: all 0.3s ease;
          color: #0f172a;
        }

        .feature-card:hover {
          border-color: #6366f1;
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.12);
        }

        .feature-icon {
          color: #6366f1;
          margin-bottom: 1.25rem;
          width: 36px;
          height: 36px;
        }

        .feature-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          font-weight: 700;
          color: #0f172a;
        }

        .feature-card p {
          color: #64748b;
          line-height: 1.6;
          font-size: 0.93rem;
        }

        .landing-footer {
          padding: 3rem 5%;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          color: #94a3b8;
          background: #f0f4ff;
          font-size: 0.9rem;
        }

        @media (max-width: 900px) {
          .hero-section { flex-direction: column; padding-top: 3rem; }
          .hero-title { font-size: 2.2rem; }
          .hero-right-panel { max-width: 100%; width: 100%; }
          .steps-grid { flex-direction: column; align-items: center; }
          .step-arrow { transform: rotate(90deg); }
          .agents-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
        }

        /* ─── Learn More Wrapper ─── */
        .learn-more-wrapper {
          background: #f8faff;
          border-top: 1px solid #e2e8f0;
          scroll-margin-top: 80px;
        }

        /* Section common */
        .section-badge {
          display: inline-block;
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 0.35rem 1rem;
          border-radius: 50px;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 3rem;
          letter-spacing: -1px;
        }

        .highlight-cyan { color: #06b6d4; }
        .highlight-indigo { color: #6366f1; }

        /* How It Works */
        .how-it-works {
          padding: 5rem 8%;
          text-align: center;
        }

        .steps-grid {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .step-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 2rem;
          max-width: 240px;
          text-align: left;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        .step-card:hover {
          border-color: #6366f1;
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(99, 102, 241, 0.12);
        }

        .step-num {
          font-size: 2.5rem;
          font-weight: 900;
          color: #e2e8f0;
          line-height: 1;
          margin-bottom: 0.75rem;
        }

        .step-card h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .step-card p {
          font-size: 0.87rem;
          color: #64748b;
          line-height: 1.6;
        }

        .step-arrow {
          font-size: 1.8rem;
          color: #cbd5e1;
          font-weight: 300;
          flex-shrink: 0;
        }

        /* Agents Section */
        .agents-section {
          padding: 5rem 8%;
          background: #fff;
          text-align: center;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          text-align: left;
        }

        .agent-detail-card {
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid transparent;
          transition: all 0.3s ease;
        }

        .agent-code { background: rgba(99, 102, 241, 0.05); border-color: rgba(99, 102, 241, 0.15); }
        .agent-debug { background: rgba(6, 182, 212, 0.05); border-color: rgba(6, 182, 212, 0.15); }
        .agent-review { background: rgba(34, 197, 94, 0.05); border-color: rgba(34, 197, 94, 0.15); }

        .agent-detail-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }

        .agent-icon-wrap {
          width: 54px;
          height: 54px;
          background: #fff;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          color: #6366f1;
        }

        .agent-debug .agent-icon-wrap { color: #06b6d4; }
        .agent-review .agent-icon-wrap { color: #22c55e; }

        .agent-detail-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.6rem;
        }

        .agent-detail-card > p {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        .agent-features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .agent-features-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #475569;
          font-weight: 500;
        }

        .agent-features-list li svg { color: #22c55e; flex-shrink: 0; }

        /* Testimonials */
        .testimonials-section {
          padding: 5rem 8%;
          background: #f0f4ff;
          text-align: center;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          text-align: left;
        }

        .testimonial-card {
          background: #fff;
          border-radius: 20px;
          padding: 1.75rem;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(99, 102, 241, 0.1);
          border-color: #6366f1;
        }

        .stars-row {
          display: flex;
          gap: 3px;
          margin-bottom: 1rem;
        }

        .testimonial-text {
          font-size: 0.92rem;
          color: #334155;
          line-height: 1.7;
          margin-bottom: 1.25rem;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .author-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .author-name {
          display: block;
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
        }

        .author-role {
          display: block;
          font-size: 0.78rem;
          color: #94a3b8;
        }

        /* Final CTA */
        .final-cta {
          padding: 6rem 8%;
          background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
          text-align: center;
          color: #fff;
        }

        .final-cta h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -1px;
        }

        .final-cta p {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 2.5rem;
        }

        .cta-main-btn {
          background: #fff;
          color: #6366f1;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .cta-main-btn:hover {
          transform: scale(1.06);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
