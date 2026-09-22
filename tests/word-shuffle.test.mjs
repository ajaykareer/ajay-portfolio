import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createRound,
  difficulties,
  initialRound,
  revealTile,
  startRound,
  studyRound,
} from '../lib/word-shuffle.ts';

const playableRound = () => startRound(initialRound(), () => 0.5);

test('the initial study board has no target and cannot spend a pick', () => {
  assert.deepEqual(initialRound(), initialRound());
  const round = initialRound();
  assert.equal(round.target, null);
  assert.strictEqual(revealTile(round, 0), round);
  assert.strictEqual(studyRound(round), round);
  const playing = startRound(round, () => 0);
  assert.equal(playing.phase, 'playing');
  assert.equal(playing.target, round.board[0]);
  assert.equal(round.target, null);
  assert.strictEqual(
    startRound(playing, () => 0.9),
    playing,
  );
});

test('each difficulty chooses a valid target only when hidden, including random boundary samples', () => {
  for (const difficulty of Object.keys(difficulties)) {
    for (const sample of [0, 0.42, 0.999999]) {
      const round = createRound(difficulty, undefined, () => sample);
      assert.equal(round.board.length, difficulties[difficulty].count);
      assert.equal(new Set(round.board).size, round.board.length);
      assert.equal(round.target, null);
      assert.equal(round.phase, 'study');
      assert.deepEqual(round.opened, []);
      const playing = startRound(round, () => sample);
      assert.equal(
        playing.board.filter((word) => word === playing.target).length,
        1,
      );
      const next = createRound(difficulty, playing.target, () => sample);
      assert.equal(next.target, null);
      assert.notEqual(startRound(next, () => sample).target, playing.target);
    }
  }
});

test('winning on the first pick ends the round and preserves the previous state', () => {
  const round = playableRound();
  const winner = round.board.indexOf(round.target);
  const won = revealTile(round, winner);
  assert.equal(won.phase, 'won');
  assert.deepEqual(won.opened, [winner]);
  assert.deepEqual(round.opened, []);
  assert.strictEqual(revealTile(won, 0), won);
  assert.strictEqual(studyRound(won), won);
});

test('repeated and invalid picks never consume another attempt', () => {
  const round = revealTile(playableRound(), 0);
  for (const invalid of [0, -1, 100, 0.5, Number.NaN]) {
    assert.strictEqual(revealTile(round, invalid), round);
  }
  assert.equal(round.opened.length, 1);
});

test('the third incorrect pick ends the game and a later correct pick cannot win', () => {
  let round = playableRound();
  for (const index of [0, 1, 2]) round = revealTile(round, index);
  assert.equal(round.phase, 'lost');
  assert.deepEqual(round.opened, [0, 1, 2]);
  assert.strictEqual(
    revealTile(round, round.board.indexOf(round.target)),
    round,
  );
  assert.strictEqual(startRound(round), round);
  assert.strictEqual(studyRound(round), round);
});

test('a correct third pick wins rather than reporting a loss', () => {
  let round = playableRound();
  round = revealTile(revealTile(round, 0), 1);
  round = revealTile(round, round.board.indexOf(round.target));
  assert.equal(round.phase, 'won');
  assert.equal(round.opened.length, 3);
});

test('studying again clears the target and picks without moving the words', () => {
  const playing = revealTile(playableRound(), 0);
  const studying = studyRound(playing);
  assert.equal(studying.phase, 'study');
  assert.equal(studying.target, null);
  assert.deepEqual(studying.opened, []);
  assert.deepEqual(studying.board, playing.board);
  assert.equal(studying.previousTarget, playing.target);
  assert.equal(playing.opened.length, 1);
  const restarted = startRound(studying, () => 0.5);
  assert.notEqual(restarted.target, playing.target);
  assert.ok(restarted.board.includes(restarted.target));
  assert.deepEqual(restarted.opened, []);
});

test('repeated study/hide cycles never immediately reuse a target', () => {
  for (const difficulty of Object.keys(difficulties)) {
    for (const sample of [0, 0.5, 0.999999]) {
      let round = startRound(createRound(difficulty), () => sample);
      for (let cycle = 0; cycle < 5; cycle++) {
        const previous = round.target;
        round = startRound(studyRound(round), () => sample);
        assert.notEqual(round.target, previous);
        assert.ok(round.board.includes(round.target));
      }
    }
  }
});
