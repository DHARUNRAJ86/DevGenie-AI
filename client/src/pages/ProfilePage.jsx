import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Calendar, Shield, LogOut, 
  Settings, CreditCard, Activity, Bell, Zap, Check, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [emailNotify, setEmailNotify] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(user?.plan || 'Free');
  const [prefAgent, setPrefAgent] = useState('Code');
  const [prefStyle, setPrefStyle] = useState('Detailed');
  const [prefFont, setPrefFont] = useState('Fira Code');
  const [prefSaved, setPrefSaved] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardError, setCardError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (user?.plan) {
      setCurrentPlan(user.plan);
    }
  }, [user]);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'N/A';

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const PLANS = [
    { id: 'free', name: 'Free', price: '$0', features: ['Core AI Agents', 'Standard Speed', 'Limited History'], color: '#94a3b8' },
    { id: 'pro', name: 'Pro', price: '$19', features: ['Unlimited Agents', 'Priority Speed', 'GPT-4 Fallback', 'Custom Personas'], color: '#6366f1' },
    { id: 'enterprise', name: 'Team', price: '$49', features: ['Team Collaboration', 'Dedicated Support', 'API Access', 'SSO Auth'], color: '#a855f7' }
  ];

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const completePayment = async () => {
    // Validate
    if (cardNumber.replace(/\s/g, '').length < 16) return setCardError('Please enter a valid 16-digit card number.');
    if (expiry.length < 5) return setCardError('Please enter a valid expiry date (MM/YY).');
    if (cvc.length < 3) return setCardError('CVC must be 3 digits.');
    setCardError('');
    setPaymentProcessing(true);

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const res = await axios.put(`${API_URL}/auth/plan`, 
        { plan: selectedPlan.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setTimeout(() => {
          setPaymentProcessing(false);
          setPaymentSuccess(true);
          setCurrentPlan(selectedPlan.name);
          fetchUser();
        }, 1500);
      }
    } catch (err) {
      setPaymentProcessing(false);
      setCardError(err.response?.data?.error || 'Payment processing failed. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(false);
    setCardError('');
    setCardNumber('');
    setExpiry('');
    setCvc('');
  };

  const formatCardNumber = (v) => {
    const cleaned = v.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (v) => {
    const cleaned = v.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length > 2) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  const savePreferences = () => {
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  return (
    <div className="profile-layout">
      {/* Top Banner */}
      <div className="profile-banner">
        <div className="profile-banner-bg" />
        <button className="profile-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back to Chat
        </button>
      </div>

      <div className="profile-content-wrapper">
        {/* Left Sidebar - Identity */}
        <aside className="profile-sidebar">
          <div className="profile-identity-card">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-large">
                <span>{initial}</span>
              </div>
              <div className="profile-status-dot" />
            </div>
            <h1 className="profile-name">{user?.name || 'User'}</h1>
            <p className="profile-email">{user?.email}</p>
            <span className={`profile-plan-badge ${currentPlan.toLowerCase()}`}>
              <Zap size={14} /> {currentPlan} Plan
            </span>
          </div>

          <nav className="profile-nav-menu">
            <button 
              className={`profile-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <User size={18} /> Account Overview
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> Preferences
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveTab('billing')}
            >
              <CreditCard size={18} /> Billing & Plan
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <Activity size={18} /> Recent Activity
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="profile-main-content">
          {activeTab === 'overview' && (
            <div className="profile-tab-pane slide-up">
              <h2 className="profile-section-title">Account Details</h2>
              
              <div className="profile-info-grid">
                <div className="profile-info-row">
                  <div className="profile-info-icon"><User size={20} /></div>
                  <div className="profile-info-content">
                    <span className="profile-info-label">Full Name</span>
                    <span className="profile-info-value">{user?.name || '—'}</span>
                  </div>
                </div>

                <div className="profile-info-row">
                  <div className="profile-info-icon"><Mail size={20} /></div>
                  <div className="profile-info-content">
                    <span className="profile-info-label">Email Address</span>
                    <span className="profile-info-value">{user?.email || '—'}</span>
                  </div>
                </div>

                <div className="profile-info-row">
                  <div className="profile-info-icon"><Calendar size={20} /></div>
                  <div className="profile-info-content">
                    <span className="profile-info-label">Member Since</span>
                    <span className="profile-info-value">{joinDate}</span>
                  </div>
                </div>

                <div className="profile-info-row">
                  <div className="profile-info-icon"><Shield size={20} /></div>
                  <div className="profile-info-content">
                    <span className="profile-info-label">Security</span>
                    <span className="profile-info-value">Password Secured</span>
                  </div>
                </div>
              </div>

              <div className="profile-divider" />

              <h2 className="profile-section-title">Active Integrations</h2>
              <div className="integration-card">
                <div className="integration-icon bg-indigo">
                  <Bell size={20} />
                </div>
                <div className="integration-details">
                  <h3>Email Notifications</h3>
                  <p>Receive updates about new DevGenie features.</p>
                </div>
                <button 
                  className={`integration-toggle ${emailNotify ? 'active' : ''}`}
                  onClick={() => setEmailNotify(!emailNotify)}
                  aria-label="Toggle Email Notifications"
                >
                  <div className="toggle-knob" />
                </button>
              </div>

              <div className="profile-divider" />

              <div className="profile-danger-zone">
                <div className="danger-text">
                  <h3>Sign Out</h3>
                  <p>Securely log out of your account.</p>
                </div>
                <button className="profile-action-btn--danger" onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-tab-pane slide-up">
              <h2 className="profile-section-title">Preferences</h2>

              <div className="pref-group">
                <div className="pref-label-row">
                  <div className="pref-label-icon"><Settings size={18} /></div>
                  <div>
                    <h4>Default AI Agent</h4>
                    <p>Choose which agent starts by default in new chats.</p>
                  </div>
                </div>
                <div className="pref-select-row">
                  {['Code', 'Debug', 'Review', 'Optimize'].map((a) => (
                    <button
                      key={a}
                      className={`pref-chip ${prefAgent === a ? 'active' : ''}`}
                      onClick={() => setPrefAgent(a)}
                    >
                      {a === 'Code' ? '👨‍💻' : a === 'Debug' ? '🐞' : a === 'Review' ? '🔍' : '⚡'} {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pref-divider" />

              <div className="pref-group">
                <div className="pref-label-row">
                  <div className="pref-label-icon"><Bell size={18} /></div>
                  <div>
                    <h4>Response Style</h4>
                    <p>How should DevGenie write its answers?</p>
                  </div>
                </div>
                <div className="pref-select-row">
                  {['Concise', 'Detailed', 'Creative'].map((s) => (
                    <button
                      key={s}
                      className={`pref-chip ${prefStyle === s ? 'active' : ''}`}
                      onClick={() => setPrefStyle(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pref-divider" />

              <div className="pref-group">
                <div className="pref-label-row">
                  <div className="pref-label-icon"><Shield size={18} /></div>
                  <div>
                    <h4>Code Font</h4>
                    <p>Font used inside code blocks in responses.</p>
                  </div>
                </div>
                <div className="pref-select-row">
                  {['Fira Code', 'JetBrains Mono', 'Cascadia'].map((f) => (
                    <button
                      key={f}
                      className={`pref-chip ${prefFont === f ? 'active' : ''}`}
                      onClick={() => setPrefFont(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pref-save-row">
                <button className="pref-save-btn" onClick={savePreferences}>
                  {prefSaved ? <><Check size={16} /> Saved!</> : 'Save Preferences'}
                </button>
                {prefSaved
                  ? <span className="pref-saved-msg"><Check size={14} /> Preferences saved successfully!</span>
                  : <span className="pref-save-hint">Changes apply immediately</span>
                }
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="profile-tab-pane slide-up">
              <h2 className="profile-section-title">Subscription Plans</h2>
              <div className="plans-grid">
                {PLANS.map((plan) => (
                  <div key={plan.id} className={`plan-card ${currentPlan === plan.name ? 'plan-card--active' : ''}`}>
                    <div className="plan-header">
                      <h3>{plan.name}</h3>
                      <div className="plan-price">{plan.price}<span>/mo</span></div>
                    </div>
                    <ul className="plan-features">
                      {plan.features.map((f, i) => (
                        <li key={i}><Check size={14} /> {f}</li>
                      ))}
                    </ul>
                    {currentPlan === plan.name ? (
                      <button className="plan-btn plan-btn--disabled">Current Plan</button>
                    ) : (
                      <button className="plan-btn" onClick={() => handleUpgrade(plan)}>Choose Plan</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="profile-tab-pane slide-up">
              <h2 className="profile-section-title">Recent Activity</h2>

              <div className="activity-stats-row">
                <div className="activity-stat">
                  <span className="activity-stat-value">12</span>
                  <span className="activity-stat-label">Chats Today</span>
                </div>
                <div className="activity-stat">
                  <span className="activity-stat-value">84</span>
                  <span className="activity-stat-label">Total Sessions</span>
                </div>
                <div className="activity-stat">
                  <span className="activity-stat-value">Code</span>
                  <span className="activity-stat-label">Top Agent</span>
                </div>
                <div className="activity-stat">
                  <span className="activity-stat-value">1.2k</span>
                  <span className="activity-stat-label">Lines Generated</span>
                </div>
              </div>

              <div className="profile-divider" />

              <h2 className="profile-section-title">Session Timeline</h2>
              <div className="activity-timeline">
                {[
                  { agent: '👨‍💻 Code', title: 'Build a REST API in Express.js', time: '2 min ago', color: '#6366f1' },
                  { agent: '🐞 Debug', title: 'Fix undefined reference error', time: '1 hr ago', color: '#06b6d4' },
                  { agent: '🔍 Review', title: 'Review authentication middleware', time: 'Yesterday', color: '#22c55e' },
                  { agent: '⚡ Optimize', title: 'Optimize SQL query performance', time: 'Yesterday', color: '#f59e0b' },
                  { agent: '👨‍💻 Code', title: 'Create React dashboard components', time: '2 days ago', color: '#6366f1' },
                ].map((item, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-dot" style={{ background: item.color }} />
                    <div className="activity-body">
                      <span className="activity-agent" style={{ color: item.color }}>{item.agent}</span>
                      <p className="activity-title">{item.title}</p>
                    </div>
                    <span className="activity-time">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <button className="modal-close" onClick={handleCloseModal}><X size={20} /></button>
            
            {paymentSuccess ? (
              <div className="payment-success-screen">
                <div className="success-icon">
                  <Check size={36} />
                </div>
                <h2 className="success-title">Plan Activated!</h2>
                <div className="success-messages">
                  <p className="success-msg-primary">
                    Successfully activated to your account and enjoy your journey
                  </p>
                  <p className="success-msg-secondary">
                    Check your profile and also logout later
                  </p>
                </div>
                <button className="success-close-btn" onClick={handleCloseModal}>
                  Start Journey
                </button>
              </div>
            ) : (
              <>
                <div className="payment-header">
                  <div className="payment-icon"><CreditCard size={32} /></div>
                  <h2>Complete Upgrade</h2>
                  <p>Upgrading to <strong>{selectedPlan?.name}</strong> — {selectedPlan?.price}/mo</p>
                </div>

                <div className="payment-form">
                  <div className="form-group">
                    <label htmlFor="card-num">Card Number</label>
                    <input
                      id="card-num"
                      className="pay-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      maxLength={19}
                      onChange={(e) => { setCardError(''); setCardNumber(formatCardNumber(e.target.value)); }}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiry">Expiry</label>
                      <input
                        id="expiry"
                        className="pay-input"
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={expiry}
                        maxLength={5}
                        onChange={(e) => { setCardError(''); setExpiry(formatExpiry(e.target.value)); }}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvc">CVC</label>
                      <input
                        id="cvc"
                        className="pay-input"
                        type="password"
                        inputMode="numeric"
                        placeholder="•••"
                        value={cvc}
                        maxLength={3}
                        onChange={(e) => { setCardError(''); setCvc(e.target.value.replace(/\D/g, '')); }}
                      />
                    </div>
                  </div>
                  {cardError && <p className="card-error">{cardError}</p>}
                  <button
                    className={`pay-now-btn ${paymentProcessing ? 'processing' : ''}`}
                    onClick={completePayment}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? 'Processing…' : `Pay ${selectedPlan?.price} & Activate`}
                  </button>
                  <p className="payment-safety">
                    <Shield size={14} /> Securely encrypted by DevGenie Pay
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
