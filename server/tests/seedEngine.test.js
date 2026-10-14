const { generateBoard, DIFFICULTY_CONFIG, createPrng } = require('../services/seedEngine');

describe('SeedEngine Tests', () => {
  test('generates 4x4 grid with 8 pairs by default (Standard)', () => {
    const board = generateBoard('TEST_SEED_1', 'standard');
    expect(board.cards.length).toBe(16);
    expect(board.pairs).toBe(8);
    expect(board.rows).toBe(4);
    expect(board.cols).toBe(4);
  });

  test('generates identical boards when given the identical seed', () => {
    const boardA = generateBoard('REPRODUCIBLE_SEED_XYZ', 'standard');
    const boardB = generateBoard('REPRODUCIBLE_SEED_XYZ', 'standard');

    expect(boardA.cards.length).toBe(boardB.cards.length);
    for (let i = 0; i < boardA.cards.length; i++) {
      expect(boardA.cards[i].cardId).toBe(boardB.cards[i].cardId);
      expect(boardA.cards[i].pairId).toBe(boardB.cards[i].pairId);
    }
  });

  test('generates different boards with different seeds', () => {
    const boardA = generateBoard('SEED_ALPHA_123', 'standard');
    const boardB = generateBoard('SEED_BETA_999', 'standard');

    const cardIdsA = boardA.cards.map(c => c.cardId).join(',');
    const cardIdsB = boardB.cards.map(c => c.cardId).join(',');

    expect(cardIdsA).not.toBe(cardIdsB);
  });

  test('every card has exactly one matching pair partner in the board', () => {
    const board = generateBoard('CHECK_PAIRS_SEED', 'standard');
    const pairCounts = {};

    board.cards.forEach(card => {
      pairCounts[card.pairId] = (pairCounts[card.pairId] || 0) + 1;
    });

    expect(Object.keys(pairCounts).length).toBe(board.pairs);
    Object.values(pairCounts).forEach(count => {
      expect(count).toBe(2); // Exactly 2 cards per pair
    });
  });

  test('supports novice (3x4, 6 pairs) and advanced (6x6, 18 pairs)', () => {
    const noviceBoard = generateBoard('SEED_NOV', 'novice');
    expect(noviceBoard.cards.length).toBe(12);
    expect(noviceBoard.pairs).toBe(6);
    expect(noviceBoard.rows).toBe(3);
    expect(noviceBoard.cols).toBe(4);

    const advBoard = generateBoard('SEED_ADV', 'advanced');
    expect(advBoard.cards.length).toBe(36);
    expect(advBoard.pairs).toBe(18);
    expect(advBoard.rows).toBe(6);
    expect(advBoard.cols).toBe(6);
  });
});
