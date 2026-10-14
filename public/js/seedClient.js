/**
 * SeedClient - Client-side deterministic board generator with Real Meme Photos
 */

window.SynapseSeedClient = (() => {
  const CARD_SYMBOLS = [
    { id: 'doge', name: 'Doge', subtitle: 'Much Memory, Wow', imagePath: '/images/memes/doge.jpg', color: '#f59e0b' },
    { id: 'distracted-bf', name: 'Distracted BF', subtitle: 'Looking at other cards', imagePath: '/images/memes/distracted-bf.jpg', color: '#ec4899' },
    { id: 'drake', name: 'Drake Hotline', subtitle: 'Nah / Yeah Approval', imagePath: '/images/memes/drake.jpg', color: '#eab308' },
    { id: 'disaster-girl', name: 'Disaster Girl', subtitle: 'Everything is fine', imagePath: '/images/memes/disaster-girl.jpg', color: '#ef4444' },
    { id: 'woman-cat', name: 'Woman vs Cat', subtitle: 'Smudge Confused at Dinner', imagePath: '/images/memes/woman-cat.jpg', color: '#38bdf8' },
    { id: 'roll-safe', name: 'Roll Safe', subtitle: 'Think About It', imagePath: '/images/memes/roll-safe.jpg', color: '#06b6d4' },
    { id: 'two-buttons', name: 'Two Buttons', subtitle: 'Daily Struggle Decision', imagePath: '/images/memes/two-buttons.jpg', color: '#8b5cf6' },
    { id: 'mocking-spongebob', name: 'Mocking Sponge', subtitle: 'cAn yOu mAtCh tHiS?', imagePath: '/images/memes/mocking-spongebob.jpg', color: '#facc15' },
    { id: 'change-my-mind', name: 'Change My Mind', subtitle: 'Prove Me Wrong', imagePath: '/images/memes/change-my-mind.jpg', color: '#10b981' },
    { id: 'buff-doge', name: 'Buff Doge vs Cheems', subtitle: 'Chad Doge vs Crying Doge', imagePath: '/images/memes/buff-doge.png', color: '#d97706' },
    { id: 'trade-offer', name: 'Trade Offer', subtitle: 'I Receive / You Receive', imagePath: '/images/memes/trade-offer.jpg', color: '#a855f7' },
    { id: 'uno-draw-25', name: 'UNO Draw 25', subtitle: 'Match Or Draw 25', imagePath: '/images/memes/uno-draw-25.jpg', color: '#f43f5e' },
    { id: 'pablo-escobar', name: 'Sad Pablo', subtitle: 'Waiting Patiently', imagePath: '/images/memes/pablo-escobar.jpg', color: '#64748b' },
    { id: 'is-this-a-pigeon', name: 'Is This A Pigeon', subtitle: 'Confusion 100', imagePath: '/images/memes/is-this-a-pigeon.jpg', color: '#3b82f6' },
    { id: 'epic-handshake', name: 'Epic Handshake', subtitle: 'Unstoppable Alliance', imagePath: '/images/memes/epic-handshake.jpg', color: '#f97316' },
    { id: 'harold', name: 'Hide The Pain', subtitle: 'Harold Smiling In Pain', imagePath: '/images/memes/harold.jpg', color: '#fbbf24' },
    { id: 'success-kid', name: 'Success Kid', subtitle: 'Nailed The Pair', imagePath: '/images/memes/success-kid.jpg', color: '#22c55e' },
    { id: 'always-has-been', name: 'Always Has Been', subtitle: 'Wait, It is all memes?', imagePath: '/images/memes/always-has-been.png', color: '#0284c7' },
    { id: 'anakin-padme', name: 'For The Better, Right?', subtitle: 'Staring In Silence', imagePath: '/images/memes/anakin-padme.png', color: '#6366f1' },
    { id: 'bernie', name: 'Once Again Asking', subtitle: 'For Your Brain Cells', imagePath: '/images/memes/bernie.jpg', color: '#0d9488' },
    { id: 'waiting-skeleton', name: 'Still Waiting', subtitle: 'Waiting For The Flip', imagePath: '/images/memes/waiting-skeleton.jpg', color: '#94a3b8' },
    { id: 'batman-slap', name: 'Batman Slap', subtitle: 'Focus On The Match!', imagePath: '/images/memes/batman-slap.jpg', color: '#dc2626' }
  ];

  const DIFFICULTY_CONFIG = {
    novice: { name: 'NPC Tutorial (Novice)', rows: 3, cols: 4, pairs: 6, mismatchDelayMs: 1100 },
    standard: { name: 'Dank Meme Matrix (Standard)', rows: 4, cols: 4, pairs: 8, mismatchDelayMs: 900 },
    advanced: { name: 'Gigachad Galaxy Brain (Advanced)', rows: 6, cols: 6, pairs: 18, mismatchDelayMs: 750 }
  };

  function createPrng(seedStr) {
    const str = String(seedStr || 'MEME_PHOTO_SEED');
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    let a = h >>> 0;
    return function () {
      let t = (a += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededShuffle(array, prng) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function generateBoard(seed = 'DOGE-01', difficulty = 'standard') {
    const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.standard;
    const prng = createPrng(seed);
    const available = seededShuffle([...CARD_SYMBOLS], prng).slice(0, config.pairs);

    const cards = [];
    available.forEach(meme => {
      cards.push({ cardId: `${meme.id}_A`, pairId: meme.id, name: meme.name, subtitle: meme.subtitle, imagePath: meme.imagePath, color: meme.color });
      cards.push({ cardId: `${meme.id}_B`, pairId: meme.id, name: meme.name, subtitle: meme.subtitle, imagePath: meme.imagePath, color: meme.color });
    });

    const shuffled = seededShuffle(cards, prng).map((c, i) => ({
      ...c,
      index: i,
      isFlipped: false,
      isMatched: false
    }));

    return {
      seed,
      difficulty,
      config,
      totalCards: shuffled.length,
      pairs: config.pairs,
      rows: config.rows,
      cols: config.cols,
      cards: shuffled
    };
  }

  return { generateBoard, DIFFICULTY_CONFIG, CARD_SYMBOLS };
})();

// Client-side adaptation evaluation fallback
window.SynapseAdaptiveClient = (() => {
  function evaluateSession({ difficulty, moves, pairs, elapsedSeconds }) {
    const theoreticalMinMoves = pairs || 8;
    const efficiency = Math.round((theoreticalMinMoves / Math.max(1, moves)) * 100);
    let nextDifficulty = difficulty || 'standard';
    let action = 'MAINTAIN';
    let detailedExplanation = '';

    if (difficulty === 'standard') {
      if (moves <= 14 && elapsedSeconds <= 35) {
        nextDifficulty = 'advanced';
        action = 'PROMOTE';
        detailedExplanation = `Promoted to Gigachad Galaxy Brain (6×6, 18 pairs). Achieved ${efficiency}% efficiency (${moves} moves) in ${elapsedSeconds}s (Threshold: <= 14 moves & <= 35s). Certified Meme Lord!`;
      } else if (moves >= 22 || elapsedSeconds >= 65) {
        nextDifficulty = 'novice';
        action = 'DEMOTE';
        detailedExplanation = `Calibrating down to NPC Tutorial Grid (3×4, 6 pairs). Session required ${moves} moves (${efficiency}% efficiency) and ${elapsedSeconds}s (Threshold exceeded: >= 22 moves or >= 65s). Touch some grass!`;
      } else {
        nextDifficulty = 'standard';
        action = 'MAINTAIN';
        detailedExplanation = `Maintaining Dank Meme Matrix (4×4). Performance (${moves} moves, ${elapsedSeconds}s) is within baseline. Need <= 14 moves to reach Gigachad status!`;
      }
    } else if (difficulty === 'novice') {
      if (moves <= 10 && elapsedSeconds <= 25) {
        nextDifficulty = 'standard';
        action = 'PROMOTE';
        detailedExplanation = `Promoted to 4×4 Dank Meme Matrix! Cleared 6 pairs in ${moves} moves within ${elapsedSeconds}s.`;
      } else {
        nextDifficulty = 'novice';
        action = 'MAINTAIN';
        detailedExplanation = `Retaining NPC Tutorial Grid (3×4). Solved in ${moves} moves and ${elapsedSeconds}s.`;
      }
    } else if (difficulty === 'advanced') {
      if (moves >= 45 || elapsedSeconds >= 120) {
        nextDifficulty = 'standard';
        action = 'DEMOTE';
        detailedExplanation = `Stepping down to 4×4 Dank Meme Matrix due to brainrot overload (${moves} moves, ${elapsedSeconds}s).`;
      } else {
        nextDifficulty = 'advanced';
        action = 'MAINTAIN';
        detailedExplanation = `Retaining Gigachad Galaxy Brain (6×6). Absolute legend across 18 meme pairs.`;
      }
    }

    return {
      previousDifficulty: difficulty,
      nextDifficulty,
      action,
      detailedExplanation,
      metrics: { theoreticalMinMoves, actualMoves: moves, pairs, elapsedSeconds, efficiency }
    };
  }

  return { evaluateSession };
})();
