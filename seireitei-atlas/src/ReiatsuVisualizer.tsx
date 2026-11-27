import React, { useEffect, useRef, useMemo } from 'react';

export interface ReiatsuProfile {
  index: number;
  sceneName: string;
  kanji: string;
  spoilerLevel: 'General Lore' | 'Soul Society Arc' | 'Arrancar Climax' | 'TYBW Canon';
  importance: number; // 1 to 10 scale
  rankTitle: string;
  periodSec: number; // Pulse period in seconds (e.g. 1.5s for god-tier down to 6.2s for serene)
  intensity: number; // 0.15 to 0.95 visual intensity
  color: string; // Primary Reiatsu hue
  secondaryColor: string; // Accent secondary hue
  description: string;
}

export const REIATSU_SCENE_PROFILES: ReiatsuProfile[] = [
  {
    index: 0,
    sceneName: 'Citadel Panorama',
    kanji: '瀞霊廷全景',
    spoilerLevel: 'General Lore',
    importance: 3.5,
    rankTitle: 'Serene Reishi Atmosphere',
    periodSec: 6.2,
    intensity: 0.22,
    color: '#6fb7ff',
    secondaryColor: '#ffffff',
    description: 'Calm, baseline spirit particles flowing across the outer battlements.',
  },
  {
    index: 1,
    sceneName: 'Four Pure Soul Gates',
    kanji: '白道門・四至',
    spoilerLevel: 'Soul Society Arc',
    importance: 4.8,
    rankTitle: 'Titan Gatekeeper Pressure',
    periodSec: 5.2,
    intensity: 0.32,
    color: '#46e3be',
    secondaryColor: '#70b5ff',
    description: 'Moderate pressure anchored by Sekkiseki stone barriers and Jidanbō.',
  },
  {
    index: 2,
    sceneName: 'Ceremonial Promenade',
    kanji: '中央大通',
    spoilerLevel: 'Soul Society Arc',
    importance: 5.5,
    rankTitle: 'Gotei 13 Patrol Pressure',
    periodSec: 4.6,
    intensity: 0.38,
    color: '#5b8cff',
    secondaryColor: '#d6e4ff',
    description: 'Disciplined military spiritual signatures along the palace approach.',
  },
  {
    index: 3,
    sceneName: 'Sōkyoku Hill Execution Ground',
    kanji: '双殛の丘',
    spoilerLevel: 'Soul Society Arc',
    importance: 9.2,
    rankTitle: 'Captain-Class Surge / Sōkyoku Blazes',
    periodSec: 2.3,
    intensity: 0.78,
    color: '#ff5429',
    secondaryColor: '#ffb338',
    description: 'Cataclysmic pressure of one million Zanpakutō; Phoenix fire waves.',
  },
  {
    index: 4,
    sceneName: 'The Parting Gate & Barracks',
    kanji: '隊舎・訓練区',
    spoilerLevel: 'Soul Society Arc',
    importance: 6.2,
    rankTitle: 'Division Barracks Field',
    periodSec: 4.0,
    intensity: 0.45,
    color: '#fca338',
    secondaryColor: '#6fb7ff',
    description: 'Dynamic overlapping Reiatsu waveforms from Gotei 13 training squares.',
  },
  {
    index: 5,
    sceneName: 'First Division Command Palace',
    kanji: '一番隊総隊長室',
    spoilerLevel: 'Arrancar Climax',
    importance: 8.8,
    rankTitle: 'Captain-Commander Scorching Pressure',
    periodSec: 2.1,
    intensity: 0.82,
    color: '#ff7700',
    secondaryColor: '#ffdd55',
    description: 'Oppressive, incinerating spiritual density of Genryūsai Yamamoto.',
  },
  {
    index: 6,
    sceneName: 'Central 46 Judicial Chamber',
    kanji: '中央四十六室',
    spoilerLevel: 'Soul Society Arc',
    importance: 7.8,
    rankTitle: 'Judicial Null-Field Pressure',
    periodSec: 3.2,
    intensity: 0.62,
    color: '#a855f7',
    secondaryColor: '#38bdf8',
    description: 'Stifling, somber psychic suppression within the subterranean hall.',
  },
  {
    index: 7,
    sceneName: 'Great Archives (Daireishoshitsu)',
    kanji: '大霊書回廊',
    spoilerLevel: 'General Lore',
    importance: 6.8,
    rankTitle: 'Forbidden Knowledge Resonance',
    periodSec: 3.6,
    intensity: 0.52,
    color: '#00d2ff',
    secondaryColor: '#818cf8',
    description: 'Mysterious, ancient spiritual vibrations radiating from millenary scroll vaults.',
  },
  {
    index: 8,
    sceneName: 'The Royal Realm (Reiōkyū)',
    kanji: '霊王宮・神域',
    spoilerLevel: 'TYBW Canon',
    importance: 10.0,
    rankTitle: 'Transcendent God-Tier (Soul King Linchpin)',
    periodSec: 1.5,
    intensity: 0.95,
    color: '#facc15',
    secondaryColor: '#ffffff',
    description: 'The supreme celestial linchpin anchoring the balance of all three worlds.',
  },
];

interface ReiatsuVisualizerProps {
  enabled: boolean;
  sceneIndex: number;
  locationSpoilerLevel?: string;
  locationImportanceBonus?: boolean;
  onToggleEnabled: () => void;
  showHud?: boolean;
}

export const ReiatsuVisualizer: React.FC<ReiatsuVisualizerProps> = ({
  enabled,
  sceneIndex,
  locationSpoilerLevel,
  locationImportanceBonus = false,
  onToggleEnabled,
  showHud = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute active profile with potential location inspection modifier
  const currentProfile = useMemo(() => {
    const base = REIATSU_SCENE_PROFILES[Math.min(sceneIndex, REIATSU_SCENE_PROFILES.length - 1)] || REIATSU_SCENE_PROFILES[0];
    
    // If a specific surveyed location is inspected, modulate based on its spoilerLevel
    if (locationImportanceBonus && locationSpoilerLevel) {
      if (locationSpoilerLevel.toLowerCase().includes('tybw') || locationSpoilerLevel.toLowerCase().includes('blood')) {
        return {
          ...base,
          rankTitle: `TYBW Lore Surge (${base.rankTitle})`,
          periodSec: Math.max(1.4, base.periodSec * 0.7),
          intensity: Math.min(0.95, base.intensity * 1.3),
        };
      }
      if (locationSpoilerLevel.toLowerCase().includes('soul')) {
        return {
          ...base,
          rankTitle: `Soul Society Arc Surge (${base.rankTitle})`,
          periodSec: Math.max(2.0, base.periodSec * 0.85),
          intensity: Math.min(0.85, base.intensity * 1.15),
        };
      }
    }

    return base;
  }, [sceneIndex, locationSpoilerLevel, locationImportanceBonus]);

  // Canvas animation loop for pulsing harmonic spiritual shockwaves
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      const period = currentProfile.periodSec;
      const freq = 1 / period;
      const baseIntensity = currentProfile.intensity;

      // 1. Subtle spiritual atmosphere aura (Linear, non-circular)
      const pulseCycle = (Math.sin(elapsed * Math.PI * 2 * freq) + 1) * 0.5; // 0 to 1
      const dynamicAlpha = baseIntensity * (0.04 + pulseCycle * 0.08);

      ctx.save();
      const linearGrad = ctx.createLinearGradient(0, height, 0, 0);
      linearGrad.addColorStop(0, 'rgba(5, 6, 15, 0)');
      linearGrad.addColorStop(0.3, currentProfile.color);
      linearGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.globalAlpha = dynamicAlpha;
      ctx.fillStyle = linearGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 3. Surging Vertical Reiatsu Pressure Ribbons (Rising spiritual energy)
      ctx.save();
      const numRibbons = 6;
      for (let r = 0; r < numRibbons; r++) {
        const ribbonX = (width / (numRibbons + 1)) * (r + 1) + Math.sin(elapsed * 2 + r) * 35;
        const ribbonH = height * (0.35 + 0.35 * Math.sin(elapsed * 1.5 + r * 1.3));
        const ribbonW = 20 + 15 * pulseCycle;
        const ribbonAlpha = baseIntensity * (0.04 + 0.08 * pulseCycle);

        const rGrad = ctx.createLinearGradient(ribbonX, height, ribbonX, height - ribbonH);
        rGrad.addColorStop(0, currentProfile.color);
        rGrad.addColorStop(0.7, currentProfile.secondaryColor);
        rGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.globalAlpha = ribbonAlpha;
        ctx.fillStyle = rGrad;
        ctx.fillRect(ribbonX - ribbonW * 0.5, height - ribbonH, ribbonW, ribbonH);
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [enabled, currentProfile]);

  return (
    <>
      {/* Reiatsu Canvas Shockwave Layer */}
      <canvas
        ref={canvasRef}
        className="reiatsu-visualizer-canvas"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 5,
          mixBlendMode: 'screen',
          display: enabled ? 'block' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Reiatsu Vignette Edge Pulse (driven by dynamic CSS variables) */}
      {enabled && (
        <div
          className="reiatsu-vignette-pulse"
          style={
            {
              '--reiatsu-color': currentProfile.color,
              '--reiatsu-secondary': currentProfile.secondaryColor,
              '--reiatsu-period': `${currentProfile.periodSec}s`,
              '--reiatsu-intensity': currentProfile.intensity,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      )}

      {/* Reiatsu HUD Pressure Gauge (Interactive widget) */}
      {showHud && (
        <aside
          className={`reiatsu-hud-badge ${enabled ? 'active' : 'paused'}`}
          aria-label="Reiatsu spiritual pressure gauge"
          role="region"
        >
          <button
            type="button"
            className="reiatsu-hud-btn"
            onClick={onToggleEnabled}
            title={enabled ? 'Disable Reiatsu spiritual pressure visualization' : 'Enable Reiatsu spiritual pressure visualization'}
            aria-pressed={enabled}
          >
            <span className="reiatsu-glyph" aria-hidden="true">
              ⚔
            </span>
            <div className="reiatsu-btn-text">
              <span className="reiatsu-title-line">
                <b>REIATSU VISUALIZER</b>
                <span className="reiatsu-state-tag">{enabled ? 'ACTIVE' : 'OFF'}</span>
              </span>
              <small className="reiatsu-sub-line">
                {enabled ? `${currentProfile.kanji} • ${currentProfile.spoilerLevel.toUpperCase()}` : 'CLICK TO OVERLAY SPIRIT PRESSURE'}
              </small>
            </div>
          </button>

          {enabled && (
            <div className="reiatsu-meter-expanded">
              <div className="reiatsu-meter-header">
                <span className="meter-label">PRESSURE INTENSITY: {Math.round(currentProfile.intensity * 100)}%</span>
                <span className="meter-freq">{(1 / currentProfile.periodSec).toFixed(2)} Hz ({currentProfile.periodSec}s)</span>
              </div>

              {/* Dynamic Fluid Pressure Bar */}
              <div className="reiatsu-bar-track">
                <div
                  className="reiatsu-bar-fill"
                  style={{
                    width: `${Math.round(currentProfile.intensity * 100)}%`,
                    backgroundColor: currentProfile.color,
                    boxShadow: `0 0 12px ${currentProfile.color}`,
                    animationDuration: `${currentProfile.periodSec}s`,
                  }}
                />
              </div>

              <div className="reiatsu-rank-pill" style={{ borderColor: `${currentProfile.color}55` }}>
                <span className="rank-dot" style={{ backgroundColor: currentProfile.color }} />
                <span className="rank-name">{currentProfile.rankTitle}</span>
              </div>
            </div>
          )}
        </aside>
      )}
    </>
  );
};
