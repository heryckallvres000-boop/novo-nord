import React from 'react';

export const ChassisScrew: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`chassis-screw ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export interface SectionDividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  orientation = 'horizontal',
  className = '',
  style = {},
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={`w-[1px] bg-white/10 shadow-[1px_0_0_rgba(0,0,0,0.8)] self-stretch ${className}`}
        style={style}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`h-[1px] w-full bg-white/10 shadow-[0_1px_0_rgba(0,0,0,0.8)] my-1 ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};
