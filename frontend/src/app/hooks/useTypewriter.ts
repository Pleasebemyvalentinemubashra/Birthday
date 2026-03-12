import { useState, useEffect, useRef } from 'react';

export function useTypewriter(text: string, started: boolean, speed = 28) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);
  const indexRef = useRef(0);
  const rafRef   = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!started) return;
    indexRef.current = 0;
    setDisplayed('');
    setDone(false);

    function step() {
      const i   = indexRef.current;
      const ch  = text[i];
      if (ch === undefined) { setDone(true); return; }
      setDisplayed(prev => prev + ch);
      indexRef.current++;
      const pause = '.!?,;:—'.includes(ch) ? speed * 4 + Math.random() * 60 : speed + Math.random() * speed;
      rafRef.current = setTimeout(step, pause);
    }
    step();

    return () => clearTimeout(rafRef.current);
  }, [started, text, speed]);

  return { displayed, done };
}
