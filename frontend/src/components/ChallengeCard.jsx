import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Defensive ChallengeCard: ensure it behaves safely when props are missing
const ChallengeCard = ({ challenge = {}, onVote = () => {}, onAddSolution = () => {} }) => {
  const statusClass = (challenge.status || '').toLowerCase();
  const voteLabel = `Upvote ${challenge.title || 'challenge'}`;
  const solutionLabel = `Add solution to ${challenge.title || 'challenge'}`;

  return React.createElement(
    'div',
    { className: 'challenge-card' },
    React.createElement(
      'div',
      { className: 'card-header' },
      React.createElement('span', { className: 'cat-badge' }, challenge.cat || 'General'),
      React.createElement('span', { className: `status-badge ${statusClass}` }, challenge.status || 'Unknown')
    ),
    React.createElement(Link, { to: `/challengeroom/${challenge.id}`, className: 'card-title-link' }, React.createElement('h3', { className: 'card-title' }, challenge.title || 'Untitled Challenge')),
    React.createElement(
      'div',
      { className: 'card-meta' },
      React.createElement('span', { className: 'vote-count' }, `${challenge.votes != null ? challenge.votes : 0} votes`),
      React.createElement('span', { className: 'solution-count' }, `${(challenge.solutions && challenge.solutions.length) || 0} solutions`)
    ),
    React.createElement(
      'div',
      { className: 'card-actions' },
      React.createElement(
        'button',
        { type: 'button', className: 'vote-btn', 'aria-label': voteLabel, onClick: () => onVote(challenge.id) },
        '▲ Upvote'
      ),
      React.createElement(
        'button',
        { type: 'button', className: 'solution-btn', 'aria-label': solutionLabel, onClick: () => onAddSolution(challenge.id) },
        'Add Solution'
      )
    ),
    (challenge.solutions && challenge.solutions.length > 0) && React.createElement(
      'div',
      { className: 'solutions-preview', 'aria-live': 'polite' },
      React.createElement('h4', null, 'Latest Solution:'),
      React.createElement('p', { className: 'solution-text' }, (challenge.solutions && challenge.solutions[0] && challenge.solutions[0].text) || '')
    )
  );
};

ChallengeCard.propTypes = {
  challenge: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    cat: PropTypes.string,
    status: PropTypes.string,
    votes: PropTypes.number,
    solutions: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.any, text: PropTypes.string }))
  }),
  onVote: PropTypes.func,
  onAddSolution: PropTypes.func,
};

export default ChallengeCard;
