import React from 'react';
import { SynthState } from '../../types/synth';
import {
  RotaryKnob,
  ToggleButton,
  MomentaryButton,
  LedIndicator,
  TextLabel,
} from '../primitives';

interface MasterRotarySectionProps {
  state: SynthState;
  setParam: (name: string, value: any) => void;
  toggleParam: (name: keyof SynthState) => void;
  className?: string;
}

export const MasterRotarySection: React.FC<MasterRotarySectionProps> = ({
  state,
  setParam,
  toggleParam,
  className = '',
}) => {
  return (
    <div
      className={`relative rounded-[3px] p-2 flex flex-col justify-between shrink-0 select-none border-r border-white/10 ${className}`}
      style={{ width: '105px', height: '375px', minHeight: '375px' }}
    >
      {/* Top: MASTER LEVEL Knob */}
      <div className="flex flex-col items-center pt-1 border-b border-white/15 pb-2">
        <TextLabel variant="sublabel" className="text-[7.5px] font-black text-white mb-1">
          MASTER LEVEL
        </TextLabel>
        <RotaryKnob
          value={state.masterLevel}
          min={0}
          max={10}
          step={0.1}
          size="lg"
          scaleType="none"
          onChange={(val) => setParam('masterLevel', val)}
        />
      </div>

      {/* Middle & Bottom: ROTARY SPEAKER Module */}
      <div className="flex-1 flex flex-col justify-between pt-1.5">
        <div className="flex items-center justify-between border-b border-white/15 pb-0.5">
          <span className="text-[6.5px] font-black text-neutral-100 uppercase tracking-tight">
            ROTARY SPEAKER
          </span>
          <div className="flex items-center gap-0.5">
            <LedIndicator color="red" isOn={state.rotaryOn} size="xs" />
            <ToggleButton
              label="ON"
              width="18px"
              height="11px"
              isActive={state.rotaryOn}
              onToggle={() => toggleParam('rotaryOn')}
            />
          </div>
        </div>

        {/* DRIVE Knob with scale 0 to 10 */}
        <div className="flex justify-center my-0.5">
          <RotaryKnob
            value={state.rotaryDrive}
            min={0}
            max={10}
            step={0.1}
            size="sm"
            scaleType="0-10"
            onChange={(val) => setParam('rotaryDrive', val)}
            sublabel="DRIVE"
          />
        </div>

        {/* ORGAN Button with LED */}
        <div className="flex items-center justify-center gap-1">
          <LedIndicator color="red" isOn={state.rotaryOrgan} size="xs" />
          <ToggleButton
            label="ORGAN"
            width="38px"
            height="14px"
            isActive={state.rotaryOrgan}
            onToggle={() => toggleParam('rotaryOrgan')}
          />
        </div>

        <span className="text-[5.5px] font-semibold text-neutral-300 text-center">
          CLOSE MIC ▼
        </span>

        {/* STOP MODE Button with LED */}
        <div className="flex items-center justify-center gap-1">
          <LedIndicator color="red" isOn={state.rotaryStopMode} size="xs" />
          <ToggleButton
            label="STOP MODE"
            width="46px"
            height="14px"
            isActive={state.rotaryStopMode}
            onToggle={() => toggleParam('rotaryStopMode')}
          />
        </div>

        {/* ANGLE Button */}
        <div className="flex justify-center">
          <MomentaryButton label="ANGLE" width="38px" height="13px" onPress={() => {}} />
        </div>

        {/* SLOW / FAST Rotary Speed LEDs and Toggle */}
        <div className="flex items-center justify-around bg-[#12161c]/80 p-1 rounded border border-white/10">
          <div
            onClick={() => setParam('rotarySpeed', 'SLOW')}
            className="flex items-center gap-0.5 cursor-pointer"
          >
            <LedIndicator color="green" isOn={state.rotarySpeed === 'SLOW'} size="xs" />
            <span className="text-[6px] font-bold text-neutral-200">SLOW</span>
          </div>

          <div
            onClick={() => setParam('rotarySpeed', 'FAST')}
            className="flex items-center gap-0.5 cursor-pointer"
          >
            <LedIndicator color="red" isOn={state.rotarySpeed === 'FAST'} size="xs" />
            <span className="text-[6px] font-bold text-neutral-200">FAST</span>
          </div>
        </div>

        {/* MORPH Button */}
        <div className="flex items-center justify-center gap-1">
          <LedIndicator color="red" isOn={state.rotaryMorph} size="xs" />
          <ToggleButton
            label="MORPH"
            width="38px"
            height="14px"
            isActive={state.rotaryMorph}
            onToggle={() => toggleParam('rotaryMorph')}
          />
        </div>
      </div>
    </div>
  );
};
