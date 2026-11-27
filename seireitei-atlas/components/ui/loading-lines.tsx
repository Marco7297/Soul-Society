import React from "react";

export interface LoadingLinesProps {
  text?: string;
  subtext?: string;
  className?: string;
  scale?: number;
  showEmblem?: boolean;
}

const LoadingLines: React.FC<LoadingLinesProps> = ({
  text = "SOUL SOCIETY REALM • 尸魂界",
  subtext = "始解 • GOTEI 13 REISHI CONVERGENCE",
  className = "",
  scale,
  showEmblem = true,
}) => {
  const letters = text.split("");

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-[160px] w-full select-none ${className}`}
      style={scale ? { transform: `scale(${scale})` } : undefined}
    >
      {/* Subtext Tag */}
      {subtext && (
        <span className="font-mono text-[9px] sm:text-[10.5px] tracking-[0.35em] text-[#c9a65b] uppercase mb-3 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-sm bg-[#c9a65b]" />
          {subtext}
        </span>
      )}

      {/* Main Animated Letters Display */}
      <div className="relative flex items-center justify-center flex-wrap px-4 py-2 font-mono text-[1.25rem] sm:text-[1.75rem] md:text-[2.1rem] font-bold tracking-wider text-white">
        {/* Animated letterforms */}
        {letters.map((letter, idx) => (
          <span
            key={idx}
            className="relative inline-block opacity-0 z-[2] animate-[letterAnim_3.6s_linear_infinite] text-white"
            style={{ animationDelay: `${0.08 + idx * 0.075}s` }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}

        {/* Loader background with authentic spiritual energy mask */}
        <div className="absolute top-0 left-0 w-full h-full z-[1] bg-transparent [mask:repeating-linear-gradient(90deg,transparent_0,transparent_5px,black_6px,black_8px)]">
          <div
            className="absolute top-0 left-0 w-full h-full 
            bg-gradient-to-r from-[#c9a65b]/80 via-[#6fb7ff]/80 to-[#f4f1ea]/80
            animate-[transformAnim_2.4s_infinite_alternate_cubic-bezier(0.6,0.8,0.5,1),opacityAnim_3.6s_infinite]"
          />
        </div>

        {/* Sweeping Katana Blade Glint Sheen */}
        <div className="absolute inset-0 pointer-events-none z-[3] overflow-hidden">
          <div className="w-[120%] h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-25 animate-[bladeSlash_2.8s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes transformAnim {
          0% {
            transform: translate(-50%) scale(0.95);
          }
          100% {
            transform: translate(50%) scale(1.08);
          }
        }

        @keyframes opacityAnim {
          0%,
          100% {
            opacity: 0.15;
          }
          20% {
            opacity: 1;
          }
          70% {
            opacity: 0.2;
          }
        }

        @keyframes letterAnim {
          0% {
            opacity: 0;
            transform: translateY(4px) scale(0.95);
          }
          6% {
            opacity: 1;
            text-shadow: 0 0 10px #6fb7ff, 0 0 20px #c9a65b, 0 0 32px rgba(111, 183, 255, 0.6);
            transform: translateY(-2px) scale(1.06);
          }
          22% {
            opacity: 0.35;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(0);
          }
        }

        @keyframes bladeSlash {
          0% {
            transform: translateX(-150%) skewX(-25deg);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          35% {
            transform: translateX(150%) skewX(-25deg);
            opacity: 0;
          }
          100% {
            transform: translateX(150%) skewX(-25deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingLines;
