import React, { useState, useRef, useEffect } from 'react';
import { TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = TRACKS[idx];

  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play().catch(() => setPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, idx]);

  const toggle = () => setPlaying(!playing);
  const next = () => { setIdx((i) => (i + 1) % TRACKS.length); setProg(0); };
  const prev = () => { setIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length); setProg(0); };

  const updateTime = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProg((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  // Generate ASCII progress bar
  const barLength = 20;
  const filled = Math.floor((prog / 100) * barLength) || 0;
  const asciiBar = '[' + '█'.repeat(filled) + '-'.repeat(Math.max(0, barLength - filled)) + ']';

  return (
    <div className="border-4 border-[#FF00FF] bg-black p-6 font-sans text-xl shadow-[8px_8px_0px_#00FFFF] w-full">
      <audio ref={audioRef} src={track.url} onTimeUpdate={updateTime} onEnded={next} />
      
      <div className="flex justify-between items-end border-b-4 border-[#00FFFF] pb-2 mb-6">
        <span className="text-2xl font-mono text-[#00FFFF] glitch-text" data-text="AUDIO_STREAM">AUDIO_STREAM</span>
        <span className={`font-mono text-sm ${playing ? "animate-pulse text-[#FF00FF]" : "text-gray-500"}`}>
          [{playing ? "ACTIVE" : "HALTED"}]
        </span>
      </div>

      <div className="mb-6">
        <div className="text-white text-3xl font-bold truncate mb-1">&gt; {track.title}</div>
        <div className="text-[#FF00FF] text-lg">SRC: {track.artist}</div>
      </div>

      <div className="mb-8 text-center text-[#00FFFF] font-mono text-lg tracking-[0.2em] overflow-hidden whitespace-nowrap">
        {asciiBar}
      </div>

      <div className="flex justify-between items-center gap-4">
        <button 
          onClick={prev} 
          className="flex-1 py-3 border-2 border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors font-bold"
        >
          &lt;&lt; PRV
        </button>
        <button 
          onClick={toggle} 
          className="flex-1 py-3 border-2 border-[#FF00FF] bg-[#FF00FF]/10 hover:bg-[#FF00FF] hover:text-black transition-colors text-white font-bold"
        >
          {playing ? 'PAUSE' : 'EXECUTE'}
        </button>
        <button 
          onClick={next} 
          className="flex-1 py-3 border-2 border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors font-bold"
        >
          NXT &gt;&gt;
        </button>
      </div>
    </div>
  );
};
