import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../services/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.register({ email, password, name });
      setMessage(res.verifyUrl ? `Verification URL (dev): ${res.verifyUrl}` : 'Account created; check your email');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage(err?.error || 'Registration failed');
    }
  };

  return (
    <div className="view-fade auth-page">
      <div className="auth-grid">
        <div className="auth-panel">
          <h1>Create account</h1>
          <p className="muted">Join Q.Lab to collaborate and learn with other creators.</p>

          <form onSubmit={handle} className="auth-form">
            <input placeholder="Full name (optional)" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            {message && <div className="message">{message}</div>}
            <button className="primary-btn" type="submit">Create account</button>
          </form>
        </div>

        <aside className="auth-visual">
          <div className="visual-inner">
            <div className="visual-copy">
              <h2>Q.Lab</h2>
              <p className="muted">Build together with the community and share your projects.</p>
            </div>
            <div className="visual-cube">
              <img src="/logo192.png" alt="logo" style={{ width: 140, height: 140, borderRadius: 18 }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Register;