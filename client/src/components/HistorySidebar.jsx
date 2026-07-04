import React, { useState, useRef, useEffect } from 'react';
import {
  X, Plus, Search, Library, Box, LayoutGrid, Terminal, ChevronDown,
  Bot, LogOut, MoreHorizontal, Pencil, Pin, PinOff, Trash2, Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Time grouping helper ────────────────────────────────────────────────────
function getGroupLabel(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'Last 7 Days';
  return 'Older';
}

const GROUP_ORDER = ['Pinned', 'Today', 'Yesterday', 'Last 7 Days', 'Older'];

function groupHistory(history) {
  const groups = {};
  history.forEach((item) => {
    const label = item.isPinned ? 'Pinned' : getGroupLabel(item.updatedAt || item.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });
  return groups;
}

// ─── Single history item with context menu ──────────────────────────────────
function HistoryItem({ item, isActive, onSelect, onDelete, onRename, onPin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(item.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef(null);
  const renameRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setShowDeleteConfirm(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Auto-focus rename input
  useEffect(() => {
    if (renaming) renameRef.current?.focus();
  }, [renaming]);

  const handleRenameSubmit = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== item.title) onRename(item.sessionId, trimmed);
    setRenaming(false);
    setMenuOpen(false);
  };

  return (
    <div
      className={`history-item${isActive ? ' history-item--active' : ''}`}
      onClick={() => !renaming && onSelect(item)}
    >
      {renaming ? (
        <div className="history-rename-row" onClick={(e) => e.stopPropagation()}>
          <input
            ref={renameRef}
            className="history-rename-input"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') { setRenaming(false); setRenameValue(item.title); }
            }}
          />
          <button className="history-rename-confirm" onClick={handleRenameSubmit} title="Save">
            <Check size={13} />
          </button>
        </div>
      ) : (
        <div className="history-item-header">
          {item.isPinned && <Pin size={10} className="history-pin-icon" />}
          <div className="history-item-preview">{item.title}</div>

          <div className="history-item-actions" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              className="history-menu-btn"
              onClick={() => { setMenuOpen((v) => !v); setShowDeleteConfirm(false); }}
              title="Options"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <div className="history-context-menu">
                {!showDeleteConfirm ? (
                  <>
                    <button className="ctx-item" onClick={() => { setRenaming(true); setMenuOpen(false); }}>
                      <Pencil size={13} /> Rename
                    </button>
                    <button className="ctx-item" onClick={() => { onPin(item.sessionId); setMenuOpen(false); }}>
                      {item.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
                      {item.isPinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button className="ctx-item ctx-item--danger" onClick={() => setShowDeleteConfirm(true)}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </>
                ) : (
                  <div className="ctx-delete-confirm">
                    <p>Delete this chat?</p>
                    <div className="ctx-confirm-btns">
                      <button className="ctx-confirm-yes" onClick={() => { onDelete(item.sessionId); setMenuOpen(false); }}>
                        Delete
                      </button>
                      <button className="ctx-confirm-no" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Sidebar ────────────────────────────────────────────────────────────
const HistorySidebar = ({
  history, activeSessionId, onHistorySelect, onHistoryDelete, onHistoryRename,
  onHistoryPin, onNewChat, onSearchToggle, isSearchOpen, searchQuery, setSearchQuery, onProfileClick,
  activePanel, onPanelSelect,
}) => {
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'search',   icon: <Search size={16} />,     label: 'Search chats', action: onSearchToggle },
    { id: 'library',  icon: <Library size={16} />,    label: 'Library',      action: () => onPanelSelect('library') },
    { id: 'projects', icon: <Box size={16} />,        label: 'Projects',     action: () => onPanelSelect('projects') },
    { id: 'apps',     icon: <LayoutGrid size={16} />, label: 'Apps',         action: () => onPanelSelect('apps') },
    { id: 'playground', icon: <Terminal size={16} />,   label: 'Playground',   action: () => onPanelSelect('playground') },
  ];

  // Filter by search query
  const filtered = history.filter(
    (h) => h?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped = groupHistory(filtered);

  return (
    <aside className="history-sidebar">
      {/* Brand */}
      <div className="sidebar-brand" onClick={() => onPanelSelect(null)}>
        <Bot size={18} />
        <span>DevGenie AI</span>
        <ChevronDown size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
      </div>

      <div className="sidebar-top-items">
        {/* New Chat */}
        <div
          className="sidebar-utility-item new-chat"
          onClick={() => { onPanelSelect(null); onNewChat?.(); }}
        >
          <Plus size={16} />
          <span>New chat</span>
        </div>

        {navItems.map((item) => (
          <React.Fragment key={item.id}>
            <div
              className={`sidebar-utility-item${(item.id === 'search' && isSearchOpen) || (activePanel === item.id) ? ' nav-active' : ''}`}
              onClick={() => {
                if (item.id !== 'search') {
                  // If we are clicking library/projects/apps/playground, open it
                  item.action?.();
                } else {
                  onPanelSelect(null); // Close active panels when searching
                  item.action?.();
                }
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

      {/* Grouped history list */}
      <div className="history-list">
        {GROUP_ORDER.map((group) => {
          const items = grouped[group];
          if (!items?.length) return null;
          return (
            <div key={group} className="history-group">
              <div className="history-group-label">{group}</div>
              {items.map((item) => (
                <HistoryItem
                  key={item.sessionId}
                  item={item}
                  isActive={item.sessionId === activeSessionId && !activePanel}
                  onSelect={(selected) => {
                    onPanelSelect(null); // Return to chat when selecting history
                    onHistorySelect(selected);
                  }}
                  onDelete={onHistoryDelete}
                  onRename={onHistoryRename}
                  onPin={onHistoryPin}
                />
              ))}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="history-empty">
            {searchQuery ? 'No chats match your search.' : 'No recent chats.'}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-labels">
          <span className="footer-label-text">Profile</span>
          <span className="footer-label-text">Log Out</span>
        </div>
        <div className="sidebar-footer-controls">
          <div className="user-profile" onClick={onProfileClick} style={{ cursor: 'pointer' }} title="View Profile">
            <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-status">{(user?.plan || 'Free')} Plan</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default HistorySidebar;
