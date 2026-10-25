import React, { useState, useRef } from 'react';

export interface OrganDrawbarProps {
  index: number;
  value: number; // 0 (pushed in) to 8 (fully pulled out)
  onChange: (val: number) => void;
  topLabel: string;
  subTopLabel: string;
  bottomLabel: string;
  colorType: 'brown' | 'white' | 'black';
  height?: number;
  className?: string;
}

export const OrganDrawbar: React.FC<OrganDrawbarProps> = ({
  index,
  value,
  onChange,
  topLabel,
  subTopLabel,
  bottomLabel,
  colorType,
  height = 135,
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
    // On organ drawbars: 0 is pushed IN (at the top), 8 is pulled OUT (at the bottom)
    const relativeY = clientY - rect.top;
    const norm = Math.max(0, Math.min(1, relativeY / trackHeight));
    const stepVal = Math.round(norm * 8);
    onChange(stepVal);
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

  // Stepped drawbar handle styling
  const handleStyles = {
    brown: 'bg-gradient-to-b from-[#3a2016] via-[#22130c] to-[#120a06] border-[#4a2b1f] text-neutral-200',
    white: 'bg-gradient-to-b from-[#ffffff] via-[#e5e9f0] to-[#ccd3e0] border-[#b0b8c6] text-neutral-900',
    black: 'bg-gradient-to-b from-[#323842] via-[#1c2026] to-[#0c0e12] border-[#444c58] text-neutral-200',
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Top Labels */}
      <span className="text-[6px] font-bold text-neutral-300 uppercase tracking-tight text-center leading-none">
        {topLabel}
      </span>
      <span className="text-[6.5px] font-extrabold text-neutral-200 font-mono tracking-tight text-center leading-none mb-1">
        {subTopLabel}
      </span>

      {/* Track slot with red LED segment scale (1-8) */}
      <div
        ref={trackRef}
        className="relative w-6 rounded-[2px] bg-[#0c0f14] border border-black/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] flex flex-col justify-between items-center py-1 cursor-ns-resize touch-none"
        style={{ height }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Red LED Ladder Bars (8 segments, 1 at top to 8 at bottom) */}
        <div className="absolute inset-y-1.5 left-1 flex flex-col justify-between pointer-events-none">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
            const isLit = value >= num;
            return (
              <div key={num} className="flex items-center gap-0.5">
                <span className="text-[5.5px] font-bold font-mono text-neutral-500 leading-none">
                  {num}
                </span>
                <div
                  className={`w-[3px] h-[5px] rounded-[0.5px] transition-colors ${
                    isLit
                      ? 'bg-red-500 shadow-[0_0_4px_#ff2233]'
                      : 'bg-[#2a0e10] opacity-40'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Center slot slit */}
        <div className="w-[2px] h-full bg-[#050608] shadow-[inset_0_0_2px_#000000]" />

        {/* Stepped Drawbar Handle */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-6 h-8 rounded-[3px] border shadow-[0_4px_8px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.4)] flex flex-col items-center justify-between py-1 cursor-grab active:cursor-grabbing pointer-events-none ${
            handleStyles[colorType]
          }`}
          style={{
            top: `calc(${(value / 8) * 72}% - 2px)`,
            transition: isDragging ? 'none' : 'top 0.05s ease-out',
          }}
        >
          {/* Top grip ridge */}
          <div className="w-4 h-[2px] bg-black/30 rounded" />

          {/* Value printed on drawbar cap */}
          <span className="text-[7.5px] font-black font-mono leading-none">
            {value}
          </span>

          {/* Bottom grip groove */}
          <div className="w-4 h-[2px] bg-black/40 rounded" />
        </div>
      </div>

      {/* Bottom foot mark */}
      <span className="text-[7px] font-black text-neutral-300 font-mono tracking-tight mt-1 leading-none">
        {bottomLabel}
      </span>
    </div>
  );
};
