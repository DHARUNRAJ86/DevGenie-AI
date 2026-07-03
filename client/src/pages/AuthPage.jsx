import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </button>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo" onClick={() => navigate('/')}>
            <Sparkles className="icon-gold" size={32} />
            <h2>DevGenie AI</h2>
          </div>
          <p>{isLogin ? 'Welcome back, developer!' : 'Join the elite developer community.'}</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Login
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-msg">{error}</div>}
          
          {!isLogin && (
            <div className="input-group">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              minLength="6"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-footer">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Sign Up' : ' Log In'}
          </span>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .auth-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 40%, #f5f0ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        /* Decorative blobs */
        .auth-container::before {
          content: '';
          position: fixed;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: -100px;
          right: -100px;
          border-radius: 50%;
          pointer-events: none;
        }

        .auth-container::after {
          content: '';
          position: fixed;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%);
          bottom: -80px;
          left: -80px;
          border-radius: 50%;
          pointer-events: none;
        }

        /* Back Button */
        .back-btn {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #475569;
          padding: 0.55rem 1.1rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          z-index: 50;
        }

        .back-btn:hover {
          border-color: #6366f1;
          color: #6366f1;
          transform: translateX(-3px);
          box-shadow: 0 4px 16px rgba(99,102,241,0.15);
        }

        .auth-card {
          background: #fff;
          border: 1px solid rgba(99, 102, 241, 0.1);
          width: 100%;
          max-width: 450px;
          padding: 3rem;
          border-radius: 28px;
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.1), 0 4px 20px rgba(0,0,0,0.05);
          position: relative;
          z-index: 2;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 0.5rem;
          cursor: pointer;
        }

        .auth-logo h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -1px;
        }

        .auth-header p {
          color: #64748b;
          font-size: 0.95rem;
        }

        .auth-tabs {
          display: flex;
          background: #f1f5f9;
          padding: 5px;
          border-radius: 14px;
          margin-bottom: 2rem;
        }

        .auth-tabs button {
          flex: 1;
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 0.75rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .auth-tabs button.active {
          background: #fff;
          color: #6366f1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .input-group input {
          width: 100%;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          padding: 1rem 1rem 1rem 3rem;
          border-radius: 12px;
          color: #0f172a;
          font-size: 0.97rem;
          outline: none;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }

        .input-group input::placeholder {
          color: #94a3b8;
        }

        .input-group input:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
        }

        .error-msg {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #ef4444;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.88rem;
          text-align: center;
        }

        .submit-btn {
          background: #6366f1;
          color: #fff;
          border: none;
          padding: 1.05rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
          margin-top: 0.5rem;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          background: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .auth-footer {
          margin-top: 1.75rem;
          text-align: center;
          color: #64748b;
          font-size: 0.92rem;
        }

        .auth-footer span {
          color: #6366f1;
          font-weight: 700;
          cursor: pointer;
          margin-left: 5px;
        }

        .auth-footer span:hover {
          text-decoration: underline;
        }

        .icon-gold { color: #f59e0b; }
      `}</style>
    </div>
  );
};

export default AuthPage;
