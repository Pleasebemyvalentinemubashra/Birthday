import { useEffect, useRef, useState, useCallback } from 'react';

/** Returns a 0→1 progress value as the element scrolls through the viewport */
export function useScrollProgress(offset = 0) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    if (!ref.current) return;
    const rect  = ref.current.getBoundingClientRect();
    const winH  = window.innerHeight;
    // 0 when element bottom enters viewport, 1 when element top leaves
    const p = 1 - (rect.bottom - offset) / (winH + rect.height - offset);
    setProgress(Math.min(1, Math.max(0, p)));
  }, [offset]);

  useEffect(() => {
    let raf: number;
    const tick = () => { update(); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [update]);

  return { ref, progress };
}

/** Returns smoothed global scroll 0→1 */
export function useGlobalScroll() {
  const [pct, setPct] = useState(0);
  const smooth = useRef(0);
  const target = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    let raf: number;
    const tick = () => {
      smooth.current += (target.current - smooth.current) * 0.07;
      setPct(smooth.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return pct;
}

/** Returns scrollY as a smooth value */
export function useSmoothScrollY() {
  const smooth = useRef(window.scrollY);
  const target = useRef(window.scrollY);
  const [y, setY] = useState(window.scrollY);

  useEffect(() => {
    const onScroll = () => { target.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    let raf: number;
    const tick = () => {
      smooth.current += (target.current - smooth.current) * 0.07;
      setY(smooth.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return y;
}
