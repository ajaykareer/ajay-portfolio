// Injected only by `preview.mjs --audit`, never included in the hosted site.
(() => {
  const metrics = { lcpMs: 0, cls: 0, longTasks: 0, blockingMs: 0 };
  const observe = (type, callback) => {
    try {
      new PerformanceObserver((list) =>
        list.getEntries().forEach(callback),
      ).observe({ type, buffered: true });
    } catch {
      /* Browser may not support every metric. */
    }
  };
  observe('largest-contentful-paint', (entry) => {
    metrics.lcpMs = Math.round(entry.startTime);
  });
  observe('layout-shift', (entry) => {
    if (!entry.hadRecentInput) metrics.cls += entry.value;
  });
  observe('longtask', (entry) => {
    metrics.longTasks++;
    metrics.blockingMs += Math.max(0, entry.duration - 50);
  });
  window.addEventListener(
    'load',
    () =>
      setTimeout(() => {
        console.info(
          'PORTFOLIO_LOAD',
          JSON.stringify({
            ...metrics,
            cls: +metrics.cls.toFixed(4),
            blockingMs: Math.round(metrics.blockingMs),
          }),
        );
      }, 2000),
    { once: true },
  );
  let frame = 0;
  let until = 0;
  let previous = 0;
  let samples = [];
  const tick = (time) => {
    if (previous) samples.push(time - previous);
    previous = time;
    if (time < until) frame = requestAnimationFrame(tick);
    else {
      const sorted = samples.toSorted((a, b) => a - b);
      console.info(
        'PORTFOLIO_SCROLL',
        JSON.stringify({
          view: location.hash,
          frames: sorted.length,
          p95FrameMs: Math.round(sorted[Math.floor(sorted.length * 0.95)] || 0),
          framesOver50ms: sorted.filter((n) => n > 50).length,
        }),
      );
      frame = previous = 0;
      samples = [];
    }
  };
  window.addEventListener(
    'scroll',
    () => {
      until = performance.now() + 600;
      if (!frame) frame = requestAnimationFrame(tick);
    },
    { passive: true },
  );
})();
