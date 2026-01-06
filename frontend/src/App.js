import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import Home from './pages/Home';
import Challenges from './pages/Challenges';
import ChallengeRoom from './pages/ChallengeRoom';
import About from './pages/about';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Privacy from './pages/privacy';
import Terms from './pages/terms';
import Contact from './pages/contact';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="logo">
            <img src="/logo192.png" alt="Q.Lab logo" className="logo-img" />
            <span className="logo-text">Q.LAB</span>
          </div>
          <Navbar />
          <div className="sidebar-footer">
            <div className="version">v1.0.0</div>
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challengeroom" element={<ChallengeRoom />} />
            <Route path="/challengeroom/:id" element={<ChallengeRoom />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </main>
      </div>
      <AIChat />
    </Router>
  );
}
