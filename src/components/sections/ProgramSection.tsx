import React from 'react';
import { SynthState } from '../../types/synth';
import { PRESETS } from '../../state/useSynthStore';
import {
  RotaryKnob,
  ToggleButton,
  MomentaryButton,
  LedIndicator,
  ProgramDisplay,
  TextLabel,
} from '../primitives';

interface ProgramSectionProps {
  state: SynthState;
  setParam: (name: string, value: any) => void;
  toggleParam: (name: keyof SynthState) => void;
  selectPreset: (preset: any) => void;
  selectProgramNumber: (num: number) => void;
  clockTick: boolean;
  className?: string;
}

export const ProgramSection: React.FC<ProgramSectionProps> = ({
  state,
  setParam,
  toggleParam,
  selectPreset,
  selectProgramNumber,
  clockTick,
  className = '',
}) => {
  const nextPreset = () => {
    const curIdx = PRESETS.findIndex((p) => p.id === state.activePreset.id);
    const nextIdx = (curIdx + 1) % PRESETS.length;
    selectPreset(PRESETS[nextIdx]);
  };

  const prevPreset = () => {
    const curIdx = PRESETS.findIndex((p) => p.id === state.activePreset.id);
    const prevIdx = (curIdx - 1 + PRESETS.length) % PRESETS.length;
    selectPreset(PRESETS[prevIdx]);
  };

  return (
    <div
      className={`relative p-2.5 flex shrink-0 select-none ${className}`}
      style={{ width: '385px', height: '430px', minHeight: '430px' }}
    >
      {/* Main Program & Navigation Surface */}
      <div className="flex-1 flex flex-col justify-between pr-2">
        {/* Top Blocks: MORPH ASSIGN | SPLIT | MST CLK | TRANSP */}
        <div className="flex items-start justify-between gap-1 pb-1">
          {/* MORPH ASSIGN Box */}
          <div className="silkscreen-frame-red p-1.5 flex flex-col items-center">
            <span className="text-[6.5px] font-black text-white tracking-widest uppercase mb-1">
              MORPH ASSIGN
            </span>
            <div className="flex items-center gap-1.5">
              <div
                onClick={() => toggleParam('morphWheel')}
                className="flex items-center gap-0.5 cursor-pointer"
              >
                <LedIndicator color="green" isOn={state.morphWheel} size="xs" />
                <span className="text-[6px] font-bold text-neutral-200">WHEEL</span>
              </div>
              <div
                onClick={() => toggleParam('morphAftertouch')}
                className="flex items-center gap-0.5 cursor-pointer"
              >
                <LedIndicator color="red" isOn={state.morphAftertouch} size="xs" />
                <span className="text-[6px] font-bold text-neutral-200">A.T. ▼</span>
              </div>
              <div
                onClick={() => toggleParam('morphControlPedal')}
                className="flex items-center gap-0.5 cursor-pointer"
              >
                <LedIndicator color="red" isOn={state.morphControlPedal} size="xs" />
                <span className="text-[6px] font-bold text-neutral-200">CTRLPED ▼</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-center border-t border-white/20 mt-1 pt-0.5">
              <span className="text-[5.5px] font-bold text-neutral-300">
                CLEAR MORPH
              </span>
            </div>
          </div>

          {/* SPLIT */}
          <div className="flex flex-col items-center gap-0.5">
            <TextLabel variant="indicator" className="text-[6.5px]">SPLIT</TextLabel>
            <div className="flex items-center gap-0.5">
              <LedIndicator color="red" isOn={state.splitActive} size="xs" />
              <MomentaryButton
                label="ON/SET▼"
                width="28px"
                height="14px"
                onPress={() => toggleParam('splitActive')}
              />
            </div>
            <span className="text-[5.5px] font-bold text-neutral-300">SET KEY</span>
          </div>

          {/* MST CLK */}
          <div className="flex flex-col items-center gap-0.5">
            <TextLabel variant="indicator" className="text-[6.5px]">MST CLK</TextLabel>
            <div className="flex items-center gap-0.5">
              <LedIndicator color="red" isOn={clockTick} size="xs" />
              <MomentaryButton
                label="TAP/SET▼"
                width="28px"
                height="14px"
                onPress={() => {
                  setParam('masterClockTempo', state.masterClockTempo === 120 ? 128 : 120);
                }}
              />
            </div>
            <span className="text-[5.5px] font-bold text-neutral-300">PEDAL TAP</span>
          </div>

          {/* TRANSP */}
          <div className="flex flex-col items-center gap-0.5">
            <TextLabel variant="indicator" className="text-[6.5px]">TRANSP</TextLabel>
            <div className="flex items-center gap-0.5">
              <LedIndicator color="red" isOn={state.transposeActive} size="xs" />
              <MomentaryButton
                label="ON/SET▼"
                width="28px"
                height="14px"
                onPress={() => toggleParam('transposeActive')}
              />
            </div>
            <span className="text-[5.5px] font-bold text-neutral-300">PANIC</span>
            <span className="text-[5px] font-semibold text-neutral-400">PROG VIEW</span>
          </div>
        </div>

        {/* Second Row: STORE & PRESET LIBRARY */}
        <div className="flex items-center justify-between gap-1.5 my-0.5">
          {/* Store Buttons */}
          <div className="flex items-center gap-1.5">
            <div className="flex flex-col items-center">
              <MomentaryButton
                variant="store"
                label="STORE"
                onPress={() => {
                  setParam('lastChangedParam', {
                    name: 'STORE',
                    value: 'SAVED TO FLASH',
                  });
                }}
              />
            </div>
            <div className="flex flex-col items-center">
              <MomentaryButton
                label="STORE AS..."
                sublabel="PAGE NAME"
                width="40px"
                height="14px"
                onPress={() => {
                  setParam('lastChangedParam', {
                    name: 'STORE AS',
                    value: 'NAME DIALOG',
                  });
                }}
              />
            </div>
            <div className="flex flex-col gap-0.5 pl-1">
              <div className="flex items-center gap-0.5">
                <LedIndicator color="red" isOn={true} size="xs" />
                <span className="text-[5px] font-bold text-neutral-300">MIDI</span>
              </div>
              <div className="flex items-center gap-0.5">
                <LedIndicator color="red" isOn={false} size="xs" />
                <span className="text-[5px] font-bold text-neutral-300">EXTERN</span>
              </div>
            </div>
          </div>

          {/* PRESET LIBRARY Box */}
          <div className="silkscreen-frame-red px-2 py-1 flex items-center gap-2">
            <span className="text-[6px] font-black text-white tracking-widest uppercase">
              PRESET LIBRARY
            </span>
            <div className="flex items-center gap-1.5">
              <div
                onClick={() => toggleParam('presetLibraryOrgan')}
                className="flex items-center gap-0.5 cursor-pointer"
              >
                <LedIndicator color="red" isOn={state.presetLibraryOrgan} size="xs" />
                <span className="text-[6px] font-bold text-neutral-200">ORGAN</span>
              </div>
              <div
                onClick={() => toggleParam('presetLibraryPiano')}
                className="flex items-center gap-0.5 cursor-pointer"
              >
                <LedIndicator color="red" isOn={state.presetLibraryPiano} size="xs" />
                <span className="text-[6px] font-bold text-neutral-200">PIANO</span>
              </div>
              <div
                onClick={() => toggleParam('presetLibrarySynth')}
                className="flex items-center gap-0.5 cursor-pointer"
              >
                <LedIndicator color="red" isOn={state.presetLibrarySynth} size="xs" />
                <span className="text-[6px] font-bold text-neutral-200">SYNTH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Encoder & OLED Display Screen */}
        <div className="flex items-center justify-between gap-2 my-1">
          {/* Big Black Program Encoder Knob */}
          <div className="flex flex-col items-center">
            <RotaryKnob
              value={state.activeProgramNumber}
              min={1}
              max={8}
              step={1}
              size="lg"
              scaleType="none"
              onChange={(val) => selectProgramNumber(Math.round(val))}
              label="PROGRAM [LIST]"
              sublabel="◀ PAGE/CAT ▶"
            />
          </div>

          {/* Central High-Resolution OLED Screen */}
          <ProgramDisplay
            preset={state.activePreset}
            lastChangedParam={state.lastChangedParam}
          />
        </div>

        {/* Below Screen Controls: BANK, LIVE MODE, NUM PAD, LAYER SCENE II */}
        <div className="flex items-center justify-between px-0.5 my-0.5">
          <div className="flex flex-col items-center">
            <TextLabel variant="sublabel" className="mb-0.5 text-[6px]">
              ◀ BANK ▶
            </TextLabel>
            <div className="flex items-center">
              <MomentaryButton variant="rocker-left" onPress={prevPreset} />
              <MomentaryButton variant="rocker-right" onPress={nextPreset} />
            </div>
          </div>

          <ToggleButton
            hasLed
            ledColor="red"
            isActive={state.liveMode}
            label="LIVE MODE"
            width="40px"
            height="15px"
            onToggle={() => toggleParam('liveMode')}
          />

          <ToggleButton
            hasLed
            ledColor="red"
            isActive={state.numPadActive}
            label="NUM PAD"
            width="36px"
            height="15px"
            onToggle={() => toggleParam('numPadActive')}
          />

          <ToggleButton
            hasLed
            ledColor="blue"
            isActive={state.layerSceneII}
            label="LAYER SCENE II"
            width="46px"
            height="15px"
            onToggle={() => toggleParam('layerSceneII')}
          />

          <MomentaryButton label="PEDAL" width="28px" height="15px" onPress={() => {}} />
        </div>

        {/* Program Buttons 1 - 8 */}
        <div className="silkscreen-frame-red p-1.5 flex flex-col gap-1 mt-0.5">
          <div className="text-center text-[6.5px] font-black tracking-widest text-white uppercase">
            PROGRAM
          </div>

          {/* Row 1: 1, 2, 3, 4 */}
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <ToggleButton
                  hasLed
                  ledColor="red"
                  isActive={state.activeProgramNumber === num}
                  label={String(num)}
                  width="36px"
                  height="16px"
                  onToggle={() => selectProgramNumber(num)}
                />
              </div>
            ))}
          </div>

          {/* Row 2: 5, 6, 7, 8 */}
          <div className="grid grid-cols-4 gap-1.5 border-t border-white/20 pt-1">
            {[
              { num: 5, sub: 'SYSTEM', aux: 'OUTPUT' },
              { num: 6, sub: 'SOUND', aux: 'PEDAL' },
              { num: 7, sub: 'ORGANIZE', aux: 'MIDI' },
              { num: 8, sub: 'AUX KB', aux: 'EXTERN' },
            ].map((item) => (
              <div key={item.num} className="flex flex-col items-center">
                <ToggleButton
                  hasLed
                  ledColor="red"
                  isActive={state.activeProgramNumber === item.num}
                  label={String(item.num)}
                  sublabel={item.sub}
                  width="36px"
                  height="16px"
                  onToggle={() => selectProgramNumber(item.num)}
                />
                <span className="text-[5.5px] font-bold text-neutral-300 uppercase mt-0.5">
                  {item.aux}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical Column on the Right: PRESET NAME, SOLO, UNDO, SECTION EDIT, LAYER INIT, PASTE, SHIFT */}
      <div className="w-[48px] border-l border-white/20 pl-1.5 flex flex-col justify-between items-center py-0.5">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[5.5px] font-black text-white uppercase leading-none text-center">
            PRESET NAME
          </span>
          <ToggleButton
            hasLed
            ledColor="red"
            isActive={state.soloActive}
            label="SOLO"
            width="34px"
            height="15px"
            onToggle={() => toggleParam('soloActive')}
          />
          <MomentaryButton label="UNDO" width="34px" height="14px" onPress={() => {}} />
          <MomentaryButton
            label="SECTION EDIT▼"
            width="36px"
            height="14px"
            onPress={() => {}}
          />
          <MomentaryButton
            label="LAYER INIT"
            sublabel="MON/COPY"
            width="36px"
            height="14px"
            onPress={() => {}}
          />
          <MomentaryButton label="PASTE▼" width="34px" height="14px" onPress={() => {}} />
        </div>

        {/* Large Iconic Light Grey SHIFT Button */}
        <div className="mt-2">
          <ToggleButton
            variant="shift"
            label="SHIFT"
            sublabel="EXIT"
            isActive={state.shiftActive}
            onToggle={() => toggleParam('shiftActive')}
          />
        </div>
      </div>
    </div>
  );
};
