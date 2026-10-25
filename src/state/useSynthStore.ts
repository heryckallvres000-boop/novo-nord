import { useState, useCallback, useRef, useEffect } from 'react';
import { SynthState, PresetData } from '../types/synth';

export const PRESETS: PresetData[] = [
  {
    id: 'p1',
    number: 'A:11',
    name: 'Nord Stage 4',
    category: 'Grand & Synth',
    organLayer: '1:03 B3 Soulful',
    pianoLayer: 'White Grand XL',
    synthLayer: '2:35 Vista Pad Whl',
    pianoType: 'GRAND',
    synthWaveform: 'Super Saw',
    synthDetune: 3.4,
    filterCutoff: 6.8,
    filterResonance: 3.2,
    reverbDryWet: 4.5,
    delayDryWet: 2.8,
    masterTempo: 120,
  },
  {
    id: 'p2',
    number: 'A:12',
    name: 'Royal Grand 3D',
    category: 'Acoustic Piano',
    organLayer: 'Off',
    pianoLayer: 'Royal Grand 3D Lrg',
    synthLayer: 'Airy Flute Pad',
    pianoType: 'GRAND',
    synthWaveform: 'Analog Square',
    synthDetune: 1.2,
    filterCutoff: 8.5,
    filterResonance: 1.5,
    reverbDryWet: 3.5,
    delayDryWet: 1.2,
    masterTempo: 110,
  },
  {
    id: 'p3',
    number: 'A:13',
    name: 'B3 Gospel Shout',
    category: 'Organ Lead',
    organLayer: '888000000 3rd Perc',
    pianoLayer: 'Upright Felt M',
    synthLayer: 'Brass Section Sync',
    pianoType: 'UPRIGHT',
    synthWaveform: 'Dual Saw Sync',
    synthDetune: 4.1,
    filterCutoff: 7.0,
    filterResonance: 4.0,
    reverbDryWet: 5.0,
    delayDryWet: 3.5,
    masterTempo: 135,
  },
  {
    id: 'p4',
    number: 'A:14',
    name: 'Neosoul Mk I Whl',
    category: 'Electric Piano',
    organLayer: 'Mellow Flutes',
    pianoLayer: 'Neosoul EP7 MkI',
    synthLayer: 'Poly Synth Brass',
    pianoType: 'ELECTRIC',
    synthWaveform: 'Bell Tines',
    synthDetune: 2.0,
    filterCutoff: 5.5,
    filterResonance: 2.1,
    reverbDryWet: 4.0,
    delayDryWet: 3.0,
    masterTempo: 92,
  },
  {
    id: 'p5',
    number: 'A:15',
    name: 'Cyber Arp 84',
    category: 'Synth Sequence',
    organLayer: 'Farfisa Compact',
    pianoLayer: 'Off',
    synthLayer: 'Analog Pluck Arp',
    pianoType: 'MISC',
    synthWaveform: 'Super Saw',
    synthDetune: 5.6,
    filterCutoff: 4.8,
    filterResonance: 7.2,
    reverbDryWet: 6.2,
    delayDryWet: 5.5,
    masterTempo: 128,
  },
  {
    id: 'p6',
    number: 'A:16',
    name: 'Cinema Strings XL',
    category: 'Orchestral',
    organLayer: 'Vox Continental',
    pianoLayer: 'Bamberger Upright',
    synthLayer: 'Symphonic Strings',
    pianoType: 'GRAND',
    synthWaveform: 'PWM String Orch',
    synthDetune: 2.8,
    filterCutoff: 7.2,
    filterResonance: 1.0,
    reverbDryWet: 7.5,
    delayDryWet: 4.0,
    masterTempo: 80,
  },
  {
    id: 'p7',
    number: 'A:17',
    name: 'Funk Clav Wah D6',
    category: 'Clavinet / Funk',
    organLayer: 'Off',
    pianoLayer: 'Clavinet D6 CB',
    synthLayer: 'Moog Bass Punch',
    pianoType: 'CLAV',
    synthWaveform: 'Pulse Narrow',
    synthDetune: 0.5,
    filterCutoff: 6.2,
    filterResonance: 6.8,
    reverbDryWet: 2.5,
    delayDryWet: 2.0,
    masterTempo: 104,
  },
  {
    id: 'p8',
    number: 'A:18',
    name: 'Ambient Cathedral',
    category: 'Atmospheric',
    organLayer: 'Pipe Organ Full',
    pianoLayer: 'Silver Grand M',
    synthLayer: 'Shimmer Cloud Verb',
    pianoType: 'DIGITAL',
    synthWaveform: 'Additive Vox',
    synthDetune: 3.9,
    filterCutoff: 4.0,
    filterResonance: 2.5,
    reverbDryWet: 9.0,
    delayDryWet: 6.5,
    masterTempo: 75,
  },
];

export const INITIAL_SYNTH_STATE: SynthState = {
  // Master Level & Rotary
  masterLevel: 7.5,
  rotaryOn: true,
  rotaryDrive: 3.5,
  rotaryOrgan: true,
  rotaryCloseMic: true,
  rotaryStopMode: false,
  rotaryAngle: false,
  rotarySpeed: 'SLOW',
  rotaryMorph: false,

  // Organ Section
  organOn: true,
  organSolo: false,
  organFxFocus: false,
  organSliderA: 88,
  organSliderB: 42,
  organAuxAOn: true,
  organAuxBOn: false,
  organModel: 'B3',
  organVibChorusType: 'C3',
  organVibChorusOn: true,
  organPercVolumeSoft: false,
  organPercDecayFast: true,
  organPercHarmonicThird: true,
  organPercPoly: false,
  organPercOn: true,
  // 9 Drawbars positions from reference image:
  // 16'=7, 5 1/3'=6, 8'=8, 4'=7, 2 2/3'=4, 2'=0, 1 3/5'=3, 1 1/3'=2, 1'=0
  organDrawbars: [7, 6, 8, 7, 4, 0, 3, 2, 0],
  organSustped: true,
  organPstick: false,
  organPreset: true,
  organSync: false,
  organOctave: 0,
  organKbZone: [true, true, true],

  activePreset: PRESETS[0],
  bankIndex: 0,
  activeProgramNumber: 1,
  masterClockTempo: 120,
  masterClockActive: true,
  splitActive: false,
  splitKey: 'C4',
  transposeActive: false,
  transposeValue: 0,
  liveMode: false,
  numPadActive: false,
  layerSceneII: false,
  shiftActive: false,
  soloActive: false,

  presetLibraryOrgan: true,
  presetLibraryPiano: true,
  presetLibrarySynth: true,

  morphWheel: true,
  morphAftertouch: false,
  morphControlPedal: false,

  // Piano Section
  pianoOn: true,
  pianoSolo: false,
  pianoFxFocus: true,
  pianoSliderA: 82,
  pianoSliderB: 45,
  pianoAuxAOn: true,
  pianoAuxBOn: false,
  pianoSoftRel: true,
  pianoStringRes: true,
  pianoPedalNoise: true,
  pianoUnison: 1,
  pianoKbTouch: 'MED',
  pianoDynComp: 2,
  pianoType: 'GRAND',
  pianoModelIndex: 1,
  pianoSustped: true,
  pianoPstick: true,
  pianoTimbre: 'BRIGHT',
  pianoOctave: 0,
  pianoKbZone: [true, true, false],

  // Synth Section
  synthOn: true,
  synthSolo: false,
  synthFxFocus: false,
  synthSliderA: 90,
  synthSliderB: 65,
  synthSliderC: 30,
  synthAuxAOn: true,
  synthAuxBOn: true,
  synthAuxCOn: false,
  synthSustped: true,
  synthPstick: true,
  synthKbHold: false,
  synthArpRun: false,
  synthOctave: 0,
  synthKbZone: [false, true, true],
  synthMode: 'ANALOG',
  synthWaveform: 'Super Saw',
  synthDetune: 3.4,
  synthOscType: 'ANALOG',
  synthOscCategory: 'SUPER',
  synthOscCtrl: 6.8,
  synthEnvAmt: 2.5,
  synthFilterType: 'LP24',
  synthFilterCutoff: 6.8,
  synthFilterResonance: 3.2,
  synthFilterOn: true,
  synthFilterEnv: true,
  synthFilterVelocity: true,
  synthAmpVelocity: true,
  synthAmpUnison: 2,
  synthArpRate: 5.0,
  synthArpRange: 2.0,
  synthArpPoly: true,
  synthArpGate: false,
  synthVoiceMono: false,
  synthVoiceLegato: false,
  synthVoiceGlide: 1.5,
  synthLfoWaveform: 'TRI',
  synthLfoRate: 4.5,
  synthLfoAmount: 5.5,
  synthLfoDest: 'FILTER',

  // Effects Section
  fxOn: true,
  fxOrganActive: [true, false],
  fxPianoActive: [true, true],
  fxSynthActive: [true, true, false],

  mod1On: true,
  mod1Type: 'A-PAN',
  mod1Rate: 4.2,
  mod1Amount: 6.0,
  mod1Variation: false,

  mod2On: true,
  mod2Type: 'CHOR',
  mod2Rate: 3.5,
  mod2Amount: 5.0,
  mod2Variation: true,

  ampEqOn: true,
  ampModel: 'TWIN',
  ampDrive: 2.8,
  eqBass: 2.0,
  eqMidFreq: 800,
  eqMidRes: 1.5,
  eqTreble: 3.0,

  delayOn: true,
  delayTempo: 4.5,
  delayFeedback: 4.0,
  delayDryWet: 2.8,
  delayAnalog: true,
  delayPingPong: true,
  delayEffect: 'CHOR',
  delayFilter: 'LP',

  compActive: true,
  compAmount: 4.2,
  compFast: true,

  reverbOn: true,
  reverbBright: true,
  reverbDark: false,
  reverbType: 'STAGE',
  reverbDryWet: 4.5,
  reverbChorale: false,
  reverbGlobal: true,

  lastChangedParam: null,
};

export function useSynthStore() {
  const [state, setState] = useState<SynthState>(INITIAL_SYNTH_STATE);
  const paramTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setParam = useCallback((name: string, value: any) => {
    setState((prev) => ({
      ...prev,
      [name]: value,
      lastChangedParam: { name, value: typeof value === 'number' ? value.toFixed(1) : String(value) },
    }));

    if (paramTimeoutRef.current) clearTimeout(paramTimeoutRef.current);
    paramTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, lastChangedParam: null }));
    }, 2500);
  }, []);

  const setDrawbar = useCallback((index: number, value: number) => {
    setState((prev) => {
      const nextDrawbars = [...prev.organDrawbars] as SynthState['organDrawbars'];
      nextDrawbars[index] = Math.max(0, Math.min(8, value));
      return {
        ...prev,
        organDrawbars: nextDrawbars,
        lastChangedParam: { name: `Drawbar ${index + 1}`, value: value },
      };
    });
  }, []);

  const selectPreset = useCallback((preset: PresetData) => {
    setState((prev) => ({
      ...prev,
      activePreset: preset,
      synthWaveform: preset.synthWaveform,
      synthDetune: preset.synthDetune,
      synthFilterCutoff: preset.filterCutoff,
      synthFilterResonance: preset.filterResonance,
      reverbDryWet: preset.reverbDryWet,
      delayDryWet: preset.delayDryWet,
      masterClockTempo: preset.masterTempo,
      pianoType: preset.pianoType,
      lastChangedParam: { name: 'Preset', value: `${preset.number} ${preset.name}` },
    }));
  }, []);

  const selectProgramNumber = useCallback((num: number) => {
    const preset = PRESETS[(num - 1) % PRESETS.length];
    setState((prev) => ({
      ...prev,
      activeProgramNumber: num,
      activePreset: preset,
      synthWaveform: preset.synthWaveform,
      synthDetune: preset.synthDetune,
      lastChangedParam: { name: 'Program', value: num },
    }));
  }, []);

  const toggleParam = useCallback((name: keyof SynthState) => {
    setState((prev) => {
      const current = prev[name];
      if (typeof current === 'boolean') {
        const nextVal = !current;
        return {
          ...prev,
          [name]: nextVal,
          lastChangedParam: { name, value: nextVal ? 'ON' : 'OFF' },
        };
      }
      return prev;
    });
  }, []);

  const [clockTick, setClockTick] = useState(false);
  useEffect(() => {
    const intervalMs = (60 / state.masterClockTempo) * 1000;
    const interval = setInterval(() => {
      setClockTick(true);
      setTimeout(() => setClockTick(false), 80);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [state.masterClockTempo]);

  return {
    state,
    setParam,
    setDrawbar,
    toggleParam,
    selectPreset,
    selectProgramNumber,
    clockTick,
  };
}
