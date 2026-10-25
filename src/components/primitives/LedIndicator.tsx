import React from 'react';

export interface LedIndicatorProps {
  color?: 'red' | 'green' | 'amber' | 'blue';
  isOn?: boolean;
  isBlinking?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
  sublabel?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  onClick?: () => void;
}

export const LedIndicator: React.FC<LedIndicatorProps> = ({
  color = 'red',
  isOn = false,
  isBlinking = false,
  size = 'sm',
  label,
  sublabel,
  labelPosition = 'right',
  className = '',
  onClick,
}) => {
  const sizePixels = {
    xs: { outer: 8, inner: 4.5, ring: 7 },
    sm: { outer: 10, inner: 6, ring: 9 },
    md: { outer: 12, inner: 7.5, ring: 11 },
    lg: { outer: 15, inner: 9.5, ring: 13.5 },
  };

  const currentSize = sizePixels[size];
  const active = isOn || isBlinking;

  const colorPalettes = {
    red: {
      litFill: '#ff1f2d',
      litGlow: 'drop-shadow(0 0 4px #ff1f2d) drop-shadow(0 0 8px rgba(255, 31, 45, 0.7))',
      unlitFill: '#381215',
      innerCore: '#ffffff',
    },
    green: {
      litFill: '#24e350',
      litGlow: 'drop-shadow(0 0 4px #24e350) drop-shadow(0 0 8px rgba(36, 227, 80, 0.7))',
      unlitFill: '#112b1a',
      innerCore: '#ffffff',
    },
    amber: {
      litFill: '#ffb31a',
      litGlow: 'drop-shadow(0 0 4px #ffb31a) drop-shadow(0 0 8px rgba(255, 179, 26, 0.7))',
      unlitFill: '#33230b',
      innerCore: '#ffffff',
    },
    blue: {
      litFill: '#22d3ee',
      litGlow: 'drop-shadow(0 0 4px #22d3ee) drop-shadow(0 0 8px rgba(34, 211, 238, 0.7))',
      unlitFill: '#0d2538',
      innerCore: '#ffffff',
    },
  };

  const palette = colorPalettes[color];

  const svgLed = (
    <svg
      width={currentSize.outer}
      height={currentSize.outer}
      viewBox={`0 0 ${currentSize.outer} ${currentSize.outer}`}
      className={`shrink-0 ${onClick ? 'cursor-pointer' : ''} ${isBlinking ? 'animate-pulse' : ''}`}
      onClick={onClick}
    >
      <defs>
        {/* Bezel Ring Gradient */}
        <radialGradient id={`bezel-${color}-${size}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#404652" />
          <stop offset="60%" stopColor="#1a1e24" />
          <stop offset="100%" stopColor="#0b0d10" />
        </radialGradient>

        {/* Lens Convex Gradient */}
        <radialGradient id={`lens-${color}-${size}`} cx="38%" cy="38%" r="60%">
          {active ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor={palette.litFill} />
              <stop offset="90%" stopColor={palette.litFill} />
              <stop offset="100%" stopColor="#a30f18" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#555f6d" stopOpacity="0.4" />
              <stop offset="40%" stopColor={palette.unlitFill} />
              <stop offset="100%" stopColor="#08090a" />
            </>
          )}
        </radialGradient>
      </defs>

      {/* Dark metallic mounting bezel */}
      <circle
        cx={currentSize.outer / 2}
        cy={currentSize.outer / 2}
        r={currentSize.outer / 2 - 0.5}
        fill={`url(#bezel-${color}-${size})`}
        stroke="#050608"
        strokeWidth="0.8"
      />

      {/* Lens body */}
      <circle
        cx={currentSize.outer / 2}
        cy={currentSize.outer / 2}
        r={currentSize.inner / 2}
        fill={`url(#lens-${color}-${size})`}
        style={{
          filter: active ? palette.litGlow : 'none',
        }}
      />

      {/* Specular glass arc highlight */}
      <path
        d={`M ${currentSize.outer / 2 - currentSize.inner / 4} ${
          currentSize.outer / 2 - currentSize.inner / 3.5
        } A ${currentSize.inner / 3} ${currentSize.inner / 3} 0 0 1 ${
          currentSize.outer / 2 + currentSize.inner / 4
        } ${currentSize.outer / 2 - currentSize.inner / 3.5}`}
        stroke="#ffffff"
        strokeWidth="0.6"
        strokeLinecap="round"
        fill="none"
        opacity={active ? 0.8 : 0.25}
      />
    </svg>
  );

  if (!label && !sublabel) return svgLed;

  const labelEl = (
    <div className="flex flex-col leading-none">
      {label && (
        <span className="text-[8px] font-bold text-neutral-200 tracking-wider uppercase select-none">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-[7px] font-semibold text-neutral-400 tracking-tight uppercase select-none">
          {sublabel}
        </span>
      )}
    </div>
  );

  const posClasses = {
    right: 'flex-row items-center gap-1.5',
    left: 'flex-row-reverse items-center gap-1.5',
    top: 'flex-col-reverse items-center gap-1',
    bottom: 'flex-col items-center gap-1',
  };

  return (
    <div className={`inline-flex ${posClasses[labelPosition]} ${className}`}>
      {svgLed}
      {labelEl}
    </div>
  );
};
