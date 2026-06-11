import type { ReactNode, CSSProperties } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './RevealBox.css';

interface RevealBoxProps {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
}

export function RevealBox({ children, delay = 0, style = {} }: RevealBoxProps) {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`reveal-box ${visible ? 'reveal-box--visible' : ''}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}
