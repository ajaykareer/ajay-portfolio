'use client';

import {
  createContext,
  useContext,
  useEffect,
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

export const usePortfolioMotion = () => useContext(MotionPreference);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<'full' | 'reduced' | null>(null);
  const [systemReduced, setSystemReduced] = useState(false);
  const reduced = preference ? preference === 'reduced' : systemReduced;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setSystemReduced(media.matches);
    sync();
    media.addEventListener('change', sync);
    try {
      const saved = localStorage.getItem(preferenceKey);
      if (saved === 'full' || saved === 'reduced') setPreference(saved);
    } catch {
      /* Storage can be disabled; the switch still works for this visit. */
    }
    return () => media.removeEventListener('change', sync);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.motion = preference ?? 'system';
  }, [preference]);

  const toggle = () => {
    const next = reduced ? 'full' : 'reduced';
    setPreference(next);
    try {
      localStorage.setItem(preferenceKey, next);
    } catch {
      /* Optional preference persistence. */
    }
  };

  return (
    <MotionPreference.Provider value={{ reduced, toggle }}>
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
  const Tag = m[as];
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
