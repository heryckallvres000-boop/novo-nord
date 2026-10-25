import React from 'react';
import { SynthState } from '../../types/synth';
import {
  PanelSection,
  RotaryKnob,
  ToggleButton,
  MomentaryButton,
  LedIndicator,
  SliderControl,
  TextLabel,
} from '../primitives';

interface PianoSectionProps {
  state: SynthState;
  setParam: (name: string, value: any) => void;
  toggleParam: (name: keyof SynthState) => void;
  className?: string;
}

export const PianoSection: React.FC<PianoSectionProps> = ({
  state,
  setParam,
  toggleParam,
  className = '',
}) => {
  const pianoTypes = [
    { id: 'ELECTRIC', label: 'ELECTRIC' },
    { id: 'CLAV', label: 'CLAV' },
    { id: 'UPRIGHT', label: 'UPRIGHT' },
    { id: 'DIGITAL', label: 'DIGITAL' },
    { id: 'GRAND', label: 'GRAND' },
    { id: 'MISC', label: 'MISC' },
  ];

  const cyclePianoType = () => {
    const list: SynthState['pianoType'][] = [
      'GRAND',
      'UPRIGHT',
      'ELECTRIC',
      'CLAV',
      'DIGITAL',
      'MISC',
    ];
    const idx = list.indexOf(state.pianoType);
    setParam('pianoType', list[(idx + 1) % list.length]);
  };

  const cycleUnison = () => {
    const next = ((state.pianoUnison + 1) % 4) as 0 | 1 | 2 | 3;
    setParam('pianoUnison', next);
  };

  const cycleKbTouch = () => {
    const list: SynthState['pianoKbTouch'][] = ['LIGHT', 'MED', 'HEAVY'];
    const idx = list.indexOf(state.pianoKbTouch);
    setParam('pianoKbTouch', list[(idx + 1) % list.length]);
  };

  const cycleDynComp = () => {
    const next = ((state.pianoDynComp + 1) % 4) as 0 | 1 | 2 | 3;
    setParam('pianoDynComp', next);
  };

  const cycleTimbre = () => {
    const list: SynthState['pianoTimbre'][] = ['BRIGHT', 'MID', 'SOFT', 'DYNO1', 'DYNO2'];
    const idx = list.indexOf(state.pianoTimbre);
    setParam('pianoTimbre', list[(idx + 1) % list.length]);
  };

  const headerRight = (
    <div className="flex items-center gap-2.5">
      <div className="flex flex-col items-center gap-0.5">
        <TextLabel variant="indicator" className="text-[7px]">FX FOCUS</TextLabel>
        <LedIndicator
          color="amber"
          isOn={state.pianoFxFocus}
          size="xs"
          onClick={() => toggleParam('pianoFxFocus')}
        />
      </div>

      <ToggleButton
        variant="toggle-switch"
        label="ON"
        isActive={state.pianoOn}
        ledColor="amber"
        onToggle={() => toggleParam('pianoOn')}
      />

      <ToggleButton
        label="SOLO ▼"
        width="34px"
        height="18px"
        isActive={state.pianoSolo}
        onToggle={() => toggleParam('pianoSolo')}
      />
    </div>
  );

  return (
    <PanelSection
      title="PIANO"
      subtitle="SECTION"
      headerRight={headerRight}
      width="445px"
      height="430px"
      minHeight="430px"
      className={className}
    >
      <div className="flex-1 flex gap-2 pt-1 px-1">
        {/* Left Side: Sliders A and B & Bottom Octave / KB Zone */}
        <div className="w-[160px] flex flex-col justify-between pr-1.5 border-r border-white/10">
          {/* Sliders A & B */}
          <div className="flex justify-around items-end bg-[#11151b]/80 p-2 rounded border border-white/5 shadow-inner">
            <SliderControl
              label="A"
              sublabel="AUX KB"
              value={state.pianoSliderA}
              onChange={(val) => setParam('pianoSliderA', val)}
              auxKbOn={state.pianoAuxAOn}
              onAuxKbToggle={() => toggleParam('pianoAuxAOn')}
              height={165}
            />
            <SliderControl
              label="B"
              sublabel="AUX KB"
              value={state.pianoSliderB}
              onChange={(val) => setParam('pianoSliderB', val)}
              auxKbOn={state.pianoAuxBOn}
              onAuxKbToggle={() => toggleParam('pianoAuxBOn')}
              height={165}
            />
          </div>

          {/* Bottom: Octave Shift & KB Zone */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10 mt-1">
            <div className="flex items-center justify-between">
              {/* Octave Shift */}
              <div className="flex flex-col items-center">
                <span className="text-[6.5px] font-bold text-neutral-300 uppercase tracking-tight mb-0.5">
                  ◀ OCTAVE SHIFT ▶
                </span>
                <div className="flex items-center">
                  <MomentaryButton
                    variant="rocker-left"
                    onPress={() =>
                      setParam('pianoOctave', Math.max(-2, state.pianoOctave - 1))
                    }
                  />
                  <MomentaryButton
                    variant="rocker-right"
                    onPress={() =>
                      setParam('pianoOctave', Math.min(2, state.pianoOctave + 1))
                    }
                  />
                </div>
              </div>

              {/* KB Zone */}
              <div className="flex flex-col items-center">
                <span className="text-[6.5px] font-bold text-neutral-300 uppercase tracking-tight mb-0.5">
                  ◀ KB ZONE ▶
                </span>
                <div className="flex items-center gap-1.5 bg-[#0f1318] px-2 py-1 rounded border border-black/90">
                  <LedIndicator color="green" isOn={state.pianoKbZone[0]} size="xs" />
                  <LedIndicator color="green" isOn={state.pianoKbZone[1]} size="xs" />
                  <LedIndicator color="green" isOn={state.pianoKbZone[2]} size="xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Acoustics / Unison / Touch / Comp + Piano Select + Timbre + Model List Knob */}
        <div className="flex-1 flex flex-col justify-between pl-1">
          {/* Top 4 Columns: ACOUSTICS | UNISON | KB TOUCH | DYN COMP */}
          <div className="grid grid-cols-4 gap-1 silkscreen-frame p-1.5 rounded">
            {/* 1. ACOUSTICS */}
            <div className="flex flex-col items-center justify-between">
              <span className="text-[6px] font-black text-neutral-200 uppercase tracking-tight">
                ACOUSTICS
              </span>
              <div className="flex flex-col gap-1 my-1">
                <LedIndicator
                  color="red"
                  isOn={state.pianoSoftRel}
                  label="SOFT REL"
                  size="xs"
                />
                <LedIndicator
                  color="red"
                  isOn={state.pianoStringRes}
                  label="STRING RES"
                  size="xs"
                />
              </div>
              <ToggleButton
                variant="red-rim"
                width="20px"
                height="15px"
                isActive={state.pianoSoftRel}
                onToggle={() => {
                  toggleParam('pianoSoftRel');
                  toggleParam('pianoStringRes');
                }}
              />
              <span className="text-[5.5px] font-semibold text-neutral-400 mt-0.5">
                PED NOISE ▼
              </span>
            </div>

            {/* 2. UNISON */}
            <div className="flex flex-col items-center justify-between">
              <span className="text-[6px] font-black text-neutral-200 uppercase tracking-tight">
                UNISON
              </span>
              <div className="flex flex-col gap-1 my-1">
                <LedIndicator
                  color="red"
                  isOn={state.pianoUnison === 2}
                  label="2"
                  size="xs"
                />
                <LedIndicator
                  color="red"
                  isOn={state.pianoUnison === 3}
                  label="3"
                  size="xs"
                />
                <LedIndicator
                  color="red"
                  isOn={state.pianoUnison === 1}
                  label="1"
                  size="xs"
                />
              </div>
              <MomentaryButton
                width="20px"
                height="15px"
                onPress={cycleUnison}
              />
            </div>

            {/* 3. KB TOUCH */}
            <div className="flex flex-col items-center justify-between">
              <span className="text-[6px] font-black text-neutral-200 uppercase tracking-tight">
                KB TOUCH
              </span>
              <div className="flex flex-col gap-1 my-1">
                <LedIndicator
                  color="red"
                  isOn={state.pianoKbTouch === 'MED'}
                  label="MED"
                  size="xs"
                />
                <LedIndicator
                  color="red"
                  isOn={state.pianoKbTouch === 'HEAVY'}
                  label="HEAVY"
                  size="xs"
                />
                <LedIndicator
                  color="red"
                  isOn={state.pianoKbTouch === 'LIGHT'}
                  label="LIGHT"
                  size="xs"
                />
              </div>
              <MomentaryButton
                width="20px"
                height="15px"
                onPress={cycleKbTouch}
              />
            </div>

            {/* 4. DYN COMP */}
            <div className="flex flex-col items-center justify-between">
              <span className="text-[6px] font-black text-neutral-200 uppercase tracking-tight">
                DYN COMP
              </span>
              <div className="flex flex-col gap-1 my-1">
                <LedIndicator
                  color="red"
                  isOn={state.pianoDynComp === 2}
                  label="2"
                  size="xs"
                />
                <LedIndicator
                  color="red"
                  isOn={state.pianoDynComp === 3}
                  label="3"
                  size="xs"
                />
                <LedIndicator
                  color="red"
                  isOn={state.pianoDynComp === 1}
                  label="1"
                  size="xs"
                />
              </div>
              <MomentaryButton
                width="20px"
                height="15px"
                onPress={cycleDynComp}
              />
            </div>
          </div>

          {/* Middle: SUSTPED/PSTICK + PIANO SELECT Matrix */}
          <div className="flex gap-1.5 my-1">
            {/* SUSTPED & PSTICK Column */}
            <div className="w-[52px] flex flex-col justify-around items-center py-1">
              <ToggleButton
                hasLed
                ledColor="red"
                isActive={state.pianoSustped}
                sublabel="SUSTPED"
                width="22px"
                height="14px"
                onToggle={() => toggleParam('pianoSustped')}
              />
              <ToggleButton
                hasLed
                ledColor="red"
                isActive={state.pianoPstick}
                sublabel="PSTICK"
                width="22px"
                height="14px"
                onToggle={() => toggleParam('pianoPstick')}
              />
            </div>

            {/* PIANO SELECT Framed Matrix */}
            <div className="flex-1 silkscreen-frame p-1.5 rounded flex flex-col justify-between">
              <span className="text-[6.5px] font-black text-neutral-200 uppercase tracking-wider text-center border-b border-white/10 pb-0.5 mb-1">
                PIANO SELECT
              </span>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {pianoTypes.map((pt) => (
                  <div
                    key={pt.id}
                    onClick={() => setParam('pianoType', pt.id)}
                    className="flex items-center gap-1 cursor-pointer hover:opacity-90"
                  >
                    <LedIndicator
                      color="red"
                      isOn={state.pianoType === pt.id}
                      size="xs"
                    />
                    <span
                      className={`text-[6.5px] font-bold tracking-tight select-none ${
                        state.pianoType === pt.id ? 'text-white' : 'text-neutral-400'
                      }`}
                    >
                      {pt.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lower Row: TIMBRE & INFO + MODEL [LIST] Knob */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            {/* TIMBRE Box */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[5.5px] font-bold text-neutral-400 uppercase">TIMBRE</span>
                <div className="flex flex-col gap-0.5">
                  {['BRIGHT', 'MID', 'SOFT', 'DYNO1', 'DYNO2'].map((t) => (
                    <div key={t} className="flex items-center gap-0.5">
                      <LedIndicator
                        color="red"
                        isOn={state.pianoTimbre === t}
                        size="xs"
                      />
                      <span className={`text-[5px] font-bold ${state.pianoTimbre === t ? 'text-white' : 'text-neutral-500'}`}>
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-1.5 ml-1">
                <MomentaryButton
                  width="28px"
                  height="14px"
                  label="TIMBRE"
                  onPress={cycleTimbre}
                />
                <MomentaryButton
                  label="INFO"
                  width="24px"
                  height="14px"
                  onPress={cyclePianoType}
                />
              </div>
            </div>

            {/* MODEL [LIST] Knob with circular scale */}
            <div className="flex flex-col items-center">
              <RotaryKnob
                value={state.pianoModelIndex}
                min={1}
                max={8}
                step={1}
                size="md"
                scaleType="none"
                onChange={(val) => setParam('pianoModelIndex', Math.round(val))}
                sublabel="MODEL [LIST]"
              />
            </div>
          </div>
        </div>
      </div>
    </PanelSection>
  );
};
