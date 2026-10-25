import React, { useState, useRef, useEffect, useCallback } from 'react';

interface KnobProps {
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

export const Knob: React.FC<KnobProps> = ({
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
    const deltaY = dragStartY.current - e.clientY; // upward drag increases
    const range = max - min;
    const sensitivity = e.shiftKey ? 0.001 : 0.005; // fine tune with shift
    const deltaVal = deltaY * range * sensitivity;
    let nextVal = startVal.current + deltaVal;

    // Apply step
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

  // Dimensions
  const sizeConfig = {
    sm: { diameter: 30, cap: 20, pointerLen: 8, font: 'text-[7px]' },
    md: { diameter: 36, cap: 24, pointerLen: 10, font: 'text-[7.5px]' },
    lg: { diameter: 44, cap: 30, pointerLen: 13, font: 'text-[8.5px]' },
    xl: { diameter: 52, cap: 36, pointerLen: 16, font: 'text-[9.5px]' },
  };

  const currentSize = sizeConfig[size];

  // Scale markers generator
  const renderScale = () => {
    if (scaleType === 'none') return null;

    let ticks: { label?: string; angle: number; isMajor: boolean }[] = [];

    if (scaleType === '0-10') {
      const labels = ['0', '', '2', '', '4', '', '6', '', '8', '', '10'];
      ticks = labels.map((lbl, idx) => ({
        label: lbl,
        angle: -135 + (idx / 10) * 270,
        isMajor: idx % 2 === 0,
      }));
    } else if (scaleType === '-10-+10') {
      ticks = [
        { label: '-10', angle: -135, isMajor: true },
        { label: '-5', angle: -135 + 270 * 0.25, isMajor: true },
        { label: '0', angle: 0, isMajor: true },
        { label: '5', angle: 135 - 270 * 0.25, isMajor: true },
        { label: '10', angle: 135, isMajor: true },
      ];
    } else if (scaleType === '-15-+15') {
      ticks = [
        { label: '-15', angle: -135, isMajor: true },
        { label: '-10', angle: -135 + 270 * 0.166, isMajor: false },
        { label: '-5', angle: -135 + 270 * 0.333, isMajor: true },
        { label: '0', angle: 0, isMajor: true },
        { label: '5', angle: 270 * 0.333 - 135 + 135, isMajor: true },
        { label: '10', angle: 270 * 0.416 - 135 + 135, isMajor: false },
        { label: '15', angle: 135, isMajor: true },
      ];
    } else if (scaleType === 'freq') {
      ticks = [
        { label: '200', angle: -135, isMajor: true },
        { label: '400', angle: -135 + 270 * 0.2, isMajor: true },
        { label: '600', angle: -135 + 270 * 0.35, isMajor: true },
        { label: '1K', angle: -135 + 270 * 0.5, isMajor: true },
        { label: '2K', angle: -135 + 270 * 0.65, isMajor: true },
        { label: '4K', angle: -135 + 270 * 0.8, isMajor: true },
        { label: '8K', angle: 135, isMajor: true },
      ];
    }

    const radius = currentSize.diameter / 2 + 8.5;

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{ width: '100%', height: '100%' }}
      >
        {ticks.map((t, idx) => {
          const rad = ((t.angle - 90) * Math.PI) / 180;
          const cx = '50%';
          const cy = '50%';
          // Position numbers slightly outside
          const textRadius = radius + 4.5;
          const tx = Math.cos(rad) * textRadius;
          const ty = Math.sin(rad) * textRadius;

          return (
            <g key={idx}>
              {/* Tick dot */}
              <circle
                cx={`calc(50% + ${Math.cos(rad) * (radius - 2.5)}px)`}
                cy={`calc(50% + ${Math.sin(rad) * (radius - 2.5)}px)`}
                r={t.isMajor ? 1.1 : 0.7}
                fill={t.isMajor ? '#e2e8f0' : '#94a3b8'}
                opacity={0.85}
              />
              {/* Label */}
              {t.label && (
                <text
                  x={`calc(50% + ${tx}px)`}
                  y={`calc(50% + ${ty}px)`}
                  fill="#cbd5e1"
                  fontSize="7px"
                  fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="select-none"
                >
                  {t.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div
      className={`relative flex flex-col items-center select-none ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => !isDragging && setShowTooltip(false)}
    >
      {/* Label above */}
      {label && (
        <div className="text-[8px] font-bold text-neutral-200 tracking-wider uppercase mb-1.5 leading-none text-center">
          {label}
        </div>
      )}

      {/* Knob assembly with dial and scale */}
      <div
        className="relative flex items-center justify-center cursor-ns-resize touch-none"
        style={{
          width: currentSize.diameter + 24,
          height: currentSize.diameter + 24,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        {/* Scale */}
        {renderScale()}

        {/* Master Clock LED indicator if attached */}
        {hasMstClkLed && (
          <div className="absolute -left-1 bottom-0 flex items-center gap-1">
            <div
              className={`w-[6px] h-[6px] rounded-full border border-black/80 transition-all ${
                isMstClkActive
                  ? 'bg-red-500 shadow-[0_0_6px_#ff2233]'
                  : 'bg-[#3b1215] opacity-50'
              }`}
            />
            <span className="text-[6.5px] font-bold text-neutral-300">MST CLK</span>
          </div>
        )}

        {/* Outer Ribbed Knob Body */}
        <div
          className="relative rounded-full bg-[#1b1f24] shadow-[0_4px_8px_rgba(0,0,0,0.85),0_1px_2px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.18)] border border-neutral-900 flex items-center justify-center"
          style={{
            width: currentSize.diameter,
            height: currentSize.diameter,
            transform: `rotate(${angle}deg)`,
            transition: isDragging ? 'none' : 'transform 0.08s ease-out',
          }}
        >
          {/* Subtle knurling flute lines around the perimeter */}
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[1px] h-[3px] bg-neutral-950/80"
              style={{
                top: 1,
                left: '50%',
                transformOrigin: `0px ${currentSize.diameter / 2 - 1}px`,
                transform: `rotate(${i * (360 / 16)}deg) translateX(-50%)`,
              }}
            />
          ))}

          {/* Concentric brushed metal top cap */}
          <div
            className="rounded-full brushed-aluminum flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.7)]"
            style={{
              width: currentSize.cap,
              height: currentSize.cap,
            }}
          >
            {/* Center black indentation */}
            <div className="w-[4px] h-[4px] rounded-full bg-neutral-900/60 shadow-[inset_0_1px_1px_rgba(0,0,0,0.9)]" />
          </div>

          {/* White indicator pointer notch */}
          <div
            className="absolute top-[2px] w-[2px] rounded-full bg-white shadow-[0_0_2px_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.8)]"
            style={{
              height: currentSize.pointerLen,
              left: 'calc(50% - 1px)',
            }}
          />
        </div>

        {/* Live floating value tooltip */}
        {showTooltip && (
          <div className="absolute -top-7 px-1.5 py-0.5 rounded bg-black/90 border border-neutral-700 text-[9px] font-mono font-bold text-cyan-300 shadow-lg pointer-events-none z-30 whitespace-nowrap">
            {value.toFixed(1)} {unit}
          </div>
        )}
      </div>

      {/* Sublabel below */}
      {sublabel && (
        <div className="text-[7px] font-bold text-neutral-400 tracking-tight uppercase mt-0.5 leading-none text-center">
          {sublabel}
        </div>
      )}
    </div>
  );
};
