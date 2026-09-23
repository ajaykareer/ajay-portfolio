'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  emptyScores,
  recordScore,
  type GameResult,
  type GameScores,
} from '@/lib/game-scores';
import { difficulties } from '@/lib/word-shuffle';

const GameSession = createContext<{
  scores: GameScores;
  record: (result: GameResult) => void;
  reset: () => void;
} | null>(null);

export function GameSessionProvider({ children }: { children: ReactNode }) {
  const [scores, setScores] = useState(emptyScores);
  const record = useCallback((result: GameResult) => {
    setScores((current) => recordScore(current, result));
  }, []);
  const reset = useCallback(() => setScores(emptyScores()), []);
  const value = useMemo(
    () => ({ scores, record, reset }),
    [scores, record, reset],
  );
  return <GameSession.Provider value={value}>{children}</GameSession.Provider>;
}

export function useGameSession() {
  const session = useContext(GameSession);
  if (!session) throw new Error('Word Shuffle needs GameSessionProvider');
  return session;
}

export function SessionScoreboard() {
  const { scores, reset } = useGameSession();
  return (
    <section
      className="shuffle-scoreboard"
      aria-label="Word Shuffle scoreboard"
    >
      <div className="scoreboard-heading">
        <h3>
          <Trophy size={17} aria-hidden="true" /> Your scoreboard
        </h3>
        <Button variant="ghost" onClick={reset} disabled={scores.rounds === 0}>
          Reset scores
        </Button>
      </div>
      <p className="scoreboard-note">
        This visit only. Scores reset when you refresh or close this tab.
      </p>
      <dl className="scoreboard-stats" aria-live="polite" aria-atomic="true">
        <div>
          <dt>Points</dt>
          <dd>{scores.points}</dd>
        </div>
        <div>
          <dt>Wins</dt>
          <dd>{scores.wins}</dd>
        </div>
        <div>
          <dt>Rounds</dt>
          <dd>{scores.rounds}</dd>
        </div>
        <div>
          <dt>Best streak</dt>
          <dd>{scores.bestStreak}</dd>
        </div>
      </dl>
      {scores.recent.length ? (
        <ol
          className="scoreboard-results"
          aria-label="Last five completed rounds"
        >
          {scores.recent.map((result) => (
            <li key={result.number}>
              <span className="scoreboard-result" data-won={result.won}>
                {result.won ? 'Won' : 'Missed'}
              </span>
              <span>
                {difficulties[result.difficulty].label} · {result.picks}{' '}
                {result.picks === 1 ? 'pick' : 'picks'}
              </span>
              <strong>+{result.points}</strong>
            </li>
          ))}
        </ol>
      ) : (
        <p className="scoreboard-empty">
          Finish a round to put your first score on the board.
        </p>
      )}
      <details className="scoreboard-rules">
        <summary>How scoring works</summary>
        <p>
          A win earns 30, 20, or 10 points for one, two, or three picks. Medium
          doubles the points; Hard triples them. Only finished rounds count. A
          missed round ends your winning streak.
        </p>
      </details>
    </section>
  );
}
