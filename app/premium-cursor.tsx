'use client';

import { useEffect, useRef } from 'react';

/** Small desktop accent; touch, text inputs and reduced-motion retain native pointers. */
export function PremiumCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    const node = cursor.current;
    if (!node) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      node.dataset.visible = 'false';
      document.documentElement.classList.remove('has-custom-cursor');
    };
    const move = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (
        !media.matches ||
        event.pointerType !== 'mouse' ||
        target?.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      node.dataset.interactive = String(
        Boolean(target?.closest('a, button, [role="button"], [role="option"]')),
      );
      if (!frame)
        frame = requestAnimationFrame(() => {
          node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          node.dataset.visible = 'true';
          document.documentElement.classList.add('has-custom-cursor');
          frame = 0;
        });
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Tab') hide();
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    document.addEventListener('keydown', keyboard);
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('blur', hide);
    media.addEventListener('change', hide);
    return () => {
      cancelAnimationFrame(frame);
      hide();
      document.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', hide);
      document.removeEventListener('keydown', keyboard);
      document.removeEventListener('visibilitychange', hide);
      window.removeEventListener('blur', hide);
      media.removeEventListener('change', hide);
    };
  }, []);
  return (
    <div
      ref={cursor}
      className="premium-cursor"
      data-visible="false"
      aria-hidden="true"
    >
      <span className="cursor-ring" />
      <span className="cursor-dot" />
    </div>
  );
}
