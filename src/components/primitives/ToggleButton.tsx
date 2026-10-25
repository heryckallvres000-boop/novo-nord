import React from 'react';
import { LedIndicator } from './LedIndicator';

export interface ToggleButtonProps {
  id?: string;
  label?: string;
  sublabel?: string;
  isActive: boolean;
  onToggle: () => void;
  variant?: 'standard' | 'red-rim' | 'toggle-switch' | 'shift' | 'square-compact';
  hasLed?: boolean;
  ledColor?: 'red' | 'green' | 'amber' | 'blue';
  ledPosition?: 'top' | 'inside' | 'left';
  width?: string;
  height?: string;
  disabled?: boolean;
  className?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  sublabel,
  isActive,
  onToggle,
  variant = 'standard',
  hasLed = false,
  ledColor = 'red',
  ledPosition = 'top',
  width,
  height,
  disabled = false,
  className = '',
}) => {
  // Latch Toggle Switch Variant
  if (variant === 'toggle-switch') {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        {label && (
          <span className="text-[8px] font-bold tracking-wider text-neutral-300 uppercase leading-none select-none">
            {label}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <LedIndicator color={ledColor} isOn={isActive} size="sm" />
          <button
            type="button"
            onClick={onToggle}
            disabled={disabled}
            className={`relative w-8 h-4 rounded-[3px] bg-[#1a1e24] border border-black/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.15)] p-0.5 cursor-pointer transition-all ${
              isActive ? 'bg-[#252b34]' : ''
            }`}
          >
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

  // Shift Button
  if (variant === 'shift') {
    return (
      <div className={`flex flex-col items-center gap-0.5 select-none ${className}`}>
        <span className="text-[7.5px] font-bold tracking-widest text-neutral-300 uppercase">
          {label || 'SHIFT'}
        </span>
        <button
          type="button"
          onClick={onToggle}
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

  // Red Rim Button
  if (variant === 'red-rim') {
    return (
      <div className={`flex flex-col items-center gap-0.5 select-none ${className}`}>
        {hasLed && ledPosition === 'top' && (
          <div className="mb-0.5">
            <LedIndicator color={ledColor} isOn={isActive} size="xs" />
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className={`nord-btn nord-btn-red-rim rounded-[3px] flex items-center justify-center cursor-pointer ${
            isActive ? 'nord-btn-active ring-1 ring-red-400' : ''
          }`}
          style={{ width: width || '22px', height: height || '17px' }}
        >
          {label && (
            <span className="text-[7.5px] font-bold text-neutral-200 uppercase">
              {label}
            </span>
          )}
        </button>
        {sublabel && (
          <span className="text-[6.5px] font-bold text-neutral-300 tracking-tight uppercase leading-none text-center mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    );
  }

  // Standard Toggle Button
  return (
    <div className={`flex flex-col items-center gap-0.5 select-none ${className}`}>
      {hasLed && ledPosition === 'top' && (
        <div className="mb-0.5">
          <LedIndicator color={ledColor} isOn={isActive} size="xs" />
        </div>
      )}
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`nord-btn rounded-[3px] flex items-center justify-center cursor-pointer ${
          isActive ? 'nord-btn-active' : ''
        }`}
        style={{ width: width || '24px', height: height || '17px' }}
      >
        {hasLed && ledPosition === 'inside' && (
          <div className="mr-1">
            <LedIndicator color={ledColor} isOn={isActive} size="xs" />
          </div>
        )}
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
