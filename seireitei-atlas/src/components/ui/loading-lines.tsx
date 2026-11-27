import React from 'react';

interface LoadingLinesProps {
  text?: string;
  className?: string;
}

export const LoadingLines: React.FC<LoadingLinesProps> = ({
  text = 'SOUL SOCIETY REALM • 尸魂界',
  className = '',
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center py-6 ${className}`}>
      {/* Outer spiritual beam emitter lines */}
      <div className="relative w-full max-w-[340px] sm:max-w-[440px] h-[36px] flex items-center justify-center">
        {/* Animated scanning Reiatsu laser line */}
        <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#6fb7ff] to-transparent opacity-60 animate-pulse" />
        <div
          className="absolute h-[2px] w-[90px] bg-gradient-to-r from-transparent via-[#f4f1ea] to-transparent blur-[0.5px]"
          style={{
            animation: 'scanLine 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        />

        {/* Central Bleach Kanji Crest Ornament */}
        <div className="relative z-10 flex items-center gap-3 px-4 py-1 rounded-full bg-[#05060f]/90 border border-[#6fb7ff]/30 shadow-[0_0_20px_rgba(111,183,255,0.25)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
          <span className="font-serif tracking-[0.25em] text-[#f4f1ea] text-xs font-semibold uppercase">
            {text}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a65b]" />
        </div>
      </div>

      {/* Dynamic Spiritual Frequency Waveform Graphic */}
      <div className="flex items-center gap-[3px] mt-3 h-5">
        {[18, 35, 60, 90, 75, 40, 85, 100, 70, 45, 95, 60, 30, 75, 50, 20].map((h, i) => (
          <div
            key={i}
            className="w-[2px] rounded-full bg-gradient-to-t from-[#38bdf8]/30 via-[#6fb7ff] to-[#f4f1ea]"
            style={{
              height: `${h}%`,
              animation: `pulseBar 1.2s ease-in-out infinite alternate`,
              animationDelay: `${(i * 0.08).toFixed(2)}s`,
              opacity: 0.4 + (h / 100) * 0.6,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes scanLine {
          0% { transform: translateX(-160px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(160px); opacity: 0; }
        }
        @keyframes pulseBar {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.15); }
        }
      `}</style>
    </div>
  );
};

export default LoadingLines;
