import React from 'react';

export interface TextLabelProps {
  children: React.ReactNode;
  variant?: 'title' | 'section-header' | 'module-header' | 'sublabel' | 'indicator';
  className?: string;
  style?: React.CSSProperties;
}

export const TextLabel: React.FC<TextLabelProps> = ({
  children,
  variant = 'module-header',
  className = '',
  style = {},
}) => {
  const styles = {
    title: 'text-[18px] font-black tracking-wider text-white uppercase font-[\'Plus_Jakarta_Sans\',sans-serif] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
    'section-header': 'text-[16px] font-black tracking-wider text-white uppercase font-[\'Plus_Jakarta_Sans\',sans-serif] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
    'module-header': 'text-[8px] font-bold tracking-widest text-neutral-200 uppercase font-[\'Plus_Jakarta_Sans\',sans-serif] leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]',
    sublabel: 'text-[6.5px] font-bold tracking-tight text-neutral-400 uppercase font-[\'Plus_Jakarta_Sans\',sans-serif] leading-none',
    indicator: 'text-[7px] font-semibold tracking-normal text-neutral-300 uppercase font-[\'Plus_Jakarta_Sans\',sans-serif] leading-none',
  };

  return (
    <span className={`${styles[variant]} ${className}`} style={style}>
      {children}
    </span>
  );
};
