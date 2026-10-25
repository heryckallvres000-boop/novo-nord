import React from 'react';
import { SynthState } from '../../types/synth';
import {
  PanelSection,
  RotaryKnob,
  ToggleButton,
  MomentaryButton,
  LedIndicator,
} from '../primitives';

interface EffectsSectionProps {
  state: SynthState;
  setParam: (name: string, value: any) => void;
  toggleParam: (name: keyof SynthState) => void;
  clockTick: boolean;
  className?: string;
}

export const EffectsSection: React.FC<EffectsSectionProps> = ({
  state,
  setParam,
  toggleParam,
  clockTick,
  className = '',
}) => {
  const mod1Types: SynthState['mod1Type'][] = [
    'RM',
    'TREM',
    'A-PAN',
    'A-WAH',
    'WAH',
    'PUMP',
  ];

  const mod2Types: SynthState['mod2Type'][] = [
    'CHOR',
    'FLANG',
    'PHAS',
    'VIBE',
    'ENS',
    'SPIN',
  ];

  const ampModels: SynthState['ampModel'][] = [
    'SMALL',
    'JC',
    'TWIN',
    'ROTARY',
    'LP',
    'HP',
  ];

  const reverbTypes: SynthState['reverbType'][] = [
    'ROOM',
    'BOOTH',
    'SPRING',
    'STAGE',
    'HALL',
    'CATH',
  ];

  const cycleMod1 = () => {
    const idx = mod1Types.indexOf(state.mod1Type);
    setParam('mod1Type', mod1Types[(idx + 1) % mod1Types.length]);
  };

  const cycleMod2 = () => {
    const idx = mod2Types.indexOf(state.mod2Type);
    setParam('mod2Type', mod2Types[(idx + 1) % mod2Types.length]);
  };

  const cycleAmpModel = () => {
    const idx = ampModels.indexOf(state.ampModel);
    setParam('ampModel', ampModels[(idx + 1) % ampModels.length]);
  };

  const cycleReverbType = () => {
    const idx = reverbTypes.indexOf(state.reverbType);
    setParam('reverbType', reverbTypes[(idx + 1) % reverbTypes.length]);
  };

  const headerRight = (
    <ToggleButton
      variant="toggle-switch"
      label="ON"
      isActive={state.fxOn}
      ledColor="red"
      onToggle={() => toggleParam('fxOn')}
    />
  );

  return (
    <PanelSection
      title="LAYER EFFECTS"
      headerRight={headerRight}
      width="780px"
      height="430px"
      minHeight="430px"
      className={className}
    >
      <div className="flex-1 flex pr-0.5 pt-1 px-1">
        {/* Left Vertical Strip: FX FOCUS & SHIFT */}
        <div className="w-[85px] flex flex-col justify-between silkscreen-frame p-1.5 rounded mr-1.5">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[6.5px] font-black text-neutral-200 uppercase tracking-tight">
              FX FOCUS
            </span>

            {/* ORGAN */}
            <div className="flex flex-col items-center">
              <span className="text-[5.5px] font-bold text-neutral-400">ORGAN</span>
              <div className="flex items-center gap-1 mt-0.5">
                <LedIndicator color="red" isOn={state.fxOrganActive[0]} size="xs" label="A" />
                <LedIndicator color="red" isOn={state.fxOrganActive[1]} size="xs" label="B" />
              </div>
            </div>

            <MomentaryButton label="ALL FX OFF" width="48px" height="13px" onPress={() => {}} />

            {/* PIANO */}
            <div className="flex flex-col items-center">
              <span className="text-[5.5px] font-bold text-neutral-400">PIANO</span>
              <div className="flex items-center gap-1 mt-0.5">
                <LedIndicator color="red" isOn={state.fxPianoActive[0]} size="xs" label="A" />
                <LedIndicator color="red" isOn={state.fxPianoActive[1]} size="xs" label="B" />
              </div>
            </div>

            <MomentaryButton label="GROUP▼" width="44px" height="13px" onPress={() => {}} />

            {/* SYNTH */}
            <div className="flex flex-col items-center">
              <span className="text-[5.5px] font-bold text-neutral-400">SYNTH</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                <LedIndicator color="red" isOn={state.fxSynthActive[0]} size="xs" label="A" />
                <LedIndicator color="red" isOn={state.fxSynthActive[1]} size="xs" label="B" />
                <LedIndicator color="red" isOn={state.fxSynthActive[2]} size="xs" label="C" />
              </div>
            </div>

            <MomentaryButton label="GROUP▼" width="44px" height="13px" onPress={() => {}} />
          </div>

          {/* Second SHIFT Button */}
          <div className="flex justify-center mt-2">
            <ToggleButton
              variant="shift"
              label="SHIFT"
              sublabel="EXIT"
              isActive={state.shiftActive}
              onToggle={() => toggleParam('shiftActive')}
            />
          </div>
        </div>

        {/* Right Effects Modules Rack */}
        <div className="flex-1 flex flex-col justify-between pr-1">
          {/* Row 1: MOD 1 & DELAY */}
          <div className="grid grid-cols-12 gap-1.5">
            {/* MOD 1 */}
            <div className="col-span-5 silkscreen-frame p-1.5 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-0.5 mb-0.5">
                <span className="text-[7.5px] font-black text-neutral-100 uppercase">
                  MOD 1
                </span>
                <div className="flex items-center gap-1">
                  <LedIndicator color="red" isOn={state.mod1On} size="xs" />
                  <ToggleButton
                    label="ON"
                    width="18px"
                    height="12px"
                    isActive={state.mod1On}
                    onToggle={() => toggleParam('mod1On')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <RotaryKnob
                  value={state.mod1Rate}
                  min={0}
                  max={10}
                  step={0.1}
                  size="sm"
                  scaleType="0-10"
                  onChange={(val) => setParam('mod1Rate', val)}
                  hasMstClkLed
                  isMstClkActive={clockTick}
                  sublabel="RATE"
                />
                <RotaryKnob
                  value={state.mod1Amount}
                  min={0}
                  max={10}
                  step={0.1}
                  size="sm"
                  scaleType="0-10"
                  onChange={(val) => setParam('mod1Amount', val)}
                  sublabel="AMOUNT"
                />
                {/* MOD 1 Selector List */}
                <div
                  onClick={cycleMod1}
                  className="flex flex-col gap-0.5 bg-[#0b0e13] p-1 rounded border border-black/80 cursor-pointer"
                >
                  {mod1Types.map((type) => (
                    <div key={type} className="flex items-center gap-0.5">
                      <LedIndicator
                        color="red"
                        isOn={state.mod1Type === type}
                        size="xs"
                      />
                      <span
                        className={`text-[5.5px] font-bold ${
                          state.mod1Type === type ? 'text-white' : 'text-neutral-500'
                        }`}
                      >
                        {type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-0.5 pt-0.5 border-t border-white/10">
                <ToggleButton
                  label="VARIATION"
                  width="44px"
                  height="12px"
                  isActive={state.mod1Variation}
                  onToggle={() => toggleParam('mod1Variation')}
                />
                <span className="text-[6px] font-bold text-neutral-400">
                  PED ▼
                </span>
              </div>
            </div>

            {/* DELAY */}
            <div className="col-span-7 silkscreen-frame p-1.5 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-0.5 mb-0.5">
                <span className="text-[7.5px] font-black text-neutral-100 uppercase">
                  DELAY
                </span>
                <div className="flex items-center gap-1">
                  <LedIndicator color="red" isOn={state.delayOn} size="xs" />
                  <ToggleButton
                    label="ON"
                    width="18px"
                    height="12px"
                    isActive={state.delayOn}
                    onToggle={() => toggleParam('delayOn')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-around py-0.5">
                <RotaryKnob
                  value={state.delayTempo}
                  min={0}
                  max={10}
                  step={0.1}
                  size="sm"
                  scaleType="0-10"
                  onChange={(val) => setParam('delayTempo', val)}
                  hasMstClkLed
                  isMstClkActive={clockTick}
                  sublabel="TEMPO"
                />
                <RotaryKnob
                  value={state.delayFeedback}
                  min={0}
                  max={10}
                  step={0.1}
                  size="sm"
                  scaleType="0-10"
                  onChange={(val) => setParam('delayFeedback', val)}
                  sublabel="FEEDBACK"
                />
                <RotaryKnob
                  value={state.delayDryWet}
                  min={0}
                  max={10}
                  step={0.1}
                  size="sm"
                  scaleType="0-10"
                  onChange={(val) => setParam('delayDryWet', val)}
                  sublabel="DRY/WET"
                />
              </div>

              <div className="flex items-center justify-between mt-0.5 pt-0.5 border-t border-white/10">
                <MomentaryButton
                  label="TAP/SET▼"
                  width="36px"
                  height="12px"
                  onPress={() => {}}
                />
                <ToggleButton
                  label="ANALOG▼"
                  width="34px"
                  height="12px"
                  isActive={state.delayAnalog}
                  onToggle={() => toggleParam('delayAnalog')}
                />
                <ToggleButton
                  label="PING PONG▼"
                  width="40px"
                  height="12px"
                  isActive={state.delayPingPong}
                  onToggle={() => toggleParam('delayPingPong')}
                />
              </div>
            </div>
          </div>

          {/* Row 2: MOD 2 & AMP SIM / EQ */}
          <div className="grid grid-cols-12 gap-1.5 my-1">
            {/* MOD 2 */}
            <div className="col-span-5 silkscreen-frame p-1.5 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-0.5 mb-0.5">
                <span className="text-[7.5px] font-black text-neutral-100 uppercase">
                  MOD 2
                </span>
                <div className="flex items-center gap-1">
                  <LedIndicator color="red" isOn={state.mod2On} size="xs" />
                  <ToggleButton
                    label="ON"
                    width="18px"
                    height="12px"
                    isActive={state.mod2On}
                    onToggle={() => toggleParam('mod2On')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <RotaryKnob
                  value={state.mod2Rate}
                  min={0}
                  max={10}
                  step={0.1}
                  size="sm"
                  scaleType="0-10"
                  onChange={(val) => setParam('mod2Rate', val)}
                  sublabel="RATE"
                />
                <RotaryKnob
                  value={state.mod2Amount}
                  min={0}
                  max={10}
                  step={0.1}
                  size="sm"
                  scaleType="0-10"
                  onChange={(val) => setParam('mod2Amount', val)}
                  sublabel="AMOUNT"
                />
                {/* MOD 2 Selector List */}
                <div
                  onClick={cycleMod2}
                  className="flex flex-col gap-0.5 bg-[#0b0e13] p-1 rounded border border-black/80 cursor-pointer"
                >
                  {mod2Types.map((type) => (
                    <div key={type} className="flex items-center gap-0.5">
                      <LedIndicator
                        color="red"
                        isOn={state.mod2Type === type}
                        size="xs"
                      />
                      <span
                        className={`text-[5.5px] font-bold ${
                          state.mod2Type === type ? 'text-white' : 'text-neutral-500'
                        }`}
                      >
                        {type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-0.5 pt-0.5 border-t border-white/10">
                <ToggleButton
                  label="VARIATION▼"
                  width="44px"
                  height="12px"
                  isActive={state.mod2Variation}
                  onToggle={() => toggleParam('mod2Variation')}
                />
              </div>
            </div>

            {/* AMP SIM / EQ */}
            <div className="col-span-7 silkscreen-frame p-1.5 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-0.5 mb-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-[7.5px] font-black text-neutral-100 uppercase">
                    AMP SIM / EQ
                  </span>
                  <LedIndicator color="red" isOn={state.ampEqOn} size="xs" />
                </div>
                <ToggleButton
                  label="ON"
                  width="18px"
                  height="12px"
                  isActive={state.ampEqOn}
                  onToggle={() => toggleParam('ampEqOn')}
                />
              </div>

              {/* EQ Knobs */}
              <div className="flex items-center justify-around py-0.5">
                <RotaryKnob
                  value={state.ampDrive}
                  min={0}
                  max={10}
                  step={0.1}
                  size="sm"
                  scaleType="0-10"
                  onChange={(val) => setParam('ampDrive', val)}
                  sublabel="DRIVE"
                />
                <RotaryKnob
                  value={state.eqBass}
                  min={-10}
                  max={10}
                  step={0.5}
                  bipolar
                  size="sm"
                  scaleType="-10-+10"
                  onChange={(val) => setParam('eqBass', val)}
                  sublabel="BASS"
                />
                <RotaryKnob
                  value={state.eqMidFreq}
                  min={200}
                  max={8000}
                  step={50}
                  size="sm"
                  scaleType="freq"
                  onChange={(val) => setParam('eqMidFreq', val)}
                  sublabel="MID FREQ"
                />
                <RotaryKnob
                  value={state.eqTreble}
                  min={-10}
                  max={10}
                  step={0.5}
                  bipolar
                  size="sm"
                  scaleType="-10-+10"
                  onChange={(val) => setParam('eqTreble', val)}
                  sublabel="TREBLE"
                />
              </div>

              <div className="flex items-center justify-between mt-0.5 pt-0.5 border-t border-white/10">
                <div
                  onClick={cycleAmpModel}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-[6.5px] font-black text-amber-300">
                    MODEL: {state.ampModel}
                  </span>
                  <MomentaryButton label="VARIATION▼" width="40px" height="12px" onPress={cycleAmpModel} />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: COMP & REVERB */}
          <div className="grid grid-cols-12 gap-1.5">
            {/* COMP (Compressor) */}
            <div className="col-span-4 silkscreen-frame p-1.5 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-0.5 mb-0.5">
                <span className="text-[7.5px] font-black text-neutral-100 uppercase">
                  COMP
                </span>
                <div className="flex items-center gap-1">
                  <LedIndicator color="green" isOn={state.compActive} size="xs" />
                  <span className="text-[5.5px] font-bold text-neutral-300">ACTIVE</span>
                </div>
              </div>

              <div className="flex items-center justify-around py-0.5">
                <RotaryKnob
                  value={state.compAmount}
                  min={0}
                  max={10}
                  step={0.1}
                  size="sm"
                  scaleType="0-10"
                  onChange={(val) => setParam('compAmount', val)}
                  sublabel="AMOUNT"
                />
                <ToggleButton
                  label="FAST"
                  width="26px"
                  height="14px"
                  isActive={state.compFast}
                  onToggle={() => toggleParam('compFast')}
                />
              </div>
            </div>

            {/* REVERB */}
            <div className="col-span-8 silkscreen-frame p-1.5 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-0.5 mb-0.5">
                <span className="text-[7.5px] font-black text-neutral-100 uppercase">
                  REVERB
                </span>
                <div className="flex items-center gap-1">
                  <LedIndicator color="red" isOn={state.reverbOn} size="xs" />
                  <ToggleButton
                    label="ON"
                    width="18px"
                    height="12px"
                    isActive={state.reverbOn}
                    onToggle={() => toggleParam('reverbOn')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-around py-0.5">
                {/* Reverb Types Matrix */}
                <div
                  onClick={cycleReverbType}
                  className="grid grid-cols-2 gap-x-2 gap-y-0.5 bg-[#0b0e13] p-1 rounded border border-black/80 cursor-pointer"
                >
                  {reverbTypes.map((type) => (
                    <div key={type} className="flex items-center gap-0.5">
                      <LedIndicator
                        color="red"
                        isOn={state.reverbType === type}
                        size="xs"
                      />
                      <span
                        className={`text-[5.5px] font-bold ${
                          state.reverbType === type ? 'text-white' : 'text-neutral-500'
                        }`}
                      >
                        {type}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Big Reverb Dry/Wet Knob */}
                <RotaryKnob
                  value={state.reverbDryWet}
                  min={0}
                  max={10}
                  step={0.1}
                  size="md"
                  scaleType="0-10"
                  onChange={(val) => setParam('reverbDryWet', val)}
                  sublabel="DRY/WET"
                />

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <LedIndicator color="red" isOn={state.reverbBright} size="xs" label="BRIGHT" />
                    <LedIndicator color="red" isOn={state.reverbDark} size="xs" label="DARK" />
                  </div>
                  <ToggleButton
                    label="VAR | CHORALE▼"
                    width="54px"
                    height="13px"
                    isActive={state.reverbChorale}
                    onToggle={() => toggleParam('reverbChorale')}
                  />
                  <ToggleButton
                    hasLed
                    ledColor="red"
                    isActive={state.reverbGlobal}
                    label="GLOBAL▼"
                    width="44px"
                    height="13px"
                    onToggle={() => toggleParam('reverbGlobal')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Far Right Edge: Swedish Manufacturing Signature */}
        <div className="w-[20px] flex items-center justify-center border-l border-white/10 pl-0.5 select-none">
          <div
            className="text-[6.5px] font-bold tracking-widest text-neutral-300 whitespace-nowrap uppercase origin-center transform -rotate-90"
            style={{ width: '360px' }}
          >
            HANDMADE IN SWEDEN BY CLAVIA DMI AB · v2.0 Rev B
          </div>
        </div>
      </div>
    </PanelSection>
  );
};
