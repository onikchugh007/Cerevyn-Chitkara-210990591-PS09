/**
 * SeedEngine - Deterministic PRNG and Real Meme Photo Matrix Generator
 * Features 22 iconic internet meme photos stored locally.
 */

const CARD_SYMBOLS = [
  {
    id: 'doge',
    name: 'Doge',
    subtitle: 'Much Memory, Wow',
    imagePath: '/images/memes/doge.jpg',
    color: '#f59e0b'
  },
  {
    id: 'distracted-bf',
    name: 'Distracted BF',
    subtitle: 'Looking at other cards',
    imagePath: '/images/memes/distracted-bf.jpg',
    color: '#ec4899'
  },
  {
    id: 'drake',
    name: 'Drake Hotline',
    subtitle: 'Nah / Yeah Approval',
    imagePath: '/images/memes/drake.jpg',
    color: '#eab308'
  },
  {
    id: 'disaster-girl',
    name: 'Disaster Girl',
    subtitle: 'Everything is fine',
    imagePath: '/images/memes/disaster-girl.jpg',
    color: '#ef4444'
  },
  {
    id: 'woman-cat',
    name: 'Woman vs Cat',
    subtitle: 'Smudge Confused at Dinner',
    imagePath: '/images/memes/woman-cat.jpg',
    color: '#38bdf8'
  },
  {
    id: 'roll-safe',
    name: 'Roll Safe',
    subtitle: 'Think About It',
    imagePath: '/images/memes/roll-safe.jpg',
    color: '#06b6d4'
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    subtitle: 'Daily Struggle Decision',
    imagePath: '/images/memes/two-buttons.jpg',
    color: '#8b5cf6'
  },
  {
    id: 'mocking-spongebob',
    name: 'Mocking Sponge',
    subtitle: 'cAn yOu mAtCh tHiS?',
    imagePath: '/images/memes/mocking-spongebob.jpg',
    color: '#facc15'
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind',
    subtitle: 'Prove Me Wrong',
    imagePath: '/images/memes/change-my-mind.jpg',
    color: '#10b981'
  },
  {
    id: 'buff-doge',
    name: 'Buff Doge vs Cheems',
    subtitle: 'Chad Doge vs Crying Doge',
    imagePath: '/images/memes/buff-doge.png',
    color: '#d97706'
  },
  {
    id: 'trade-offer',
    name: 'Trade Offer',
    subtitle: 'I Receive / You Receive',
    imagePath: '/images/memes/trade-offer.jpg',
    color: '#a855f7'
  },
  {
    id: 'uno-draw-25',
    name: 'UNO Draw 25',
    subtitle: 'Match Or Draw 25',
    imagePath: '/images/memes/uno-draw-25.jpg',
    color: '#f43f5e'
  },
  {
    id: 'pablo-escobar',
    name: 'Sad Pablo',
    subtitle: 'Waiting Patiently',
    imagePath: '/images/memes/pablo-escobar.jpg',
    color: '#64748b'
  },
  {
    id: 'is-this-a-pigeon',
    name: 'Is This A Pigeon',
    subtitle: 'Confusion 100',
    imagePath: '/images/memes/is-this-a-pigeon.jpg',
    color: '#3b82f6'
  },
  {
    id: 'epic-handshake',
    name: 'Epic Handshake',
    subtitle: 'Unstoppable Alliance',
    imagePath: '/images/memes/epic-handshake.jpg',
    color: '#f97316'
  },
  {
    id: 'harold',
    name: 'Hide The Pain',
    subtitle: 'Harold Smiling In Pain',
    imagePath: '/images/memes/harold.jpg',
    color: '#fbbf24'
  },
  {
    id: 'success-kid',
    name: 'Success Kid',
    subtitle: 'Nailed The Pair',
    imagePath: '/images/memes/success-kid.jpg',
    color: '#22c55e'
  },
  {
    id: 'always-has-been',
    name: 'Always Has Been',
    subtitle: 'Wait, It is all memes?',
    imagePath: '/images/memes/always-has-been.png',
    color: '#0284c7'
  },
  {
    id: 'anakin-padme',
    name: 'For The Better, Right?',
    subtitle: 'Staring In Silence',
    imagePath: '/images/memes/anakin-padme.png',
    color: '#6366f1'
  },
  {
    id: 'bernie',
    name: 'Once Again Asking',
    subtitle: 'For Your Brain Cells',
    imagePath: '/images/memes/bernie.jpg',
    color: '#0d9488'
  },
  {
    id: 'waiting-skeleton',
    name: 'Still Waiting',
    subtitle: 'Waiting For The Flip',
    imagePath: '/images/memes/waiting-skeleton.jpg',
    color: '#94a3b8'
  },
  {
    id: 'batman-slap',
    name: 'Batman Slap',
    subtitle: 'Focus On The Match!',
    imagePath: '/images/memes/batman-slap.jpg',
    color: '#dc2626'
  }
];

const DIFFICULTY_CONFIG = {
  novice: {
    name: 'NPC Tutorial (Novice)',
    rows: 3,
    cols: 4,
    pairs: 6,
    mismatchDelayMs: 1100,
    minTargetMoves: 6,
    targetMaxSeconds: 30,
    description: '3×4 grid with 6 meme pairs. Extended recognition window.'
  },
  standard: {
    name: 'Dank Meme Matrix (Standard)',
    rows: 4,
    cols: 4,
    pairs: 8,
    mismatchDelayMs: 900,
    minTargetMoves: 8,
    targetMaxSeconds: 40,
    description: '4×4 grid with 8 meme pairs. Standard baseline calibration test.'
  },
  advanced: {
    name: 'Gigachad Galaxy Brain (Advanced)',
    rows: 6,
    cols: 6,
    pairs: 18,
    mismatchDelayMs: 750,
    minTargetMoves: 18,
    targetMaxSeconds: 90,
    description: '6×6 grid with 18 meme pairs. Extreme working memory endurance.'
  }
};

/**
 * Creates a deterministic Mulberry32 PRNG from a string seed.
 */
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

/**
 * Deterministic Fisher-Yates shuffle using provided PRNG
 */
function seededShuffle(array, prng) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate a complete reproducible game board with real meme photos
 */
function generateBoard(seed = 'DOGE-01', difficulty = 'standard') {
  const normalizedDiff = DIFFICULTY_CONFIG[difficulty] ? difficulty : 'standard';
  const config = DIFFICULTY_CONFIG[normalizedDiff];
  const prng = createPrng(seed);

  // Pick required unique meme photos
  const availableMemes = seededShuffle([...CARD_SYMBOLS], prng).slice(0, config.pairs);

  // Build pairs
  const cards = [];
  availableMemes.forEach((meme) => {
    // Instance A
    cards.push({
      cardId: `${meme.id}_A`,
      pairId: meme.id,
      name: meme.name,
      subtitle: meme.subtitle,
      imagePath: meme.imagePath,
      color: meme.color
    });
    // Instance B
    cards.push({
      cardId: `${meme.id}_B`,
      pairId: meme.id,
      name: meme.name,
      subtitle: meme.subtitle,
      imagePath: meme.imagePath,
      color: meme.color
    });
  });

  // Deterministically shuffle cards
  const shuffledCards = seededShuffle(cards, prng).map((card, index) => ({
    ...card,
    index,
    isFlipped: false,
    isMatched: false
  }));

  return {
    seed,
    difficulty: normalizedDiff,
    config,
    totalCards: shuffledCards.length,
    pairs: config.pairs,
    rows: config.rows,
    cols: config.cols,
    cards: shuffledCards
  };
}

module.exports = {
  CARD_SYMBOLS,
  DIFFICULTY_CONFIG,
  createPrng,
  seededShuffle,
  generateBoard
};
