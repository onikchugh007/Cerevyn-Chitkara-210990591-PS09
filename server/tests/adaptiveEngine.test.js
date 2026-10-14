const { evaluateSession, calculateMetrics } = require('../services/adaptiveEngine');

describe('AdaptiveEngine Tests', () => {
  describe('calculateMetrics', () => {
    test('accurately calculates theoretical moves and efficiency', () => {
      const metrics = calculateMetrics({ moves: 10, pairs: 8, elapsedSeconds: 20 });
      expect(metrics.theoreticalMinMoves).toBe(8);
      expect(metrics.actualMoves).toBe(10);
      expect(metrics.efficiency).toBe(80); // (8 / 10) * 100
      expect(metrics.movesPerPair).toBe(1.25);
    });

    test('handles 100% perfect play', () => {
      const metrics = calculateMetrics({ moves: 8, pairs: 8, elapsedSeconds: 15 });
      expect(metrics.efficiency).toBe(100);
    });
  });

  describe('evaluateSession from Standard Difficulty (4x4, 8 pairs)', () => {
    test('promotes to advanced when moves <= 14 AND time <= 35s', () => {
      const result = evaluateSession({
        difficulty: 'standard',
        moves: 12,
        pairs: 8,
        elapsedSeconds: 28
      });

      expect(result.action).toBe('PROMOTE');
      expect(result.nextDifficulty).toBe('advanced');
      expect(result.ruleId).toBe('RULE_PROMOTION_OVERCLOCK');
      expect(result.detailedExplanation).toContain('Promoted to Gigachad Galaxy Brain');
    });

    test('demotes to novice when moves >= 22 (excessive moves)', () => {
      const result = evaluateSession({
        difficulty: 'standard',
        moves: 24,
        pairs: 8,
        elapsedSeconds: 30
      });

      expect(result.action).toBe('DEMOTE');
      expect(result.nextDifficulty).toBe('novice');
      expect(result.ruleId).toBe('RULE_RECALIBRATE_FATIGUE');
      expect(result.detailedExplanation).toContain('Calibrating down to NPC Tutorial Grid');
    });

    test('demotes to novice when elapsedSeconds >= 65s (slow completion)', () => {
      const result = evaluateSession({
        difficulty: 'standard',
        moves: 16,
        pairs: 8,
        elapsedSeconds: 70
      });

      expect(result.action).toBe('DEMOTE');
      expect(result.nextDifficulty).toBe('novice');
      expect(result.ruleId).toBe('RULE_RECALIBRATE_FATIGUE');
    });

    test('maintains standard when performance is within baseline threshold', () => {
      const result = evaluateSession({
        difficulty: 'standard',
        moves: 18,
        pairs: 8,
        elapsedSeconds: 45
      });

      expect(result.action).toBe('MAINTAIN');
      expect(result.nextDifficulty).toBe('standard');
      expect(result.ruleId).toBe('RULE_MAINTAIN_STANDARD');
      expect(result.detailedExplanation).toContain('Maintaining Dank Meme Matrix (4×4)');
    });
  });

  describe('evaluateSession from Novice Difficulty (3x4, 6 pairs)', () => {
    test('promotes to standard when moves <= 10 AND time <= 25s', () => {
      const result = evaluateSession({
        difficulty: 'novice',
        moves: 8,
        pairs: 6,
        elapsedSeconds: 18
      });

      expect(result.action).toBe('PROMOTE');
      expect(result.nextDifficulty).toBe('standard');
      expect(result.ruleId).toBe('RULE_NOVICE_GRADUATE');
    });

    test('retains novice if threshold not met', () => {
      const result = evaluateSession({
        difficulty: 'novice',
        moves: 14,
        pairs: 6,
        elapsedSeconds: 30
      });

      expect(result.action).toBe('MAINTAIN');
      expect(result.nextDifficulty).toBe('novice');
      expect(result.ruleId).toBe('RULE_NOVICE_RETAIN');
    });
  });
});
