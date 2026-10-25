import React, { useState } from 'react';

export interface MomentaryButtonProps {
  id?: string;
  label?: string;
  sublabel?: string;
  onPress: () => void;
  variant?: 'standard' | 'store' | 'rocker-left' | 'rocker-right' | 'compact';
  width?: string;
  height?: string;
  disabled?: boolean;
  className?: string;
}

export const MomentaryButton: React.FC<MomentaryButtonProps> = ({
  label,
  sublabel,
  onPress,
  variant = 'standard',
  width,
  height,
  disabled = false,
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsPressed(true);
    onPress();
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  // Bright Red Store Button
  if (variant === 'store') {
    return (
      <div className={`flex flex-col items-center gap-1 select-none ${className}`}>
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          disabled={disabled}
          className={`w-[26px] h-[18px] rounded-[3px] bg-gradient-to-b from-[#e5242f] via-[#c41520] to-[#8f0c14] border border-red-400/50 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center cursor-pointer ${
            isPressed ? 'translate-y-[1.5px] shadow-inner ring-1 ring-red-400' : ''
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-red-200/90 shadow-[0_0_4px_#ffffff]" />
        </button>
        {label && (
          <span className="text-[7.5px] font-bold tracking-wider text-neutral-200 uppercase leading-none">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[6.5px] font-semibold text-neutral-400 tracking-tight uppercase leading-none">
            {sublabel}
          </span>
        )}
      </div>
    );
  }

  // Rocker Left / Right Buttons
  if (variant === 'rocker-left' || variant === 'rocker-right') {
    const isLeft = variant === 'rocker-left';
    return (
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        disabled={disabled}
        className={`nord-btn flex items-center justify-center px-1.5 py-1 text-[8px] font-bold text-neutral-200 uppercase tracking-tight cursor-pointer ${
          isLeft ? 'rounded-l-sm border-r-0' : 'rounded-r-sm'
        } ${isPressed ? 'nord-btn-active' : ''} ${className}`}
        style={{ width: width || '24px', height: height || '18px' }}
      >
        {label || (isLeft ? '◀' : '▶')}
      </button>
    );
  }

  // Standard Momentary Button
  return (
    <div className={`flex flex-col items-center gap-0.5 select-none ${className}`}>
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        disabled={disabled}
        className={`nord-btn rounded-[3px] flex items-center justify-center cursor-pointer ${
          isPressed ? 'nord-btn-active' : ''
        }`}
        style={{ width: width || '24px', height: height || '17px' }}
      >
        {label && (
          <span className="text-[7.5px] font-bold text-neutral-200 uppercase tracking-tight px-0.5">
            {label}
          </span>
        )}
      </button>
      {sublabel && (
        <span className="text-[6.5px] font-bold text-neutral-300 tracking-tight uppercase leading-tight text-center mt-0.5 max-w-[44px] truncate">
          {sublabel}
        </span>
      )}
    </div>
  );
};
