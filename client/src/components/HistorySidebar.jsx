import React, { useState } from 'react';
import { X, Plus, Search, Library, Box, LayoutGrid, Terminal, ChevronDown, Bot, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HistorySidebar = ({ 
  history, onHistorySelect, onHistoryDelete, onNewChat, 
  onSearchToggle, isSearchOpen, searchQuery, setSearchQuery 
}) => {
  const [activeItem, setActiveItem] = useState(null);
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'search', icon: <Search size={16} />, label: 'Search chats', action: onSearchToggle },
    { id: 'library', icon: <Library size={16} />, label: 'Library', action: () => alert("Library coming soon!") },
    { id: 'projects', icon: <Box size={16} />, label: 'Projects', action: () => alert("Projects coming soon!") },
    { id: 'apps', icon: <LayoutGrid size={16} />, label: 'Apps', action: () => alert("Apps coming soon!") },
    { id: 'codex', icon: <Terminal size={16} />, label: 'Codex', action: () => alert("Codex coming soon!") },
  ];

  return (
    <aside className="history-sidebar">

      {/* Brand logo at the very top */}
      <div className="sidebar-brand">
        <Bot size={18} />
        <span>DevGenie AI</span>
        <ChevronDown size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
      </div>

      <div className="sidebar-top-items">
        {/* New Chat — resets conversation */}
        <div
          className="sidebar-utility-item new-chat"
          onClick={() => { setActiveItem('new'); onNewChat && onNewChat(); }}
        >
          <Plus size={16} />
          <span>New chat</span>
        </div>

        {navItems.map(item => (
          <React.Fragment key={item.id}>
            <div
              className={`sidebar-utility-item${activeItem === item.id || (item.id === 'search' && isSearchOpen) ? ' nav-active' : ''}`}
              onClick={() => {
                setActiveItem(item.id);
                if (item.action) item.action();
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.id === 'search' && isSearchOpen && (
              <div className="search-input-container">
                <input
                  autoFocus
                  type="text"
                  className="search-input"
                  placeholder="Search your chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="history-header">Recents</div>

      <div className="history-list">
        {history.map((item) => (
          <div
            key={item.sessionId}
            className="history-item"
            onClick={() => onHistorySelect(item)}
          >
            <div className="history-item-header">
              <div className="history-item-preview">{item.title}</div>
              <button
                className="delete-history-btn"
                onClick={(e) => { e.stopPropagation(); onHistoryDelete(item.sessionId); }}
                title="Delete"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
            No recents
          </div>
        )}
      </div>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-status">Free Plan</span>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} title="Log Out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default HistorySidebar;
