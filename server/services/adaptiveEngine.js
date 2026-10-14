/**
 * AdaptiveEngine - Explainable Meme IQ & Cognitive Load Calibration Engine
 * 
 * Implements mathematically documented, transparent adaptation rules
 * wrapped in entertaining meme culture explainability.
 */

const ADAPTATION_RULES_DOCUMENTATION = [
  {
    from: 'standard',
    to: 'advanced',
    ruleId: 'RULE_PROMOTION_OVERCLOCK',
    trigger: 'Moves <= 14 (Efficiency >= 57%) AND Elapsed Time <= 35s',
    rationale: 'Gigachad memory retention and rapid recognition qualify for 6×6 Galaxy Brain Matrix.'
  },
  {
    from: 'standard',
    to: 'novice',
    ruleId: 'RULE_RECALIBRATE_FATIGUE',
    trigger: 'Moves >= 22 (Efficiency <= 36%) OR Elapsed Time >= 65s',
    rationale: 'Smooth brain hesitation detected (excessive flips/time); recalibrating to 3×4 NPC Grid.'
  },
  {
    from: 'standard',
    to: 'standard',
    ruleId: 'RULE_MAINTAIN_STANDARD',
    trigger: 'Moves between 15-21 AND Elapsed Time between 36-64s',
    rationale: 'Mid-tier performance; maintaining standard 4×4 Dank Meme Matrix.'
  },
  {
    from: 'novice',
    to: 'standard',
    ruleId: 'RULE_NOVICE_GRADUATE',
    trigger: 'Moves <= 10 (Efficiency >= 60%) AND Elapsed Time <= 25s',
    rationale: 'NPC Tutorial cleared; escalating from 3×4 to 4×4 Dank Meme Matrix.'
  },
  {
    from: 'novice',
    to: 'novice',
    ruleId: 'RULE_NOVICE_RETAIN',
    trigger: 'Moves > 10 OR Elapsed Time > 25s',
    rationale: 'Still in tutorial mode; target <= 10 moves & <= 25s to level up.'
  },
  {
    from: 'advanced',
    to: 'standard',
    ruleId: 'RULE_ADVANCED_FALLBACK',
    trigger: 'Moves >= 45 (Efficiency <= 40%) OR Elapsed Time >= 120s',
    rationale: 'Galaxy Brain overload; stepping down to 4×4 to recover composure.'
  },
  {
    from: 'advanced',
    to: 'advanced',
    ruleId: 'RULE_ADVANCED_MASTERY',
    trigger: 'Moves < 45 AND Elapsed Time < 120s',
    rationale: 'Sustained Gigachad status across 18 meme pairs; retaining advanced matrix.'
  }
];

/**
 * Calculates cognitive performance metrics from session raw data
 */
function calculateMetrics({ moves, pairs, elapsedSeconds }) {
  const safeMoves = Math.max(1, Number(moves) || 1);
  const safePairs = Math.max(1, Number(pairs) || 8);
  const safeTime = Math.max(0.1, Number(elapsedSeconds) || 0);

  const theoreticalMinMoves = safePairs;
  const efficiency = Math.round((theoreticalMinMoves / safeMoves) * 100);
  const movesPerPair = Number((safeMoves / safePairs).toFixed(2));
  const timePerPairSeconds = Number((safeTime / safePairs).toFixed(2));

  return {
    theoreticalMinMoves,
    actualMoves: safeMoves,
    pairs: safePairs,
    elapsedSeconds: Number(safeTime.toFixed(1)),
    efficiency,
    movesPerPair,
    timePerPairSeconds
  };
}

/**
 * Evaluates a completed session and determines next difficulty with meme-infused explainability.
 */
function evaluateSession(session) {
  const currentDiff = session.difficulty || 'standard';
  const metrics = calculateMetrics(session);
  const { actualMoves, elapsedSeconds, efficiency } = metrics;

  let nextDifficulty = currentDiff;
  let action = 'MAINTAIN';
  let ruleId = '';
  let reasonSummary = '';
  let detailedExplanation = '';

  if (currentDiff === 'standard') {
    if (actualMoves <= 14 && elapsedSeconds <= 35) {
      nextDifficulty = 'advanced';
      action = 'PROMOTE';
      ruleId = 'RULE_PROMOTION_OVERCLOCK';
      reasonSummary = '🏆 GIGACHAD ASCENSION (200 IQ)';
      detailedExplanation = `Promoted to Gigachad Galaxy Brain (6×6, 18 pairs). You achieved ${efficiency}% efficiency (${actualMoves} moves vs theoretical min 8) and finished in ${elapsedSeconds}s (Threshold: <= 14 moves & <= 35s). Certified Meme Lord!`;
    } else if (actualMoves >= 22 || elapsedSeconds >= 65) {
      nextDifficulty = 'novice';
      action = 'DEMOTE';
      ruleId = 'RULE_RECALIBRATE_FATIGUE';
      reasonSummary = '📉 SMOOTH BRAIN MOMENT (0 IQ)';
      detailedExplanation = `Calibrating down to NPC Tutorial Grid (3×4, 6 pairs). Session required ${actualMoves} moves (${efficiency}% efficiency) and ${elapsedSeconds}s (Threshold exceeded: >= 22 moves or >= 65s). Touch some grass and rebuild your dopamine receptors!`;
    } else {
      nextDifficulty = 'standard';
      action = 'MAINTAIN';
      ruleId = 'RULE_MAINTAIN_STANDARD';
      reasonSummary = '😐 MID TIER DETECTED';
      detailedExplanation = `Maintaining Dank Meme Matrix (4×4). Your performance (${actualMoves} moves, ${elapsedSeconds}s, ${efficiency}% efficiency) is within baseline. Need <= 14 moves and <35s to ascend to Gigachad status!`;
    }
  } else if (currentDiff === 'novice') {
    if (actualMoves <= 10 && elapsedSeconds <= 25) {
      nextDifficulty = 'standard';
      action = 'PROMOTE';
      ruleId = 'RULE_NOVICE_GRADUATE';
      reasonSummary = '✨ NPC STATUS REMOVED';
      detailedExplanation = `Promoted to 4×4 Dank Meme Matrix! Cleared 6 pairs in ${actualMoves} moves (${efficiency}% efficiency) in ${elapsedSeconds}s (Threshold: <= 10 moves & <= 25s). You are no longer an NPC!`;
    } else {
      nextDifficulty = 'novice';
      action = 'MAINTAIN';
      ruleId = 'RULE_NOVICE_RETAIN';
      reasonSummary = '🔄 TUTORIAL CONTINUES';
      detailedExplanation = `Retaining NPC Tutorial Grid (3×4). Solved in ${actualMoves} moves and ${elapsedSeconds}s. Target moves <= 10 and time <= 25s to level up to the real matrix.`;
    }
  } else if (currentDiff === 'advanced') {
    if (actualMoves >= 45 || elapsedSeconds >= 120) {
      nextDifficulty = 'standard';
      action = 'DEMOTE';
      ruleId = 'RULE_ADVANCED_FALLBACK';
      reasonSummary = '🤯 BRAINROT OVERLOAD';
      detailedExplanation = `Stepping down to 4×4 Dank Meme Matrix. The 36-card matrix produced high exploration latency (${actualMoves} moves, ${elapsedSeconds}s). Normalizing baseline.`;
    } else {
      nextDifficulty = 'advanced';
      action = 'MAINTAIN';
      ruleId = 'RULE_ADVANCED_MASTERY';
      reasonSummary = '👑 PEAK GIGACHAD';
      detailedExplanation = `Retaining Gigachad Galaxy Brain (6×6). Outstanding endurance across 18 meme pairs (${actualMoves} moves in ${elapsedSeconds}s). Absolute legend.`;
    }
  }

  return {
    previousDifficulty: currentDiff,
    nextDifficulty,
    action,
    ruleId,
    reasonSummary,
    detailedExplanation,
    metrics,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  ADAPTATION_RULES_DOCUMENTATION,
  calculateMetrics,
  evaluateSession
};
