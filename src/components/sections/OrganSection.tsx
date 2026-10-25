import React from 'react';
import { SynthState } from '../../types/synth';
import {
  PanelSection,
  ToggleButton,
  MomentaryButton,
  LedIndicator,
  SliderControl,
  TextLabel,
} from '../primitives';
import { OrganDrawbar } from '../hardware/OrganDrawbar';

interface OrganSectionProps {
  state: SynthState;
  setParam: (name: string, value: any) => void;
  setDrawbar: (index: number, value: number) => void;
  toggleParam: (name: keyof SynthState) => void;
  className?: string;
}

export const OrganSection: React.FC<OrganSectionProps> = ({
  state,
  setParam,
  setDrawbar,
  toggleParam,
  className = '',
}) => {
  const organModels: SynthState['organModel'][] = [
    'B3',
    'VOX',
    'FARF',
    'PIPE1',
    'PIPE2',
    'B3_BASS',
  ];

  const vibChorusTypes: SynthState['organVibChorusType'][] = [
    'V1',
    'C1',
    'V2',
    'C2',
    'V3',
    'C3',
  ];

  const cycleOrganModel = () => {
    const idx = organModels.indexOf(state.organModel);
    setParam('organModel', organModels[(idx + 1) % organModels.length]);
  };

  const cycleVibChorus = () => {
    const idx = vibChorusTypes.indexOf(state.organVibChorusType);
    setParam('organVibChorusType', vibChorusTypes[(idx + 1) % vibChorusTypes.length]);
  };

  const drawbarsConfig: {
    top: string;
    subTop: string;
    bottom: string;
    color: 'brown' | 'white' | 'black';
  }[] = [
    { top: 'BASS16', subTop: "16'", bottom: "16'", color: 'brown' },
    { top: 'STR16', subTop: "8'", bottom: "5¹/³'", color: 'brown' },
    { top: 'FLUTE8', subTop: "4'", bottom: "8'", color: 'white' },
    { top: 'OBOE8', subTop: "2'", bottom: "4'", color: 'white' },
    { top: 'TRMP8', subTop: 'II', bottom: "2²/³'", color: 'black' },
    { top: 'STR8', subTop: 'III', bottom: "2'", color: 'white' },
    { top: 'FLUTE4', subTop: 'IV', bottom: "1³/⁵'", color: 'black' },
    { top: 'STR4', subTop: '', bottom: "1¹/³'", color: 'black' },
    { top: '2 2/3', subTop: '~ - ~', bottom: "1'", color: 'white' },
  ];

  const headerRight = (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center gap-0.5">
        <TextLabel variant="indicator">FX FOCUS</TextLabel>
        <LedIndicator
          color="amber"
          isOn={state.organFxFocus}
          size="xs"
          onClick={() => toggleParam('organFxFocus')}
        />
      </div>

      <ToggleButton
        variant="toggle-switch"
        label="ON"
        isActive={state.organOn}
        ledColor="amber"
        onToggle={() => toggleParam('organOn')}
      />

      <ToggleButton
        label="SOLO ▼"
        width="34px"
        height="18px"
        isActive={state.organSolo}
        onToggle={() => toggleParam('organSolo')}
      />
    </div>
  );

  return (
    <PanelSection
      title="ORGAN"
      subtitle="SECTION"
      headerRight={headerRight}
      width="770px"
      height="375px"
      minHeight="375px"
      className={className}
    >
      <div className="flex-1 flex gap-2 pt-1 px-1">
        {/* Left Side: Sliders A and B & Bottom Controls */}
        <div className="w-[170px] flex flex-col justify-between pr-1 border-r border-white/10">
          {/* Sliders A & B */}
          <div className="flex justify-around items-end bg-[#13171d]/70 p-1.5 rounded border border-white/5 shadow-inner">
            <SliderControl
              label="A"
              sublabel="AUX KB"
              value={state.organSliderA}
              onChange={(val) => setParam('organSliderA', val)}
              auxKbOn={state.organAuxAOn}
              onAuxKbToggle={() => toggleParam('organAuxAOn')}
              height={125}
            />
            <SliderControl
              label="B"
              sublabel="AUX KB"
              value={state.organSliderB}
              onChange={(val) => setParam('organSliderB', val)}
              auxKbOn={state.organAuxBOn}
              onAuxKbToggle={() => toggleParam('organAuxBOn')}
              height={125}
            />
          </div>

          {/* Bottom Buttons: SUSTPED, PSTICK, PRESET, SYNC, OCTAVE, ZONE */}
          <div className="flex flex-col gap-1.5 pt-1.5">
            <div className="flex items-center justify-between">
              <ToggleButton
                hasLed
                ledColor="red"
                isActive={state.organSustped}
                sublabel="SUSTPED"
                width="20px"
                height="13px"
                onToggle={() => toggleParam('organSustped')}
              />
              <ToggleButton
                hasLed
                ledColor="red"
                isActive={state.organPstick}
                sublabel="PSTICK"
                width="20px"
                height="13px"
                onToggle={() => toggleParam('organPstick')}
              />
              <ToggleButton
                hasLed
                ledColor="red"
                isActive={state.organPreset}
                sublabel="PRESET"
                width="20px"
                height="13px"
                onToggle={() => toggleParam('organPreset')}
              />
              <MomentaryButton label="SYNC ▼" width="22px" height="13px" onPress={() => {}} />
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-1">
              {/* Octave Shift */}
              <div className="flex flex-col items-center">
                <span className="text-[5.5px] font-bold text-neutral-300 uppercase">
                  ◀ OCTAVE SHIFT ▶
                </span>
                <div className="flex items-center">
                  <MomentaryButton
                    variant="rocker-left"
                    onPress={() =>
                      setParam('organOctave', Math.max(-2, state.organOctave - 1))
                    }
                  />
                  <MomentaryButton
                    variant="rocker-right"
                    onPress={() =>
                      setParam('organOctave', Math.min(2, state.organOctave + 1))
                    }
                  />
                </div>
              </div>

              {/* KB Zone */}
              <div className="flex flex-col items-center">
                <span className="text-[5.5px] font-bold text-neutral-300 uppercase">
                  ◀ KB ZONE ▶
                </span>
                <div className="flex items-center gap-1 bg-[#10141a] px-1.5 py-0.5 rounded border border-black/80">
                  <LedIndicator color="green" isOn={state.organKbZone[0]} size="xs" />
                  <LedIndicator color="green" isOn={state.organKbZone[1]} size="xs" />
                  <LedIndicator color="green" isOn={state.organKbZone[2]} size="xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Top Blocks (Model, Vib/Chorus, Percussion) + Bottom 9 Drawbars */}
        <div className="flex-1 flex flex-col justify-between pl-1">
          {/* Top Blocks: ORGAN MODEL | VIB/CHORUS | B3 PERCUSSION */}
          <div className="grid grid-cols-12 gap-1.5 bg-[#14181f]/85 p-1.5 rounded border border-white/10">
            {/* 1. ORGAN MODEL Box */}
            <div className="col-span-3 bg-[#11141a] p-1.5 rounded border border-white/15 flex flex-col justify-between">
              <span className="text-[6.5px] font-black text-neutral-200 tracking-wider uppercase text-center border-b border-white/10 pb-0.5 mb-1">
                ORGAN MODEL
              </span>
              <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
                {[
                  { id: 'FARF', label: 'FARF' },
                  { id: 'PIPE1', label: 'PIPE1' },
                  { id: 'VOX', label: 'VOX' },
                  { id: 'PIPE2', label: 'PIPE2' },
                  { id: 'B3', label: 'B3' },
                  { id: 'B3_BASS', label: 'B3 BASS' },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setParam('organModel', m.id)}
                    className="flex items-center gap-0.5 cursor-pointer"
                  >
                    <LedIndicator
                      color="red"
                      isOn={state.organModel === m.id}
                      size="xs"
                    />
                    <span
                      className={`text-[6px] font-bold ${
                        state.organModel === m.id ? 'text-white' : 'text-neutral-500'
                      }`}
                    >
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-1 mt-1 pt-1 border-t border-white/10">
                <MomentaryButton label="▲" width="18px" height="12px" onPress={cycleOrganModel} />
                <MomentaryButton label="▼" width="18px" height="12px" onPress={cycleOrganModel} />
              </div>
            </div>

            {/* 2. VIB / CHORUS Box */}
            <div className="col-span-4 bg-[#11141a] p-1.5 rounded border border-white/15 flex flex-col justify-between">
              <span className="text-[6.5px] font-black text-neutral-200 tracking-wider uppercase text-center border-b border-white/10 pb-0.5 mb-1">
                VIB / CHORUS
              </span>
              <div className="flex flex-col items-center">
                {/* 6 LEDs: C2, V3, C3 / V2, C1, V1 */}
                <div className="grid grid-cols-3 gap-x-3 gap-y-0.5">
                  <LedIndicator
                    color="red"
                    isOn={state.organVibChorusType === 'C2'}
                    size="xs"
                    label="C2"
                  />
                  <LedIndicator
                    color="red"
                    isOn={state.organVibChorusType === 'V3'}
                    size="xs"
                    label="V3"
                  />
                  <LedIndicator
                    color="red"
                    isOn={state.organVibChorusType === 'C3'}
                    size="xs"
                    label="C3"
                  />
                  <LedIndicator
                    color="red"
                    isOn={state.organVibChorusType === 'V2'}
                    size="xs"
                    label="V2"
                  />
                  <LedIndicator
                    color="red"
                    isOn={state.organVibChorusType === 'C1'}
                    size="xs"
                    label="C1"
                  />
                  <LedIndicator
                    color="red"
                    isOn={state.organVibChorusType === 'V1'}
                    size="xs"
                    label="V1"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/10 px-1">
                <ToggleButton
                  variant="toggle-switch"
                  label="ON"
                  isActive={state.organVibChorusOn}
                  ledColor="red"
                  onToggle={() => toggleParam('organVibChorusOn')}
                />
                <MomentaryButton
                  label="SELECT"
                  width="36px"
                  height="13px"
                  onPress={cycleVibChorus}
                />
              </div>
            </div>

            {/* 3. B3 PERCUSSION Box */}
            <div className="col-span-5 bg-[#11141a] p-1.5 rounded border border-white/15 flex flex-col justify-between">
              <span className="text-[6.5px] font-black text-neutral-200 tracking-wider uppercase text-center border-b border-white/10 pb-0.5 mb-1">
                B3 PERCUSSION
              </span>
              <div className="grid grid-cols-3 gap-1">
                <div className="flex flex-col items-center">
                  <span className="text-[5.5px] font-bold text-neutral-400">VOLUME</span>
                  <div className="flex items-center gap-0.5 my-0.5">
                    <LedIndicator
                      color="red"
                      isOn={state.organPercVolumeSoft}
                      size="xs"
                    />
                    <span className="text-[6px] font-bold text-neutral-200">SOFT</span>
                  </div>
                  <ToggleButton
                    width="24px"
                    height="13px"
                    isActive={state.organPercVolumeSoft}
                    onToggle={() => toggleParam('organPercVolumeSoft')}
                  />
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[5.5px] font-bold text-neutral-400">DECAY</span>
                  <div className="flex items-center gap-0.5 my-0.5">
                    <LedIndicator
                      color="red"
                      isOn={state.organPercDecayFast}
                      size="xs"
                    />
                    <span className="text-[6px] font-bold text-neutral-200">FAST</span>
                  </div>
                  <ToggleButton
                    width="24px"
                    height="13px"
                    isActive={state.organPercDecayFast}
                    onToggle={() => toggleParam('organPercDecayFast')}
                  />
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[5.5px] font-bold text-neutral-400">HARMONIC</span>
                  <div className="flex items-center gap-0.5 my-0.5">
                    <LedIndicator
                      color="red"
                      isOn={state.organPercHarmonicThird}
                      size="xs"
                    />
                    <span className="text-[6px] font-bold text-neutral-200">THIRD</span>
                  </div>
                  <ToggleButton
                    width="24px"
                    height="13px"
                    isActive={state.organPercHarmonicThird}
                    onToggle={() => toggleParam('organPercHarmonicThird')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/10 px-1">
                <MomentaryButton label="POLY ▼" width="34px" height="13px" onPress={() => {}} />
                <ToggleButton
                  variant="toggle-switch"
                  label="ON"
                  isActive={state.organPercOn}
                  ledColor="red"
                  onToggle={() => toggleParam('organPercOn')}
                />
              </div>
            </div>
          </div>

          {/* 9 PHYSICAL HAMMOND DRAWBARS */}
          <div className="bg-[#10141a]/95 p-2 rounded border border-white/15 shadow-inner mt-1.5 flex justify-between items-end">
            {drawbarsConfig.map((item, idx) => (
              <OrganDrawbar
                key={idx}
                index={idx}
                value={state.organDrawbars[idx]}
                onChange={(val) => setDrawbar(idx, val)}
                topLabel={item.top}
                subTopLabel={item.subTop}
                bottomLabel={item.bottom}
                colorType={item.color}
                height={132}
              />
            ))}
          </div>
        </div>
      </div>
    </PanelSection>
  );
};
