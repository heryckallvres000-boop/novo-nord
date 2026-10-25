import React, { useState, useRef } from 'react';
import { NumericScale } from './NumericScale';

export interface RotaryKnobProps {
  id?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange: (val: number) => void;
  label?: string;
  sublabel?: string;
  unit?: string;
  bipolar?: boolean;
  scaleType?: '0-10' | '-10-+10' | '-15-+15' | 'freq' | 'none';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hasMstClkLed?: boolean;
  isMstClkActive?: boolean;
  className?: string;
}

export const RotaryKnob: React.FC<RotaryKnobProps> = ({
  value,
  min = 0,
  max = 10,
  step = 0.1,
  defaultValue = 5,
  onChange,
  label,
  sublabel,
  unit = '',
  bipolar = false,
  scaleType = '0-10',
  size = 'md',
  hasMstClkLed = false,
  isMstClkActive = false,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dragStartY = useRef(0);
  const startVal = useRef(value);

  // Map value to angle (-135 deg to +135 deg)
  const norm = (value - min) / (max - min);
  const clampedNorm = Math.max(0, Math.min(1, norm));
  const angle = -135 + clampedNorm * 270;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setShowTooltip(true);
    dragStartY.current = e.clientY;
    startVal.current = value;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = dragStartY.current - e.clientY;
    const range = max - min;
    const sensitivity = e.shiftKey ? 0.001 : 0.005;
    const deltaVal = deltaY * range * sensitivity;
    let nextVal = startVal.current + deltaVal;

    if (step) {
      nextVal = Math.round(nextVal / step) * step;
    }
    nextVal = Math.max(min, Math.min(max, nextVal));
    onChange(Number(nextVal.toFixed(2)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    setTimeout(() => setShowTooltip(false), 800);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handleDoubleClick = () => {
    onChange(defaultValue);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const dir = e.deltaY > 0 ? -1 : 1;
    const stepVal = step || (max - min) / 50;
    const nextVal = Math.max(min, Math.min(max, value + dir * stepVal));
    onChange(Number(nextVal.toFixed(2)));
  };

  const sizeConfig = {
    sm: { diameter: 26, cap: 17, pointerLen: 7 },
    md: { diameter: 31, cap: 21, pointerLen: 9 },
    lg: { diameter: 36, cap: 24, pointerLen: 11 },
    xl: { diameter: 44, cap: 29, pointerLen: 14 },
  };

  const currentSize = sizeConfig[size];
  const radius = currentSize.diameter / 2;

  return (
    <div
      className={`relative flex flex-col items-center select-none ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => !isDragging && setShowTooltip(false)}
    >
      {/* Label above */}
      {label && (
        <span className="text-[7.5px] font-bold text-neutral-200 tracking-wider uppercase mb-0.5 leading-none text-center">
          {label}
        </span>
      )}

      {/* Interactive Knob Assembly */}
      <div
        className="relative flex items-center justify-center cursor-ns-resize touch-none my-0.5"
        style={{
          width: currentSize.diameter + 22,
          height: currentSize.diameter + 22,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        {/* Radial Numeric Scale */}
        <NumericScale radius={radius} scaleType={scaleType} />

        {/* Master Clock indicator if attached */}
        {hasMstClkLed && (
          <div className="absolute -left-1 bottom-0 flex items-center gap-0.5">
            <div
              className={`w-[5px] h-[5px] rounded-full border border-black/80 transition-all ${
                isMstClkActive
                  ? 'bg-red-500 shadow-[0_0_5px_#ff2233]'
                  : 'bg-[#3b1215] opacity-50'
              }`}
            />
            <span className="text-[6px] font-bold text-neutral-300">MST CLK</span>
          </div>
        )}

        {/* SVG Textured Knob Body with fluting and brushed metal core */}
        <div
          className="relative rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.9),0_1px_2px_rgba(0,0,0,0.9)]"
          style={{
            width: currentSize.diameter,
            height: currentSize.diameter,
            transform: `rotate(${angle}deg)`,
            transition: isDragging ? 'none' : 'transform 0.08s ease-out',
          }}
        >
          <svg
            width={currentSize.diameter}
            height={currentSize.diameter}
            viewBox={`0 0 ${currentSize.diameter} ${currentSize.diameter}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              <radialGradient id={`knob-body-${size}`} cx="45%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#30353d" />
                <stop offset="65%" stopColor="#181c22" />
                <stop offset="100%" stopColor="#0d0f12" />
              </radialGradient>

              <radialGradient id={`metal-cap-${size}`} cx="42%" cy="38%" r="62%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="25%" stopColor="#cbd5e1" />
                <stop offset="60%" stopColor="#94a3b8" />
                <stop offset="90%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#334155" />
              </radialGradient>
            </defs>

            {/* Base knob perimeter */}
            <circle
              cx={radius}
              cy={radius}
              r={radius - 0.5}
              fill={`url(#knob-body-${size})`}
              stroke="#080a0c"
              strokeWidth="1"
            />

            {/* 18 perimeter knurl flutes */}
            {[...Array(18)].map((_, i) => {
              const fluteAngle = (i * 360) / 18;
              const rad = (fluteAngle * Math.PI) / 180;
              const x1 = radius + Math.cos(rad) * (radius - 3.5);
              const y1 = radius + Math.sin(rad) * (radius - 3.5);
              const x2 = radius + Math.cos(rad) * (radius - 0.8);
              const y2 = radius + Math.sin(rad) * (radius - 0.8);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#07090b"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Concentric brushed metal top disc */}
            <circle
              cx={radius}
              cy={radius}
              r={currentSize.cap / 2}
              fill={`url(#metal-cap-${size})`}
              stroke="#1e293b"
              strokeWidth="0.8"
            />

            {/* Concentric machined circle */}
            <circle
              cx={radius}
              cy={radius}
              r={currentSize.cap / 2 - 2.5}
              fill="none"
              stroke="#475569"
              strokeWidth="0.5"
              opacity="0.6"
            />

            {/* Center black indent */}
            <circle
              cx={radius}
              cy={radius}
              r={1.8}
              fill="#0f172a"
              opacity="0.8"
            />

            {/* White pointer notch */}
            <line
              x1={radius}
              y1={2}
              x2={radius}
              y2={radius - 1}
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.8))',
              }}
            />
          </svg>
        </div>

        {/* Live floating tooltip */}
        {showTooltip && (
          <div className="absolute -top-7 px-1.5 py-0.5 rounded bg-black/95 border border-neutral-700 text-[9px] font-mono font-bold text-cyan-300 shadow-xl pointer-events-none z-30 whitespace-nowrap">
            {value.toFixed(1)} {unit}
          </div>
        )}
      </div>

      {/* Sublabel below */}
      {sublabel && (
        <span className="text-[6.5px] font-bold text-neutral-400 tracking-tight uppercase leading-none text-center">
          {sublabel}
        </span>
      )}
    </div>
  );
};
