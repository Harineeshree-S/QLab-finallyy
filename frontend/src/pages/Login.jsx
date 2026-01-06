import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../services/auth';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const authCtx = useAuth() || {};
  const { setUser } = authCtx;
  const emailRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('qlab_remember_email');
    if (saved) { setEmail(saved); setRemember(true); }
    if (emailRef.current) emailRef.current.focus();
  }, []);

  const handle = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await auth.login({ email, password });
      if (setUser) setUser(data.user || null);
      if (remember) localStorage.setItem('qlab_remember_email', email); else localStorage.removeItem('qlab_remember_email');
      navigate('/');
    } catch (err) {
      setError(err?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-fade auth-page">
      <div className="auth-grid">
        <div className="auth-panel">
          <h1>Welcome back</h1>
          <p className="muted">Sign in to continue to Q.Lab</p>

          <form onSubmit={handle} className="auth-form" aria-live="polite">
            <input ref={emailRef} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <div className="password-row">
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" className="link-btn" onClick={() => setShowPassword(s => !s)} aria-pressed={showPassword}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
            <label className="remember">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember me
            </label>
            {error && <div className="error">{error}</div>}
            <button className="primary-btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          </form>

          <div className="auth-extras">
            <p className="small muted">Don't have an account? <a href="/register">Register</a></p>
          </div>
        </div>

        <aside className="auth-visual">
          <div className="visual-inner">
            <div className="visual-copy">
              <h2>Q.Lab</h2>
              <p className="muted">Collaborate, learn and build with the community.</p>
            </div>
            <div className="visual-cube">
              {/* 3D visual */}
              <img src="/static/media/gradient-blob.svg" alt="decorative blob" style={{ width: 180, height: 180, borderRadius: 18 }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Login;