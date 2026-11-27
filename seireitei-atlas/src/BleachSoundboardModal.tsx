import React, { useState } from 'react';
import { BleachAudioSynthesizer } from './BleachAudioSynthesizer';

interface BleachSoundboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  synth: BleachAudioSynthesizer;
}

export const BleachSoundboardModal: React.FC<BleachSoundboardModalProps> = ({
  isOpen,
  onClose,
  synth,
}) => {
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);

  if (!isOpen) return null;

  const sounds = [
    {
      id: 'shikai',
      name: '始解 • SHIKAI RELEASE',
      sub: 'Crystalline blade draw & ringing steel sheen overtone',
      color: '#38BDF8',
      play: () => synth.playShikai(),
    },
    {
      id: 'bankai',
      name: '卍解 • BANKAI DETONATION',
      sub: 'Sub-bass earthquake rumble & sky-cleaving Reiatsu roar',
      color: '#EF4444',
      play: () => synth.playBankai(),
    },
    {
      id: 'shunpo',
      name: '瞬歩 • SHUNPO FLASH STEP',
      sub: 'Supersonic air displacement pop & high-speed footwork',
      color: '#F59E0B',
      play: () => synth.playShunpo(),
    },
    {
      id: 'hado',
      name: '破道 • HADŌ ENERGY BURST',
      sub: 'Concentrated destructive spirit wave & resonant blast',
      color: '#EC4899',
      play: () => synth.playKido('hado'),
    },
    {
      id: 'bakudo',
      name: '縛道 • BAKUDŌ BINDING SPELL',
      sub: 'Tri-harmonic paralyzing light beam & spatial lock',
      color: '#10B981',
      play: () => synth.playKido('bakudo'),
    },
    {
      id: 'konso',
      name: '魂葬 • KONSŌ SOUL BURIAL',
      sub: 'Serene temple chime guiding plus souls to Soul Society',
      color: '#D4AF37',
      play: () => synth.playKonso(),
    },
  ];

  const handleTrigger = (s: (typeof sounds)[0]) => {
    setActiveSoundId(s.id);
    s.play();
    setTimeout(() => {
      setActiveSoundId(null);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="soundboard-title"
    >
      <div
        className="relative w-full max-w-xl bg-[#090d1a] border border-[#c9a65b]/40 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(201,166,91,0.2)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <span
              className="w-7 h-7 rounded-lg bg-[#c9a65b]/15 border border-[#c9a65b]/40 flex items-center justify-center text-sm text-[#c9a65b] shrink-0"
              aria-hidden="true"
            >
              ♫
            </span>
            <div>
              <h3 id="soundboard-title" className="font-serif text-xl tracking-wider text-[#f4f1ea] font-semibold">
                REIATSU SOUNDBOARD • 霊音響堂
              </h3>
              <p className="font-mono text-[11px] text-[#c9a65b] tracking-wider">
                Procedural Web Audio API sound generator for Bleach anime effects
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white font-mono text-sm px-2.5 py-1 rounded border border-white/10 hover:border-white/30 transition-all"
            aria-label="Close soundboard"
          >
            ✕
          </button>
        </div>

        {/* Sound buttons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {sounds.map((sound) => {
            const isPlaying = activeSoundId === sound.id;
            return (
              <button
                key={sound.id}
                type="button"
                onClick={() => handleTrigger(sound)}
                className={`relative flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer overflow-hidden group ${
                  isPlaying
                    ? 'bg-white/15 scale-[1.02] shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-[#0f1424]/80 hover:bg-[#151c33] border-white/10 hover:border-white/30'
                }`}
                style={{
                  borderColor: isPlaying ? sound.color : undefined,
                }}
              >
                {/* Spiritual pulse background aura when pressed */}
                {isPlaying && (
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none animate-pulse"
                    style={{ backgroundColor: sound.color }}
                  />
                )}

                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className="font-mono text-xs font-semibold tracking-wider"
                    style={{ color: sound.color }}
                  >
                    {sound.name}
                  </span>
                  <span className="text-xs group-hover:translate-x-0.5 transition-transform">
                    {isPlaying ? '🔊' : '▶'}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 leading-snug">{sound.sub}</p>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>REAL-TIME WEB AUDIO SYNTHESIS</span>
          <span>NO EXTERNAL AUDIO FILES REQUIRED</span>
        </div>
      </div>
    </div>
  );
};

export default BleachSoundboardModal;
