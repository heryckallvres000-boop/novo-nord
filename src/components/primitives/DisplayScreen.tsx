import React from 'react';
import { PresetData } from '../../types/synth';

export interface ProgramDisplayProps {
  preset: PresetData;
  lastChangedParam?: { name: string; value: string | number } | null;
  className?: string;
}

export const ProgramDisplay: React.FC<ProgramDisplayProps> = ({
  preset,
  lastChangedParam,
  className = '',
}) => {
  return (
    <div
      className={`relative w-[158px] h-[92px] rounded-[3px] oled-glass p-2 overflow-hidden flex flex-col justify-between font-mono select-none ${className}`}
    >
      {/* CRT Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 2px)',
        }}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between text-[11px] font-bold tracking-tight oled-text-glow leading-none">
        <span>{preset.number}</span>
      </div>

      {/* Main Preset Name */}
      <div className="text-[14px] font-bold tracking-tight text-white oled-text-glow leading-tight my-0.5 font-['Chakra_Petch',sans-serif]">
        {preset.name}
      </div>

      {/* Layer Rows */}
      <div className="flex flex-col gap-0.5 text-[8.5px] oled-text-glow border-t border-cyan-900/40 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate">
            <span className="text-[7px] px-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-300">
              ORG
            </span>
            <span className="truncate">{preset.organLayer}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate">
            <span className="text-[7px] px-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-300">
              PNO
            </span>
            <span className="truncate">{preset.pianoLayer}</span>
          </div>
          <span className="text-[7px] font-bold border border-cyan-700/60 px-0.5 rounded-sm bg-cyan-950/90 text-cyan-200">
            XL
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate">
            <span className="text-[7px] px-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-300">
              SYN
            </span>
            <span className="truncate">{preset.synthLayer}</span>
          </div>
        </div>
      </div>

      {/* HUD Parameter Overlay */}
      {lastChangedParam && (
        <div className="absolute inset-x-1 bottom-1 bg-[#091522]/95 border border-cyan-500/80 rounded px-1.5 py-1 shadow-lg flex items-center justify-between text-[8px] oled-text-glow z-20">
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

export interface SynthDisplayProps {
  waveform?: string;
  detune?: number;
  oscType?: string;
  category?: string;
  waveIndex?: string;
  className?: string;
}

export const SynthDisplay: React.FC<SynthDisplayProps> = ({
  waveform = 'Super Saw',
  detune = 3.4,
  oscType = 'ANALOG',
  category = 'SUPER',
  waveIndex = '1 (5)',
  className = '',
}) => {
  const numSaws = 5;
  const spread = Math.min(12, Math.max(2, detune * 2.2));

  return (
    <div className={`relative w-[190px] h-[100px] rounded-[3px] oled-glass p-2 overflow-hidden flex flex-col justify-between font-mono select-none ${className}`}>
      {/* Scanline */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 2px)',
        }}
      />

      {/* Header */}
      <div className="flex justify-center -mt-0.5">
        <div className="border border-cyan-700/60 rounded px-2 py-0.5 text-[8px] font-bold tracking-widest text-cyan-200 oled-text-glow bg-cyan-950/40">
          OSC WAVEFORM
        </div>
      </div>

      {/* Mid Waveform */}
      <div className="flex items-center justify-between my-0.5">
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-white tracking-tight oled-text-glow font-['Chakra_Petch',sans-serif]">
            {waveform}
          </span>
          <span className="text-[8.5px] font-bold text-cyan-300 oled-text-glow">
            DETUNE: {detune.toFixed(1)}
          </span>
        </div>

        {/* Stepped Multi-Saw Graphic */}
        <div className="w-[68px] h-[32px] relative flex items-center justify-center">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 68 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {[...Array(numSaws)].map((_, i) => {
              const offsetX = (i - (numSaws - 1) / 2) * (spread / 3);
              const opacity = 0.4 + (i / numSaws) * 0.6;
              return (
                <path
                  key={i}
                  d={`M ${10 + offsetX} 28 L ${28 + offsetX} 4 L ${28 + offsetX} 28 L ${46 + offsetX} 4 L ${46 + offsetX} 28`}
                  stroke="#a5f3fc"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="miter"
                  opacity={opacity}
                  style={{
                    filter: 'drop-shadow(0 0 2px rgba(165,243,252,0.8))',
                  }}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Bottom 3 parameter boxes */}
      <div className="grid grid-cols-3 gap-1 pt-1 border-t border-cyan-900/40 text-[7px] font-bold text-center">
        <div className="flex flex-col items-center">
          <span className="border border-cyan-800/80 rounded px-1 text-cyan-300 bg-cyan-950/60 leading-tight">
            {oscType}
          </span>
          <span className="text-cyan-400/80 text-[6.5px] tracking-tight mt-0.5">
            [TYPE]
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="border border-cyan-800/80 rounded px-1 text-cyan-300 bg-cyan-950/60 leading-tight">
            {category}
          </span>
          <span className="text-cyan-400/80 text-[6.5px] tracking-tight mt-0.5">
            [CAT]
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="border border-cyan-800/80 rounded px-1 text-cyan-300 bg-cyan-950/60 leading-tight">
            {waveIndex}
          </span>
          <span className="text-cyan-400/80 text-[6.5px] tracking-tight mt-0.5">
            [WAVE]
          </span>
        </div>
      </div>
    </div>
  );
};
