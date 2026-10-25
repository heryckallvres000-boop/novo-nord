import React, { useState, useRef } from 'react';
import { Led } from './Led';

interface SliderProps {
  id?: string;
  value: number; // 0 to 100
  onChange: (val: number) => void;
  label?: string;
  sublabel?: string;
  auxKbOn?: boolean;
  onAuxKbToggle?: () => void;
  height?: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  label = 'A',
  sublabel = 'AUX KB',
  auxKbOn = false,
  onAuxKbToggle,
  height = 120,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromPointer(e.clientY);
  };

  const updateFromPointer = (clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const trackHeight = rect.height;
    // Bottom is 0, Top is 100
    const relativeY = rect.bottom - clientY;
    const norm = Math.max(0, Math.min(1, relativeY / trackHeight));
    onChange(Math.round(norm * 100));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateFromPointer(e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // 9-segment LED meter calculation
  const totalSegments = 9;
  const activeSegments = Math.round((value / 100) * totalSegments);

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Top Slider Header & AUX KB Button */}
      <div className="flex items-center gap-1 mb-1">
        <span className="text-[9px] font-black text-neutral-100">{label}</span>
        {sublabel && (
          <span className="text-[6.5px] font-semibold text-neutral-400 tracking-tight uppercase">
            {sublabel}
          </span>
        )}
      </div>

      {/* AUX KB ON/OFF Button & LED */}
      <div className="flex flex-col items-center gap-0.5 mb-2">
        <button
          type="button"
          onClick={onAuxKbToggle}
          className="nord-btn px-1 py-0.5 rounded-[2px] text-[6.5px] font-bold text-neutral-200 tracking-tight flex items-center gap-1 cursor-pointer"
        >
          <Led color="amber" isOn={auxKbOn} size="xs" />
          <span>ON/OFF▼</span>
        </button>
      </div>

      {/* Main Fader Track Area with 9-segment LED ladder */}
      <div className="flex items-center gap-2">
        {/* 9-segment vertical LED meter ladder */}
        <div
          className="flex flex-col-reverse justify-between py-1 px-0.5 rounded-[2px] bg-[#0c0f13] border border-black/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"
          style={{ height: height }}
        >
          {[...Array(totalSegments)].map((_, i) => {
            const isLit = i < activeSegments;
            const isTop = i >= totalSegments - 2; // top 2 are amber/orange
            return (
              <div
                key={i}
                className={`w-[4.5px] h-[7px] rounded-[1px] transition-all duration-75 ${
                  isLit
                    ? isTop
                      ? 'bg-amber-400 shadow-[0_0_5px_#fbbf24]'
                      : 'bg-emerald-400 shadow-[0_0_5px_#34d399]'
                    : isTop
                    ? 'bg-[#2b1f0c] opacity-40'
                    : 'bg-[#0f2419] opacity-40'
                }`}
              />
            );
          })}
        </div>

        {/* Fader Track & Cap */}
        <div
          ref={trackRef}
          className="relative slider-track-slot w-5 flex justify-center cursor-ns-resize touch-none"
          style={{ height: height }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Central slit */}
          <div className="w-[2.5px] h-full bg-[#050608] shadow-[inset_0_0_2px_#000000]" />

          {/* Fader Handle Cap */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-7 h-6 rounded-[2px] fader-cap flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-none"
            style={{
              bottom: `calc(${value}% - 12px)`,
              transition: isDragging ? 'none' : 'bottom 0.05s ease-out',
            }}
          >
            {/* Horizontal ribbed grip */}
            <div className="w-5 h-full flex flex-col justify-center items-center gap-0.5">
              <div className="w-full h-[1px] bg-white/20" />
              {/* Center crisp white indicator line */}
              <div className="w-full h-[2px] bg-white shadow-[0_0_2px_rgba(255,255,255,0.9)]" />
              <div className="w-full h-[1px] bg-black/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Numerical readout at bottom */}
      <span className="text-[7.5px] font-mono font-bold text-neutral-400 mt-1.5 tabular-nums">
        {value}%
      </span>
    </div>
  );
};
