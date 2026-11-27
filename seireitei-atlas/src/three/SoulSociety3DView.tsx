import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  X,
  Compass,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Bookmark,
  FileText,
  RefreshCw,
} from 'lucide-react';
import {
  buildSoulSocietyScene,
  type BuiltSceneState,
  type Landmark3DInfo,
  type SoulSocietySceneId,
  type WaypointStop,
} from './scenes';
import { useAuth } from '../contexts/AuthContext';

interface SoulSociety3DViewProps {
  isOpen: boolean;
  initialScene?: SoulSocietySceneId;
  isDawn: boolean;
  onClose: () => void;
  onOpenLocationPanel: (locationId: string) => void;
  onOpenArchiveModal: (prefillLocationId?: string, prefillScene?: SoulSocietySceneId) => void;
  onToast: (msg: string) => void;
}

const SCENE_TABS: { id: SoulSocietySceneId; code: string; label: string }[] = [
  { id: 'seireitei', code: '01', label: 'FLOATING SEIREITEI' },
  { id: 'sokyoku', code: '02', label: 'SŌKYOKU MESA' },
  { id: 'reiokyu', code: '03', label: 'REIŌKYŪ PALACE' },
];

// Pre-allocated scratch helpers outside render loop
const _goalPos = new THREE.Vector3();
const _goalTarget = new THREE.Vector3();
const _rayPointer = new THREE.Vector2();

function detectSoftwareWebGL(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return false;
    const rendererStr = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
    return /SwiftShader|llvmpipe|Software Rasterizer|Microsoft Basic Render/i.test(rendererStr);
  } catch {
    return false;
  }
}

export function SoulSociety3DView({
  isOpen,
  initialScene = 'seireitei',
  isDawn,
  onClose,
  onOpenLocationPanel,
  onOpenArchiveModal,
  onToast,
}: SoulSociety3DViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user, bookmarks, toggleBookmark, signInWithGoogle } = useAuth();

  const [sceneId, setSceneId] = useState<SoulSocietySceneId>(initialScene);
  const [waypoints, setWaypoints] = useState<WaypointStop[]>([]);
  const [activeWaypointIndex, setActiveWaypointIndex] = useState<number>(0);
  const [landmarks, setLandmarks] = useState<Landmark3DInfo[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark3DInfo | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [autoTour, setAutoTour] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);

  // Refs synced to Three.js render loop
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;
  const landmarksRef = useRef<Landmark3DInfo[]>([]);
  landmarksRef.current = landmarks;
  const waypointsRef = useRef<WaypointStop[]>([]);
  waypointsRef.current = waypoints;

  const cameraGoalRef = useRef<{
    active: boolean;
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  }>({
    active: false,
    position: [-22, 10.8, 33],
    target: [0, 3.5, -1],
    fov: 45,
  });

  useEffect(() => {
    if (isOpen) {
      setSceneId(initialScene);
      setActiveWaypointIndex(0);
      setAutoTour(false);
      setContextLost(false);
    }
  }, [isOpen, initialScene]);

  // Escape & Arrow navigation keys
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const jumpToWaypoint = useCallback(
    (index: number) => {
      const list = waypointsRef.current;
      if (list.length === 0) return;
      const safeIdx = ((index % list.length) + list.length) % list.length;
      const wp = list[safeIdx];
      setActiveWaypointIndex(safeIdx);
      cameraGoalRef.current = {
        active: true,
        position: wp.position,
        target: wp.target,
        fov: wp.fov ?? 45,
      };
      if (wp.landmarkId) {
        const match = landmarksRef.current.find((lm) => lm.id === wp.landmarkId);
        if (match) setSelectedLandmark(match);
      }
    },
    []
  );

  // Timed Auto-Tour stepper
  useEffect(() => {
    if (!isOpen || !autoTour || waypoints.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveWaypointIndex((prev) => {
        const next = (prev + 1) % waypoints.length;
        const wp = waypoints[next];
        if (wp) {
          cameraGoalRef.current = {
            active: true,
            position: wp.position,
            target: wp.target,
            fov: wp.fov ?? 45,
          };
          if (wp.landmarkId) {
            const match = landmarksRef.current.find((lm) => lm.id === wp.landmarkId);
            if (match) setSelectedLandmark(match);
          }
        }
        return next;
      });
    }, 6500);
    return () => window.clearInterval(interval);
  }, [isOpen, autoTour, waypoints]);

  // Main Three.js WebGL initialization & scene lifecycle
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const container = containerRef.current;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setContextLost(true);
      return;
    }

    const gl = renderer.getContext();
    const isSoftwareGl = detectSoftwareWebGL(gl);

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDawn ? 1.18 : 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();

    // RoomEnvironment IBL
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = isDawn ? 0.72 : 0.48;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.25, 340);

    // Three-Point Twilight/Sunrise Horizon Lighting matching seireitei-home.webp
    const hemiLight = new THREE.HemisphereLight(
      isDawn ? 0xc2dbff : 0x7aa4e8,
      isDawn ? 0x3b354d : 0x11182f,
      isDawn ? 1.05 : 0.78
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      isDawn ? 0xffe4b8 : 0xffd6a6,
      isDawn ? 2.25 : 1.95
    );
    keyLight.position.set(24, 24, -18);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = isSoftwareGl ? 512 : 2048;
    keyLight.shadow.mapSize.height = isSoftwareGl ? 512 : 2048;
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 110;
    const d = 36;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6fb7ff, 0.72);
    fillLight.position.set(-22, 16, 28);
    scene.add(fillLight);

    // Build selected Soul Society 3D diorama
    const built: BuiltSceneState = buildSoulSocietyScene({
      sceneId,
      scene,
      maxAnisotropy: Math.min(8, renderer.capabilities.getMaxAnisotropy()),
      isSoftwareGl,
      isDawn,
    });

    const fogColor = isDawn ? built.fogColorDawn : built.fogColorNight;
    scene.background = new THREE.Color(fogColor);
    scene.fog = new THREE.FogExp2(fogColor, built.fogDensity);

    setWaypoints(built.waypoints);
    setLandmarks(built.landmarks);
    setActiveWaypointIndex(0);
    setSelectedLandmark(built.landmarks[0] || null);

    const initialWp = built.waypoints[0];
    camera.position.set(...initialWp.position);
    camera.fov = initialWp.fov ?? 45;
    camera.updateProjectionMatrix();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...initialWp.target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 6;
    controls.maxDistance = 85;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 0.45;
    controls.update();

    cameraGoalRef.current.active = false;

    // Click-vs-drag raycasting for landmark inspection
    const raycaster = new THREE.Raycaster();
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      cameraGoalRef.current.active = false;
      setAutoTour(false);
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 6) return;

      const rect = renderer.domElement.getBoundingClientRect();
      _rayPointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _rayPointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_rayPointer, camera);
      const hits = raycaster.intersectObjects(built.interactables, true);
      if (hits.length > 0) {
        const info = hits[0].object.userData?.landmark as Landmark3DInfo | undefined;
        if (info) {
          setSelectedLandmark(info);
          setDockCollapsed(false);
          cameraGoalRef.current = {
            active: true,
            position: info.focusPos,
            target: info.focusTarget,
            fov: 42,
          };
          const matchedWpIdx = built.waypoints.findIndex((w) => w.landmarkId === info.id);
          if (matchedWpIdx >= 0) setActiveWaypointIndex(matchedWpIdx);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(1, entry.contentRect.width);
        const h = Math.max(1, entry.contentRect.height);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    let rafId = 0;
    let timerId = 0;
    let disposed = false;
    let lastTime = performance.now();
    let elapsed = 0;

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      elapsed += dt;

      built.update(elapsed, dt);

      if (cameraGoalRef.current.active) {
        _goalPos.set(...cameraGoalRef.current.position);
        _goalTarget.set(...cameraGoalRef.current.target);

        const lambda = 4.2;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _goalPos.x, lambda, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _goalPos.y, lambda, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _goalPos.z, lambda, dt);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, _goalTarget.x, lambda, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _goalTarget.y, lambda, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _goalTarget.z, lambda, dt);

        if (Math.abs(camera.fov - cameraGoalRef.current.fov) > 0.02) {
          camera.fov = THREE.MathUtils.damp(camera.fov, cameraGoalRef.current.fov, lambda, dt);
          camera.updateProjectionMatrix();
        }

        if (
          camera.position.distanceTo(_goalPos) < 0.09 &&
          controls.target.distanceTo(_goalTarget) < 0.09
        ) {
          cameraGoalRef.current.active = false;
        }
      }

      controls.autoRotate = autoRotateRef.current && !cameraGoalRef.current.active;
      controls.update();

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        timerId = window.setTimeout(() => {
          if (!disposed) rafId = window.requestAnimationFrame(tick);
        }, 28);
      } else {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      built.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      envTarget.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, [isOpen, sceneId, isDawn, reloadNonce]);

  if (!isOpen) return null;

  const activeWaypoint = waypoints[activeWaypointIndex] || null;
  const isSelectedBookmarked =
    selectedLandmark &&
    bookmarks.some((b) => b.locationId === selectedLandmark.locationId);

  const handleBookmarkClick = async () => {
    if (!selectedLandmark) return;
    if (!user) {
      const ok = await signInWithGoogle();
      if (!ok) return;
    }
    const res = await toggleBookmark({
      locationId: selectedLandmark.locationId,
      locationName: selectedLandmark.name,
      region: selectedLandmark.jp,
    });
    if (res !== null) {
      onToast(
        res
          ? `Bookmarked ${selectedLandmark.name} to Soul Archive`
          : `Removed ${selectedLandmark.name} from Soul Archive`
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] w-screen h-screen bg-[#070b1a] select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Three.js 3D Soul Society Diorama"
    >
      {/* Full-bleed WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Graceful WebGL Context Loss Recovery Overlay */}
      {contextLost && (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-[#070b1a] text-center px-6">
          <img
            src="/seireitei-home.webp"
            alt="Floating Seireitei Citadel"
            className="w-full max-w-md rounded-2xl border border-[#c9a65b]/40 opacity-65 mb-5 shadow-2xl"
          />
          <div className="font-mono text-[11px] tracking-[0.2em] text-[#6fb7ff] uppercase mb-1">
            REISHI RENDER INTERRUPTED
          </div>
          <h2 className="font-serif text-xl text-[#f4f1ea] mb-2">
            3D WebGL Context Paused
          </h2>
          <p className="text-xs text-[#f4f1ea]/70 max-w-sm mb-4">
            Your graphics context was reclaimed by the browser. Click below to restore the Floating Seireitei Citadel scene.
          </p>
          <button
            type="button"
            onClick={() => {
              setContextLost(false);
              setReloadNonce((n) => n + 1);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#162344] border border-[#c9a65b] text-[#f4f1ea] font-mono text-xs tracking-wider hover:bg-[#213361]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#c9a65b]" />
            <span>RESTORE 3D CITADEL</span>
          </button>
        </div>
      )}

      {/* Minimal Top Header Bar (high-opacity solid surface, zero backdrop-blur over WebGL) */}
      <div className="pointer-events-none fixed top-0 inset-x-0 z-10 flex items-center justify-between px-4 sm:px-6 pt-3.5">
        <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-xl bg-[#070a16]/95 border border-[#c9a65b]/40 shadow-2xl">
          <Compass className="w-4 h-4 text-[#c9a65b] shrink-0" />
          <div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-[#6fb7ff] uppercase">
              3D CITADEL EXPLORER • 尸魂界
            </div>
            <div className="font-serif text-sm sm:text-base text-[#f4f1ea] leading-tight">
              {SCENE_TABS.find((t) => t.id === sceneId)?.label}
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoTour((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] tracking-wider border transition-colors ${
              autoTour
                ? 'bg-[#2a2010] border-[#c9a65b] text-[#f7e5b4]'
                : 'bg-[#070a16]/95 border-[#f4f1ea]/20 text-[#f4f1ea]/85 hover:border-[#c9a65b]'
            }`}
            title="Play or pause guided waypoint flythrough"
          >
            {autoTour ? <Pause className="w-3.5 h-3.5 text-[#c9a65b]" /> : <Play className="w-3.5 h-3.5 text-[#c9a65b]" />}
            <span className="hidden sm:inline">{autoTour ? 'TOUR PLAYING' : 'AUTO TOUR'}</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoRotate((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] tracking-wider border transition-colors ${
              autoRotate
                ? 'bg-[#101c36] border-[#6fb7ff] text-[#6fb7ff]'
                : 'bg-[#070a16]/95 border-[#f4f1ea]/20 text-[#f4f1ea]/80 hover:border-[#c9a65b]'
            }`}
            title="Toggle automatic orbital drift"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{autoRotate ? 'ORBIT ON' : 'ORBIT OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#070a16]/95 border border-[#c9a65b]/45 text-[#f4f1ea] hover:bg-[#141c38] hover:border-[#c9a65b] font-mono text-[10px] tracking-widest transition-colors"
            aria-label="Exit 3D view"
          >
            <X className="w-4 h-4 text-[#c9a65b]" />
            <span>EXIT 3D</span>
          </button>
        </div>
      </div>

      {/* Unified Collapsible Bottom Control Dock (<= 15% viewport height, solid surface) */}
      <div className="pointer-events-none fixed bottom-3 inset-x-0 z-10 flex justify-center px-3 sm:px-6">
        <div className="pointer-events-auto w-full max-w-6xl rounded-2xl bg-[#070a16]/95 border border-[#c9a65b]/40 shadow-2xl overflow-hidden">
          {/* Compact Top Dock Strip: Realm Switcher + Waypoint Stepper + Hide Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b border-[#f4f1ea]/10">
            <div className="flex flex-wrap items-center gap-1.5">
              {SCENE_TABS.map((tab) => {
                const active = tab.id === sceneId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setAutoTour(false);
                      setSceneId(tab.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] tracking-wider border transition-colors ${
                      active
                        ? 'bg-[#1a2444] border-[#c9a65b] text-[#f4f1ea]'
                        : 'bg-[#0b1024] border-[#f4f1ea]/15 text-[#f4f1ea]/70 hover:text-white hover:border-[#6fb7ff]/50'
                    }`}
                  >
                    <span className="text-[#c9a65b] mr-1">{tab.code}</span>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Guided Waypoint Prev / Chips / Next Stepper */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setAutoTour(false);
                  jumpToWaypoint(activeWaypointIndex - 1);
                }}
                className="p-1 rounded-lg bg-[#0b1024] border border-[#f4f1ea]/20 text-[#f4f1ea]/85 hover:border-[#c9a65b]"
                aria-label="Previous waypoint"
                title="Previous guided waypoint"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1">
                {waypoints.map((wp, idx) => (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => {
                      setAutoTour(false);
                      jumpToWaypoint(idx);
                    }}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] border transition-colors ${
                      activeWaypointIndex === idx
                        ? 'bg-[#13264a] border-[#6fb7ff] text-[#6fb7ff]'
                        : 'bg-[#0b1024] border-[#f4f1ea]/15 text-[#f4f1ea]/65 hover:text-white'
                    }`}
                    title={wp.label}
                  >
                    {wp.code}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setAutoTour(false);
                  jumpToWaypoint(activeWaypointIndex + 1);
                }}
                className="p-1 rounded-lg bg-[#0b1024] border border-[#f4f1ea]/20 text-[#f4f1ea]/85 hover:border-[#c9a65b]"
                aria-label="Next waypoint"
                title="Next guided waypoint"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setDockCollapsed((v) => !v)}
                className="ml-1 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0b1024] border border-[#f4f1ea]/15 text-[#c9a65b] font-mono text-[10px] hover:border-[#c9a65b]"
                aria-label={dockCollapsed ? 'Expand 3D controls' : 'Collapse 3D controls'}
              >
                {dockCollapsed ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>TOUR INFO</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>HIDE</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Waypoint Narrative + Selected Landmark Archive Actions */}
          {!dockCollapsed && (
            <div className="px-3 sm:px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              {/* Active Guided Waypoint Info */}
              {activeWaypoint && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-[#6fb7ff]">
                    <span>WAYPOINT {activeWaypoint.code}/{String(waypoints.length).padStart(2, '0')}</span>
                    <span className="text-[#c9a65b]">• {activeWaypoint.jp}</span>
                  </div>
                  <div className="font-serif text-sm text-[#f4f1ea] truncate">
                    {activeWaypoint.label}
                  </div>
                  <p className="text-[11px] text-[#f4f1ea]/75 truncate m-0">
                    {activeWaypoint.narrative}
                  </p>
                </div>
              )}

              {/* Selected Landmark Brief + Archive Actions */}
              {selectedLandmark && (
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 border-t md:border-t-0 md:border-l border-[#f4f1ea]/15 pt-2 md:pt-0 md:pl-4 shrink-0">
                  <div className="hidden lg:block max-w-[230px] mr-1">
                    <div className="font-mono text-[9px] text-[#c9a65b] truncate">
                      {selectedLandmark.jp}
                    </div>
                    <div className="text-xs font-medium text-[#f4f1ea] truncate">
                      {selectedLandmark.name}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBookmarkClick}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-mono text-[9px] border transition-colors ${
                      isSelectedBookmarked
                        ? 'bg-[#2a2210] border-[#c9a65b] text-[#c9a65b]'
                        : 'bg-[#0b1024] border-[#f4f1ea]/20 text-[#f4f1ea]/85 hover:border-[#c9a65b]'
                    }`}
                    title="Save landmark to your Soul Archive"
                  >
                    <Bookmark className="w-3 h-3" />
                    <span>{isSelectedBookmarked ? 'SAVED' : 'SAVE'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenArchiveModal(selectedLandmark.locationId, sceneId)
                    }
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0b1024] border border-[#6fb7ff]/40 text-[#6fb7ff] hover:bg-[#132242] font-mono text-[9px] transition-colors"
                    title="Record a field note for this 3D landmark"
                  >
                    <FileText className="w-3 h-3" />
                    <span>NOTE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLocationPanel(selectedLandmark.locationId);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1c2848] border border-[#c9a65b]/50 text-[#f4f1ea] hover:bg-[#273660] font-mono text-[9px] transition-colors"
                  >
                    DOSSIER ↗
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
