import React from 'react';
import './ShiftButton.css';

const ArrowUpRight = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export interface ShiftButtonProps {
  text?: string;
  variant?: 'slide' | 'left' | 'right';
  baseColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

export function ShiftButton({
  text = "Shop now",
  variant = "slide",
  baseColor = "#ff5c00",
  textColor = "#ffffff",
  onClick,
  className = ''
}: ShiftButtonProps) {
  if (variant === "slide") {
    return (
      <div className={`shift-button-container ${className}`} onClick={onClick}>
        <div 
          className="shift-button"
          style={{ '--shift-bg': baseColor, color: textColor } as React.CSSProperties}
        >
          <div className="shift-button__icon-wrap">
            <ArrowUpRight />
          </div>
          <span className="shift-button__text">
            {text}
          </span>
        </div>
      </div>
    );
  }

  const isRight = variant === "right";

  return (
    <div className={`shift-button-reveal-container ${variant} ${className}`} onClick={onClick}>
      <div className="shift-button-reveal">
        {!isRight && (
          <div 
            className="shift-button-reveal__icon icon-left"
            style={{ '--shift-bg': baseColor, color: textColor } as React.CSSProperties}
          >
            <ArrowUpRight />
          </div>
        )}

        <div 
          className="shift-button-reveal__text"
          style={{ '--shift-bg': baseColor, color: textColor } as React.CSSProperties}
        >
          {text}
        </div>

        {isRight && (
          <div 
            className="shift-button-reveal__icon icon-right"
            style={{ '--shift-bg': baseColor, color: textColor } as React.CSSProperties}
          >
            <ArrowUpRight />
          </div>
        )}
      </div>
    </div>
  );
}
