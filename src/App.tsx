import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF00FF] selection:text-black overflow-x-hidden relative screen-tear">
      {/* Static Noise Overlay */}
      <div className="bg-noise" />
      
      {/* CRT Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-8">
        <header className="text-center w-full border-b-4 border-[#00FFFF] pb-6 mb-4">
          <h1 className="text-3xl md:text-5xl font-mono uppercase mb-4 glitch-text" data-text="NEON_SNAKE.EXE">
            NEON_SNAKE.EXE
          </h1>
          <p className="text-[#FF00FF] font-mono tracking-[0.2em] text-sm md:text-lg uppercase">
            SYS.OVERRIDE // GLITCH_ART_MODE
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-6xl">
          <div className="flex-1 w-full flex justify-center">
            <SnakeGame />
          </div>

          <div className="flex-1 w-full flex flex-col gap-8">
            <MusicPlayer />

            <div className="border-4 border-[#00FFFF] bg-black p-6 font-sans text-xl shadow-[8px_8px_0px_#FF00FF]">
              <h3 className="text-2xl text-[#FF00FF] uppercase mb-4 border-b-2 border-[#FF00FF] inline-block font-bold">SYSTEM_DIRECTIVES</h3>
              <ul className="space-y-3 text-white">
                <li className="flex items-start gap-2">
                  <span className="text-[#00FFFF] font-bold">&gt;</span>
                  INPUT: [ARROW_KEYS] TO REDIRECT VECTOR
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00FFFF] font-bold">&gt;</span>
                  TARGET: CONSUME MAGENTA DATA PACKETS
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00FFFF] font-bold">&gt;</span>
                  CMD: [SPACE] TO HALT/RESUME EXECUTION
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF00FF] font-bold animate-pulse">!</span>
                  WARNING: AVOID BOUNDARY COLLISION AND SELF-INTERSECTION
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
