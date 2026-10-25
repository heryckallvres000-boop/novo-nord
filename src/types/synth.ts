export type SectionId = 'piano' | 'program' | 'synth' | 'effects';

export interface KnobConfig {
  id: string;
  label: string;
  sublabel?: string;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
  unit?: string;
  bipolar?: boolean;
  showScale?: boolean;
  scaleType?: '0-10' | '-10-+10' | '-15-+15' | 'freq' | 'custom';
  customLabels?: string[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface LedState {
  id: string;
  color: 'red' | 'green' | 'amber' | 'blue';
  isOn: boolean;
  isBlinking?: boolean;
}

export interface PresetData {
  id: string;
  number: string;
  name: string;
  category: string;
  organLayer: string;
  pianoLayer: string;
  synthLayer: string;
  pianoType: 'GRAND' | 'UPRIGHT' | 'ELECTRIC' | 'DIGITAL' | 'MISC' | 'CLAV';
  synthWaveform: string;
  synthDetune: number;
  filterCutoff: number;
  filterResonance: number;
  reverbDryWet: number;
  delayDryWet: number;
  masterTempo: number;
}

export interface SynthState {
  // Master Level & Rotary Speaker
  masterLevel: number;
  rotaryOn: boolean;
  rotaryDrive: number;
  rotaryOrgan: boolean;
  rotaryCloseMic: boolean;
  rotaryStopMode: boolean;
  rotaryAngle: boolean;
  rotarySpeed: 'SLOW' | 'FAST';
  rotaryMorph: boolean;

  // Organ Section
  organOn: boolean;
  organSolo: boolean;
  organFxFocus: boolean;
  organSliderA: number;
  organSliderB: number;
  organAuxAOn: boolean;
  organAuxBOn: boolean;
  organModel: 'B3' | 'VOX' | 'FARF' | 'PIPE1' | 'PIPE2' | 'B3_BASS';
  organVibChorusType: 'V1' | 'C1' | 'V2' | 'C2' | 'V3' | 'C3';
  organVibChorusOn: boolean;
  organPercVolumeSoft: boolean;
  organPercDecayFast: boolean;
  organPercHarmonicThird: boolean;
  organPercPoly: boolean;
  organPercOn: boolean;
  organDrawbars: [number, number, number, number, number, number, number, number, number]; // 9 drawbars (0-8)
  organSustped: boolean;
  organPstick: boolean;
  organPreset: boolean;
  organSync: boolean;
  organOctave: number;
  organKbZone: [boolean, boolean, boolean];

  // Master / Program
  activePreset: PresetData;
  bankIndex: number;
  activeProgramNumber: number; // 1-8
  masterClockTempo: number; // BPM
  masterClockActive: boolean;
  splitActive: boolean;
  splitKey: string;
  transposeActive: boolean;
  transposeValue: number;
  liveMode: boolean;
  numPadActive: boolean;
  layerSceneII: boolean;
  shiftActive: boolean;
  soloActive: boolean;

  // Preset library
  presetLibraryOrgan: boolean;
  presetLibraryPiano: boolean;
  presetLibrarySynth: boolean;

  // Morph
  morphWheel: boolean;
  morphAftertouch: boolean;
  morphControlPedal: boolean;

  // Piano Section
  pianoOn: boolean;
  pianoSolo: boolean;
  pianoFxFocus: boolean;
  pianoSliderA: number; // 0-100
  pianoSliderB: number;
  pianoAuxAOn: boolean;
  pianoAuxBOn: boolean;
  pianoSoftRel: boolean;
  pianoStringRes: boolean;
  pianoPedalNoise: boolean;
  pianoUnison: 0 | 1 | 2 | 3;
  pianoKbTouch: 'LIGHT' | 'MED' | 'HEAVY';
  pianoDynComp: 0 | 1 | 2 | 3;
  pianoType: 'GRAND' | 'UPRIGHT' | 'ELECTRIC' | 'DIGITAL' | 'MISC' | 'CLAV';
  pianoModelIndex: number;
  pianoSustped: boolean;
  pianoPstick: boolean;
  pianoTimbre: 'SOFT' | 'MID' | 'BRIGHT' | 'DYNO1' | 'DYNO2';
  pianoOctave: number; // -2 to +2
  pianoKbZone: [boolean, boolean, boolean]; // 3 zones

  // Synth Section
  synthOn: boolean;
  synthSolo: boolean;
  synthFxFocus: boolean;
  synthSliderA: number;
  synthSliderB: number;
  synthSliderC: number;
  synthAuxAOn: boolean;
  synthAuxBOn: boolean;
  synthAuxCOn: boolean;
  synthSustped: boolean;
  synthPstick: boolean;
  synthKbHold: boolean;
  synthArpRun: boolean;
  synthOctave: number;
  synthKbZone: [boolean, boolean, boolean];
  synthMode: 'SAMPLES' | 'ANALOG' | 'EXTERN';
  synthWaveform: string;
  synthDetune: number;
  synthOscType: string;
  synthOscCategory: string;
  synthOscCtrl: number;
  synthEnvAmt: number;
  synthFilterType: 'LP24' | 'LP12' | 'BP' | 'HP';
  synthFilterCutoff: number;
  synthFilterResonance: number;
  synthFilterOn: boolean;
  synthFilterEnv: boolean;
  synthFilterVelocity: boolean;
  synthAmpVelocity: boolean;
  synthAmpUnison: 0 | 1 | 2 | 3;
  synthArpRate: number;
  synthArpRange: number;
  synthArpPoly: boolean;
  synthArpGate: boolean;
  synthVoiceMono: boolean;
  synthVoiceLegato: boolean;
  synthVoiceGlide: number;
  synthLfoWaveform: 'TRI' | 'SAW' | 'SQR' | 'S&H';
  synthLfoRate: number;
  synthLfoAmount: number;
  synthLfoDest: 'PITCH' | 'CTRL' | 'FILTER';

  // Effects Section
  fxOn: boolean;
  fxOrganActive: [boolean, boolean]; // A, B
  fxPianoActive: [boolean, boolean]; // A, B
  fxSynthActive: [boolean, boolean, boolean]; // A, B, C
  
  // Mod 1
  mod1On: boolean;
  mod1Type: 'RM' | 'TREM' | 'A-PAN' | 'A-WAH' | 'WAH' | 'PUMP';
  mod1Rate: number;
  mod1Amount: number;
  mod1Variation: boolean;

  // Mod 2
  mod2On: boolean;
  mod2Type: 'CHOR' | 'FLANG' | 'PHAS' | 'VIBE' | 'ENS' | 'SPIN';
  mod2Rate: number;
  mod2Amount: number;
  mod2Variation: boolean;

  // Amp Sim / EQ
  ampEqOn: boolean;
  ampModel: 'SMALL' | 'JC' | 'TWIN' | 'ROTARY' | 'LP' | 'HP';
  ampDrive: number;
  eqBass: number;
  eqMidFreq: number;
  eqMidRes: number;
  eqTreble: number;

  // Delay
  delayOn: boolean;
  delayTempo: number;
  delayFeedback: number;
  delayDryWet: number;
  delayAnalog: boolean;
  delayPingPong: boolean;
  delayEffect: 'NONE' | 'CHOR' | 'VIBE' | 'ENS' | 'FLAM' | 'SPACE';
  delayFilter: 'OFF' | 'HP' | 'LP' | 'BP';

  // Compressor
  compActive: boolean;
  compAmount: number;
  compFast: boolean;

  // Reverb
  reverbOn: boolean;
  reverbBright: boolean;
  reverbDark: boolean;
  reverbType: 'ROOM' | 'BOOTH' | 'SPRING' | 'STAGE' | 'HALL' | 'CATH';
  reverbDryWet: number;
  reverbChorale: boolean;
  reverbGlobal: boolean;

  // UI Display helper
  lastChangedParam: { name: string; value: string | number } | null;
}
