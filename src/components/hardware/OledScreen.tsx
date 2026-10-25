import React from 'react';
import { PresetData } from '../../types/synth';

interface OledScreenProps {
  preset: PresetData;
  lastChangedParam?: { name: string; value: string | number } | null;
  className?: string;
}

export const OledScreen: React.FC<OledScreenProps> = ({
  preset,
  lastChangedParam,
  className = '',
}) => {
  return (
    <div
      className={`relative w-[158px] h-[92px] rounded-[3px] oled-glass p-2 overflow-hidden flex flex-col justify-between font-mono select-none ${className}`}
    >
      {/* Subtle CRT / OLED scanline matrix overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 2px)',
        }}
      />

      {/* Top Header: Preset Number */}
      <div className="flex items-center justify-between text-[11px] font-bold tracking-tight oled-text-glow leading-none">
        <span>{preset.number}</span>
      </div>

      {/* Main Preset Name */}
      <div className="text-[14px] font-bold tracking-tight text-white oled-text-glow leading-tight my-0.5 font-['Chakra_Petch',sans-serif]">
        {preset.name}
      </div>

      {/* 3 Layer Rows */}
      <div className="flex flex-col gap-0.5 text-[8.5px] oled-text-glow border-t border-cyan-900/40 pt-1">
        {/* Organ Layer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate">
            <span className="text-[7.5px] px-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-300">
              ORG
            </span>
            <span className="truncate">{preset.organLayer}</span>
          </div>
        </div>

        {/* Piano Layer with XL badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate">
            <span className="text-[7.5px] px-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-300">
              PNO
            </span>
            <span className="truncate">{preset.pianoLayer}</span>
          </div>
          <span className="text-[7.5px] font-bold border border-cyan-700/60 px-0.5 rounded-sm bg-cyan-950/90 text-cyan-200">
            XL
          </span>
        </div>

        {/* Synth Layer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate">
            <span className="text-[7.5px] px-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-300">
              SYN
            </span>
            <span className="truncate">{preset.synthLayer}</span>
          </div>
        </div>
      </div>

      {/* Live HUD Parameter notification overlay */}
      {lastChangedParam && (
        <div className="absolute inset-x-1 bottom-1 bg-[#091522]/95 border border-cyan-500/80 rounded px-1.5 py-1 shadow-lg flex items-center justify-between text-[8px] oled-text-glow z-20 animate-fade-in">
          <span className="text-cyan-400 font-bold uppercase truncate max-w-[80px]">
            {lastChangedParam.name}:
          </span>
          <span className="text-white font-mono font-bold truncate max-w-[60px]">
            {lastChangedParam.value}
          </span>
        </div>
      )}
    </div>
  );
};
