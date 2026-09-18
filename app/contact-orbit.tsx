'use client';

import { useEffect, useRef, useState } from 'react';
import type { Globe } from 'cobe';
import {
  ArrowLeft,
  ArrowRight,
  Globe2,
  LocateFixed,
  Pause,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePortfolioMotion } from './page-motion';

const HOME_PHI = (349.02 * Math.PI) / 180;
const HOME_THETA = 0.45;

/** One animation loop for the globe and stars; stopped offscreen and when paused. */
export function ContactOrbit({ dark }: { dark: boolean }) {
  const { reduced } = usePortfolioMotion();
  const region = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stars = useRef<HTMLCanvasElement>(null);
  const engine = useRef<{ refresh: () => void } | null>(null);
  const orientation = useRef({ phi: HOME_PHI, theta: HOME_THETA });
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const settings = useRef({ dark, paused: false, reduced: false });
  const [paused, setPaused] = useState(false);
  const [availability, setAvailability] = useState<
    'loading' | 'ready' | 'fallback'
  >('loading');

  useEffect(() => {
    settings.current.dark = dark;
    settings.current.paused = paused;
    settings.current.reduced = reduced;
    engine.current?.refresh();
  }, [dark, paused, reduced]);

  useEffect(() => {
    const host = region.current;
    const globeCanvas = canvas.current;
    const starCanvas = stars.current;
    if (!host || !globeCanvas || !starCanvas) return;
    const ctx = starCanvas.getContext('2d');
    let disposed = false;
    let globe: Globe | undefined;
    let frame = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let visible = true;
    let contextAvailable = true;
    let width = 1;
    let height = 1;
    let ratio = 1;
    // A fixed constellation avoids layout changes when React re-renders.
    const points = Array.from({ length: 82 }, (_, i) => ({
      x: ((i * 73 + 19) % 997) / 997,
      y: ((i * 127 + 43) % 991) / 991,
      radius: i % 11 === 0 ? 1.55 : 0.55 + (i % 3) * 0.2,
      speed: 0.001 + (i % 5) * 0.00035,
      phase: i * 1.9,
    }));

    const paint = () => {
      if (disposed) return;
      const theme = settings.current.dark;
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        for (const point of points) {
          const x = ((point.x + elapsed * point.speed) % 1) * width;
          const y = ((point.y - elapsed * point.speed * 0.3 + 10) % 1) * height;
          const opacity =
            (theme ? 0.24 : 0.16) +
            (Math.sin(elapsed * 0.5 + point.phase) + 1) * (theme ? 0.18 : 0.12);
          ctx.fillStyle = theme
            ? `rgba(240,213,194,${opacity})`
            : `rgba(116,79,62,${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, point.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (contextAvailable)
        globe?.update({
          ...orientation.current,
          dark: theme ? 1 : 0,
          baseColor: theme ? [0.32, 0.23, 0.19] : [0.94, 0.82, 0.73],
          glowColor: theme ? [0.19, 0.105, 0.08] : [0.98, 0.94, 0.91],
          mapBrightness: theme ? 9 : 3.2,
          mapBaseBrightness: theme ? 0.03 : 0.08,
          diffuse: theme ? 1.8 : 1.3,
        });
    };
    const canAnimate = () =>
      !disposed &&
      visible &&
      !document.hidden &&
      !settings.current.paused &&
      !settings.current.reduced;
    const animate = (time: number) => {
      frame = 0;
      if (!canAnimate()) return;
      if (!lastFrame) lastFrame = time;
      const delta = time - lastFrame;
      if (delta >= 1000 / 30) {
        const seconds = Math.min(delta / 1000, 0.06);
        elapsed += seconds;
        if (!pointer.current) orientation.current.phi += seconds * 0.13;
        paint();
        lastFrame = time;
      }
      frame = requestAnimationFrame(animate);
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
      paint();
      if (canAnimate()) frame = requestAnimationFrame(animate);
    };
    engine.current = { refresh };
    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      starCanvas.width = Math.round(width * ratio);
      starCanvas.height = Math.round(height * ratio);
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
      const size = globeCanvas.clientWidth;
      globe?.update({
        width: Math.round(size),
        height: Math.round(size),
        devicePixelRatio: ratio,
      });
      refresh();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
    intersection.observe(host);
    const contextLost = (event: Event) => {
      event.preventDefault();
      contextAvailable = false;
      setAvailability('fallback');
    };
    document.addEventListener('visibilitychange', refresh);
    globeCanvas.addEventListener('webglcontextlost', contextLost);
    resize();
    void import('cobe')
      .then(({ default: createGlobe }) => {
        if (disposed) return;
        const size = globeCanvas.clientWidth;
        // Detect unavailable WebGL so the contact form always remains usable.
        const context = {
          alpha: true,
          antialias: true,
          stencil: false,
          depth: false,
          preserveDrawingBuffer: false,
        };
        if (
          !(
            globeCanvas.getContext('webgl2', context) ||
            globeCanvas.getContext('webgl', context)
          )
        )
          throw new Error('WebGL unavailable');
        globe = createGlobe(globeCanvas, {
          width: Math.round(size),
          height: Math.round(size),
          devicePixelRatio: ratio,
          phi: orientation.current.phi,
          theta: orientation.current.theta,
          dark: 0,
          diffuse: 1.3,
          mapSamples: 22000,
          mapBrightness: 3.2,
          baseColor: [0.94, 0.82, 0.73],
          markerColor: [1, 0.32, 0.13],
          glowColor: [0.98, 0.94, 0.91],
          markers: [{ location: [43.85, -79.02], size: 0.07 }],
          markerElevation: 0.035,
          scale: 0.94,
          context,
        });
        setAvailability('ready');
        refresh();
      })
      .catch(() => {
        if (!disposed) setAvailability('fallback');
      });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', refresh);
      globeCanvas.removeEventListener('webglcontextlost', contextLost);
      globe?.destroy();
      engine.current = null;
    };
  }, []);

  const rotate = (amount: number) => {
    orientation.current.phi += amount;
    engine.current?.refresh();
  };
  const endDrag = () => {
    pointer.current = null;
  };

  return (
    <div className="contact-orbit" ref={region}>
      <canvas ref={stars} className="orbit-stars" aria-hidden="true" />
      <div className="orbit-caption">
        <span className="eyebrow">A SMALL WORLD. A NEW CONNECTION.</span>
        <h2>
          Good ideas travel.
          <br />
          <em>Let’s start one.</em>
        </h2>
      </div>
      <div
        className="globe-stage"
        role="group"
        aria-label="Interactive globe with a marker in Ajax, Ontario. Drag or use left and right arrow keys to rotate."
        tabIndex={availability === 'ready' ? 0 : -1}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            rotate(event.key === 'ArrowLeft' ? -0.2 : 0.2);
          }
        }}
        onPointerDown={(event) => {
          if (event.button !== 0 || availability !== 'ready') return;
          event.currentTarget.setPointerCapture(event.pointerId);
          pointer.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          };
        }}
        onPointerMove={(event) => {
          const previous = pointer.current;
          if (!previous || previous.id !== event.pointerId) return;
          orientation.current.phi += (event.clientX - previous.x) * 0.007;
          orientation.current.theta = Math.max(
            -0.7,
            Math.min(
              0.7,
              orientation.current.theta + (event.clientY - previous.y) * 0.004,
            ),
          );
          pointer.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          };
          engine.current?.refresh();
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <canvas
          ref={canvas}
          className="globe-canvas"
          data-ready={availability === 'ready'}
          aria-hidden="true"
        />
        {availability !== 'ready' && (
          <div className="globe-fallback">
            <Globe2 size={76} strokeWidth={0.75} aria-hidden="true" />
            <span>
              {availability === 'loading'
                ? 'A world of possibilities.'
                : 'Connected, wherever you are.'}
            </span>
          </div>
        )}
      </div>
      <div className="orbit-footer">
        <div className="orbit-location">
          <span /> AJAX, ONTARIO{' '}
          <span className="orbit-coordinates">43.85° N / 79.02° W</span>
        </div>
        <div className="orbit-controls">
          <span>
            {reduced
              ? 'Motion reduced'
              : paused
                ? 'Take your time'
                : 'Drag to explore'}
          </span>
          <div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Rotate globe left"
              onClick={() => rotate(-0.3)}
              disabled={availability !== 'ready'}
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Rotate globe right"
              onClick={() => rotate(0.3)}
              disabled={availability !== 'ready'}
            >
              <ArrowRight />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Reset globe to Ontario"
              onClick={() => {
                orientation.current = { phi: HOME_PHI, theta: HOME_THETA };
                engine.current?.refresh();
              }}
              disabled={availability !== 'ready'}
            >
              <LocateFixed />
            </Button>
            {!reduced && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  paused ? 'Play globe and stars' : 'Pause globe and stars'
                }
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? <Play /> : <Pause />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
