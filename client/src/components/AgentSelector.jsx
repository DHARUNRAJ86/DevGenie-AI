import React from 'react';
import { Code2, Bug, Eye, Zap } from 'lucide-react';

const AGENTS = [
  { id: 'code',     icon: <Code2 size={14} />, label: 'Write Code',    color: '#6366f1' },
  { id: 'debug',    icon: <Bug  size={14} />,  label: 'Debug Errors',  color: '#f97316' },
  { id: 'review',   icon: <Eye  size={14} />,  label: 'Review Code',   color: '#22c55e' },
  { id: 'optimize', icon: <Zap  size={14} />,  label: 'Optimize',      color: '#eab308' },
];

const AgentSelector = ({ selected, onSelect, compact = false }) => {
  return (
    <div className={`agent-selector${compact ? ' agent-selector--compact' : ''}`}>
      {!compact && (
        <p className="agent-selector-label">Switch Agent Mode</p>
      )}
      <div className="agent-pills">
        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            className={`agent-btn${selected === agent.id ? ' active' : ''}`}
            style={selected === agent.id ? { '--agent-color': agent.color } : {}}
            onClick={() => onSelect(agent.id)}
            title={agent.label}
          >
            {agent.icon}
            {agent.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgentSelector;
