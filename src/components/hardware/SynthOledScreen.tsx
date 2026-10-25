import React from 'react';

interface SynthOledScreenProps {
  waveform?: string;
  detune?: number;
  oscType?: string;
  category?: string;
  waveIndex?: string;
  onInfoClick?: () => void;
  onList1Click?: () => void;
  onList2Click?: () => void;
  className?: string;
}

export const SynthOledScreen: React.FC<SynthOledScreenProps> = ({
  waveform = 'Super Saw',
  detune = 3.4,
  oscType = 'ANALOG',
  category = 'SUPER',
  waveIndex = '1 (5)',
  onInfoClick,
  onList1Click,
  onList2Click,
  className = '',
}) => {
  // Waveform visualization calculation: multi-stacked saw teeth
  const numSaws = 5;
  const spread = Math.min(12, Math.max(2, detune * 2.2));

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Outer OLED bezel */}
      <div className="relative w-[190px] h-[100px] rounded-[3px] oled-glass p-2 overflow-hidden flex flex-col justify-between font-mono">
        {/* CRT Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 2px)',
          }}
        />

        {/* Top Centered Header Box: OSC WAVEFORM */}
        <div className="flex justify-center -mt-0.5">
          <div className="border border-cyan-700/60 rounded px-2 py-0.5 text-[8.5px] font-bold tracking-widest text-cyan-200 oled-text-glow bg-cyan-950/40">
            OSC WAVEFORM
          </div>
        </div>

        {/* Middle Area: Waveform name + Detune + Stepped graphic */}
        <div className="flex items-center justify-between my-0.5">
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-white tracking-tight oled-text-glow font-['Chakra_Petch',sans-serif]">
              {waveform}
            </span>
            <span className="text-[9px] font-bold text-cyan-300 oled-text-glow">
              DETUNE: {detune.toFixed(1)}
            </span>
          </div>

          {/* Stepped Super-Saw Graphic representation */}
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
        <div className="grid grid-cols-3 gap-1 pt-1 border-t border-cyan-900/40 text-[7.5px] font-bold text-center">
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

      {/* 3 Encoders below screen: INFO, LIST, LIST */}
      <div className="flex items-center justify-between w-[184px] mt-2 px-3">
        {/* INFO Encoder */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            type="button"
            onClick={onInfoClick}
            className="w-7 h-7 rounded-full bg-[#1b2027] border border-black/90 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer hover:bg-[#252c36] active:translate-y-[1px]"
          >
            <div className="w-4 h-4 rounded-full brushed-aluminum" />
          </button>
          <span className="text-[7.5px] font-bold text-neutral-300 tracking-wider uppercase">
            INFO
          </span>
        </div>

        {/* LIST 1 Encoder */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            type="button"
            onClick={onList1Click}
            className="w-7 h-7 rounded-full bg-[#1b2027] border border-black/90 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer hover:bg-[#252c36] active:translate-y-[1px]"
          >
            <div className="w-4 h-4 rounded-full brushed-aluminum" />
          </button>
          <span className="text-[7.5px] font-bold text-neutral-300 tracking-wider uppercase">
            LIST
          </span>
        </div>

        {/* LIST 2 Encoder */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            type="button"
            onClick={onList2Click}
            className="w-7 h-7 rounded-full bg-[#1b2027] border border-black/90 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer hover:bg-[#252c36] active:translate-y-[1px]"
          >
            <div className="w-4 h-4 rounded-full brushed-aluminum" />
          </button>
          <span className="text-[7.5px] font-bold text-neutral-300 tracking-wider uppercase">
            LIST
          </span>
        </div>
      </div>
    </div>
  );
};
