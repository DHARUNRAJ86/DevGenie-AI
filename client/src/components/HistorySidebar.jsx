import React, { useState } from 'react';
import { X, Plus, Search, Library, Box, LayoutGrid, Terminal, ChevronDown, Bot } from 'lucide-react';

const HistorySidebar = ({ history, onHistorySelect, onHistoryDelete, onNewChat, onSearchToggle }) => {
  const [activeItem, setActiveItem] = useState(null);

  const navItems = [
    { id: 'search', icon: <Search size={16} />, label: 'Search chats', action: onSearchToggle },
    { id: 'library', icon: <Library size={16} />, label: 'Library', action: null },
    { id: 'projects', icon: <Box size={16} />, label: 'Projects', action: null },
    { id: 'apps', icon: <LayoutGrid size={16} />, label: 'Apps', action: null },
    { id: 'codex', icon: <Terminal size={16} />, label: 'Codex', action: null },
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
          <div
            key={item.id}
            className={`sidebar-utility-item${activeItem === item.id ? ' nav-active' : ''}`}
            onClick={() => {
              setActiveItem(item.id);
              if (item.action) item.action();
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
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
    </aside>
  );
};

export default HistorySidebar;
