export type Difficulty = 'easy' | 'medium' | 'hard';
export type RoundPhase = 'study' | 'playing' | 'won' | 'lost';

export const difficulties = {
  easy: { label: 'Easy', count: 9, columns: 3 },
  medium: { label: 'Medium', count: 16, columns: 4 },
  hard: { label: 'Hard', count: 36, columns: 6 },
} as const;

const words = [
  'PIXEL',
  'CLOUD',
  'FRAME',
  'STACK',
  'LOGIC',
  'MOUSE',
  'CABLE',
  'BUILD',
  'SPARK',
  'INPUT',
  'PATCH',
  'CLICK',
  'TRACE',
  'CACHE',
  'QUERY',
  'ARRAY',
  'TOKEN',
  'EVENT',
  'PRINT',
  'RESET',
  'SMART',
  'POWER',
  'CLOCK',
  'FOCUS',
  'SHIFT',
  'LEARN',
  'CLEAR',
  'BRUSH',
  'CRAFT',
  'SHAPE',
  'SOUND',
  'STORY',
  'PLANE',
  'NORTH',
  'SOUTH',
  'WATER',
  'MUSIC',
  'LIGHT',
  'BOARD',
  'PANEL',
  'PULSE',
  'WIRED',
  'SPACE',
  'POINT',
  'SWIPE',
  'TOUCH',
  'LAYER',
  'DREAM',
];

export type ShuffleRound = {
  difficulty: Difficulty;
  board: string[];
  target: string;
  opened: number[];
  phase: RoundPhase;
};

// The first board is deterministic so server rendering and hydration match.
export function initialRound(): ShuffleRound {
  return {
    difficulty: 'easy',
    board: words.slice(0, 9),
    target: 'LOGIC',
    opened: [],
    phase: 'study',
  };
}

export function createRound(
  difficulty: Difficulty,
  previousTarget?: string,
  random: () => number = Math.random,
): ShuffleRound {
  const shuffled = [...words];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  const board = shuffled.slice(0, difficulties[difficulty].count);
  let targetIndex = Math.floor(random() * board.length);
  if (board[targetIndex] === previousTarget)
    targetIndex = (targetIndex + 1) % board.length;
  return {
    difficulty,
    board,
    target: board[targetIndex],
    opened: [],
    phase: 'study',
  };
}

export function startRound(round: ShuffleRound): ShuffleRound {
  if (round.phase !== 'study') return round;
  return { ...round, opened: [], phase: 'playing' };
}

export function revealTile(round: ShuffleRound, index: number): ShuffleRound {
  if (
    round.phase !== 'playing' ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= round.board.length ||
    round.opened.includes(index)
  )
    return round;
  const opened = [...round.opened, index];
  const phase =
    round.board[index] === round.target
      ? 'won'
      : opened.length === 3
        ? 'lost'
        : 'playing';
  return { ...round, opened, phase };
}
