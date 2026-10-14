/**
 * SessionStore - Persistent Anonymous Session Data Store
 * Records game sessions to memory and optionally syncs with JSON storage file.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data directory:', err.message);
  }
}

// In-memory sessions list with initial fallback
let sessions = [];

// Try to load persisted sessions on startup
try {
  if (fs.existsSync(SESSIONS_FILE)) {
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    sessions = JSON.parse(raw);
  }
} catch (err) {
  console.warn('Could not read existing sessions, starting fresh:', err.message);
  sessions = [];
}

/**
 * Persist sessions to disk asynchronously
 */
function persistSessions() {
  try {
    fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions.slice(-200), null, 2), (err) => {
      if (err) console.error('Failed to save sessions file:', err.message);
    });
  } catch (err) {
    console.error('Persist error:', err.message);
  }
}

/**
 * Save an anonymous session record
 */
function saveSession(sessionRecord) {
  const record = {
    id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...sessionRecord
  };
  sessions.unshift(record);
  // Keep last 200 in memory
  if (sessions.length > 200) sessions = sessions.slice(0, 200);
  persistSessions();
  return record;
}

/**
 * Get recent anonymous sessions
 */
function getRecentSessions(limit = 20) {
  return sessions.slice(0, limit);
}

/**
 * Get aggregate analytics across all recorded sessions
 */
function getAnalytics() {
  const total = sessions.length;
  if (total === 0) {
    return {
      totalSessions: 0,
      difficultyDistribution: { novice: 0, standard: 0, advanced: 0 },
      averageMoves: 0,
      averageTimeSeconds: 0,
      averageEfficiency: 0,
      recentTrend: []
    };
  }

  const difficultyDistribution = { novice: 0, standard: 0, advanced: 0 };
  let sumMoves = 0;
  let sumTime = 0;
  let sumEfficiency = 0;

  sessions.forEach(s => {
    const diff = s.difficulty || 'standard';
    difficultyDistribution[diff] = (difficultyDistribution[diff] || 0) + 1;
    sumMoves += (s.metrics ? s.metrics.actualMoves : (s.moves || 0));
    sumTime += (s.metrics ? s.metrics.elapsedSeconds : (s.elapsedSeconds || 0));
    sumEfficiency += (s.metrics ? s.metrics.efficiency : 0);
  });

  return {
    totalSessions: total,
    difficultyDistribution,
    averageMoves: Number((sumMoves / total).toFixed(1)),
    averageTimeSeconds: Number((sumTime / total).toFixed(1)),
    averageEfficiency: Number((sumEfficiency / total).toFixed(1)),
    recentTrend: sessions.slice(0, 10).map(s => ({
      id: s.id,
      difficulty: s.difficulty,
      moves: s.metrics?.actualMoves || s.moves,
      time: s.metrics?.elapsedSeconds || s.elapsedSeconds,
      efficiency: s.metrics?.efficiency || 0,
      action: s.adaptation?.action || 'MAINTAIN',
      timestamp: s.timestamp
    }))
  };
}

/**
 * Reset sessions (primarily for automated testing)
 */
function clearSessions() {
  sessions = [];
}

module.exports = {
  saveSession,
  getRecentSessions,
  getAnalytics,
  clearSessions
};
