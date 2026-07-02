import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Copy, Check, Loader2, ArrowUp, Plus, Mic, AudioWaveform, X } from 'lucide-react';

const ChatInterface = ({ onSubmit, loading, messages = [], placeholder }) => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    const el = e.target;
    el.style.overflow = 'hidden';
    el.style.height = '24px';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
    if (el.scrollHeight > 180) el.style.overflow = 'auto';
    setInput(el.value);
  };

  useEffect(() => {
    if (messages.length > 0 && textareaRef.current) {
      setInput('');
      setAttachedFile(null);
      textareaRef.current.style.height = '24px';
    }
  }, [messages.length]);

  const handleSubmit = () => {
    const finalInput = attachedFile
      ? `${input}\n\n[Attached file: ${attachedFile.name}]\n${attachedFile.content}`
      : input;
    if (!finalInput.trim() || loading) return;
    onSubmit(finalInput);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachedFile({ name: file.name, content: ev.target.result });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasInput = input.trim() || attachedFile;

  return (
    <>
      {/* Chat messages */}
      {messages.length > 0 && (
        <div className="messages-area">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? 'user-msg-wrapper' : 'bot-msg-wrapper'}>
              {msg.role === 'user' ? (
                <div className="user-query-display">{msg.content}</div>
              ) : (
                <div className="bot-response-display">
                  <div className="bot-response-header">
                    <Bot size={15} /> DevGenie AI
                  </div>
                  <div className="output-content">
                     <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {idx === messages.length - 1 && loading ? (
                     <Loader2 size={18} className="loader" style={{ marginTop: '0.5rem' }} />
                  ) : (
                    <button className="copy-btn" onClick={() => handleCopy(msg.content)}>
                      {copied ? <><Check size={13} color="#4ade80" /> Copied</> : <><Copy size={13} /> Copy</>}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="input-bar-wrapper">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.js,.ts,.py,.java,.c,.cpp,.html,.css,.json,.md"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Attached file chip */}
        {attachedFile && (
          <div className="attached-file-chip">
            <span>{attachedFile.name}</span>
            <button className="remove-file-btn" onClick={() => setAttachedFile(null)}>
              <X size={12} />
            </button>
          </div>
        )}

        <div className="input-container">
          {/* Plus / attach icon on left */}
          <button
            className="input-icon-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Plus size={18} />
          </button>

          <textarea
            ref={textareaRef}
            className="prompt-input"
            placeholder={placeholder}
            value={input}
            onChange={handleInput}
            disabled={loading}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          {/* Right side icons */}
          <div className="input-right-icons">
            {hasInput ? (
              /* Show send button when there's input */
              <button
                className="submit-btn-icon"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Loader2 size={15} className="loader" /> : <ArrowUp size={15} />}
              </button>
            ) : (
              /* Show mic + waveform when idle */
              <>
                <button className="input-icon-btn" title="Voice input">
                  <Mic size={17} />
                </button>
                <button className="submit-btn-icon" title="Audio">
                  <AudioWaveform size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
