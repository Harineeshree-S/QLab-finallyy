import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    // This is a demo form: in production we'd POST to an API endpoint
    setSent(true);
  };

  return (
    <div className="view-fade auth-page">
      <div style={{ maxWidth: 980 }}>
        <h1>Contact Us</h1>
        {sent ? (
          <div className="notice">Thanks! We'll get back to you shortly.</div>
        ) : (
          <form className="contact-form" onSubmit={submit}>
            <div className="row">
              <input className="col" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <input className="col" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
            <div style={{ textAlign: 'right' }}>
              <button className="primary-btn" type="submit">Send Message</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}