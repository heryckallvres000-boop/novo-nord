/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSynthStore } from './state/useSynthStore';
import { PianoSection } from './components/sections/PianoSection';
import { ProgramSection } from './components/sections/ProgramSection';
import { SynthSection } from './components/sections/SynthSection';
import { EffectsSection } from './components/sections/EffectsSection';
import { ViewportControls } from './components/navigation/ViewportControls';
import { VirtualKeyboard } from './components/keyboard/VirtualKeyboard';
import { SectionId } from './types/synth';
import { audioEngine } from './audio/audioEngine';

export default function App() {
  const {
    state,
    setParam,
    toggleParam,
    selectPreset,
    selectProgramNumber,
    clockTick,
  } = useSynthStore();

  const [zoom, setZoom] = useState<number>(0.85);
  const [activeSection, setActiveSection] = useState<SectionId | 'all'>('all');
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);
  const [showRefOverlay, setShowRefOverlay] = useState<boolean>(false);
  const [refOverlayOpacity, setRefOverlayOpacity] = useState<number>(0.5);

  // References for pan and section scrolling
  const viewportRef = useRef<HTMLDivElement>(null);
  const pianoRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<HTMLDivElement>(null);
  const effectsRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to section
  const handleJumpToSection = (section: SectionId | 'all') => {
    setActiveSection(section);
    if (!viewportRef.current) return;

    if (section === 'all') {
      viewportRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (section === 'piano' && pianoRef.current) {
      pianoRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    } else if (section === 'program' && programRef.current) {
      programRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    } else if (section === 'synth' && synthRef.current) {
      synthRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    } else if (section === 'effects' && effectsRef.current) {
      effectsRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  };

  const resetZoom = () => setZoom(1.0);

  const fitToScreen = useCallback(() => {
    if (!viewportRef.current) return;
    const availableWidth = window.innerWidth - 32;
    // Total panel target width is ~2440px
    const targetWidth = 2440;
    const calculatedZoom = Math.max(0.35, Math.min(1.0, availableWidth / targetWidth));
    setZoom(Number(calculatedZoom.toFixed(2)));
  }, []);

  // Auto-fit on initial load & window resize
  useEffect(() => {
    fitToScreen();
    const handleResize = () => fitToScreen();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitToScreen]);

  const handleToggleAudio = () => {
    if (!isAudioActive) {
      audioEngine.init();
      setIsAudioActive(true);
    } else {
      setIsAudioActive(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080a0d] flex flex-col items-center select-none overflow-hidden text-neutral-100">
      {/* Top Header Bar with Navigation and Zoom Tools */}
      <ViewportControls
        zoom={zoom}
        setZoom={setZoom}
        resetZoom={resetZoom}
        fitToScreen={fitToScreen}
        activeSection={activeSection}
        onJumpToSection={handleJumpToSection}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
        showKeyboard={showKeyboard}
        onToggleKeyboard={() => setShowKeyboard((prev) => !prev)}
        showRefOverlay={showRefOverlay}
        onToggleRefOverlay={() => setShowRefOverlay((prev) => !prev)}
        refOverlayOpacity={refOverlayOpacity}
        setRefOverlayOpacity={setRefOverlayOpacity}
        lastChangedParam={state.lastChangedParam}
      />

      {/* Main Synthesizer Workspace Container */}
      <main
        ref={viewportRef}
        className="w-full flex-1 overflow-x-auto overflow-y-auto pt-16 pb-40 px-4 flex items-center justify-start 2xl:justify-center cursor-default"
      >
        {/* Scaled Hardware Panel Assembly */}
        <div
          className="transition-transform duration-100 origin-top flex flex-col items-center my-auto"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Continuous Red Powder-Coated Metal Chassis */}
          <div className="relative nord-red-chassis rounded-[6px] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.98),0_4px_20px_rgba(0,0,0,0.85)] border border-[#c42831]/50">
            {/* Top Metallic Bevel Highlight */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none rounded-t" />

            {/* Top Chassis Screws running continuously across the faceplate */}
            <div className="absolute top-1.5 inset-x-8 flex justify-between pointer-events-none z-10">
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
            </div>

            {/* Hardware Control Sections in exact physical horizontal alignment */}
            <div className="flex items-stretch gap-2.5">
              {/* 1. PIANO SECTION (Left, Recessed Slate Panel) */}
              <div ref={pianoRef} className="h-[430px]">
                <PianoSection
                  state={state}
                  setParam={setParam}
                  toggleParam={toggleParam}
                />
              </div>

              {/* 2. PROGRAM / MASTER / SYSTEM SECTION (Center-Left, on Red Chassis) */}
              <div ref={programRef} className="h-[430px]">
                <ProgramSection
                  state={state}
                  setParam={setParam}
                  toggleParam={toggleParam}
                  selectPreset={selectPreset}
                  selectProgramNumber={selectProgramNumber}
                  clockTick={clockTick}
                />
              </div>

              {/* 3. SYNTH SECTION (Center-Right, Recessed Slate Panel) */}
              <div ref={synthRef} className="h-[430px]">
                <SynthSection
                  state={state}
                  setParam={setParam}
                  toggleParam={toggleParam}
                  clockTick={clockTick}
                />
              </div>

              {/* 4. LAYER EFFECTS SECTION (Far-Right, Recessed Slate Panel) */}
              <div ref={effectsRef} className="h-[430px]">
                <EffectsSection
                  state={state}
                  setParam={setParam}
                  toggleParam={toggleParam}
                  clockTick={clockTick}
                />
              </div>
            </div>

            {/* Bottom Metallic Shadow & Chassis Screws */}
            <div className="absolute bottom-1.5 inset-x-8 flex justify-between pointer-events-none z-10">
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
              <span className="chassis-screw opacity-80" />
            </div>

            {/* Optional 1:1 Reference Image Comparison Overlay */}
            {showRefOverlay && (
              <div
                className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-[6px]"
                style={{ opacity: refOverlayOpacity }}
              >
                <img
                  src="/assets/aistudio/NS4_HA88_TopDown-01_241008_e2296ae7.jpg"
                  alt="Original Reference Panel"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Collapsible Virtual Audition Keyboard */}
      {showKeyboard && (
        <VirtualKeyboard
          state={state}
          isAudioActive={isAudioActive}
          onActivateAudio={() => {
            audioEngine.init();
            setIsAudioActive(true);
          }}
        />
      )}
    </div>
  );
}
