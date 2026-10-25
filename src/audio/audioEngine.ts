/**
 * Audio Engine Connector & Architecture for Nord Stage 4.
 *
 * Implements a real Web Audio API signal chain reflecting the hardware controls:
 * Polyphonic Oscillators -> Resonant Lowpass/Bandpass/Highpass Filter -> Amp Envelope -> Delay -> Reverb -> Master Out.
 */

import { SynthState } from '../types/synth';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedbackGain: GainNode | null = null;
  private delayDryWetGain: GainNode | null = null;
  private reverbDryWetGain: GainNode | null = null;
  private isInitialized = false;
  private activeVoices = new Map<number, { oscs: OscillatorNode[]; gain: GainNode }>();

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      this.ctx = new AudioCtxClass();

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      // Filter
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(2500, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(3.0, this.ctx.currentTime);

      // Delay chain
      this.delayNode = this.ctx.createDelay(2.0);
      this.delayNode.delayTime.setValueAtTime(0.35, this.ctx.currentTime);
      this.delayFeedbackGain = this.ctx.createGain();
      this.delayFeedbackGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.delayDryWetGain = this.ctx.createGain();
      this.delayDryWetGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

      // Connect delay loop
      this.delayNode.connect(this.delayFeedbackGain);
      this.delayFeedbackGain.connect(this.delayNode);
      this.delayNode.connect(this.delayDryWetGain);
      this.delayDryWetGain.connect(this.masterGain);

      // Reverb pseudo-diffuser (reverb impulse or comb filter)
      this.reverbDryWetGain = this.ctx.createGain();
      this.reverbDryWetGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.reverbDryWetGain.connect(this.masterGain);

      // Main signal routing
      this.filterNode.connect(this.masterGain);
      this.filterNode.connect(this.delayNode);
      this.masterGain.connect(this.ctx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioContext initialization deferred until user interaction', e);
    }
  }

  public updateParameters(state: SynthState) {
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;

    // Filter frequency: logarithmic map 0-10 -> 80Hz - 18000Hz
    const cutoffNorm = state.synthFilterCutoff / 10;
    const targetFreq = 80 * Math.pow(18000 / 80, cutoffNorm);
    this.filterNode.frequency.setTargetAtTime(targetFreq, now, 0.05);

    // Resonance Q: 0-10 -> 0.5 to 15
    const targetQ = 0.5 + (state.synthFilterResonance / 10) * 14.5;
    this.filterNode.Q.setTargetAtTime(targetQ, now, 0.05);

    // Filter type
    if (state.synthFilterType === 'HP') {
      this.filterNode.type = 'highpass';
    } else if (state.synthFilterType === 'BP') {
      this.filterNode.type = 'bandpass';
    } else {
      this.filterNode.type = 'lowpass';
    }

    // Delay Dry/Wet & Tempo
    if (this.delayDryWetGain && this.delayNode && this.delayFeedbackGain) {
      const delayAmount = state.delayOn ? (state.delayDryWet / 10) * 0.6 : 0;
      this.delayDryWetGain.gain.setTargetAtTime(delayAmount, now, 0.05);
      const feedback = (state.delayFeedback / 10) * 0.75;
      this.delayFeedbackGain.gain.setTargetAtTime(feedback, now, 0.05);
      const delaySec = Math.max(0.05, Math.min(1.2, (60 / state.masterClockTempo) * 0.75));
      this.delayNode.delayTime.setTargetAtTime(delaySec, now, 0.1);
    }
  }

  public noteOn(midiNote: number, velocity = 0.8, state: SynthState) {
    this.init();
    if (!this.ctx || !this.filterNode) return;

    this.noteOff(midiNote);

    const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
    const now = this.ctx.currentTime;

    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0, now);

    // Attack - Decay - Sustain
    const attackTime = 0.02;
    const decayTime = 0.3;
    const sustainLevel = velocity * 0.4;
    voiceGain.gain.linearRampToValueAtTime(velocity * 0.5, now + attackTime);
    voiceGain.gain.setTargetAtTime(sustainLevel, now + attackTime, decayTime);

    const oscs: OscillatorNode[] = [];

    // Poly Saw / Square architecture based on synthWaveform
    const isSaw = state.synthWaveform.toLowerCase().includes('saw');
    const oscType: OscillatorType = isSaw ? 'sawtooth' : 'triangle';

    // Multi-detune stack (Super Saw simulation with 3 voices)
    const detuneCents = state.synthDetune * 12; // 0 to 120 cents
    const detuneOffsets = [-detuneCents, 0, detuneCents];

    detuneOffsets.forEach((detune) => {
      const osc = this.ctx!.createOscillator();
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);
      osc.connect(voiceGain);
      osc.start(now);
      oscs.push(osc);
    });

    voiceGain.connect(this.filterNode);
    this.activeVoices.set(midiNote, { oscs, gain: voiceGain });
  }

  public noteOff(midiNote: number) {
    if (!this.ctx) return;
    const voice = this.activeVoices.get(midiNote);
    if (!voice) return;

    const now = this.ctx.currentTime;
    const releaseTime = 0.35;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

    setTimeout(() => {
      voice.oscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (_) {}
      });
      voice.gain.disconnect();
    }, (releaseTime + 0.1) * 1000);

    this.activeVoices.delete(midiNote);
  }

  public isReady(): boolean {
    return this.isInitialized && !!this.ctx;
  }
}

export const audioEngine = new AudioEngine();
