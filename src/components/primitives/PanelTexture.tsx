import React from 'react';

interface PanelTextureProps {
  type: 'nord-red' | 'slate-grey' | 'module-box' | 'oled-glass' | 'brushed-aluminum';
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const PanelTexture: React.FC<PanelTextureProps> = ({
  type,
  className = '',
  children,
  style = {},
}) => {
  const textureClasses = {
    'nord-red': 'nord-red-chassis',
    'slate-grey': 'nord-slate-panel',
    'module-box': 'nord-module-box',
    'oled-glass': 'oled-glass',
    'brushed-aluminum': 'brushed-aluminum',
  };

  return (
    <div className={`${textureClasses[type]} ${className}`} style={style}>
      {children}
    </div>
  );
};
