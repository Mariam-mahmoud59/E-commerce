import { useState, useEffect, useRef } from 'react';

export function useScrollReveal() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);

  return [ref, visible] as const;
}
