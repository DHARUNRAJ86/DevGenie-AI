import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Calendar, Shield, LogOut, 
  Settings, CreditCard, Activity, Bell, ChevronRight, Zap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

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
            <span className="profile-plan-badge">
              <Zap size={14} /> Free Plan
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
                <button className="integration-toggle active">
                  <div className="toggle-knob" />
                </button>
              </div>

              <div className="profile-divider" />

              <div className="profile-danger-zone">
                <div className="danger-text">
                  <h3>Sign Out</h3>
                  <p>Securely log out of your DevGenie account.</p>
                </div>
                <button className="profile-action-btn--danger" onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-tab-pane slide-up">
              <div className="empty-state-panel">
                <Settings size={48} className="empty-state-icon" />
                <h3>Preferences</h3>
                <p>Customize your AI agent settings and UI themes.</p>
                <div className="coming-soon-badge">Coming Soon</div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="profile-tab-pane slide-up">
              <div className="plan-upgrade-banner">
                <div className="banner-content">
                  <h3>DevGenie Pro</h3>
                  <p>Unlock unlimited agents, GPT-4 fallback, and premium generation speed.</p>
                </div>
                <button className="upgrade-btn">Upgrade Now</button>
              </div>
              <div className="current-plan-details">
                <p>Currently on <strong>Free Plan</strong>.</p>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="profile-tab-pane slide-up">
              <div className="empty-state-panel">
                <Activity size={48} className="empty-state-icon" />
                <h3>No recent activity</h3>
                <p>Your session history and statistics will appear here.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
