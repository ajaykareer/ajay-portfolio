'use client';

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
  useLayoutEffect,
  useState,
  type ReactNode,
} from 'react';
import { Sparkles, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  MotionConfig,
  useIsPresent,
} from 'motion/react';
import * as m from 'motion/react-m';

const ease = [0.22, 0.68, 0, 1] as const;
const MotionPreference = createContext({ reduced: false, toggle: () => {} });
const preferenceKey = 'ajay-portfolio-motion';
const preferenceEvent = 'portfolio-motion-change';
let unavailableStoragePreference: 'full' | 'reduced' | null = null;
const revealElements = { div: m.div, article: m.article, section: m.section };

function readMotionPreference(): 'full' | 'reduced' | 'system' {
  try {
    const saved = localStorage.getItem(preferenceKey);
    if (saved === 'full' || saved === 'reduced') return saved;
  } catch {
    if (unavailableStoragePreference) return unavailableStoragePreference;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'reduced'
    : 'full';
}

function subscribeMotionPreference(onChange: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', onChange);
  window.addEventListener('storage', onChange);
  window.addEventListener(preferenceEvent, onChange);
  return () => {
    media.removeEventListener('change', onChange);
    window.removeEventListener('storage', onChange);
    window.removeEventListener(preferenceEvent, onChange);
  };
}

export const usePortfolioMotion = () => useContext(MotionPreference);

export function MotionProvider({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore(
    subscribeMotionPreference,
    readMotionPreference,
    () => 'system',
  );
  const reduced = preference === 'reduced';

  useLayoutEffect(() => {
    document.documentElement.dataset.motion = preference;
  }, [preference]);

  const toggle = useCallback(() => {
    const next = reduced ? 'full' : 'reduced';
    try {
      localStorage.setItem(preferenceKey, next);
    } catch {
      unavailableStoragePreference = next;
    }
    window.dispatchEvent(new Event(preferenceEvent));
  }, [reduced]);
  const settings = useMemo(() => ({ reduced, toggle }), [reduced, toggle]);

  return (
    <MotionPreference.Provider value={settings}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
          {children}
        </MotionConfig>
      </LazyMotion>
    </MotionPreference.Provider>
  );
}

export function MotionToggle() {
  const { reduced, toggle } = usePortfolioMotion();
  return (
    <Button
      variant="ghost"
      className="motion-toggle"
      onClick={toggle}
      aria-label={reduced ? 'Enable animations' : 'Reduce animations'}
      aria-pressed={!reduced}
      title={
        reduced
          ? 'Enable animations for this site'
          : 'Reduce animations for this site'
      }
    >
      {reduced ? <Pause size={15} /> : <Sparkles size={15} />}
      <span>Motion {reduced ? 'off' : 'on'}</span>
    </Button>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}

export function MotionPage({
  children,
  onEntered,
}: {
  children: ReactNode;
  onEntered: () => void;
}) {
  const { reduced } = usePortfolioMotion();
  const present = useIsPresent();

  // Wait for the previous page to exit before moving the new page to the top.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <m.div
      className="page-view"
      inert={!present}
      initial="hidden"
      animate="entered"
      exit="exited"
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 24 },
        entered: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0 : 0.6, ease },
        },
        exited: {
          opacity: 0,
          y: reduced ? 0 : -12,
          transition: { duration: reduced ? 0 : 0.16, ease: 'easeIn' },
        },
      }}
      onAnimationComplete={(definition) => {
        if (definition === 'entered') onEntered();
      }}
    >
      {children}
    </m.div>
  );
}

/** Explicit, one-time entrances. No scroll handlers, layout reads or blur effects. */
export function Reveal({
  children,
  as = 'div',
  delay = 0,
  distance = 44,
  className,
  id,
  'aria-labelledby': labelledBy,
}: {
  children: ReactNode;
  as?: 'div' | 'section' | 'article';
  delay?: number;
  distance?: number;
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
}) {
  const { reduced } = usePortfolioMotion();
  const [focused, setFocused] = useState(false);
  const Tag = revealElements[as];
  return (
    <Tag
      className={className}
      id={id}
      aria-labelledby={labelledBy}
      data-motion-reveal=""
      initial={{ opacity: 0, y: reduced ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={focused ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -24px 0px' }}
      transition={{
        duration: reduced || focused ? 0 : 0.75,
        delay: reduced || focused ? 0 : delay,
        ease,
      }}
      onFocusCapture={(event) => {
        // Keyboard users can reach a card before the viewport reveal finishes.
        if (
          event.target.matches(
            'a, button, input, textarea, select, [role="button"]',
          )
        )
          setFocused(true);
      }}
    >
      {children}
    </Tag>
  );
}

/** Native scroll timeline: the browser updates this without JavaScript. */
export function ScrollProgress() {
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span />
    </div>
  );
}
