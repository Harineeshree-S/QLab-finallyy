import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import * as api from '../services/api';

const ChallengeRoom = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [solutionText, setSolutionText] = useState('');
  const [commentText, setCommentText] = useState('');

  const loadChallenges = useCallback(async () => {
    const data = await api.getChallenges();
    setChallenges(data);
    setSelectedChallenge(prev => (prev ? prev : (data.length > 0 ? data[0] : null)));
  }, []);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  // If a route param is present, prefer loading that challenge directly
  const location = useLocation();

  useEffect(() => {
    const m = location.pathname.match(/\/challengeroom\/([^/]+)/);
    const id = m ? m[1] : null;
    if (!id) return;
    (async () => {
      const c = await api.getChallengeById(id);
      if (c) setSelectedChallenge(c);
    })();
  }, [location]);

  const handleSelectChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setSolutionText('');
    setCommentText('');
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!solutionText.trim() || !selectedChallenge) return;
    
    await api.submitSolution(selectedChallenge.id, { text: solutionText });
    setSolutionText('');
    loadChallenges();
    
    const updated = await api.getChallengeById(selectedChallenge.id);
    setSelectedChallenge(updated);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedChallenge) return;
    
    await api.addComment(selectedChallenge.id, { text: commentText });
    setCommentText('');
    loadChallenges();
    
    const updated = await api.getChallengeById(selectedChallenge.id);
    setSelectedChallenge(updated);
  };

  return (
    <div className="view-fade challenge-room">
      <h1> Challenge Room</h1>
      
      <div className="room-layout">
        {/* Sidebar */}
        <aside className="room-sidebar">
          <h3>Active Challenges ({challenges.length})</h3>
          <div className="challenge-list">
            {challenges.map(c => (
              <div
                key={c.id}
                className={`challenge-item ${selectedChallenge?.id === c.id ? 'active' : ''}`}
                onClick={() => handleSelectChallenge(c)}
              >
                <span className="item-icon">🎯</span>
                <div className="item-info">
                  <div className="item-title">{c.title}</div>
                  <div className="item-meta">{c.cat} • {c.votes} votes</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="room-content">
          {selectedChallenge ? (
            <>
              <div className="challenge-detail">
                <div className="detail-header">
                  <h2>{selectedChallenge.title}</h2>
                  <span className="cat-badge-large">{selectedChallenge.cat}</span>
                </div>
                <div className="detail-meta">
                  <span> {selectedChallenge.votes} votes</span>
                  <span className={`status-${selectedChallenge.status.toLowerCase()}`}>
                    {selectedChallenge.status}
                  </span>
                </div>
              </div>

              {/* Solutions Section */}
              <div className="solutions-section">
                <h3> Proposed Solutions ({selectedChallenge.solutions?.length || 0})</h3>
                <div className="solutions-list">
                  {selectedChallenge.solutions && selectedChallenge.solutions.length > 0 ? (
                    selectedChallenge.solutions.map(sol => (
                      <div key={sol.id} className="solution-card">
                        <div className="solution-author">{sol.author || 'Anonymous'}</div>
                        <p className="solution-text">{sol.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="empty-msg">No solutions yet. Be the first to propose one!</p>
                  )}
                </div>

                <form onSubmit={handleSubmitSolution} className="input-form">
                  <textarea
                    placeholder="Propose your solution..."
                    value={solutionText}
                    onChange={(e) => setSolutionText(e.target.value)}
                    rows="4"
                  />
                  <button type="submit" className="submit-btn">Submit Solution</button>
                </form>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <h3> Community Commentary ({selectedChallenge.comments?.length || 0})</h3>
                <div className="comments-list">
                  {selectedChallenge.comments && selectedChallenge.comments.length > 0 ? (
                    selectedChallenge.comments.map(comment => (
                      <div key={comment.id} className="comment-card">
                        <div className="comment-time">
                          {new Date(comment.timestamp).toLocaleString()}
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="empty-msg">No comments yet.</p>
                  )}
                </div>

                <form onSubmit={handleSubmitComment} className="input-form">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button type="submit" className="submit-btn">Add Comment</button>
                </form>
              </div>
            </>
          ) : (
            <div className="empty-state">Select a challenge to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeRoom;
