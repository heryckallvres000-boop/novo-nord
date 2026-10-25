import React, { useState, useEffect, useCallback } from 'react';
import { audioEngine } from '../../audio/audioEngine';
import { SynthState } from '../../types/synth';

interface VirtualKeyboardProps {
  state: SynthState;
  isAudioActive: boolean;
  onActivateAudio: () => void;
  className?: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  state,
  isAudioActive,
  onActivateAudio,
  className = '',
}) => {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [octaveOffset, setOctaveOffset] = useState(0);

  // Generate 37 keys (3 octaves: C3 (48) to C6 (84))
  const startNote = 48 + octaveOffset * 12;
  const numKeys = 37;

  const isBlackKey = (midiNote: number) => {
    const noteInOctave = midiNote % 12;
    return [1, 3, 6, 8, 10].includes(noteInOctave);
  };

  const handleNoteOn = useCallback(
    (midiNote: number) => {
      if (!isAudioActive) {
        onActivateAudio();
      }
      setActiveNotes((prev) => new Set(prev).add(midiNote));
      audioEngine.noteOn(midiNote, 0.85, state);
    },
    [isAudioActive, onActivateAudio, state]
  );

  const handleNoteOff = useCallback((midiNote: number) => {
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(midiNote);
      return next;
    });
    audioEngine.noteOff(midiNote);
  }, []);

  // Update audio engine parameters whenever synth state updates
  useEffect(() => {
    audioEngine.updateParameters(state);
  }, [state]);

  // Computer QWERTY keyboard binding
  useEffect(() => {
    const keyMap: { [key: string]: number } = {
      a: 0, // C
      w: 1, // C#
      s: 2, // D
      e: 3, // D#
      d: 4, // E
      f: 5, // F
      t: 6, // F#
      g: 7, // G
      y: 8, // G#
      h: 9, // A
      u: 10, // A#
      j: 11, // B
      k: 12, // C+1
      o: 13, // C#+1
      l: 14, // D+1
      p: 15, // D#+1
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (key in keyMap) {
        const note = startNote + 12 + keyMap[key];
        handleNoteOn(note);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keyMap) {
        const note = startNote + 12 + keyMap[key];
        handleNoteOff(note);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handleNoteOn, handleNoteOff, startNote]);

  // Keys array
  const keys = Array.from({ length: numKeys }, (_, i) => startNote + i);
  const whiteKeys = keys.filter((k) => !isBlackKey(k));

  return (
    <div
      className={`fixed bottom-0 inset-x-0 bg-[#161a20]/95 backdrop-blur-md border-t border-neutral-700/80 shadow-[0_-8px_20px_rgba(0,0,0,0.7)] p-2 z-40 flex flex-col items-center select-none ${className}`}
    >
      {/* Mini toolbar */}
      <div className="w-full max-w-4xl flex items-center justify-between px-3 pb-1 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
            Audition Keyboard
          </span>
          <span className="text-[10px] text-neutral-400 hidden sm:inline">
            (Play with mouse/touch or QWERTY keys: A W S E D F T G Y H U J K)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOctaveOffset((o) => Math.max(-2, o - 1))}
            className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 font-mono text-[10px] cursor-pointer"
          >
            Oct -
          </button>
          <span className="font-mono text-neutral-300 text-xs tabular-nums">
            Oct: {octaveOffset > 0 ? `+${octaveOffset}` : octaveOffset}
          </span>
          <button
            onClick={() => setOctaveOffset((o) => Math.min(2, o + 1))}
            className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 font-mono text-[10px] cursor-pointer"
          >
            Oct +
          </button>
        </div>
      </div>

      {/* Piano Keys Container */}
      <div className="relative flex justify-center h-28 max-w-4xl w-full px-2 overflow-x-auto py-1">
        {/* White Keys */}
        <div className="flex relative">
          {whiteKeys.map((note) => {
            const isPressed = activeNotes.has(note);
            return (
              <button
                key={note}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleNoteOn(note);
                }}
                onPointerUp={() => handleNoteOff(note)}
                onPointerLeave={() => activeNotes.has(note) && handleNoteOff(note)}
                className={`w-7 sm:w-8 h-24 rounded-b-[3px] border border-neutral-400/80 shadow-[0_3px_5px_rgba(0,0,0,0.4)] transition-all cursor-pointer relative shrink-0 ${
                  isPressed
                    ? 'bg-neutral-200 translate-y-[2px] shadow-inner'
                    : 'bg-gradient-to-b from-[#f8fafc] via-[#edf2f7] to-[#e2e8f0] hover:bg-neutral-100'
                }`}
              >
                {note % 12 === 0 && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-neutral-500 font-mono">
                    C{Math.floor(note / 12) - 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Black Keys overlaid */}
        <div className="absolute top-1 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex relative pl-1">
            {whiteKeys.map((note, idx) => {
              const nextNote = note + 1;
              if (!isBlackKey(nextNote) || idx === whiteKeys.length - 1) {
                return <div key={`spacer-${note}`} className="w-7 sm:w-8 shrink-0" />;
              }

              const isPressed = activeNotes.has(nextNote);
              return (
                <div key={`container-${nextNote}`} className="relative w-7 sm:w-8 shrink-0">
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleNoteOn(nextNote);
                    }}
                    onPointerUp={() => handleNoteOff(nextNote)}
                    onPointerLeave={() => activeNotes.has(nextNote) && handleNoteOff(nextNote)}
                    className={`absolute top-0 -right-2.5 sm:-right-3 w-4.5 sm:w-5 h-16 rounded-b-[2px] bg-gradient-to-b from-[#2b3038] via-[#1a1e24] to-[#0c0e12] border border-black shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-auto cursor-pointer z-10 transition-transform ${
                      isPressed ? 'translate-y-[2px] bg-[#101317]' : ''
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
