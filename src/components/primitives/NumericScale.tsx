import React from 'react';

export interface NumericScaleProps {
  radius: number;
  scaleType?: '0-10' | '-10-+10' | '-15-+15' | 'freq' | 'none';
  customTicks?: { label?: string; angle: number; isMajor: boolean }[];
  className?: string;
}

export const NumericScale: React.FC<NumericScaleProps> = ({
  radius,
  scaleType = '0-10',
  customTicks,
  className = '',
}) => {
  if (scaleType === 'none') return null;

  let ticks: { label?: string; angle: number; isMajor: boolean }[] = [];

  if (customTicks) {
    ticks = customTicks;
  } else if (scaleType === '0-10') {
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

  const svgSize = (radius + 14) * 2;
  const center = svgSize / 2;

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className={`absolute pointer-events-none overflow-visible ${className}`}
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {ticks.map((t, idx) => {
        const rad = ((t.angle - 90) * Math.PI) / 180;
        const tickDotRadius = radius + 2.8;
        const textRadius = radius + 9.8;

        const dotX = center + Math.cos(rad) * tickDotRadius;
        const dotY = center + Math.sin(rad) * tickDotRadius;

        const textX = center + Math.cos(rad) * textRadius;
        const textY = center + Math.sin(rad) * textRadius;

        return (
          <g key={idx}>
            {/* Tick Dot */}
            <circle
              cx={dotX}
              cy={dotY}
              r={t.isMajor ? 1.0 : 0.6}
              fill={t.isMajor ? '#f1f5f9' : '#94a3b8'}
              opacity={t.isMajor ? 0.95 : 0.75}
            />

            {/* Scale Number */}
            {t.label && (
              <text
                x={textX}
                y={textY}
                fill="#f1f5f9"
                fontSize="6.5px"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.95))',
                }}
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
