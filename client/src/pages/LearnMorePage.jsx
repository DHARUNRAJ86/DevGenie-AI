import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Terminal, Shield, CheckCircle, ArrowLeft, ArrowRight, Star, Sparkles } from 'lucide-react';

const LearnMorePage = () => {
  const navigate = useNavigate();

  return (
    <div className="lm-page">

      {/* Nav */}
      <nav className="lm-nav">
        <button className="lm-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Home
        </button>
        <div className="lm-logo">
          <Sparkles size={20} style={{ color: '#f59e0b' }} />
          <span>DevGenie AI</span>
        </div>
        <button className="lm-cta-nav-btn" onClick={() => navigate('/auth')}>
          Get Started
        </button>
      </nav>

      {/* Hero Banner */}
      <section className="lm-hero">
        <div className="lm-badge">Discover DevGenie AI</div>
        <h1 className="lm-hero-title">Everything You Need to <span className="lm-cyan">Build Smarter</span></h1>
        <p className="lm-hero-sub">Explore how DevGenie AI transforms the way developers write, debug, and review code.</p>
      </section>

      {/* How It Works */}
      <section className="lm-section lm-white">
        <div className="lm-section-badge">How It Works</div>
        <h2 className="lm-section-title">From Prompt to Production in <span className="lm-cyan">3 Steps</span></h2>
        <div className="lm-steps-grid">
          <div className="lm-step-card">
            <div className="lm-step-num">01</div>
            <h3>Describe Your Task</h3>
            <p>Type your requirement in plain English — from building a REST API to debugging a complex algorithm.</p>
          </div>
          <div className="lm-step-arrow">→</div>
          <div className="lm-step-card">
            <div className="lm-step-num">02</div>
            <h3>AI Agent Activates</h3>
            <p>DevGenie selects the best specialized agent — Architect, Debugger, or Reviewer — to handle your request.</p>
          </div>
          <div className="lm-step-arrow">→</div>
          <div className="lm-step-card">
            <div className="lm-step-num">03</div>
            <h3>Ship Production Code</h3>
            <p>Review the clean, well-structured output and integrate it directly into your project.</p>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section className="lm-section lm-light">
        <div className="lm-section-badge">AI Agents</div>
        <h2 className="lm-section-title">Three Specialized Agents, <span className="lm-indigo">One Platform</span></h2>
        <div className="lm-agents-grid">
          <div className="lm-agent-card lm-agent-code">
            <div className="lm-agent-icon"><Code size={26} /></div>
            <h3>Code Architect</h3>
            <p>Generates full project structures, boilerplate code, APIs, and database schemas from a single description.</p>
            <ul className="lm-feat-list">
              <li><CheckCircle size={14} /> REST &amp; GraphQL API generation</li>
              <li><CheckCircle size={14} /> Design Pattern implementation</li>
              <li><CheckCircle size={14} /> Database schema design</li>
            </ul>
          </div>
          <div className="lm-agent-card lm-agent-debug">
            <div className="lm-agent-icon"><Terminal size={26} /></div>
            <h3>Expert Debugger</h3>
            <p>Analyzes code snippets, identifies root-cause errors, and provides step-by-step fix instructions.</p>
            <ul className="lm-feat-list">
              <li><CheckCircle size={14} /> Root-cause analysis</li>
              <li><CheckCircle size={14} /> Performance bottleneck detection</li>
              <li><CheckCircle size={14} /> Memory leak identification</li>
            </ul>
          </div>
          <div className="lm-agent-card lm-agent-review">
            <div className="lm-agent-icon"><Shield size={26} /></div>
            <h3>Code Reviewer</h3>
            <p>Reviews your code for security vulnerabilities, anti-patterns, and suggests clean-code improvements.</p>
            <ul className="lm-feat-list">
              <li><CheckCircle size={14} /> Security vulnerability scan</li>
              <li><CheckCircle size={14} /> Code quality scoring</li>
              <li><CheckCircle size={14} /> Refactoring suggestions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="lm-section lm-white">
        <div className="lm-section-badge">Loved by Developers</div>
        <h2 className="lm-section-title">What Developers Are <span className="lm-cyan">Saying</span></h2>
        <div className="lm-testimonials-grid">
          {[
            { name: 'Dharun Raj P.', role: 'Full Stack Developer', text: 'DevGenie cut my API development time by 70%. The Code Architect agent is incredible.', stars: 5 },
            { name: 'Priya P.', role: 'Backend Engineer', text: 'The Debugger agent found a race condition I had been chasing for 2 days in under 30 seconds.', stars: 5 },
            { name: 'Dhanushri G.', role: 'Frontend Developer', text: 'Perfect for quick prototyping. Clean, well-commented code every single time.', stars: 5 },
          ].map((t, i) => (
            <div className="lm-testi-card" key={i}>
              <div className="lm-stars">{[...Array(t.stars)].map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}</div>
              <p className="lm-testi-text">"{t.text}"</p>
              <div className="lm-testi-author">
                <div className="lm-author-avatar">{t.name.charAt(0)}</div>
                <div>
                  <span className="lm-author-name">{t.name}</span>
                  <span className="lm-author-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="lm-final-cta">
        <h2>Ready to Build Faster?</h2>
        <p>Join thousands of developers already using DevGenie AI to ship better code.</p>
        <button className="lm-main-btn" onClick={() => navigate('/auth')}>
          Start for Free <ArrowRight size={18} />
        </button>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .lm-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f5f0ff 100%);
          color: #0f172a;
          font-family: 'Inter', sans-serif;
        }

        /* Nav */
        .lm-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 6%;
          background: rgba(240,244,255,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(99,102,241,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .lm-back-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.5rem 1.1rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lm-back-btn:hover {
          border-color: #6366f1;
          color: #6366f1;
          transform: translateX(-3px);
        }

        .lm-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
        }

        .lm-cta-nav-btn {
          background: #6366f1;
          color: #fff;
          border: none;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 0.55rem 1.4rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lm-cta-nav-btn:hover {
          background: #4f46e5;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
        }

        /* Hero Banner */
        .lm-hero {
          padding: 5rem 6% 4rem;
          text-align: center;
          background: linear-gradient(135deg, #eef2ff 0%, #e8eeff 50%, #f5f0ff 100%);
          border-bottom: 1px solid rgba(99,102,241,0.1);
        }

        .lm-badge {
          display: inline-block;
          background: rgba(99,102,241,0.1);
          color: #6366f1;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 0.4rem 1.1rem;
          border-radius: 50px;
          margin-bottom: 1.25rem;
        }

        .lm-hero-title {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -1.5px;
          margin-bottom: 1rem;
          color: #0f172a;
        }

        .lm-hero-sub {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .lm-cyan { color: #06b6d4; }
        .lm-indigo { color: #6366f1; }

        /* Sections */
        .lm-section {
          padding: 5rem 6%;
          text-align: center;
        }

        .lm-white { background: rgba(255,255,255,0.7); backdrop-filter: blur(8px); }
        .lm-light { background: rgba(238,242,255,0.6); backdrop-filter: blur(8px); }

        .lm-section-badge {
          display: inline-block;
          background: rgba(99,102,241,0.1);
          color: #6366f1;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 0.35rem 1rem;
          border-radius: 50px;
          margin-bottom: 0.75rem;
        }

        .lm-section-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 3rem;
          letter-spacing: -1px;
        }

        /* Steps */
        .lm-steps-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .lm-step-card {
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 20px;
          padding: 2rem;
          max-width: 230px;
          text-align: left;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .lm-step-card:hover {
          border-color: #6366f1;
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(99,102,241,0.1);
        }

        .lm-step-num {
          font-size: 2.2rem;
          font-weight: 900;
          color: #e2e8f0;
          line-height: 1;
          margin-bottom: 0.6rem;
        }

        .lm-step-card h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.4rem;
        }

        .lm-step-card p {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.6;
        }

        .lm-step-arrow {
          font-size: 1.6rem;
          color: #cbd5e1;
          flex-shrink: 0;
        }

        /* Agents */
        .lm-agents-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          text-align: left;
        }

        .lm-agent-card {
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid transparent;
          transition: all 0.3s ease;
        }

        .lm-agent-code { background: rgba(99,102,241,0.05); border-color: rgba(99,102,241,0.15); }
        .lm-agent-debug { background: rgba(6,182,212,0.05); border-color: rgba(6,182,212,0.15); }
        .lm-agent-review { background: rgba(34,197,94,0.05); border-color: rgba(34,197,94,0.15); }

        .lm-agent-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.07); }

        .lm-agent-icon {
          width: 50px; height: 50px;
          background: #fff;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          color: #6366f1;
        }

        .lm-agent-debug .lm-agent-icon { color: #06b6d4; }
        .lm-agent-review .lm-agent-icon { color: #22c55e; }

        .lm-agent-card h3 { font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; }
        .lm-agent-card > p { font-size: 0.88rem; color: #64748b; line-height: 1.6; margin-bottom: 1.1rem; }

        .lm-feat-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.45rem; }
        .lm-feat-list li {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.83rem; color: #475569; font-weight: 500;
        }
        .lm-feat-list li svg { color: #22c55e; flex-shrink: 0; }

        /* Testimonials */
        .lm-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          text-align: left;
        }

        .lm-testi-card {
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(99,102,241,0.1);
          border-radius: 20px;
          padding: 1.75rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .lm-testi-card:hover {
          transform: translateY(-4px);
          border-color: #6366f1;
          box-shadow: 0 12px 30px rgba(99,102,241,0.1);
        }

        .lm-stars { display: flex; gap: 3px; margin-bottom: 0.9rem; }

        .lm-testi-text {
          font-size: 0.9rem; color: #334155; line-height: 1.7;
          font-style: italic; margin-bottom: 1.1rem;
        }

        .lm-testi-author { display: flex; align-items: center; gap: 10px; }

        .lm-author-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.88rem; flex-shrink: 0;
        }

        .lm-author-name { display: block; font-size: 0.85rem; font-weight: 700; color: #0f172a; }
        .lm-author-role { display: block; font-size: 0.76rem; color: #94a3b8; }

        /* Final CTA */
        .lm-final-cta {
          padding: 6rem 6%;
          background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
          text-align: center;
          color: #fff;
        }

        .lm-final-cta h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.9rem; letter-spacing: -1px; }
        .lm-final-cta p { font-size: 1.05rem; color: rgba(255,255,255,0.75); margin-bottom: 2.5rem; }

        .lm-main-btn {
          background: #fff; color: #6366f1;
          border: none; padding: 1rem 2.5rem;
          border-radius: 50px; font-size: 1rem; font-weight: 700;
          cursor: pointer; display: inline-flex; align-items: center; gap: 10px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .lm-main-btn:hover { transform: scale(1.06); box-shadow: 0 12px 40px rgba(0,0,0,0.25); }

        @media (max-width: 900px) {
          .lm-hero-title { font-size: 2rem; }
          .lm-steps-grid { flex-direction: column; }
          .lm-step-arrow { transform: rotate(90deg); }
          .lm-agents-grid, .lm-testimonials-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default LearnMorePage;
