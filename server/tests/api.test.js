const request = require('supertest');
const app = require('../app');
const { clearSessions } = require('../services/sessionStore');

describe('REST API Integration Tests', () => {
  beforeEach(() => {
    clearSessions();
  });

  test('GET /api/health returns 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  test('GET /api/game/new generates reproducible board with seed and difficulty', async () => {
    const res = await request(app).get('/api/game/new?seed=AUTOMATED_TEST_SEED&difficulty=standard');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.seed).toBe('AUTOMATED_TEST_SEED');
    expect(res.body.data.difficulty).toBe('standard');
    expect(res.body.data.cards.length).toBe(16);
    expect(res.body.data.pairs).toBe(8);
  });

  test('GET /api/game/new rejects invalid difficulty parameter', async () => {
    const res = await request(app).get('/api/game/new?difficulty=ultra_impossible');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Invalid difficulty');
  });

  test('POST /api/game/session saves anonymous record and returns explainable adaptation', async () => {
    const sessionPayload = {
      seed: 'SEED_WIN_FAST',
      difficulty: 'standard',
      moves: 12,
      pairs: 8,
      elapsedSeconds: 24.5
    };

    const res = await request(app)
      .post('/api/game/session')
      .send(sessionPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.sessionId).toBeDefined();
    expect(res.body.adaptation.action).toBe('PROMOTE');
    expect(res.body.adaptation.nextDifficulty).toBe('advanced');
    expect(res.body.adaptation.detailedExplanation).toBeDefined();
    expect(res.body.metrics.efficiency).toBe(67);
  });

  test('POST /api/game/session validates missing parameters', async () => {
    const res = await request(app)
      .post('/api/game/session')
      .send({ seed: 'INCOMPLETE' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Missing required session metrics');
  });

  test('GET /api/game/analytics returns aggregated statistics', async () => {
    // Record two sessions
    await request(app).post('/api/game/session').send({
      seed: 'S1', difficulty: 'standard', moves: 10, pairs: 8, elapsedSeconds: 20
    });
    await request(app).post('/api/game/session').send({
      seed: 'S2', difficulty: 'standard', moves: 20, pairs: 8, elapsedSeconds: 40
    });

    const res = await request(app).get('/api/game/analytics');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.analytics.totalSessions).toBe(2);
    expect(res.body.analytics.averageMoves).toBe(15);
    expect(res.body.analytics.averageTimeSeconds).toBe(30);
  });

  test('GET /api/game/rules returns documented threshold specifications', async () => {
    const res = await request(app).get('/api/game/rules');
    expect(res.statusCode).toBe(200);
    expect(res.body.rules.length).toBeGreaterThan(0);
    expect(res.body.difficulties.standard).toBeDefined();
  });
});
