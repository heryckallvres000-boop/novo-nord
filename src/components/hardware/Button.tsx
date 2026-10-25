import React from 'react';
import { Led } from './Led';

interface ButtonProps {
  id?: string;
  label?: string;
  sublabel?: string;
  variant?: 'standard' | 'red-rim' | 'store' | 'shift' | 'rocker-left' | 'rocker-right' | 'toggle-switch' | 'small-square';
  isActive?: boolean;
  hasLed?: boolean;
  ledColor?: 'red' | 'green' | 'amber' | 'blue';
  ledIsOn?: boolean;
  ledPosition?: 'top' | 'inside' | 'left';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  width?: string;
  height?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  sublabel,
  variant = 'standard',
  isActive = false,
  hasLed = false,
  ledColor = 'red',
  ledIsOn = false,
  ledPosition = 'top',
  onClick,
  disabled = false,
  className = '',
  width,
  height,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled || !onClick) return;
    onClick();
  };

  // Special Latch Toggle Switch (e.g. SECTION ON, LAYER EFFECTS ON)
  if (variant === 'toggle-switch') {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        {label && (
          <span className="text-[8px] font-bold tracking-wider text-neutral-300 uppercase leading-none">
            {label}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <Led color={ledColor} isOn={ledIsOn} size="sm" />
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`relative w-8 h-4 rounded-[3px] bg-[#1a1e24] border border-black/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.15)] p-0.5 cursor-pointer transition-all ${
              isActive ? 'bg-[#252b34]' : ''
            }`}
          >
            {/* Rocker tab */}
            <div
              className={`w-3.5 h-full rounded-[2px] bg-gradient-to-b from-[#e5eaef] via-[#cbd3dc] to-[#8d95a1] border border-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-transform duration-100 ${
                isActive ? 'translate-x-3.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    );
  }

  // Rocker Button for Octave Shift, KB Zone, Bank
  if (variant === 'rocker-left' || variant === 'rocker-right') {
    const isLeft = variant === 'rocker-left';
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`nord-btn flex items-center justify-center px-1.5 py-1 text-[8px] font-bold text-neutral-200 uppercase tracking-tight cursor-pointer ${
          isLeft ? 'rounded-l-sm border-r-0' : 'rounded-r-sm'
        } ${className}`}
        style={{ width: width || '24px', height: height || '18px' }}
      >
        {label || (isLeft ? '◀' : '▶')}
      </button>
    );
  }

  // Shift Button
  if (variant === 'shift') {
    return (
      <div className={`flex flex-col items-center gap-0.5 ${className}`}>
        <span className="text-[7.5px] font-bold tracking-widest text-neutral-300 uppercase">
          {label || 'SHIFT'}
        </span>
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="nord-btn-shift w-[26px] h-[34px] rounded-[3px] flex items-center justify-center font-bold text-[9px] cursor-pointer"
        >
          <div className="w-[12px] h-[12px] rounded-full border border-black/30 bg-gradient-to-b from-white/40 to-transparent" />
        </button>
        <span className="text-[7px] font-semibold text-neutral-400 uppercase tracking-tighter">
          {sublabel || 'EXIT'}
        </span>
      </div>
    );
  }

  // Store Button
  if (variant === 'store') {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={`w-[26px] h-[18px] rounded-[3px] bg-gradient-to-b from-[#e5242f] via-[#c41520] to-[#8f0c14] border border-red-400/50 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center cursor-pointer active:translate-y-[1px] active:shadow-inner ${
            isActive ? 'ring-2 ring-red-400' : ''
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-red-200/80 shadow-[0_0_4px_#ffffff]" />
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

  // Red-rim Square Button
  if (variant === 'red-rim') {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        {hasLed && ledPosition === 'top' && (
          <Led color={ledColor} isOn={ledIsOn} size="sm" />
        )}
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={`nord-btn nord-btn-red-rim rounded-[3px] flex items-center justify-center cursor-pointer ${
            isActive ? 'nord-btn-active' : ''
          }`}
          style={{ width: width || '20px', height: height || '18px' }}
        >
          {label && (
            <span className="text-[7.5px] font-bold text-neutral-200 uppercase">
              {label}
            </span>
          )}
        </button>
        {sublabel && (
          <span className="text-[7px] font-semibold text-neutral-300 uppercase leading-none text-center">
            {sublabel}
          </span>
        )}
      </div>
    );
  }

  // Standard Tactile Button
  return (
    <div className={`flex flex-col items-center gap-0.5 ${className}`}>
      {hasLed && ledPosition === 'top' && (
        <div className="mb-0.5">
          <Led color={ledColor} isOn={ledIsOn} size="xs" />
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`nord-btn rounded-[3px] flex items-center justify-center cursor-pointer ${
          isActive ? 'nord-btn-active' : ''
        }`}
        style={{ width: width || '24px', height: height || '17px' }}
      >
        {hasLed && ledPosition === 'inside' && (
          <div className="mr-1">
            <Led color={ledColor} isOn={ledIsOn} size="xs" />
          </div>
        )}
        {label && (
          <span className="text-[7.5px] font-bold text-neutral-200 uppercase tracking-tight px-0.5 select-none">
            {label}
          </span>
        )}
      </button>
      {sublabel && (
        <span className="text-[6.5px] font-bold text-neutral-300 tracking-tight uppercase leading-tight text-center mt-0.5 select-none max-w-[42px] truncate">
          {sublabel}
        </span>
      )}
    </div>
  );
};
