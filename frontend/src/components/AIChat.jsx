import React, { useState, useEffect } from 'react';
import './AIChat.css';
import AIBg from './AIBg';
// three.js version removed to avoid heavy bundle
// import AIBgThree from './AIBgThree';

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE || '';
  const toggleOpen = () => setOpen(!open);

  useEffect(() => {
    let mounted = true;
    if (!open) return;
    (async () => {
      try {
        const resp = await fetch(`${API_BASE}/api/health`);
        if (!mounted) return;
        if (!resp.ok) {
          setError('AI backend unreachable');
        } else {
          setError(null);
        }
      } catch (e) {
        if (!mounted) return;
        setError('AI backend unreachable');
      }
    })();
    return () => { mounted = false; };
  }, [open]);
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, { ...userMessage, id: Date.now() }]);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [userMessage] })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err?.error || 'AI request failed');
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'No response', id: Date.now() }]);
      setInput('');
    } catch (e) {
      console.error('AIChat error', e);
      setError(e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`ai-chat ${open ? 'open' : ''}`}>
      <button aria-label="Open AI chat" className="ai-toggle" onClick={toggleOpen}>
        <img src="/logo192.png" alt="Assistant" className="ai-toggle-img" />
        <span className="ai-toggle-label">Assistant</span>
      </button>

      {open && (
        <div className="ai-panel" role="dialog" aria-label="AI Assistant">
          <div className="ai-header">
            <strong>Q.Lab Assistant</strong>
            <button className="close-btn" onClick={toggleOpen} aria-label="Close chat">✕</button>
          </div>

          <div className={`ai-body ${error ? 'has-error' : ''}`}>
            {/* Canvas fallback background for performance */}
            <AIBg />
            {messages.length === 0 && <div className="ai-empty">Ask me about challenges or get help ideating.</div>}
            {messages.map(m => (
              <div key={m.id} className={`ai-message ${m.role === 'user' ? 'user' : 'assistant'}`}>
                <div className="ai-message-content">{m.content}</div>
              </div>
            ))}
            {error && <div className="ai-error">{error}</div>}
          </div>

          <div className="ai-footer">
            <textarea
              aria-label="Message to AI"
              rows={2}
              value={input}
              placeholder="Ask the assistant..."
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="ai-send" onClick={sendMessage} disabled={loading}>{loading ? '...' : 'Send'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;