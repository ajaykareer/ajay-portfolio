# Playground

The `#playground` view hosts Word Shuffle. Overview has a compact invitation, and the Word Shuffle project dialog remains playable. Navigation and Quick jump both include Playground.

## Temporary scoreboard

Scores are held in React memory for the current visit. Playground and the project dialog share the same scoreboard. Refreshing, closing the tab, or choosing **Reset scores** clears it. Nothing is sent to a server or saved in browser storage.

- A completed win earns 30, 20, or 10 points for one, two, or three picks.
- Medium multiplies those points by two; Hard multiplies them by three.
- A loss earns zero points and ends the current win streak; the best streak remains.
- Only completed rounds count. Studying again, changing difficulty, or leaving an unfinished game does not add a result.
- The scoreboard retains the latest five results and totals for the whole visit.
- Resetting the scoreboard does not restart an in-progress game.

Run the game and scoring checks with:

```bash
node --experimental-strip-types --test tests/word-shuffle.test.mjs tests/game-scores.test.mjs
```
