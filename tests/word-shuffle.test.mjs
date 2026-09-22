import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createRound,
  difficulties,
  initialRound,
  revealTile,
  startRound,
} from '../lib/word-shuffle.ts';

test('the initial study board is deterministic and cannot spend a pick', () => {
  assert.deepEqual(initialRound(), initialRound());
  const round = initialRound();
  assert.equal(round.board.filter((word) => word === round.target).length, 1);
  assert.strictEqual(revealTile(round, 0), round);
  assert.equal(startRound(round).phase, 'playing');
});

test('each difficulty has unique words and one target, including shuffle boundary samples', () => {
  for (const difficulty of Object.keys(difficulties)) {
    for (const sample of [0, 0.42, 0.999999]) {
      const round = createRound(difficulty, undefined, () => sample);
      assert.equal(round.board.length, difficulties[difficulty].count);
      assert.equal(new Set(round.board).size, round.board.length);
      assert.equal(
        round.board.filter((word) => word === round.target).length,
        1,
      );
      assert.equal(round.phase, 'study');
      assert.deepEqual(round.opened, []);
      const next = createRound(difficulty, round.target, () => sample);
      assert.notEqual(next.target, round.target);
    }
  }
});

test('winning on the first pick ends the round and preserves the previous state', () => {
  const round = startRound(initialRound());
  const winner = round.board.indexOf(round.target);
  const won = revealTile(round, winner);
  assert.equal(won.phase, 'won');
  assert.deepEqual(won.opened, [winner]);
  assert.deepEqual(round.opened, []);
  assert.strictEqual(revealTile(won, 0), won);
});

test('repeated and invalid picks never consume another attempt', () => {
  const round = revealTile(startRound(initialRound()), 0);
  for (const invalid of [0, -1, 100, 0.5, Number.NaN]) {
    assert.strictEqual(revealTile(round, invalid), round);
  }
  assert.equal(round.opened.length, 1);
});

test('the third incorrect pick ends the game and a later correct pick cannot win', () => {
  let round = startRound(initialRound());
  for (const index of [0, 1, 2]) round = revealTile(round, index);
  assert.equal(round.phase, 'lost');
  assert.deepEqual(round.opened, [0, 1, 2]);
  assert.strictEqual(
    revealTile(round, round.board.indexOf(round.target)),
    round,
  );
  assert.strictEqual(startRound(round), round);
});

test('a correct third pick wins rather than reporting a loss', () => {
  let round = startRound(initialRound());
  round = revealTile(revealTile(round, 0), 1);
  round = revealTile(round, round.board.indexOf(round.target));
  assert.equal(round.phase, 'won');
  assert.equal(round.opened.length, 3);
});
