'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type RevealKind = 'rise' | 'title' | 'card' | 'image';
type RevealRule = { selector: string; kind: RevealKind; delay?: number };

// Animate meaningful pieces of content, never a whole section and its children.
const rules: RevealRule[] = [
  { selector: '.intro-copy > .eyebrow', kind: 'rise' },
  { selector: '.intro-copy > h1', kind: 'title', delay: 60 },
  { selector: '.intro-description', kind: 'rise', delay: 140 },
  { selector: '.hero-actions', kind: 'rise', delay: 210 },
  { selector: '.intro-copy > .location', kind: 'rise', delay: 260 },
  { selector: '.portrait-wrap', kind: 'image', delay: 120 },
  { selector: '.current-role', kind: 'card' },
  { selector: '.section-title, .credentials-heading', kind: 'rise' },
  { selector: '.project-card', kind: 'card' },
  { selector: '.view-heading > .eyebrow', kind: 'rise' },
  { selector: '.view-heading > h1', kind: 'title', delay: 60 },
  { selector: '.view-heading > p:not(.eyebrow)', kind: 'rise', delay: 140 },
  { selector: '.filter-bar', kind: 'rise', delay: 170 },
  {
    selector: '.experience-top, .experience-date, .experience-description',
    kind: 'rise',
  },
  { selector: '.practice-grid > div, .career-row', kind: 'card' },
  { selector: '.related-work', kind: 'rise' },
  { selector: '.about-photo', kind: 'image' },
  { selector: '.about-copy > *', kind: 'rise' },
  {
    selector:
      '.education-grid > article, .credentials-grid > article, .toolbox-grid > div',
    kind: 'card',
  },
  { selector: '.contact-heading > div > .eyebrow', kind: 'rise' },
  { selector: '.contact-heading h1', kind: 'title', delay: 60 },
  { selector: '.contact-heading > p', kind: 'rise', delay: 140 },
  { selector: '.contact-studio', kind: 'card', delay: 100 },
  { selector: '.contact-links', kind: 'rise' },
];

const entrances: Record<RevealKind, Keyframe[]> = {
  rise: [
    { opacity: 0, transform: 'translate3d(0, 28px, 0)' },
    { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  title: [
    { opacity: 0, transform: 'translate3d(0, 30px, 0)', filter: 'blur(3px)' },
    { opacity: 1, transform: 'translate3d(0, 0, 0)', filter: 'blur(0)' },
  ],
  card: [
    { opacity: 0, transform: 'translate3d(0, 42px, 0) scale(0.975)' },
    { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
  ],
  image: [
    {
      opacity: 0,
      transform: 'translate3d(0, 32px, 0) scale(0.965)',
      clipPath: 'inset(8% 0 5% 0 round 18px)',
    },
    {
      opacity: 1,
      transform: 'translate3d(0, 0, 0) scale(1)',
      clipPath: 'inset(0% 0 0% 0 round 0px)',
    },
  ],
};

/** Progressive enhancement: content starts visible and works without motion APIs. */
export function MotionPage({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = root.current;
    if (
      !page ||
      !('IntersectionObserver' in window) ||
      !Element.prototype.animate
    )
      return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const registered = new Map<HTMLElement, RevealRule>();
    const pending = new Set<HTMLElement>();
    const animations = new Map<HTMLElement, Animation>();
    let disposed = false;
    let pointerFrame = 0;
    let scrollFrame = 0;
    let activeCard: HTMLElement | null = null;
    let activeVisual: HTMLElement | null = null;
    let cardBounds: DOMRect | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let portrait: HTMLElement | null = null;

    const finish = (element: HTMLElement) => {
      animations.get(element)?.cancel();
      animations.delete(element);
      pending.delete(element);
      element.removeAttribute('data-reveal-pending');
      element.removeAttribute('data-reveal-running');
      observer.unobserve(element);
    };
    const reveal = (element: HTMLElement, delay = 0) => {
      if (!pending.has(element)) return;
      const rule = registered.get(element)!;
      pending.delete(element);
      element.removeAttribute('data-reveal-pending');
      observer.unobserve(element);
      if (reduced.matches || element.contains(document.activeElement)) return;
      try {
        element.setAttribute('data-reveal-running', '');
        const animation = element.animate(entrances[rule.kind], {
          duration:
            rule.kind === 'image' ? 1000 : rule.kind === 'card' ? 850 : 740,
          delay: Math.min(delay + (rule.delay || 0), 320),
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'both',
        });
        animations.set(element, animation);
        animation.finished
          .then(() => {
            if (!disposed && animations.get(element) === animation)
              finish(element);
          })
          .catch(() => {
            /* Cancellation is expected on navigation or focus. */
          });
      } catch {
        finish(element);
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              a.boundingClientRect.left - b.boundingClientRect.left,
          );
        // Rows enter left-to-right; a long list never makes visitors wait for it all.
        entering.forEach((entry, index) =>
          reveal(entry.target as HTMLElement, Math.min(index * 65, 130)),
        );
      },
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' },
    );

    const register = () => {
      for (const [element] of registered) {
        if (!page.contains(element)) {
          finish(element);
          registered.delete(element);
        }
      }
      for (const rule of rules) {
        page.querySelectorAll<HTMLElement>(rule.selector).forEach((element) => {
          if (registered.has(element)) return;
          registered.set(element, rule);
          if (reduced.matches || element.contains(document.activeElement))
            return;
          const bounds = element.getBoundingClientRect();
          // Do not hide anything already passed when returning via browser history.
          if (bounds.bottom <= 0) return;
          pending.add(element);
          element.setAttribute('data-reveal-pending', '');
          observer.observe(element);
        });
      }
      portrait = page.querySelector('.portrait-wrap');
    };

    const resetTilt = () => {
      cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      if (activeVisual) {
        activeVisual.removeAttribute('data-tilt-active');
        for (const name of ['--tilt-x', '--tilt-y', '--spot-x', '--spot-y'])
          activeVisual.style.removeProperty(name);
      }
      activeCard = null;
      activeVisual = null;
      cardBounds = null;
    };
    const pointerMove = (event: PointerEvent) => {
      if (
        reduced.matches ||
        !finePointer.matches ||
        event.pointerType !== 'mouse'
      )
        return;
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('.project-card-button')
          : null;
      if (!target || !page.contains(target)) {
        resetTilt();
        return;
      }
      if (target !== activeCard) {
        resetTilt();
        activeCard = target;
        activeVisual = target.querySelector('.project-visual');
        cardBounds = target.getBoundingClientRect();
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerFrame)
        pointerFrame = requestAnimationFrame(() => {
          pointerFrame = 0;
          if (!activeVisual || !cardBounds) return;
          const x = Math.max(
            0,
            Math.min(1, (pointerX - cardBounds.left) / cardBounds.width),
          );
          const y = Math.max(
            0,
            Math.min(1, (pointerY - cardBounds.top) / cardBounds.height),
          );
          activeVisual.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
          activeVisual.style.setProperty('--tilt-y', `${(x - 0.5) * 6}deg`);
          activeVisual.style.setProperty('--spot-x', `${x * 100}%`);
          activeVisual.style.setProperty('--spot-y', `${y * 100}%`);
          activeVisual.setAttribute('data-tilt-active', '');
        });
    };
    const pointerOut = (event: PointerEvent) => {
      if (
        activeCard &&
        !(
          event.relatedTarget instanceof Node &&
          activeCard.contains(event.relatedTarget)
        )
      )
        resetTilt();
    };
    const scroll = () => {
      // Clear stale hover bounds when scrolling underneath a stationary pointer.
      resetTilt();
      if (scrollFrame || reduced.matches || !finePointer.matches) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        if (!portrait) return;
        const bounds = portrait.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
        const offset = Math.max(
          -1,
          Math.min(
            1,
            (window.innerHeight * 0.45 - bounds.top - bounds.height / 2) /
              window.innerHeight,
          ),
        );
        portrait.style.setProperty('--portrait-drift', `${offset * 18}px`);
      });
    };
    const showEverything = () => {
      for (const element of registered.keys()) finish(element);
      resetTilt();
      portrait?.style.removeProperty('--portrait-drift');
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
    };
    const preferenceChanged = () => {
      if (reduced.matches) showEverything();
      if (!finePointer.matches) {
        resetTilt();
        portrait?.style.removeProperty('--portrait-drift');
      }
    };
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      for (const element of registered.keys()) {
        if (element.contains(event.target)) finish(element);
      }
    };
    const visibilityChanged = () => {
      if (!document.hidden) return;
      // Finish in-flight reveals, but leave offscreen items available for later.
      for (const element of animations.keys()) finish(element);
      resetTilt();
    };

    register();
    const changes = new MutationObserver(register);
    changes.observe(page, { childList: true, subtree: true });
    page.addEventListener('focusin', focus);
    page.addEventListener('pointermove', pointerMove, { passive: true });
    page.addEventListener('pointerout', pointerOut, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll, { passive: true });
    window.addEventListener('beforeprint', showEverything);
    document.addEventListener('visibilitychange', visibilityChanged);
    reduced.addEventListener('change', preferenceChanged);
    finePointer.addEventListener('change', preferenceChanged);
    return () => {
      disposed = true;
      changes.disconnect();
      showEverything();
      observer.disconnect();
      page.removeEventListener('focusin', focus);
      page.removeEventListener('pointermove', pointerMove);
      page.removeEventListener('pointerout', pointerOut);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
      window.removeEventListener('beforeprint', showEverything);
      document.removeEventListener('visibilitychange', visibilityChanged);
      reduced.removeEventListener('change', preferenceChanged);
      finePointer.removeEventListener('change', preferenceChanged);
    };
  }, []);

  return (
    <div className="page-view" ref={root}>
      {children}
    </div>
  );
}

export function ScrollProgress() {
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const maximum =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          maximum > 1 ? Math.max(0, Math.min(1, window.scrollY / maximum)) : 0;
        fill.current?.style.setProperty('transform', `scaleX(${progress})`);
        if (track.current) track.current.hidden = maximum <= 1;
      });
    };
    const observer = new ResizeObserver(update);
    const content = document.querySelector('.main-shell');
    if (content) observer.observe(content);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return (
    <div className="scroll-progress" ref={track} aria-hidden="true">
      <span ref={fill} />
    </div>
  );
}
