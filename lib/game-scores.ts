export type GameResult = {
  difficulty: 'easy' | 'medium' | 'hard';
  won: boolean;
  picks: number;
};

export type GameScores = {
  rounds: number;
  wins: number;
  points: number;
  streak: number;
  bestStreak: number;
  recent: (GameResult & { number: number; points: number })[];
};

export function emptyScores(): GameScores {
  return {
    rounds: 0,
    wins: 0,
    points: 0,
    streak: 0,
    bestStreak: 0,
    recent: [],
  };
}

export function recordScore(
  scores: GameScores,
  result: GameResult,
): GameScores {
  const multiplier = { easy: 1, medium: 2, hard: 3 }[result.difficulty];
  const points = result.won ? (4 - result.picks) * 10 * multiplier : 0;
  const streak = result.won ? scores.streak + 1 : 0;
  return {
    rounds: scores.rounds + 1,
    wins: scores.wins + Number(result.won),
    points: scores.points + points,
    streak,
    bestStreak: Math.max(scores.bestStreak, streak),
    recent: [
      { ...result, number: scores.rounds + 1, points },
      ...scores.recent,
    ].slice(0, 5),
  };
}
