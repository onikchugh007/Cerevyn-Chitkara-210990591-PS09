/**
 * API Routes for Adaptive Memory Matching Game
 */

const express = require('express');
const router = express.Router();
const { generateBoard, DIFFICULTY_CONFIG } = require('../services/seedEngine');
const { evaluateSession, ADAPTATION_RULES_DOCUMENTATION } = require('../services/adaptiveEngine');
const { saveSession, getAnalytics, getRecentSessions } = require('../services/sessionStore');

/**
 * GET /api/game/new
 * Generate a new deterministic card board based on seed and difficulty
 */
router.get('/new', (req, res) => {
  try {
    const seed = req.query.seed || `SYN_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const difficulty = req.query.difficulty || 'standard';

    if (req.query.difficulty && !DIFFICULTY_CONFIG[req.query.difficulty]) {
      return res.status(400).json({
        error: `Invalid difficulty. Expected one of: ${Object.keys(DIFFICULTY_CONFIG).join(', ')}`
      });
    }

    const board = generateBoard(seed, difficulty);
    return res.json({
      success: true,
      data: board
    });
  } catch (err) {
    console.error('Error generating board:', err);
    return res.status(500).json({ error: 'Failed to generate board', details: err.message });
  }
});

/**
 * POST /api/game/session
 * Submit session performance and compute explainable adaptation
 */
router.post('/session', (req, res) => {
  try {
    const { seed, difficulty, moves, pairs, elapsedSeconds, clientEvents } = req.body;

    if (moves === undefined || elapsedSeconds === undefined) {
      return res.status(400).json({
        error: 'Missing required session metrics: moves and elapsedSeconds'
      });
    }

    // Evaluate adaptation with explainability
    const adaptation = evaluateSession({
      seed,
      difficulty: difficulty || 'standard',
      moves,
      pairs: pairs || 8,
      elapsedSeconds
    });

    // Save anonymous session record
    const record = saveSession({
      seed: seed || 'UNKNOWN',
      difficulty: difficulty || 'standard',
      moves: Number(moves),
      pairs: Number(pairs) || 8,
      elapsedSeconds: Number(elapsedSeconds),
      metrics: adaptation.metrics,
      adaptation: {
        nextDifficulty: adaptation.nextDifficulty,
        action: adaptation.action,
        ruleId: adaptation.ruleId,
        reasonSummary: adaptation.reasonSummary,
        detailedExplanation: adaptation.detailedExplanation
      },
      clientEventsSummary: clientEvents ? {
        rapidClicksRejected: clientEvents.rapidClicksRejected || 0,
        duplicateClicksIgnored: clientEvents.duplicateClicksIgnored || 0
      } : null
    });

    return res.status(201).json({
      success: true,
      sessionId: record.id,
      adaptation,
      metrics: adaptation.metrics
    });
  } catch (err) {
    console.error('Error recording session:', err);
    return res.status(500).json({ error: 'Failed to process session', details: err.message });
  }
});

/**
 * GET /api/game/analytics
 * Retrieve anonymous historical session analytics
 */
router.get('/analytics', (req, res) => {
  try {
    const analytics = getAnalytics();
    const recent = getRecentSessions(10);
    return res.json({
      success: true,
      analytics,
      recent
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    return res.status(500).json({ error: 'Failed to fetch analytics', details: err.message });
  }
});

/**
 * GET /api/game/rules
 * Returns documented adaptation rules and mathematical thresholds
 */
router.get('/rules', (req, res) => {
  return res.json({
    success: true,
    difficulties: DIFFICULTY_CONFIG,
    rules: ADAPTATION_RULES_DOCUMENTATION
  });
});

module.exports = router;
