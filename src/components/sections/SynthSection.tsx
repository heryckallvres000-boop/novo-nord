import React from 'react';
import { SynthState } from '../../types/synth';
import {
  PanelSection,
  RotaryKnob,
  ToggleButton,
  MomentaryButton,
  LedIndicator,
  SliderControl,
  SynthDisplay,
  TextLabel,
} from '../primitives';

interface SynthSectionProps {
  state: SynthState;
  setParam: (name: string, value: any) => void;
  toggleParam: (name: keyof SynthState) => void;
  clockTick: boolean;
  className?: string;
}

export const SynthSection: React.FC<SynthSectionProps> = ({
  state,
  setParam,
  toggleParam,
  clockTick,
  className = '',
}) => {
  const cycleWaveform = () => {
    const list = [
      'Super Saw',
      'Analog Square',
      'Dual Saw Sync',
      'PWM Strings',
      'Bell Tines',
      'Pulse Narrow',
      'Triangle Sub',
    ];
    const idx = list.indexOf(state.synthWaveform);
    const next = list[(idx + 1) % list.length];
    setParam('synthWaveform', next);
  };

  const cycleFilterType = () => {
    const list: SynthState['synthFilterType'][] = ['LP24', 'LP12', 'BP', 'HP'];
    const idx = list.indexOf(state.synthFilterType);
    setParam('synthFilterType', list[(idx + 1) % list.length]);
  };

  const cycleLfoWaveform = () => {
    const list: SynthState['synthLfoWaveform'][] = ['TRI', 'SAW', 'SQR', 'S&H'];
    const idx = list.indexOf(state.synthLfoWaveform);
    setParam('synthLfoWaveform', list[(idx + 1) % list.length]);
  };

  const cycleLfoDest = () => {
    const list: SynthState['synthLfoDest'][] = ['PITCH', 'CTRL', 'FILTER'];
    const idx = list.indexOf(state.synthLfoDest);
    setParam('synthLfoDest', list[(idx + 1) % list.length]);
  };

  const cycleSynthMode = () => {
    const list: SynthState['synthMode'][] = ['ANALOG', 'SAMPLES', 'EXTERN'];
    const idx = list.indexOf(state.synthMode);
    setParam('synthMode', list[(idx + 1) % list.length]);
  };

  const headerRight = (
    <div className="flex items-center gap-2.5">
      <div className="flex flex-col items-center gap-0.5">
        <TextLabel variant="indicator" className="text-[7px]">FX FOCUS</TextLabel>
        <LedIndicator
          color="amber"
          isOn={state.synthFxFocus}
          size="xs"
          onClick={() => toggleParam('synthFxFocus')}
        />
      </div>

      <ToggleButton
        variant="toggle-switch"
        label="ON"
        isActive={state.synthOn}
        ledColor="amber"
        onToggle={() => toggleParam('synthOn')}
      />

      <ToggleButton
        label="SOLO ▼"
        width="34px"
        height="18px"
        isActive={state.synthSolo}
        onToggle={() => toggleParam('synthSolo')}
      />
    </div>
  );

  return (
    <PanelSection
      title="SYNTH"
      subtitle="SECTION"
      headerRight={headerRight}
      width="785px"
      height="430px"
      minHeight="430px"
      className={className}
    >
      {/* Main Top Grid */}
      <div className="grid grid-cols-12 gap-2 pt-1 px-1">
        {/* Left Column: 3 Layer Sliders (A, B, C) */}
        <div className="col-span-4 flex flex-col justify-between pr-1 border-r border-white/10">
          <div className="flex justify-between items-end bg-[#11151b]/80 p-2 rounded border border-white/5 shadow-inner">
            <SliderControl
              label="A"
              sublabel="AUX KB"
              value={state.synthSliderA}
              onChange={(val) => setParam('synthSliderA', val)}
              auxKbOn={state.synthAuxAOn}
              onAuxKbToggle={() => toggleParam('synthAuxAOn')}
              height={140}
            />
            <SliderControl
              label="B"
              sublabel="AUX KB"
              value={state.synthSliderB}
              onChange={(val) => setParam('synthSliderB', val)}
              auxKbOn={state.synthAuxBOn}
              onAuxKbToggle={() => toggleParam('synthAuxBOn')}
              height={140}
            />
            <SliderControl
              label="C"
              sublabel="AUX KB"
              value={state.synthSliderC}
              onChange={(val) => setParam('synthSliderC', val)}
              auxKbOn={state.synthAuxCOn}
              onAuxKbToggle={() => toggleParam('synthAuxCOn')}
              height={140}
            />
          </div>

          {/* Under Sliders: SUSTPED, PSTICK, PAN, KB HOLD, ARP RUN */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 mt-1">
            <ToggleButton
              hasLed
              ledColor="red"
              isActive={state.synthSustped}
              sublabel="SUSTPED"
              width="20px"
              height="13px"
              onToggle={() => toggleParam('synthSustped')}
            />
            <ToggleButton
              hasLed
              ledColor="red"
              isActive={state.synthPstick}
              sublabel="PSTICK/RNG▼"
              width="20px"
              height="13px"
              onToggle={() => toggleParam('synthPstick')}
            />
            <MomentaryButton label="PAN▼" width="20px" height="13px" onPress={() => {}} />
            <ToggleButton
              hasLed
              ledColor="red"
              isActive={state.synthKbHold}
              sublabel="KB HOLD"
              width="20px"
              height="13px"
              onToggle={() => toggleParam('synthKbHold')}
            />
            <ToggleButton
              hasLed
              ledColor="red"
              isActive={state.synthArpRun}
              sublabel="ARP RUN"
              width="20px"
              height="13px"
              onToggle={() => toggleParam('synthArpRun')}
            />
          </div>

          {/* Octave Shift & KB Zone */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col items-center">
              <span className="text-[6px] font-bold text-neutral-300 uppercase">
                ◀ OCTAVE SHIFT ▶
              </span>
              <div className="flex items-center">
                <MomentaryButton
                  variant="rocker-left"
                  onPress={() =>
                    setParam('synthOctave', Math.max(-2, state.synthOctave - 1))
                  }
                />
                <MomentaryButton
                  variant="rocker-right"
                  onPress={() =>
                    setParam('synthOctave', Math.min(2, state.synthOctave + 1))
                  }
                />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[6px] font-bold text-neutral-300 uppercase">
                ◀ KB ZONE ▶
              </span>
              <div className="flex items-center gap-1 bg-[#0f1318] px-1.5 py-0.5 rounded border border-black/90">
                <LedIndicator color="green" isOn={state.synthKbZone[0]} size="xs" />
                <LedIndicator color="green" isOn={state.synthKbZone[1]} size="xs" />
                <LedIndicator color="green" isOn={state.synthKbZone[2]} size="xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Waveform OLED Screen + Encoders */}
        <div className="col-span-4 flex flex-col items-center justify-between px-1">
          <SynthDisplay
            waveform={state.synthWaveform}
            detune={state.synthDetune}
            oscType={state.synthOscType}
            category={state.synthOscCategory}
          />

          {/* 3 Encoders below screen: INFO, LIST, LIST */}
          <div className="flex items-center justify-between w-[200px] mt-1.5 px-2">
            <div className="flex flex-col items-center gap-0.5">
              <button
                type="button"
                onClick={cycleWaveform}
                className="w-6 h-6 rounded-full bg-[#1b2027] border border-black/90 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer hover:bg-[#252c36]"
              >
                <div className="w-3.5 h-3.5 rounded-full brushed-aluminum" />
              </button>
              <span className="text-[6.5px] font-bold text-neutral-300 tracking-wider uppercase">
                INFO
              </span>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  const nextDetune = Number(((state.synthDetune + 0.5) % 10).toFixed(1));
                  setParam('synthDetune', nextDetune);
                }}
                className="w-6 h-6 rounded-full bg-[#1b2027] border border-black/90 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer hover:bg-[#252c36]"
              >
                <div className="w-3.5 h-3.5 rounded-full brushed-aluminum" />
              </button>
              <span className="text-[6.5px] font-bold text-neutral-300 tracking-wider uppercase">
                LIST
              </span>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <button
                type="button"
                onClick={cycleWaveform}
                className="w-6 h-6 rounded-full bg-[#1b2027] border border-black/90 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer hover:bg-[#252c36]"
              >
                <div className="w-3.5 h-3.5 rounded-full brushed-aluminum" />
              </button>
              <span className="text-[6.5px] font-bold text-neutral-300 tracking-wider uppercase">
                LIST
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <MomentaryButton
              label="WAVEFORM"
              sublabel="KEEP EDITS ▼"
              width="50px"
              height="14px"
              onPress={cycleWaveform}
            />
            <MomentaryButton
              label="SOUND INIT"
              width="40px"
              height="14px"
              onPress={() => {
                setParam('synthFilterCutoff', 7.0);
                setParam('synthFilterResonance', 2.0);
                setParam('synthDetune', 3.4);
              }}
            />
          </div>
        </div>

        {/* Right Column: MODE, ARPEGGIATOR / GATE, VOICE, VIBRATO */}
        <div className="col-span-4 flex flex-col justify-between pl-1">
          {/* Top Row: MODE + ARPEGGIATOR/GATE */}
          <div className="flex justify-between items-start gap-1 silkscreen-frame p-1 rounded">
            {/* MODE */}
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[6.5px] font-black text-neutral-200 uppercase">
                MODE
              </span>
              <div
                onClick={cycleSynthMode}
                className="flex flex-col gap-0.5 cursor-pointer mt-0.5"
              >
                <LedIndicator
                  color="red"
                  isOn={state.synthMode === 'SAMPLES'}
                  label="SAMPLES"
                  size="xs"
                />
                <LedIndicator
                  color="red"
                  isOn={state.synthMode === 'ANALOG'}
                  label="ANALOG"
                  size="xs"
                />
                <LedIndicator
                  color="red"
                  isOn={state.synthMode === 'EXTERN'}
                  label="EXTERN"
                  size="xs"
                />
              </div>
            </div>

            {/* ARPEGGIATOR / GATE */}
            <div className="flex flex-col items-center">
              <span className="text-[6.5px] font-black text-neutral-200 uppercase mb-0.5">
                ARPEGGIATOR/GATE
              </span>
              <div className="flex items-center gap-1.5">
                <RotaryKnob
                  value={state.synthArpRate}
                  min={0}
                  max={10}
                  step={0.1}
                  size="sm"
                  scaleType="0-10"
                  onChange={(val) => setParam('synthArpRate', val)}
                  hasMstClkLed
                  isMstClkActive={clockTick}
                  sublabel="RATE/TIME"
                />
                <RotaryKnob
                  value={state.synthArpRange}
                  min={1}
                  max={4}
                  step={1}
                  size="sm"
                  scaleType="none"
                  onChange={(val) => setParam('synthArpRange', Math.round(val))}
                  sublabel="RANGE ENV"
                />
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <LedIndicator
                  color="red"
                  isOn={state.synthArpPoly}
                  label="POLY"
                  size="xs"
                />
                <LedIndicator
                  color="red"
                  isOn={state.synthArpGate}
                  label="GATE"
                  size="xs"
                />
                <MomentaryButton
                  label="PATTERN▼"
                  width="30px"
                  height="12px"
                  onPress={() => toggleParam('synthArpPoly')}
                />
              </div>
            </div>
          </div>

          {/* VOICE & VIBRATO */}
          <div className="grid grid-cols-2 gap-1 silkscreen-frame p-1 rounded mt-1">
            {/* VOICE */}
            <div className="flex flex-col items-center">
              <span className="text-[6.5px] font-black text-neutral-200 uppercase mb-0.5">
                VOICE
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex flex-col gap-0.5">
                  <LedIndicator
                    color="red"
                    isOn={state.synthVoiceMono}
                    label="MONO"
                    size="xs"
                  />
                  <LedIndicator
                    color="red"
                    isOn={state.synthVoiceLegato}
                    label="LEGATO"
                    size="xs"
                  />
                </div>
                <RotaryKnob
                  value={state.synthVoiceGlide}
                  min={0}
                  max={10}
                  step={0.1}
                  size="sm"
                  scaleType="none"
                  onChange={(val) => setParam('synthVoiceGlide', val)}
                  sublabel="GLIDE"
                />
              </div>
            </div>

            {/* VIBRATO */}
            <div className="flex flex-col items-center">
              <span className="text-[6.5px] font-black text-neutral-200 uppercase mb-0.5">
                VIBRATO
              </span>
              <div className="flex items-center gap-1">
                <div className="flex flex-col gap-0.5">
                  <LedIndicator color="red" isOn={true} label="WHL" size="xs" />
                  <LedIndicator color="red" isOn={false} label="DLY" size="xs" />
                  <LedIndicator color="red" isOn={true} label="ON" size="xs" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <MomentaryButton label="A.T." width="20px" height="12px" onPress={() => {}} />
                  <MomentaryButton label="MENU" width="20px" height="12px" onPress={() => {}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Synthesis Engine Controls: LFO, OSCILLATORS, FILTER, AMP */}
      <div className="grid grid-cols-12 gap-1.5 pt-1.5 border-t border-white/10 mt-1">
        {/* LFO Block */}
        <div className="col-span-3 silkscreen-frame p-1.5 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-0.5 mb-0.5">
            <span className="text-[7.5px] font-black text-neutral-100 uppercase">
              LFO
            </span>
            <span className="text-[6.5px] font-bold text-cyan-300">
              {state.synthLfoWaveform}
            </span>
          </div>

          <div className="flex items-center justify-around py-0.5">
            <RotaryKnob
              value={state.synthLfoRate}
              min={0}
              max={10}
              step={0.1}
              size="sm"
              scaleType="0-10"
              onChange={(val) => setParam('synthLfoRate', val)}
              hasMstClkLed
              isMstClkActive={clockTick}
              sublabel="RATE/TIME"
            />
            <RotaryKnob
              value={state.synthLfoAmount}
              min={0}
              max={10}
              step={0.1}
              size="sm"
              scaleType="0-10"
              onChange={(val) => setParam('synthLfoAmount', val)}
              sublabel="MOD AMT"
            />
          </div>

          <div className="flex items-center justify-between mt-0.5 pt-0.5 border-t border-white/10">
            <MomentaryButton
              label="WAVE"
              width="26px"
              height="13px"
              onPress={cycleLfoWaveform}
            />
            <MomentaryButton
              label="DEST"
              sublabel={state.synthLfoDest}
              width="30px"
              height="13px"
              onPress={cycleLfoDest}
            />
          </div>
        </div>

        {/* OSCILLATORS Block */}
        <div className="col-span-3 silkscreen-frame p-1.5 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-0.5 mb-0.5">
            <span className="text-[7.5px] font-black text-neutral-100 uppercase">
              OSCILLATORS
            </span>
          </div>

          <div className="flex items-center justify-around py-0.5">
            <RotaryKnob
              value={state.synthOscCtrl}
              min={0}
              max={10}
              step={0.1}
              size="sm"
              scaleType="0-10"
              onChange={(val) => setParam('synthOscCtrl', val)}
              sublabel="OSC CTRL"
            />
            <RotaryKnob
              value={state.synthEnvAmt}
              min={-10}
              max={10}
              step={0.1}
              bipolar
              size="sm"
              scaleType="-10-+10"
              onChange={(val) => setParam('synthEnvAmt', val)}
              sublabel="ENV AMT"
            />
          </div>

          <div className="flex items-center justify-between mt-0.5 pt-0.5 border-t border-white/10">
            <MomentaryButton label="PITCH/SMP" width="34px" height="13px" onPress={() => {}} />
            <MomentaryButton label="ENVELOPE" width="34px" height="13px" onPress={() => {}} />
          </div>
        </div>

        {/* FILTER Block (Dominant Cutoff Knob) */}
        <div className="col-span-4 silkscreen-frame p-1.5 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-0.5 mb-0.5">
            <span className="text-[7.5px] font-black text-neutral-100 uppercase">
              FILTER
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[7px] font-mono font-bold text-amber-300">
                {state.synthFilterType}
              </span>
              <LedIndicator color="red" isOn={state.synthFilterOn} size="xs" />
            </div>
          </div>

          <div className="flex items-center justify-around py-0.5">
            {/* Cutoff Filter Knob: Large 44px */}
            <RotaryKnob
              value={state.synthFilterCutoff}
              min={0}
              max={10}
              step={0.1}
              size="xl"
              scaleType="0-10"
              onChange={(val) => setParam('synthFilterCutoff', val)}
              sublabel="FREQ"
            />

            {/* Resonance Knob */}
            <RotaryKnob
              value={state.synthFilterResonance}
              min={0}
              max={10}
              step={0.1}
              size="md"
              scaleType="0-10"
              onChange={(val) => setParam('synthFilterResonance', val)}
              sublabel="RES/FREQ HP"
            />
          </div>

          <div className="flex items-center justify-between mt-0.5 pt-0.5 border-t border-white/10">
            <ToggleButton
              variant="red-rim"
              label="TYPE"
              width="28px"
              height="14px"
              isActive={state.synthFilterType !== 'LP24'}
              onToggle={cycleFilterType}
            />
            <ToggleButton
              hasLed
              ledColor="red"
              isActive={state.synthFilterEnv}
              label="ENV"
              width="26px"
              height="14px"
              onToggle={() => toggleParam('synthFilterEnv')}
            />
            <ToggleButton
              hasLed
              ledColor="red"
              isActive={state.synthFilterVelocity}
              label="VEL"
              width="26px"
              height="14px"
              onToggle={() => toggleParam('synthFilterVelocity')}
            />
          </div>
        </div>

        {/* AMP Block */}
        <div className="col-span-2 silkscreen-frame p-1.5 rounded flex flex-col justify-between">
          <div className="text-center border-b border-white/10 pb-0.5 mb-0.5">
            <span className="text-[7.5px] font-black text-neutral-100 uppercase">
              AMP
            </span>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <ToggleButton
              label="ENVELOPE"
              width="36px"
              height="14px"
              isActive={state.synthAmpVelocity}
              onToggle={() => toggleParam('synthAmpVelocity')}
            />
            <span className="text-[5.5px] font-semibold text-neutral-400">
              VELOCITY ▼
            </span>
          </div>

          <div className="flex flex-col items-center border-t border-white/10 pt-0.5">
            <span className="text-[6px] font-bold text-neutral-300 uppercase">
              UNISON
            </span>
            <div className="flex items-center gap-0.5 my-0.5">
              <LedIndicator color="red" isOn={state.synthAmpUnison >= 1} size="xs" />
              <LedIndicator color="red" isOn={state.synthAmpUnison >= 2} size="xs" />
              <LedIndicator color="red" isOn={state.synthAmpUnison >= 3} size="xs" />
            </div>
            <MomentaryButton
              width="22px"
              height="12px"
              onPress={() =>
                setParam('synthAmpUnison', ((state.synthAmpUnison + 1) % 4) as 0 | 1 | 2 | 3)
              }
            />
          </div>
        </div>
      </div>
    </PanelSection>
  );
};
