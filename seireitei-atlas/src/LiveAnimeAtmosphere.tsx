import React, { useEffect, useRef, useState, useCallback } from 'react';

export type AnimeAtmosphereMode = 'all' | 'sakura' | 'reishi' | 'aurora';

interface LiveAnimeAtmosphereProps {
  mode?: AnimeAtmosphereMode;
  isDawn?: boolean;
  isAudioPlaying?: boolean;
  enabled?: boolean;
  onToggleEnabled?: () => void;
  onChangeMode?: (mode: AnimeAtmosphereMode) => void;
  showControls?: boolean;
}

interface SakuraPetal {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  size: number;
  baseAlpha: number;
  colorType: number;
  swaySpeed: number;
  swayDist: number;
  swayOffset: number;
}

interface ReishiMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  colorType: 'blue' | 'gold' | 'white';
  pulseSpeed: number;
  phase: number;
}

interface GodRay {
  x: number;
  width: number;
  angle: number;
  alpha: number;
  speed: number;
  phase: number;
}

export const LiveAnimeAtmosphere: React.FC<LiveAnimeAtmosphereProps> = ({
  mode = 'all',
  isDawn = false,
  isAudioPlaying = false,
  enabled = true,
  onToggleEnabled,
  onChangeMode,
  showControls = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; vx: number; vy: number; lastX: number; lastY: number }>({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
    lastX: -1000,
    lastY: -1000,
  });

  const [activeMode, setActiveMode] = useState<AnimeAtmosphereMode>(mode);
  const [controlsExpanded, setControlsExpanded] = useState(false);

  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  const handleModeSelect = (m: AnimeAtmosphereMode) => {
    setActiveMode(m);
    onChangeMode?.(m);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nowX = e.clientX;
      const nowY = e.clientY;
      if (mouseRef.current.lastX > -900) {
        mouseRef.current.vx = (nowX - mouseRef.current.lastX) * 0.15;
        mouseRef.current.vy = (nowY - mouseRef.current.lastY) * 0.15;
      }
      mouseRef.current.x = nowX;
      mouseRef.current.y = nowY;
      mouseRef.current.lastX = nowX;
      mouseRef.current.lastY = nowY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

    // Initialize Sakura Petals
    const PETAL_COUNT = 38;
    const petals: SakuraPetal[] = [];
    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.5 + Math.random() * 0.9,
        vx: 0.6 + Math.random() * 1.2,
        vy: 0.9 + Math.random() * 1.8,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: 0.015 + Math.random() * 0.035,
        vRotY: 0.012 + Math.random() * 0.03,
        vRotZ: 0.008 + Math.random() * 0.02,
        size: 9 + Math.random() * 11,
        baseAlpha: 0.55 + Math.random() * 0.35,
        colorType: Math.random() > 0.3 ? 0 : 1, // 0 = standard sakura pink, 1 = spiritual reishi petal
        swaySpeed: 0.02 + Math.random() * 0.02,
        swayDist: 1.5 + Math.random() * 2.2,
        swayOffset: Math.random() * 100,
      });
    }

    // Initialize Reishi motes
    const REISHI_COUNT = 54;
    const reishiMotes: ReishiMote[] = [];
    for (let i = 0; i < REISHI_COUNT; i++) {
      const typeRand = Math.random();
      reishiMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.5 + Math.random() * 1.2),
        size: 1.5 + Math.random() * 3.5,
        alpha: Math.random(),
        baseAlpha: 0.35 + Math.random() * 0.5,
        colorType: typeRand > 0.35 ? 'blue' : typeRand > 0.15 ? 'gold' : 'white',
        pulseSpeed: 0.018 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Initialize Atmospheric God Rays
    const godRays: GodRay[] = [
      { x: width * 0.15, width: 140, angle: 0.38, alpha: 0.045, speed: 0.0006, phase: 0 },
      { x: width * 0.42, width: 220, angle: 0.34, alpha: 0.055, speed: 0.0008, phase: 1.8 },
      { x: width * 0.72, width: 180, angle: 0.31, alpha: 0.04, speed: 0.0007, phase: 3.4 },
      { x: width * 0.88, width: 160, angle: 0.28, alpha: 0.035, speed: 0.0005, phase: 4.9 },
    ];

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Dampen mouse impulse
      mouseRef.current.vx *= 0.94;
      mouseRef.current.vy *= 0.94;

      const audioBoost = isAudioPlaying ? 1.45 : 1.0;
      const effectiveMode = activeMode;

      // 1. Render God Rays (Anime Sunlight / Reiatsu Shafts)
      if (effectiveMode === 'all' || effectiveMode === 'aurora') {
        ctx.save();
        godRays.forEach((ray) => {
          const oscAlpha = ray.alpha * (0.7 + 0.3 * Math.sin(time * ray.speed + ray.phase)) * audioBoost;
          const currentX = ray.x + Math.sin(time * 0.001 + ray.phase) * 40;
          const endX = currentX + Math.tan(ray.angle) * height;

          const grad = ctx.createLinearGradient(currentX, 0, endX, height);
          if (isDawn) {
            grad.addColorStop(0, `rgba(255, 220, 160, ${oscAlpha * 1.5})`);
            grad.addColorStop(0.4, `rgba(255, 180, 130, ${oscAlpha})`);
            grad.addColorStop(1, 'rgba(255, 140, 100, 0)');
          } else {
            grad.addColorStop(0, `rgba(160, 210, 255, ${oscAlpha * 1.6})`);
            grad.addColorStop(0.5, `rgba(120, 185, 255, ${oscAlpha})`);
            grad.addColorStop(1, 'rgba(90, 140, 255, 0)');
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(currentX - ray.width * 0.5, 0);
          ctx.lineTo(currentX + ray.width * 0.5, 0);
          ctx.lineTo(endX + ray.width * 1.4, height);
          ctx.lineTo(endX - ray.width * 1.4, height);
          ctx.closePath();
          ctx.fill();
        });
        ctx.restore();
      }

      // 2. Render Reishi Spiritual Motes
      if (effectiveMode === 'all' || effectiveMode === 'reishi' || effectiveMode === 'aurora') {
        ctx.save();
        reishiMotes.forEach((m) => {
          m.phase += m.pulseSpeed;
          const currentAlpha = m.baseAlpha * (0.55 + 0.45 * Math.sin(m.phase));

          // Natural thermal upward float with gentle horizontal drift
          m.x += m.vx + Math.sin(m.phase * 0.7) * 0.4 + mouseRef.current.vx * 0.08;
          m.y += m.vy * audioBoost + mouseRef.current.vy * 0.08;

          // Wrap boundaries
          if (m.y < -20) {
            m.y = height + 10;
            m.x = Math.random() * width;
          }
          if (m.x < -20) m.x = width + 10;
          if (m.x > width + 20) m.x = -10;

          // Radial glow for authentic spirit energy
          const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size * 2.8);
          if (m.colorType === 'blue') {
            grad.addColorStop(0, `rgba(215, 240, 255, ${currentAlpha * 0.95})`);
            grad.addColorStop(0.35, `rgba(111, 183, 255, ${currentAlpha * 0.65})`);
            grad.addColorStop(1, 'rgba(80, 140, 255, 0)');
          } else if (m.colorType === 'gold') {
            grad.addColorStop(0, `rgba(255, 250, 210, ${currentAlpha * 0.95})`);
            grad.addColorStop(0.4, `rgba(255, 215, 110, ${currentAlpha * 0.6})`);
            grad.addColorStop(1, 'rgba(230, 160, 40, 0)');
          } else {
            grad.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha})`);
            grad.addColorStop(0.4, `rgba(220, 235, 255, ${currentAlpha * 0.5})`);
            grad.addColorStop(1, 'rgba(200, 220, 255, 0)');
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 3. Render Senbonzakura Cherry Blossom Petals
      if (effectiveMode === 'all' || effectiveMode === 'sakura') {
        ctx.save();
        petals.forEach((p) => {
          // 3D tumble rotations
          p.rotX += p.vRotX * audioBoost;
          p.rotY += p.vRotY * audioBoost;
          p.rotZ += p.vRotZ * audioBoost;

          // Natural falling physics with wind turbulence
          const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayDist;
          p.x += (p.vx + sway + mouseRef.current.vx * 0.3) * p.z * audioBoost;
          p.y += (p.vy + mouseRef.current.vy * 0.2) * p.z * audioBoost;

          // Wrap boundaries
          if (p.y > height + 40) {
            p.y = -30;
            p.x = Math.random() * width - 60;
          }
          if (p.x > width + 50) {
            p.x = -40;
          }

          // Compute 3D perspective scales
          const scaleX = Math.cos(p.rotX);
          const scaleY = Math.sin(p.rotY);
          const drawW = p.size * p.z * Math.max(0.18, Math.abs(scaleX));
          const drawH = p.size * 1.35 * p.z * Math.max(0.18, Math.abs(scaleY));
          const alpha = p.baseAlpha * Math.min(1, Math.max(0.2, (Math.abs(scaleX) + Math.abs(scaleY)) * 0.5));

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotZ);

          // Draw authentic anime petal shape (notched heart-like curve)
          ctx.beginPath();
          ctx.moveTo(0, -drawH * 0.5);
          ctx.bezierCurveTo(drawW * 0.65, -drawH * 0.45, drawW * 0.75, drawH * 0.25, 0, drawH * 0.55);
          ctx.bezierCurveTo(-drawW * 0.75, drawH * 0.25, -drawW * 0.65, -drawH * 0.45, 0, -drawH * 0.55);
          ctx.closePath();

          // Petal gradient
          const petalGrad = ctx.createLinearGradient(0, -drawH * 0.5, 0, drawH * 0.55);
          if (p.colorType === 0) {
            // Classic Senbonzakura Cherry Blossom
            if (isDawn) {
              petalGrad.addColorStop(0, `rgba(255, 235, 240, ${alpha * 0.95})`);
              petalGrad.addColorStop(0.6, `rgba(255, 175, 195, ${alpha * 0.85})`);
              petalGrad.addColorStop(1, `rgba(235, 110, 150, ${alpha * 0.75})`);
            } else {
              petalGrad.addColorStop(0, `rgba(255, 245, 250, ${alpha * 0.95})`);
              petalGrad.addColorStop(0.55, `rgba(255, 185, 210, ${alpha * 0.85})`);
              petalGrad.addColorStop(1, `rgba(220, 120, 165, ${alpha * 0.7})`);
            }
          } else {
            // Ethereal Reishi Spirit Petal (Soul Society Cyan/Gold sheen)
            petalGrad.addColorStop(0, `rgba(240, 255, 255, ${alpha * 0.95})`);
            petalGrad.addColorStop(0.5, `rgba(160, 230, 255, ${alpha * 0.8})`);
            petalGrad.addColorStop(1, `rgba(110, 180, 255, ${alpha * 0.65})`);
          }

          ctx.fillStyle = petalGrad;
          ctx.fill();

          // Soft highlight rim on the petal edge
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.45})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();

          ctx.restore();
        });
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [enabled, activeMode, isDawn, isAudioPlaying]);

  return (
    <>
      {/* High-Performance 60FPS Live Anime Canvas */}
      <canvas
        ref={canvasRef}
        className="live-anime-canvas"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 6,
          display: enabled ? 'block' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Live Anime Animation Floating HUD Controller */}
      {showControls && (
        <div
          className={`live-anime-hud ${controlsExpanded ? 'expanded' : ''}`}
          role="region"
          aria-label="Live animation controls"
        >
          <div className="live-hud-main">
            <button
              type="button"
              className={`live-hud-toggle ${enabled ? 'is-live' : 'is-paused'}`}
              onClick={onToggleEnabled}
              title={enabled ? 'Pause live anime atmosphere' : 'Resume live anime atmosphere'}
              aria-label={enabled ? 'Live animation active' : 'Live animation paused'}
            >
              <span className="live-pulse-dot" aria-hidden="true" />
              <span className="live-hud-label">
                <b>LIVE ANIMATION</b>
                <small>{enabled ? '60FPS ACTIVE' : 'PAUSED'}</small>
              </span>
            </button>

            {enabled && (
              <button
                type="button"
                className="live-hud-expand-btn"
                onClick={() => setControlsExpanded(!controlsExpanded)}
                title="Select live animation mode"
                aria-expanded={controlsExpanded}
                aria-label="Toggle atmosphere styles"
              >
                <span className="current-mode-badge">
                  {activeMode === 'all' && '🌸✦ SAKURA & REISHI'}
                  {activeMode === 'sakura' && '🌸 SENBONZAKURA'}
                  {activeMode === 'reishi' && '✦ PURE REISHI'}
                  {activeMode === 'aurora' && '⚔ REIATSU AURORA'}
                </span>
                <span className="expand-chevron">{controlsExpanded ? '▲' : '▼'}</span>
              </button>
            )}
          </div>

          {/* Collapsible Mode Selector Tray */}
          {enabled && controlsExpanded && (
            <div className="live-hud-tray">
              <span className="tray-title">ATMOSPHERE STYLE</span>
              <div className="tray-options">
                <button
                  type="button"
                  className={`tray-opt ${activeMode === 'all' ? 'active' : ''}`}
                  onClick={() => handleModeSelect('all')}
                >
                  <span className="opt-symbol">🌸✦</span>
                  <span className="opt-text">
                    <strong>Full Anime World</strong>
                    <small>Sakura petals, spirit motes & god rays</small>
                  </span>
                </button>

                <button
                  type="button"
                  className={`tray-opt ${activeMode === 'sakura' ? 'active' : ''}`}
                  onClick={() => handleModeSelect('sakura')}
                >
                  <span className="opt-symbol">🌸</span>
                  <span className="opt-text">
                    <strong>Senbonzakura</strong>
                    <small>Dancing cherry blossom petals</small>
                  </span>
                </button>

                <button
                  type="button"
                  className={`tray-opt ${activeMode === 'reishi' ? 'active' : ''}`}
                  onClick={() => handleModeSelect('reishi')}
                >
                  <span className="opt-symbol">✦</span>
                  <span className="opt-text">
                    <strong>Pure Reishi (霊子)</strong>
                    <small>Rising celestial spiritual particles</small>
                  </span>
                </button>

                <button
                  type="button"
                  className={`tray-opt ${activeMode === 'aurora' ? 'active' : ''}`}
                  onClick={() => handleModeSelect('aurora')}
                >
                  <span className="opt-symbol">⚔</span>
                  <span className="opt-text">
                    <strong>Reiatsu God Rays</strong>
                    <small>Sunbeams breaking through clouds</small>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
