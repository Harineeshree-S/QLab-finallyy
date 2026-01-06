import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import ChallengeCard from '../components/ChallengeCard';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState({ title: '', cat: 'General', description: '' });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    const data = await api.getChallenges();
    setChallenges(data);
    setLoading(false);
  };

  const handleSubmitChallenge = async (e) => {
    e.preventDefault();
    if (!newChallenge.title.trim()) return;
    
    await api.submitChallenge(newChallenge);
    setNewChallenge({ title: '', cat: 'General', description: '' });
    loadChallenges();
  };

  const handleVote = async (id) => {
    await api.voteChallenge(id);
    loadChallenges();
  };

  const navigate = useNavigate();

  const handleAddSolution = (id) => {
    navigate(`/challengeroom/${id}`);
  };

  const categories = ['All', ...new Set(challenges.map(c => c.cat))];
  const filteredChallenges = filter === 'All' 
    ? challenges 
    : challenges.filter(c => c.cat === filter);

  if (loading) return <div className="loading">Initializing Challenge Network...</div>;

  return (
    <div className="view-fade">
      <h1>🌍 Global Innovation Network</h1>

      {/* Create Challenge Form */}
      <form onSubmit={handleSubmitChallenge} className="challenge-form">
        <h2>Deploy New Challenge Node</h2>
        <div className="form-grid">
          <input
            className="form-input"
            placeholder="Challenge Title"
            value={newChallenge.title}
            onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
            required
          />
          <select
            className="form-input"
            value={newChallenge.cat}
            onChange={(e) => setNewChallenge({ ...newChallenge, cat: e.target.value })}
          >
            <option>Logistics</option>
            <option>Energy</option>
            <option>Security</option>
            <option>Environment</option>
            <option>Health</option>
            <option>Finance</option>
            <option>General</option>
          </select>
          <textarea
            className="form-input form-textarea full-width"
            placeholder="Describe the challenge and constraints..."
            value={newChallenge.description}
            onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
            rows="3"
          />
        </div>
        <button type="submit" className="primary-btn">🚀 Deploy Challenge</button>
      </form>

      {/* Filter Bar */}
      <div className="filter-bar">
        <h3>Filter by Category:</h3>
        <div className="filter-tags">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-tag ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="challenges-grid">
        {filteredChallenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onVote={handleVote}
            onAddSolution={handleAddSolution}
          />
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="empty-state">
          <p>No challenges found in this category</p>
        </div>
      )}
    </div>
  );
};

export default Challenges;
