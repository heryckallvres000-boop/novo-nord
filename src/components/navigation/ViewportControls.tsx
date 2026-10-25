import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Volume2, VolumeX, Piano, Eye } from 'lucide-react';
import { SectionId } from '../../types/synth';

interface ViewportControlsProps {
  zoom: number;
  setZoom: (fn: (prev: number) => number) => void;
  resetZoom: () => void;
  fitToScreen: () => void;
  activeSection: SectionId | 'all';
  onJumpToSection: (section: SectionId | 'all') => void;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  showKeyboard: boolean;
  onToggleKeyboard: () => void;
  showRefOverlay: boolean;
  onToggleRefOverlay: () => void;
  refOverlayOpacity: number;
  setRefOverlayOpacity: (opacity: number) => void;
  lastChangedParam?: { name: string; value: string | number } | null;
}

export const ViewportControls: React.FC<ViewportControlsProps> = ({
  zoom,
  setZoom,
  resetZoom,
  fitToScreen,
  activeSection,
  onJumpToSection,
  isAudioActive,
  onToggleAudio,
  showKeyboard,
  onToggleKeyboard,
  showRefOverlay,
  onToggleRefOverlay,
  refOverlayOpacity,
  setRefOverlayOpacity,
  lastChangedParam,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 h-12 bg-[#0e1116]/95 backdrop-blur-md border-b border-neutral-800/80 z-50 px-3 sm:px-4 flex items-center justify-between gap-3 select-none">
      {/* Brand Title Lockup (Top Bar Contract: Zone 1) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#e11d2a] shadow-[0_0_10px_#ef4444]" />
        <span className="text-xs font-black tracking-widest text-white uppercase font-['Plus_Jakarta_Sans',sans-serif]">
          Nord Stage 4
        </span>
        <span className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase hidden md:inline">
          HA88 Master Console
        </span>
      </div>

      {/* Center: Section Jump Quick Selectors (Top Bar Contract: Zone 2) */}
      <nav className="flex items-center gap-1 bg-black/60 p-0.5 rounded border border-white/10 shrink-0">
        {[
          { id: 'all', label: 'Full Panel' },
          { id: 'piano', label: 'Piano' },
          { id: 'program', label: 'Program' },
          { id: 'synth', label: 'Synth' },
          { id: 'effects', label: 'Layer Effects' },
        ].map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => onJumpToSection(sec.id as any)}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === sec.id
                ? 'bg-[#c41e28] text-white shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </nav>

      {/* Right Tools (Top Bar Contract: Zone 3) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Real-time Hardware Parameter Readout */}
        {lastChangedParam && (
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/80 border border-neutral-700/80 text-[10.5px] font-mono">
            <span className="text-cyan-400 font-bold uppercase truncate max-w-[100px]">
              {lastChangedParam.name}:
            </span>
            <span className="text-white font-bold truncate max-w-[70px]">
              {lastChangedParam.value}
            </span>
          </div>
        )}

        {/* Reference Image Comparison Overlay Toggle */}
        <div className="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded border border-neutral-800">
          <button
            type="button"
            onClick={onToggleRefOverlay}
            title="Toggle Reference Image overlay comparison to verify 1:1 visual fidelity"
            className={`flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
              showRefOverlay
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye size={12} />
            <span className="hidden sm:inline">Ref Image</span>
          </button>
          {showRefOverlay && (
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={refOverlayOpacity}
              onChange={(e) => setRefOverlayOpacity(parseFloat(e.target.value))}
              title={`Overlay Opacity: ${Math.round(refOverlayOpacity * 100)}%`}
              className="w-14 h-1 accent-amber-400 cursor-pointer"
            />
          )}
        </div>

        {/* Audition Keys Toggle */}
        <button
          type="button"
          onClick={onToggleKeyboard}
          title="Toggle 88-Key Audition Keyboard"
          className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
            showKeyboard
              ? 'bg-neutral-800 border-neutral-600 text-white'
              : 'border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
          }`}
        >
          <Piano size={13} />
          <span className="hidden sm:inline text-[11px]">Keys</span>
        </button>

        {/* Audio Engine Enable Toggle */}
        <button
          type="button"
          onClick={onToggleAudio}
          title={isAudioActive ? 'Web Audio Engine Active' : 'Enable Web Audio Engine'}
          className={`p-1 rounded border transition-colors cursor-pointer ${
            isAudioActive
              ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
              : 'border-neutral-700 text-neutral-400 hover:text-white'
          }`}
        >
          {isAudioActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded border border-neutral-800">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.35, Number((z - 0.05).toFixed(2))))}
            title="Zoom Out"
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ZoomOut size={13} />
          </button>

          <span className="text-[10.5px] font-mono font-bold text-neutral-200 w-11 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.0, Number((z + 0.05).toFixed(2))))}
            title="Zoom In"
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ZoomIn size={13} />
          </button>

          <button
            type="button"
            onClick={resetZoom}
            title="Reset Zoom (100%)"
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer border-l border-neutral-800 pl-1"
          >
            <RotateCcw size={12} />
          </button>

          <button
            type="button"
            onClick={fitToScreen}
            title="Fit Panel to Screen"
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
