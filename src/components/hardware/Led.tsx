import React from 'react';

interface LedProps {
  color?: 'red' | 'green' | 'amber' | 'blue';
  isOn?: boolean;
  isBlinking?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
  sublabel?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Led: React.FC<LedProps> = ({
  color = 'red',
  isOn = false,
  isBlinking = false,
  size = 'sm',
  label,
  sublabel,
  labelPosition = 'right',
  className = '',
}) => {
  const sizeMap = {
    xs: { outer: 'w-[7px] h-[7px]', inner: 'w-[3.5px] h-[3.5px]' },
    sm: { outer: 'w-[9px] h-[9px]', inner: 'w-[4.5px] h-[4.5px]' },
    md: { outer: 'w-[11px] h-[11px]', inner: 'w-[6px] h-[6px]' },
    lg: { outer: 'w-[14px] h-[14px]', inner: 'w-[7.5px] h-[7.5px]' },
  };

  const colorStyles = {
    red: {
      on: 'bg-red-500 shadow-[0_0_8px_#ff2233,0_0_3px_#ffffff]',
      off: 'bg-[#3a1215] opacity-50',
      core: 'bg-[#ffffff]',
      glow: 'rgba(255, 34, 51, 0.65)',
    },
    green: {
      on: 'bg-emerald-400 shadow-[0_0_8px_#34d399,0_0_3px_#ffffff]',
      off: 'bg-[#102a1c] opacity-50',
      core: 'bg-[#f0fdf4]',
      glow: 'rgba(52, 211, 153, 0.65)',
    },
    amber: {
      on: 'bg-amber-400 shadow-[0_0_8px_#fbbf24,0_0_3px_#ffffff]',
      off: 'bg-[#2f220d] opacity-50',
      core: 'bg-[#fffbeb]',
      glow: 'rgba(251, 191, 36, 0.65)',
    },
    blue: {
      on: 'bg-cyan-400 shadow-[0_0_8px_#38bdf8,0_0_3px_#ffffff]',
      off: 'bg-[#0f2438] opacity-50',
      core: 'bg-[#f0f9ff]',
      glow: 'rgba(56, 189, 248, 0.65)',
    },
  };

  const selected = colorStyles[color];
  const activeState = isOn || isBlinking;

  const ledElement = (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 border border-black/70 bg-[#12151a] shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.9),0_0.5px_1px_rgba(255,255,255,0.15)] ${sizeMap[size].outer}`}
    >
      <div
        className={`rounded-full transition-all duration-75 ${
          activeState ? selected.on : selected.off
        } ${isBlinking ? 'animate-pulse' : ''} ${sizeMap[size].inner}`}
      >
        {activeState && (
          <div
            className={`w-[1.5px] h-[1.5px] rounded-full mx-auto mt-[0.5px] ${selected.core} opacity-90`}
          />
        )}
      </div>
    </div>
  );

  if (!label && !sublabel) return ledElement;

  const labelEl = (
    <div className="flex flex-col leading-none">
      {label && (
        <span className="text-[8.5px] font-bold text-neutral-200 tracking-wider uppercase select-none">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-[7.5px] font-semibold text-neutral-400 tracking-tight uppercase select-none">
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
      {ledElement}
      {labelEl}
    </div>
  );
};
