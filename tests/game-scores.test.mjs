import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyScores, recordScore } from '../lib/game-scores.ts';

test('a fresh visit starts empty and results do not mutate earlier scores', () => {
  const start = emptyScores();
  const scored = recordScore(start, {
    difficulty: 'easy',
    won: true,
    picks: 1,
  });
  assert.deepEqual(start, emptyScores());
  assert.equal(scored.rounds, 1);
  assert.equal(scored.wins, 1);
  assert.equal(scored.points, 30);
  assert.equal(scored.streak, 1);
  assert.equal(scored.bestStreak, 1);
});

test('difficulty and picks determine points; misses count as zero', () => {
  for (const [difficulty, multiplier] of [
    ['easy', 1],
    ['medium', 2],
    ['hard', 3],
  ]) {
    for (const picks of [1, 2, 3]) {
      assert.equal(
        recordScore(emptyScores(), { difficulty, won: true, picks }).points,
        (4 - picks) * 10 * multiplier,
      );
    }
    const missed = recordScore(emptyScores(), {
      difficulty,
      won: false,
      picks: 3,
    });
    assert.equal(missed.points, 0);
    assert.equal(missed.rounds, 1);
    assert.equal(missed.wins, 0);
  }
});

test('a loss resets the current streak but keeps the best streak and totals', () => {
  let scores = emptyScores();
  for (let i = 0; i < 3; i++)
    scores = recordScore(scores, { difficulty: 'easy', won: true, picks: 2 });
  scores = recordScore(scores, { difficulty: 'hard', won: false, picks: 3 });
  assert.equal(scores.streak, 0);
  assert.equal(scores.bestStreak, 3);
  assert.equal(scores.rounds, 4);
  assert.equal(scores.wins, 3);
  assert.equal(scores.points, 60);
});

test('only the five latest results are retained, while totals include every round', () => {
  let scores = emptyScores();
  for (let i = 0; i < 8; i++)
    scores = recordScore(scores, { difficulty: 'medium', won: true, picks: 3 });
  assert.equal(scores.rounds, 8);
  assert.equal(scores.points, 160);
  assert.deepEqual(
    scores.recent.map((result) => result.number),
    [8, 7, 6, 5, 4],
  );
});
