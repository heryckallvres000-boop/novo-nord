import React from 'react';
import { ChassisScrew } from './SectionDivider';

export interface PanelSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  minHeight?: string | number;
  className?: string;
  children: React.ReactNode;
  variant?: 'slate' | 'red';
  showCornerScrews?: boolean;
}

export const PanelSection: React.FC<PanelSectionProps> = ({
  title,
  subtitle,
  headerRight,
  width = 'auto',
  height = '375px',
  minHeight = '375px',
  className = '',
  children,
  variant = 'slate',
  showCornerScrews = true,
}) => {
  const panelBg = variant === 'slate' ? 'nord-slate-panel' : 'nord-red-chassis';

  return (
    <div
      className={`relative ${panelBg} rounded-[3px] p-2.5 flex flex-col justify-between shrink-0 select-none ${className}`}
      style={{ width, height, minHeight }}
    >
      {/* 4 Corner Screws */}
      {showCornerScrews && (
        <>
          <ChassisScrew className="absolute top-1.5 left-1.5 z-10" />
          <ChassisScrew className="absolute top-1.5 right-1.5 z-10" />
          <ChassisScrew className="absolute bottom-1.5 left-1.5 z-10" />
          <ChassisScrew className="absolute bottom-1.5 right-1.5 z-10" />
        </>
      )}

      {/* Header bar */}
      {(title || headerRight) && (
        <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-white/10 px-1.5 h-8">
          {title && (
            <div className="flex items-baseline gap-1.5">
              <h2 className="text-[17px] font-black tracking-wider text-white uppercase leading-none font-['Plus_Jakarta_Sans',sans-serif]">
                {title}
              </h2>
              {subtitle && (
                <span className="text-[8px] font-bold text-neutral-400 tracking-widest uppercase">
                  {subtitle}
                </span>
              )}
            </div>
          )}

          {headerRight && <div className="flex items-center gap-3">{headerRight}</div>}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">{children}</div>
    </div>
  );
};
