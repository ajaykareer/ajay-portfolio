'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  createRound,
  difficulties,
  initialRound,
  revealTile,
  startRound,
  studyRound,
  type Difficulty,
} from '@/lib/word-shuffle';
import { usePortfolioMotion } from './page-motion';

export function WordShuffle({ compact = false }: { compact?: boolean }) {
  const [round, setRound] = useState(initialRound);
  const [roundNumber, setRoundNumber] = useState(1);
  const firstTile = useRef<HTMLButtonElement>(null);
  const headingId = useId();
  const instructionsId = useId();
  const { reduced } = usePortfolioMotion();
  const { phase, board, target, opened, difficulty } = round;
  const finished = phase === 'won' || phase === 'lost';
  const remaining = 3 - opened.length;
  const Heading = compact ? 'h3' : 'h2';

  useEffect(() => {
    if (phase === 'playing') firstTile.current?.focus();
  }, [phase]);

  function newBoard(level: Difficulty = difficulty) {
    setRound(createRound(level, target ?? round.previousTarget));
    setRoundNumber((number) => number + 1);
  }

  const announcement =
    phase === 'study'
      ? round.previousTarget
        ? 'Study the whole board again. Hiding it will choose a different target and reset your three picks.'
        : 'Remember the words and their places. Your target is chosen only after you hide the board.'
      : phase === 'won'
        ? `You found ${target} in ${opened.length} ${opened.length === 1 ? 'pick' : 'picks'}. Nicely done!`
        : phase === 'lost'
          ? `Out of picks. ${target} was on tile ${board.indexOf(target) + 1}. Try a fresh board?`
          : opened.length === 0
            ? `Where was ${target}? You have three picks.`
            : `${board[opened[opened.length - 1]]} — not this one. ${remaining} ${remaining === 1 ? 'pick' : 'picks'} left to find ${target}.`;

  return (
    <section
      className={`shuffle-lab${compact ? ' shuffle-lab-compact' : ''}`}
      aria-labelledby={headingId}
    >
      <div className="shuffle-intro">
        {compact ? (
          <>
            <Heading id={headingId}>Play the web demo</Heading>
            <p>
              Study every word. Hide the board to reveal a random target, then
              find it in three picks.
            </p>
          </>
        ) : (
          <>
            <p className="shuffle-kicker">
              <span aria-hidden="true">✳</span> A LITTLE BRAIN BREAK
            </p>
            <Heading id={headingId}>
              A few tiles.
              <br />
              <em>One good memory.</em>
            </Heading>
            <p>
              Meet Word Shuffle. Memorize the board, hide it to reveal a random
              target, then find that word in three picks.
            </p>
            <ol className="shuffle-steps">
              <li>
                <span>01</span> Study every word.
              </li>
              <li>
                <span>02</span> Hide to reveal your target.
              </li>
              <li>
                <span>03</span> Remember. Pick. Celebrate.
              </li>
            </ol>
            <div className="shuffle-origin">
              <span className="shuffle-demo-label">PLAYABLE WEB DEMO</span>
              <p>
                A browser adaptation of my Salesforce Aura project, with a study
                step for a quick memory challenge.
              </p>
              <a
                href="https://github.com/ajaykareer/Word-Shuffle-Game-Salesforce-Aura"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore the Salesforce original <ArrowUpRight size={16} />
              </a>
            </div>
          </>
        )}
      </div>

      <div className="shuffle-game" data-phase={phase}>
        <div className="shuffle-toolbar">
          <span className="shuffle-game-title">
            <Shuffle size={18} /> Word Shuffle
          </span>
          <span className="shuffle-round">
            ROUND {String(roundNumber).padStart(2, '0')}
          </span>
        </div>
        <div
          className="shuffle-levels"
          role="group"
          aria-label="Word Shuffle difficulty"
        >
          {(Object.keys(difficulties) as Difficulty[]).map((level) => (
            <Button
              key={level}
              variant="ghost"
              aria-pressed={level === difficulty}
              onClick={() => {
                if (level !== difficulty) newBoard(level);
              }}
            >
              {difficulties[level].label}{' '}
              <span>{difficulties[level].count} tiles</span>
            </Button>
          ))}
        </div>
        <div className="shuffle-target">
          <div>
            <span>{phase === 'study' ? 'TARGET HIDDEN' : 'YOUR WORD'}</span>
            <strong>{phase === 'study' ? '?????' : target}</strong>
          </div>
          <div
            className="shuffle-chances"
            aria-label={`${remaining} of 3 picks remaining`}
          >
            {[0, 1, 2].map((pick) => (
              <i
                key={pick}
                className={pick < remaining ? 'is-available' : ''}
                aria-hidden="true"
              />
            ))}
            <span>{remaining}/3 picks</span>
          </div>
        </div>
        <p id={instructionsId} className="shuffle-instruction">
          {phase === 'study' ? (
            <Eye size={15} />
          ) : finished ? (
            <Sparkles size={15} />
          ) : (
            <EyeOff size={15} />
          )}
          {phase === 'study'
            ? 'Study the board. No timer, no rush.'
            : finished
              ? 'The board is revealed.'
              : 'Pick the tile hiding your word.'}
        </p>
        <div
          className="shuffle-board"
          data-level={difficulty}
          aria-describedby={instructionsId}
          style={
            {
              '--shuffle-columns': difficulties[difficulty].columns,
            } as CSSProperties
          }
        >
          {board.map((word, index) => {
            const visible =
              phase === 'study' || finished || opened.includes(index);
            const correct = finished && word === target;
            const missed = opened.includes(index) && word !== target;
            const inactive = phase !== 'playing' || opened.includes(index);
            return (
              <Button
                key={`${roundNumber}-${index}`}
                ref={index === 0 ? firstTile : undefined}
                variant="ghost"
                className="shuffle-tile"
                data-visible={visible}
                data-result={correct ? 'correct' : missed ? 'miss' : undefined}
                aria-label={
                  visible
                    ? `Tile ${index + 1}: ${word}${correct ? ', target word' : ''}`
                    : `Reveal tile ${index + 1}`
                }
                aria-disabled={inactive}
                tabIndex={inactive ? -1 : 0}
                onClick={() =>
                  setRound((current) => revealTile(current, index))
                }
              >
                <span className="shuffle-tile-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  key={visible ? word : 'hidden'}
                  className={reduced ? '' : 'shuffle-tile-face'}
                  aria-hidden="true"
                >
                  {visible ? (
                    word
                  ) : (
                    <span className="shuffle-tile-mark">✳</span>
                  )}
                </span>
                {correct && (
                  <Check
                    className="shuffle-tile-check"
                    size={13}
                    aria-hidden="true"
                  />
                )}
              </Button>
            );
          })}
        </div>
        <div className="shuffle-feedback" data-result={phase}>
          {phase === 'won' && (
            <span className="shuffle-win-mark" aria-hidden="true">
              <Check size={19} />
              {!reduced && (
                <span className="shuffle-confetti">
                  {Array.from({ length: 8 }, (_, i) => (
                    <i key={i} style={{ '--piece': i } as CSSProperties} />
                  ))}
                </span>
              )}
            </span>
          )}
          <p role="status" aria-live="polite" aria-atomic="true">
            {announcement}
          </p>
        </div>
        <div className="shuffle-actions">
          <Button
            className="shuffle-primary"
            onClick={() => {
              if (phase === 'study') setRound(startRound(round));
              else if (phase === 'playing')
                setRound((current) => studyRound(current));
              else newBoard();
            }}
          >
            {phase === 'study' ? (
              <EyeOff size={17} />
            ) : phase === 'playing' ? (
              <Eye size={17} />
            ) : (
              <RotateCcw size={17} />
            )}
            {phase === 'study'
              ? 'Hide & play'
              : phase === 'playing'
                ? 'Study again'
                : 'Play another round'}
          </Button>
          <Button
            variant="ghost"
            className="shuffle-reset"
            onClick={() => newBoard()}
          >
            <Shuffle size={16} /> New board
          </Button>
        </div>
        <p className="shuffle-note">
          Just for fun. No sign-in or scores saved.
        </p>
      </div>
    </section>
  );
}
