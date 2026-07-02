import React from 'react';
import { Image, Pencil, Search } from 'lucide-react';

const AgentSelector = ({ selected, onSelect }) => {
  return (
    <div className="agent-selector">
      <button 
        className={`agent-btn ${selected === 'code' ? 'active' : ''}`}
        onClick={() => onSelect('code')}
      >
        <Image size={14} /> Write Code
      </button>
      <button 
        className={`agent-btn ${selected === 'debug' ? 'active' : ''}`}
        onClick={() => onSelect('debug')}
      >
        <Pencil size={14} /> Debug errors
      </button>
      <button 
        className={`agent-btn ${selected === 'review' ? 'active' : ''}`}
        onClick={() => onSelect('review')}
      >
        <Search size={14} /> Review code
      </button>
    </div>
  );
};

export default AgentSelector;
