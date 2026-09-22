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
  previousTarget: string | null;
  opened: number[];
} & (
  | { phase: 'study'; target: null }
  | { phase: Exclude<RoundPhase, 'study'>; target: string }
);

// The first board is deterministic so server rendering and hydration match.
export function initialRound(): ShuffleRound {
  return {
    difficulty: 'easy',
    board: words.slice(0, 9),
    target: null,
    previousTarget: null,
    opened: [],
    phase: 'study',
  };
}

export function createRound(
  difficulty: Difficulty,
  previousTarget?: string | null,
  random: () => number = Math.random,
): ShuffleRound {
  const shuffled = [...words];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  const board = shuffled.slice(0, difficulties[difficulty].count);
  return {
    difficulty,
    board,
    target: null,
    previousTarget: previousTarget ?? null,
    opened: [],
    phase: 'study',
  };
}

export function startRound(
  round: ShuffleRound,
  random: () => number = Math.random,
): ShuffleRound {
  if (round.phase !== 'study') return round;
  const candidates = round.board.filter(
    (word) => word !== round.previousTarget,
  );
  const target = candidates[Math.floor(random() * candidates.length)];
  return {
    ...round,
    target,
    previousTarget: target,
    opened: [],
    phase: 'playing',
  };
}

export function studyRound(round: ShuffleRound): ShuffleRound {
  if (round.phase !== 'playing') return round;
  return { ...round, target: null, opened: [], phase: 'study' };
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
