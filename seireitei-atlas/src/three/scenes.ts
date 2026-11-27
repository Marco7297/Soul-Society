import * as THREE from 'three';
import {
  createArchedBridgeGroup,
  createCitadelKeepGroup,
  createFlaredPagodaRoof,
  createFloatingIslandBedrock,
  createHakutomonGateGroup,
  createJapanesePavilionGroup,
  createKoiPondCourtyardGroup,
  createMaterialBank,
  createReiokyuDiscGroup,
  createSakuraTreeGroup,
  createSokyokuScaffoldGroup,
  createStoneLanternGroup,
  createWallWatchtowerGroup,
  type SceneMaterialBank,
} from './models';
import {
  createCliffRockTextures,
  createContactShadowTexture,
  createCourtyardPaverTextures,
  createKanjiBannerTexture,
  createKoiPondTexture,
  createReiatsuSigilTexture,
  createRoofTileTextures,
  createSekkisekiTextures,
  createSkyCrestTexture,
  createTimberTextures,
} from './textures';

export type SoulSocietySceneId = 'seireitei' | 'sokyoku' | 'reiokyu';

export interface CameraPreset {
  id: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export interface WaypointStop {
  id: string;
  code: string;
  label: string;
  jp: string;
  narrative: string;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  landmarkId?: string;
}

export interface Landmark3DInfo {
  id: string;
  locationId: string;
  name: string;
  jp: string;
  subtitle: string;
  lore: string;
  focusPos: [number, number, number];
  focusTarget: [number, number, number];
}

export interface BuiltSceneState {
  id: SoulSocietySceneId;
  title: string;
  jpTitle: string;
  fogColorNight: number;
  fogColorDawn: number;
  fogDensity: number;
  presets: CameraPreset[];
  waypoints: WaypointStop[];
  landmarks: Landmark3DInfo[];
  interactables: THREE.Object3D[];
  update: (elapsed: number, dt: number) => void;
  dispose: () => void;
}

function createSkyDome(isDawn: boolean): {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
} {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTopColor: { value: new THREE.Color(isDawn ? 0x162954 : 0x05091b) },
      uMidColor: { value: new THREE.Color(isDawn ? 0x3b588c : 0x101c40) },
      uHorizonColor: { value: new THREE.Color(isDawn ? 0xd99b6a : 0x2d325e) },
      uSunGlowColor: { value: new THREE.Color(isDawn ? 0xffe2a6 : 0xf0aa6e) },
      uSunDir: { value: new THREE.Vector3(0.45, 0.14, -0.88).normalize() },
    },
    vertexShader: `
      varying vec3 vWorldDir;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldDir = normalize(worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uTopColor;
      uniform vec3 uMidColor;
      uniform vec3 uHorizonColor;
      uniform vec3 uSunGlowColor;
      uniform vec3 uSunDir;
      varying vec3 vWorldDir;
      void main() {
        vec3 d = normalize(vWorldDir);
        float h = d.y;
        float t1 = smoothstep(-0.12, 0.22, h);
        float t2 = smoothstep(0.22, 0.85, h);
        vec3 col = mix(uHorizonColor, uMidColor, t1);
        col = mix(col, uTopColor, t2);
        float sunAmt = max(0.0, dot(d, uSunDir));
        float halo = pow(sunAmt, 6.0) * 0.55 + pow(sunAmt, 36.0) * 0.45;
        col += uSunGlowColor * halo;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(195, 36, 22), material);
  return { mesh, material };
}

/** Animated sea of clouds deck below the floating island (matching seireitei-home.webp) */
function createSeaOfClouds(isDawn: boolean): {
  group: THREE.Group;
  shaderMat: THREE.ShaderMaterial;
} {
  const group = new THREE.Group();

  const shaderMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uShadowColor: { value: new THREE.Color(isDawn ? 0x28355c : 0x0b122b) },
      uCloudColor: { value: new THREE.Color(isDawn ? 0x7e8eb8 : 0x233362) },
      uSunRimColor: { value: new THREE.Color(isDawn ? 0xf7c588 : 0xd4925e) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorld;
      void main() {
        vUv = uv;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uShadowColor;
      uniform vec3 uCloudColor;
      uniform vec3 uSunRimColor;
      varying vec2 vUv;
      varying vec3 vWorld;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p *= 2.05;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 p = vWorld.xz * 0.032 + vec2(uTime * 0.014, -uTime * 0.008);
        float n = fbm(p);
        float n2 = fbm(p * 1.9 - vec2(uTime * 0.01, uTime * 0.016));
        float density = smoothstep(0.32, 0.85, n * 0.65 + n2 * 0.45);
        float sunGlow = smoothstep(40.0, -70.0, vWorld.z) * 0.65 + smoothstep(-50.0, 50.0, vWorld.x) * 0.25;
        vec3 col = mix(uShadowColor, uCloudColor, density);
        col = mix(col, uSunRimColor, pow(density, 2.0) * clamp(sunGlow, 0.12, 0.82));
        float radialFade = 1.0 - smoothstep(68.0, 132.0, length(vWorld.xz));
        gl_FragColor = vec4(col, radialFade * (0.68 + density * 0.32));
      }
    `,
  });

  const deck = new THREE.Mesh(new THREE.PlaneGeometry(270, 270), shaderMat);
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = -11.8;
  group.add(deck);

  // Volumetric-looking instanced cloud mounds hugging the citadel base and horizon
  const puffCount = 54;
  const puffGeo = new THREE.IcosahedronGeometry(1, 2);
  const puffMat = new THREE.MeshStandardMaterial({
    color: isDawn ? 0xd9cece : 0x5c6d99,
    emissive: isDawn ? 0x4b3d4a : 0x162247,
    emissiveIntensity: 0.45,
    roughness: 0.96,
    metalness: 0.0,
    transparent: true,
    opacity: 0.78,
  });
  const puffs = new THREE.InstancedMesh(puffGeo, puffMat, puffCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < puffCount; i++) {
    const a = (i / puffCount) * Math.PI * 2 + (i % 3) * 0.14;
    const dist = i < 26 ? 25 + (i % 5) * 4.2 : 46 + (i % 7) * 7.5;
    const scaleX = 5.5 + (i % 4) * 2.4;
    const scaleY = 2.0 + (i % 3) * 0.95;
    dummy.position.set(
      Math.cos(a) * dist,
      -9.8 + (i % 4) * 1.15,
      Math.sin(a) * dist
    );
    dummy.scale.set(scaleX, scaleY, scaleX * 0.82);
    dummy.rotation.y = a;
    dummy.updateMatrix();
    puffs.setMatrixAt(i, dummy.matrix);
  }
  puffs.instanceMatrix.needsUpdate = true;
  group.add(puffs);

  return { group, shaderMat };
}

/** Soft additive diagonal sunbeam shafts across the citadel */
function createSunbeamsGroup(isDawn: boolean): {
  group: THREE.Group;
  material: THREE.ShaderMaterial;
} {
  const group = new THREE.Group();
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uColor: { value: new THREE.Color(isDawn ? 0xffdfb0 : 0xa6c4ff) },
      uOpacity: { value: isDawn ? 0.11 : 0.065 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        float edge = sin(vUv.x * 3.14159265);
        float vertical = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.18, vUv.y);
        gl_FragColor = vec4(uColor, edge * vertical * uOpacity);
      }
    `,
  });

  const beams: [number, number, number, number, number][] = [
    [-6, 16, -6, 14, 42],
    [4, 18, -12, 18, 46],
    [14, 15, 2, 12, 38],
  ];
  beams.forEach(([x, y, z, w, h]) => {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
    plane.position.set(x, y, z);
    plane.rotation.z = -0.44;
    plane.rotation.y = 0.35;
    group.add(plane);
  });

  return { group, material };
}

function tagLandmark(obj: THREE.Object3D, info: Landmark3DInfo) {
  obj.userData.landmark = info;
  obj.traverse((child) => {
    child.userData.landmark = info;
  });
}

// Pre-allocated scratch helpers (zero per-frame allocations)
const _dummy = new THREE.Object3D();

export function buildSoulSocietyScene(params: {
  sceneId: SoulSocietySceneId;
  scene: THREE.Scene;
  maxAnisotropy: number;
  isSoftwareGl: boolean;
  isDawn: boolean;
}): BuiltSceneState {
  const { sceneId, scene, maxAnisotropy, isSoftwareGl, isDawn } = params;

  const sekkisekiTex = createSekkisekiTextures(maxAnisotropy);
  const cliffRockTex = createCliffRockTextures(maxAnisotropy);
  const cobaltRoofTex = createRoofTileTextures(maxAnisotropy, 'cobalt');
  const obsidianRoofTex = createRoofTileTextures(maxAnisotropy, 'obsidian');
  const goldRoofTex = createRoofTileTextures(maxAnisotropy, 'gold');
  const timberTex = createTimberTextures(maxAnisotropy, false);
  const darkTimberTex = createTimberTextures(maxAnisotropy, true);
  const paverTex = createCourtyardPaverTextures(maxAnisotropy);
  const koiWaterTex = createKoiPondTexture(maxAnisotropy);
  const seireiteiBannerTex = createKanjiBannerTexture('瀞霊廷', 'cobalt');
  const goteiBannerTex = createKanjiBannerTexture('護廷十三隊', 'ivory');
  const skyCrestTex = createSkyCrestTexture();
  const contactShadowTex = createContactShadowTexture();
  const sigilTex = createReiatsuSigilTexture();

  const bank: SceneMaterialBank = createMaterialBank({
    sekkisekiTex,
    cliffRockTex,
    cobaltRoofTex,
    obsidianRoofTex,
    goldRoofTex,
    timberTex,
    darkTimberTex,
    koiWaterTex,
    seireiteiBannerTex,
    goteiBannerTex,
    contactShadowTex,
  });

  const root = new THREE.Group();
  scene.add(root);

  const sky = createSkyDome(isDawn);
  root.add(sky.mesh);

  const cloudSea = createSeaOfClouds(isDawn);
  root.add(cloudSea.group);

  const sunbeams = createSunbeamsGroup(isDawn);
  root.add(sunbeams.group);

  const particleCount = isSoftwareGl ? 64 : 180;
  const interactables: THREE.Object3D[] = [];
  const landmarks: Landmark3DInfo[] = [];

  let animUpdate: (elapsed: number, dt: number) => void = () => {};

  if (sceneId === 'seireitei') {
    // ------------------------------------------------------------------
    // 1. FLOATING SEIREITEI SKY-ISLAND BEDROCK + STEPPED STONE TERRACES
    // ------------------------------------------------------------------
    const mainIslandBedrock = createFloatingIslandBedrock(
      bank,
      28.5,
      16.5,
      isSoftwareGl ? 22 : 30,
      isSoftwareGl ? 8 : 12
    );
    root.add(mainIslandBedrock);

    const groundMat = new THREE.MeshStandardMaterial({
      map: paverTex.map,
      roughnessMap: paverTex.roughnessMap,
      roughness: 0.84,
      metalness: 0.05,
      color: 0xd0d6e4,
    });
    const basePlateau = new THREE.Mesh(
      new THREE.CylinderGeometry(28.4, 28.6, 0.25, 42),
      groundMat
    );
    basePlateau.position.y = 0.08;
    basePlateau.receiveShadow = true;
    root.add(basePlateau);

    // Mid City Terrace (y = 1.35)
    const midTerrace = new THREE.Mesh(
      new THREE.CylinderGeometry(17.5, 18.8, 1.35, 24),
      bank.sekkiseki
    );
    midTerrace.position.set(0, 0.68, -6.5);
    midTerrace.receiveShadow = true;
    midTerrace.castShadow = true;
    root.add(midTerrace);

    const midTerraceTop = new THREE.Mesh(
      new THREE.CylinderGeometry(17.4, 17.4, 0.08, 24),
      groundMat
    );
    midTerraceTop.position.set(0, 1.36, -6.5);
    midTerraceTop.receiveShadow = true;
    root.add(midTerraceTop);

    // Upper Citadel Keep Terrace (y = 2.75)
    const upperTerrace = new THREE.Mesh(
      new THREE.CylinderGeometry(10.5, 11.6, 1.45, 8),
      bank.sekkiseki
    );
    upperTerrace.position.set(0, 2.08, -11.5);
    upperTerrace.rotation.y = Math.PI / 8;
    upperTerrace.receiveShadow = true;
    upperTerrace.castShadow = true;
    root.add(upperTerrace);

    // Ceremonial Plaza Sigil
    const sigilPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(11.5, 11.5),
      new THREE.MeshBasicMaterial({
        map: sigilTex,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      })
    );
    sigilPlane.rotation.x = -Math.PI / 2;
    sigilPlane.position.set(0, 0.23, 11.0);
    root.add(sigilPlane);

    // ------------------------------------------------------------------
    // 2. LOWER-RIGHT OUTPOST ROCK & ARCHED APPROACH BRIDGE TO HAKUTŌMON
    // ------------------------------------------------------------------
    const outpostGroup = new THREE.Group();
    outpostGroup.position.set(6.4, 0.0, 31.2);
    outpostGroup.rotation.y = 0.26;
    const outpostBedrock = createFloatingIslandBedrock(bank, 5.2, 8.8, 14, 6);
    outpostGroup.add(outpostBedrock);

    const outpostPlatform = new THREE.Mesh(
      new THREE.CylinderGeometry(5.1, 5.3, 0.4, 16),
      bank.sekkiseki
    );
    outpostPlatform.position.y = 0.2;
    outpostPlatform.receiveShadow = true;
    outpostGroup.add(outpostPlatform);

    // Crenellated outpost watch pavilion
    const outpostPavilion = createJapanesePavilionGroup(bank, {
      width: 3.4,
      depth: 3.0,
      tiers: 1,
      roofMat: bank.cobaltRoof,
    });
    outpostPavilion.position.set(1.3, 0.35, 1.2);
    outpostGroup.add(outpostPavilion);
    root.add(outpostGroup);

    const approachBridge = createArchedBridgeGroup(bank, 11.2, 3.6);
    approachBridge.position.set(4.5, 0.15, 25.4);
    approachBridge.rotation.y = 0.24;
    root.add(approachBridge);

    // ------------------------------------------------------------------
    // 3. CLICKABLE HERO LANDMARKS
    // ------------------------------------------------------------------
    const hqInfo: Landmark3DInfo = {
      id: 'first-division-hq',
      locationId: 'first-division-barracks-captains-meeting-hall',
      name: 'Central Seireitei Keep (1st Division HQ)',
      jp: '瀞霊廷本宮 • 一番隊舎',
      subtitle: 'Supreme Command Citadel',
      lore: 'Monumental four-tier Sekkiseki keep crowned with golden shachihoko finials and the vertical 瀞霊廷 crest banner overlooking all 13 divisions.',
      focusPos: [5.8, 7.6, 5.2],
      focusTarget: [0, 7.2, -11.5],
    };
    const centralKeep = createCitadelKeepGroup(bank);
    centralKeep.position.set(0, 2.75, -11.5);
    centralKeep.rotation.y = -0.18;
    tagLandmark(centralKeep, hqInfo);
    root.add(centralKeep);
    interactables.push(centralKeep);
    landmarks.push(hqInfo);

    const gateInfo: Landmark3DInfo = {
      id: 'hakutomon-gate',
      locationId: 'seireitei-outer-wall-four-gates',
      name: 'Hakutōmon Gate & Arched Bridge',
      jp: '白道門 • 橋頭堡',
      subtitle: 'West White Way Fortress Threshold',
      lore: 'Guarded Sekkiseki arched bridge and fortress gatehouse draped in royal 瀞霊廷 and 護廷十三隊 banners above the cloud abyss.',
      focusPos: [12.5, 4.8, 31.5],
      focusTarget: [3.2, 2.6, 20.0],
    };
    const gate = createHakutomonGateGroup(bank);
    gate.position.set(2.5, 0.15, 19.6);
    gate.rotation.y = 0.24;
    tagLandmark(gate, gateInfo);
    root.add(gate);
    interactables.push(gate);
    landmarks.push(gateInfo);

    const courtyardInfo: Landmark3DInfo = {
      id: 'sakura-courtyard',
      locationId: 'sixth-division-barracks',
      name: 'Sakura Promenade & Koi Courtyard',
      jp: '桜並木 • 鯉池中庭',
      subtitle: 'Senbonzakura Garden Terrace',
      lore: 'Reflective spiritual koi waters crossed by vermilion footbridges and framed by blooming Seireitei cherry blossoms.',
      focusPos: [-9.2, 4.4, 12.2],
      focusTarget: [0, 1.8, 3.0],
    };
    const koiPond = createKoiPondCourtyardGroup(bank, 9.4, 6.2);
    koiPond.position.set(0, 0.18, 4.0);
    tagLandmark(koiPond, courtyardInfo);
    root.add(koiPond);
    interactables.push(koiPond);
    landmarks.push(courtyardInfo);

    const leftWingInfo: Landmark3DInfo = {
      id: 'kuchiki-quarter',
      locationId: 'sixth-division-barracks',
      name: '6th Division & Kuchiki Manor Wing',
      jp: '六番隊 • 朽木邸翼',
      subtitle: 'Noble Discipline & Heritage',
      lore: 'Cobalt-tiled aristocratic Gotei compound commanding the western terraced ridge above the drifting spirit stream.',
      focusPos: [-18.5, 8.2, 6.5],
      focusTarget: [-12.5, 3.5, -4.5],
    };
    const leftWing = createJapanesePavilionGroup(bank, {
      width: 6.4,
      depth: 5.2,
      tiers: 2,
      roofMat: bank.cobaltRoof,
    });
    leftWing.position.set(-12.5, 1.35, -4.5);
    leftWing.rotation.y = 0.42;
    tagLandmark(leftWing, leftWingInfo);
    root.add(leftWing);
    interactables.push(leftWing);
    landmarks.push(leftWingInfo);

    const rightWingInfo: Landmark3DInfo = {
      id: 'archives-wing',
      locationId: 'shino-academy',
      name: 'Great Spirit Archives & Kidō Hall',
      jp: '真央霊術院 • 大文庫',
      subtitle: 'Shin’ō & Zanpakutō Repository',
      lore: 'Eastern stepped pavilion storing centuries of Kidō treatises, Zanpakutō lineages, and Soul Society historical decrees.',
      focusPos: [18.5, 8.2, 6.5],
      focusTarget: [12.5, 3.5, -4.5],
    };
    const rightWing = createJapanesePavilionGroup(bank, {
      width: 6.4,
      depth: 5.2,
      tiers: 2,
      roofMat: bank.cobaltRoof,
    });
    rightWing.position.set(12.5, 1.35, -4.5);
    rightWing.rotation.y = -0.42;
    tagLandmark(rightWing, rightWingInfo);
    root.add(rightWing);
    interactables.push(rightWing);
    landmarks.push(rightWingInfo);

    // ------------------------------------------------------------------
    // 4. OUTER SEKKISEKI FORTIFICATION WALL + CORNER WATCHTOWERS
    // ------------------------------------------------------------------
    const wallCount = 32;
    const wallSegmentGeo = new THREE.BoxGeometry(3.4, 3.2, 1.25);
    const instancedWall = new THREE.InstancedMesh(
      wallSegmentGeo,
      bank.sekkiseki,
      wallCount
    );
    instancedWall.castShadow = true;
    instancedWall.receiveShadow = true;

    const merlonGeo = new THREE.BoxGeometry(1.1, 0.75, 1.35);
    const instancedMerlons = new THREE.InstancedMesh(
      merlonGeo,
      bank.sekkiseki,
      wallCount * 2
    );
    instancedMerlons.castShadow = true;

    let wIdx = 0;
    let mIdx = 0;
    for (let i = 0; i < wallCount; i++) {
      const angle = (i / wallCount) * Math.PI * 2;
      // Leave clean gate gap aligned with Hakutōmon Gate (~angle 0.14 rad)
      const relAngle = Math.atan2(Math.sin(angle - 0.12), Math.cos(angle - 0.12));
      if (Math.abs(relAngle) < 0.28) {
        _dummy.position.set(0, -40, 0);
        _dummy.scale.setScalar(0.01);
        _dummy.updateMatrix();
        instancedWall.setMatrixAt(wIdx++, _dummy.matrix);
        instancedMerlons.setMatrixAt(mIdx++, _dummy.matrix);
        instancedMerlons.setMatrixAt(mIdx++, _dummy.matrix);
        continue;
      }

      const radius = 26.8;
      const wx = Math.sin(angle) * radius;
      const wz = Math.cos(angle) * radius;
      _dummy.position.set(wx, 1.65, wz);
      _dummy.rotation.set(0, angle, 0);
      _dummy.scale.setScalar(1);
      _dummy.updateMatrix();
      instancedWall.setMatrixAt(wIdx++, _dummy.matrix);

      [-0.85, 0.85].forEach((offset) => {
        const perpX = Math.cos(angle) * offset;
        const perpZ = -Math.sin(angle) * offset;
        _dummy.position.set(wx + perpX, 3.55, wz + perpZ);
        _dummy.rotation.set(0, angle, 0);
        _dummy.scale.setScalar(1);
        _dummy.updateMatrix();
        instancedMerlons.setMatrixAt(mIdx++, _dummy.matrix);
      });
    }
    instancedWall.instanceMatrix.needsUpdate = true;
    instancedMerlons.instanceMatrix.needsUpdate = true;
    root.add(instancedWall);
    root.add(instancedMerlons);

    // Six Perimeter Bastion Watchtowers (faithful to seireitei-home.webp silhouette)
    const watchAngles = [0.75, 1.55, 2.45, 3.65, 4.65, 5.55];
    watchAngles.forEach((a) => {
      const wt = createWallWatchtowerGroup(bank);
      wt.position.set(Math.sin(a) * 26.6, 0.12, Math.cos(a) * 26.6);
      wt.rotation.y = a;
      root.add(wt);
    });

    // ------------------------------------------------------------------
    // 5. DENSE INSTANCED INNER GOTEI METROPOLIS (BARRACKS & PAGODAS)
    // ------------------------------------------------------------------
    const districtSpecs: { x: number; y: number; z: number; rot: number; sx: number; sy: number; sz: number }[] = [
      // Inner curved barracks avenues flanking courtyard & mid terrace
      { x: -16.5, y: 0.2, z: 8.5, rot: 0.45, sx: 4.2, sy: 2.2, sz: 3.4 },
      { x: -19.0, y: 0.2, z: 1.5, rot: 0.25, sx: 4.6, sy: 2.6, sz: 3.6 },
      { x: -19.5, y: 0.2, z: -6.5, rot: 0.1, sx: 4.8, sy: 2.5, sz: 3.8 },
      { x: -15.5, y: 0.2, z: -14.5, rot: -0.35, sx: 4.4, sy: 2.4, sz: 3.6 },
      { x: 16.5, y: 0.2, z: 8.5, rot: -0.45, sx: 4.2, sy: 2.2, sz: 3.4 },
      { x: 19.2, y: 0.2, z: 1.0, rot: -0.22, sx: 4.5, sy: 2.5, sz: 3.6 },
      { x: 19.6, y: 0.2, z: -7.0, rot: -0.12, sx: 4.8, sy: 2.6, sz: 3.8 },
      { x: 15.8, y: 0.2, z: -15.0, rot: 0.35, sx: 4.3, sy: 2.4, sz: 3.6 },
      // Forward residential/academy districts
      { x: -10.5, y: 0.2, z: 15.5, rot: 0.65, sx: 3.8, sy: 2.0, sz: 3.2 },
      { x: -14.5, y: 0.2, z: 13.0, rot: 0.55, sx: 3.6, sy: 2.1, sz: 3.0 },
      { x: 13.0, y: 0.2, z: 14.5, rot: -0.55, sx: 3.8, sy: 2.1, sz: 3.2 },
      { x: 17.0, y: 0.2, z: 12.2, rot: -0.62, sx: 3.5, sy: 1.9, sz: 3.0 },
      // Mid-terrace compound wings flanking Central Keep
      { x: -7.5, y: 1.4, z: -15.2, rot: 0.2, sx: 4.0, sy: 2.6, sz: 3.4 },
      { x: 7.5, y: 1.4, z: -15.2, rot: -0.2, sx: 4.0, sy: 2.6, sz: 3.4 },
      { x: -11.0, y: 1.4, z: -10.5, rot: 0.35, sx: 3.6, sy: 2.3, sz: 3.2 },
      { x: 11.0, y: 1.4, z: -10.5, rot: -0.35, sx: 3.6, sy: 2.3, sz: 3.2 },
      { x: 0.0, y: 1.4, z: -20.5, rot: 0.0, sx: 5.2, sy: 2.9, sz: 3.8 },
      { x: -6.5, y: 0.2, z: -21.5, rot: 0.18, sx: 4.4, sy: 2.4, sz: 3.4 },
      { x: 6.5, y: 0.2, z: -21.5, rot: -0.18, sx: 4.4, sy: 2.4, sz: 3.4 },
    ];

    const bodyGeo = new THREE.BoxGeometry(1, 1, 1);
    const roofProxy = createFlaredPagodaRoof(1.28, 1.28, 0.52, bank.cobaltRoof);
    const roofGeo = roofProxy.geometry;

    const cityBodies = new THREE.InstancedMesh(
      bodyGeo,
      bank.plaster,
      districtSpecs.length
    );
    cityBodies.castShadow = true;
    cityBodies.receiveShadow = true;

    const cityRoofs = new THREE.InstancedMesh(
      roofGeo,
      bank.cobaltRoof,
      districtSpecs.length
    );
    cityRoofs.castShadow = true;
    cityRoofs.receiveShadow = true;

    districtSpecs.forEach((d, idx) => {
      _dummy.position.set(d.x, d.y + d.sy / 2, d.z);
      _dummy.rotation.set(0, d.rot, 0);
      _dummy.scale.set(d.sx, d.sy, d.sz);
      _dummy.updateMatrix();
      cityBodies.setMatrixAt(idx, _dummy.matrix);

      _dummy.position.set(d.x, d.y + d.sy - 0.05, d.z);
      _dummy.rotation.set(0, d.rot, 0);
      _dummy.scale.set(d.sx, d.sy * 1.15, d.sz);
      _dummy.updateMatrix();
      cityRoofs.setMatrixAt(idx, _dummy.matrix);
    });
    cityBodies.instanceMatrix.needsUpdate = true;
    cityRoofs.instanceMatrix.needsUpdate = true;
    root.add(cityBodies);
    root.add(cityRoofs);

    // ------------------------------------------------------------------
    // 6. BLOOMING SAKURA GROVES & COURTYARD STONE LANTERNS
    // ------------------------------------------------------------------
    const sakuraCoords: [number, number, number, number][] = [
      [-7.5, 0.2, 7.2, 1.15],
      [-8.8, 0.2, 2.2, 1.0],
      [-7.0, 0.2, -1.5, 0.95],
      [7.6, 0.2, 7.4, 1.1],
      [8.8, 0.2, 2.4, 1.05],
      [7.2, 0.2, -1.2, 0.9],
      [-5.2, 0.2, 14.5, 0.92],
      [9.5, 0.2, 14.8, 0.95],
      [-14.2, 1.38, 1.2, 1.05],
      [14.2, 1.38, 1.2, 1.05],
      [3.8, 0.3, 30.2, 0.85],
    ];
    sakuraCoords.forEach(([x, y, z, sc]) => {
      const tree = createSakuraTreeGroup(bank, sc);
      tree.position.set(x, y, z);
      root.add(tree);
    });

    [-2.8, 2.8].forEach((x) => {
      [10.2, 14.8, -0.5].forEach((z) => {
        const lantern = createStoneLanternGroup(bank);
        lantern.position.set(x, 0.2, z);
        root.add(lantern);
      });
    });

    // ------------------------------------------------------------------
    // 7. ASCENDING GOLDEN REISHI RIBBON + CLIFF WATERFALLS + SKY CREST + DISTANT ISLE
    // ------------------------------------------------------------------
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-25, -13, 10),
      new THREE.Vector3(-28, -5, 6),
      new THREE.Vector3(-24, 2, -2),
      new THREE.Vector3(-27, 9, -8),
      new THREE.Vector3(-21, 17, -14),
    ]);
    const ribbonMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xffd782) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          float pulse = 0.55 + 0.45 * sin(vUv.x * 18.0 - uTime * 3.2);
          float ends = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
          gl_FragColor = vec4(uColor, pulse * ends * 0.68);
        }
      `,
    });
    const reishiRibbon = new THREE.Mesh(
      new THREE.TubeGeometry(ribbonCurve, 44, 0.42, 8, false),
      ribbonMat
    );
    root.add(reishiRibbon);

    // Cliffside Spirit Waterfalls pouring into clouds (right cliff edges)
    const waterfallMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          float flow = fract(vUv.y * 4.0 + uTime * 1.35);
          float streak = sin(vUv.x * 26.0) * 0.15 + smoothstep(0.0, 0.45, flow) * 0.45;
          float edgeX = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
          float edgeY = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
          vec3 col = mix(vec3(0.45, 0.76, 1.0), vec3(0.92, 0.98, 1.0), streak);
          gl_FragColor = vec4(col, edgeX * edgeY * (0.52 + streak * 0.42));
        }
      `,
    });
    [
      { x: 24.5, z: 12.8, rotY: 1.05, w: 2.2 },
      { x: 27.6, z: -2.0, rotY: 1.55, w: 2.6 },
    ].forEach((wf) => {
      const fall = new THREE.Mesh(new THREE.PlaneGeometry(wf.w, 12.0), waterfallMat);
      fall.position.set(wf.x, -6.1, wf.z);
      fall.rotation.y = wf.rotY;
      root.add(fall);
    });

    // Distant Floating Rock Silhouette Isles + Upper-Right Crescent Sky Emblem
    const distantIsle = createFloatingIslandBedrock(bank, 6.2, 8.5, 10, 4);
    distantIsle.position.set(-48, 8.5, -52);
    root.add(distantIsle);
    const distantShrine = createJapanesePavilionGroup(bank, {
      width: 3.2,
      depth: 2.8,
      tiers: 2,
      roofMat: bank.cobaltRoof,
    });
    distantShrine.position.set(-48, 8.5, -52);
    root.add(distantShrine);

    const skyCrest = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 18),
      new THREE.MeshBasicMaterial({
        map: skyCrestTex,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      })
    );
    skyCrest.position.set(42, 32, -24);
    skyCrest.lookAt(-22, 10.8, 33);
    root.add(skyCrest);

    // ------------------------------------------------------------------
    // 8. INSTANCED DRIFTING SENBONZAKURA PETALS
    // ------------------------------------------------------------------
    const petalGeo = new THREE.PlaneGeometry(0.24, 0.15);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xffb7cf,
      emissive: 0x7c2d50,
      emissiveIntensity: 0.42,
      roughness: 0.65,
      side: THREE.DoubleSide,
    });
    const petals = new THREE.InstancedMesh(petalGeo, petalMat, particleCount);
    const petalSeeds = Array.from({ length: particleCount }, (_, i) => ({
      x: (((i * 73) % 100) / 100 - 0.5) * 44,
      y: 0.8 + (((i * 41) % 100) / 100) * 14,
      z: (((i * 59) % 100) / 100 - 0.5) * 44,
      speed: 0.42 + (i % 5) * 0.14,
      sway: 0.65 + (i % 7) * 0.22,
      phase: i * 0.7,
    }));
    root.add(petals);

    animUpdate = (elapsed) => {
      cloudSea.shaderMat.uniforms.uTime.value = elapsed;
      ribbonMat.uniforms.uTime.value = elapsed;
      waterfallMat.uniforms.uTime.value = elapsed;
      skyCrest.rotation.z = Math.sin(elapsed * 0.25) * 0.04;

      for (let i = 0; i < particleCount; i++) {
        const p = petalSeeds[i];
        const y = (((p.y - elapsed * p.speed) % 14) + 14) % 14 + 0.4;
        const x = p.x + Math.sin(elapsed * 0.85 + p.phase) * p.sway;
        const z = p.z + Math.cos(elapsed * 0.65 + p.phase) * p.sway;
        _dummy.position.set(x, y, z);
        _dummy.rotation.set(
          elapsed * 0.8 + p.phase,
          elapsed * 1.1 + p.phase,
          elapsed * 0.5
        );
        _dummy.scale.setScalar(1);
        _dummy.updateMatrix();
        petals.setMatrixAt(i, _dummy.matrix);
      }
      petals.instanceMatrix.needsUpdate = true;
    };

    const waypoints: WaypointStop[] = [
      {
        id: 'overview',
        code: '01',
        label: 'HERO PANORAMA',
        jp: '瀞霊廷浮遊全景',
        narrative:
          'Floating Sekkiseki citadel suspended above the twilight Sea of Clouds, mirroring the primary hero composition.',
        position: [-22, 10.8, 33],
        target: [0, 3.5, -1],
        fov: 45,
        landmarkId: 'first-division-hq',
      },
      {
        id: 'gate-bridge',
        code: '02',
        label: 'ARCHED BRIDGE & GATE',
        jp: '白道門・石造連絡橋',
        narrative:
          'Arched Sekkiseki causeway spanning the cloud drop-off from the southern outpost bastion into Hakutōmon Gate.',
        position: [12.5, 4.8, 31.5],
        target: [3.2, 2.6, 20.0],
        fov: 42,
        landmarkId: 'hakutomon-gate',
      },
      {
        id: 'sakura-koi',
        code: '03',
        label: 'SAKURA & KOI COURTYARD',
        jp: '桜並木・鯉池中庭',
        narrative:
          'Senbonzakura petals drift across arched crimson footbridges and illuminated spiritual koi waters.',
        position: [-9.2, 4.4, 12.2],
        target: [0, 1.8, 3.0],
        fov: 40,
        landmarkId: 'sakura-courtyard',
      },
      {
        id: 'gotei-districts',
        code: '04',
        label: 'GOTEI METROPOLIS',
        jp: '護廷十三隊屋敷群',
        narrative:
          'Stepped avenues of cobalt-roofed Gotei barracks and Kuchiki noble wings climbing toward the high keep.',
        position: [-18.5, 8.2, 6.5],
        target: [-5.5, 3.4, -3.5],
        fov: 44,
        landmarkId: 'kuchiki-quarter',
      },
      {
        id: 'central-keep',
        code: '05',
        label: 'CENTRAL CITADEL KEEP',
        jp: '一番隊本宮・瀞霊廷旗',
        narrative:
          'Four-tier First Division tower crowned with golden shachihoko finials and the illuminated vertical 瀞霊廷 crest.',
        position: [5.8, 7.6, 5.2],
        target: [0, 7.2, -11.5],
        fov: 40,
        landmarkId: 'first-division-hq',
      },
      {
        id: 'zenith-clouds',
        code: '06',
        label: 'ZENITH CLOUD SURVEY',
        jp: '雲海眺望・月紋章',
        narrative:
          'High orbital sweep revealing the ascending golden Reishi stream, cliff waterfalls, and celestial sky sigil.',
        position: [0, 34, 28],
        target: [0, 1.0, 0],
        fov: 48,
        landmarkId: 'archives-wing',
      },
    ];

    return {
      id: sceneId,
      title: 'Floating Seireitei Citadel',
      jpTitle: '瀞霊廷全景 • 浮遊霊都',
      fogColorNight: 0x0b132b,
      fogColorDawn: 0x3b4970,
      fogDensity: 0.0085,
      waypoints,
      presets: waypoints.map((w) => ({
        id: w.id,
        label: w.label,
        position: w.position,
        target: w.target,
        fov: w.fov,
      })),
      landmarks,
      interactables,
      update: animUpdate,
      dispose: () => {
        scene.remove(root);
        sky.material.dispose();
        cloudSea.shaderMat.dispose();
        sunbeams.material.dispose();
        ribbonMat.dispose();
        waterfallMat.dispose();
        skyCrestTex.dispose();
        sigilTex.dispose();
        koiWaterTex.dispose();
        seireiteiBannerTex.dispose();
        goteiBannerTex.dispose();
        paverTex.map.dispose();
        paverTex.bumpMap.dispose();
        cliffRockTex.map.dispose();
        cliffRockTex.bumpMap.dispose();
        sekkisekiTex.map.dispose();
        sekkisekiTex.bumpMap.dispose();
        cobaltRoofTex.map.dispose();
        cobaltRoofTex.bumpMap.dispose();
        obsidianRoofTex.map.dispose();
        obsidianRoofTex.bumpMap.dispose();
        goldRoofTex.map.dispose();
        goldRoofTex.bumpMap.dispose();
        timberTex.map.dispose();
        timberTex.bumpMap.dispose();
        darkTimberTex.map.dispose();
        darkTimberTex.bumpMap.dispose();
        contactShadowTex.dispose();
      },
    };
  }

  if (sceneId === 'sokyoku') {
    const mesaIsland = createFloatingIslandBedrock(bank, 15.8, 12.0, 16, 8);
    root.add(mesaIsland);

    const plateauCap = new THREE.Mesh(
      new THREE.CylinderGeometry(13.6, 14.2, 0.45, 24),
      bank.sekkiseki
    );
    plateauCap.position.y = -0.22;
    plateauCap.receiveShadow = true;
    root.add(plateauCap);

    const seal = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      new THREE.MeshBasicMaterial({
        map: sigilTex,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      })
    );
    seal.rotation.x = -Math.PI / 2;
    seal.position.y = 0.02;
    root.add(seal);

    const sokyokuInfo: Landmark3DInfo = {
      id: 'sokyoku-scaffold',
      locationId: 'sokyoku-hill',
      name: 'Sōkyoku Execution Scaffold',
      jp: '双殛 • 毀鷇王',
      subtitle: 'Power of One Million Zanpakutō',
      lore: 'Where Rukia Kuchiki’s execution took place and Ichigo Kurosaki blocked the fiery Phoenix Halberd barehanded.',
      focusPos: [8.5, 7.2, 12.5],
      focusTarget: [0, 5.4, 0],
    };
    const { group: scaffold, halberdGroup, emberRing } =
      createSokyokuScaffoldGroup(bank);
    tagLandmark(scaffold, sokyokuInfo);
    root.add(scaffold);
    interactables.push(scaffold);
    landmarks.push(sokyokuInfo);

    const bridgeInfo: Landmark3DInfo = {
      id: 'senzaikyu-bridge',
      locationId: 'senzaikyu',
      name: 'Senzaikyū Sky Bridge',
      jp: '懺罪宮連絡橋',
      subtitle: 'White Tower of Repentance Link',
      lore: 'Elevated Sekkiseki causeway spanning the gorge between the white confinement tower and the execution mesa.',
      focusPos: [8.0, 4.5, 22.0],
      focusTarget: [0, 0.5, 16.0],
    };
    const bridgeGroup = createArchedBridgeGroup(bank, 14.5, 3.8);
    bridgeGroup.position.set(0, 0.0, 19.5);
    tagLandmark(bridgeGroup, bridgeInfo);
    root.add(bridgeGroup);
    interactables.push(bridgeGroup);
    landmarks.push(bridgeInfo);

    const towerInfo: Landmark3DInfo = {
      id: 'senzaikyu-tower',
      locationId: 'senzaikyu',
      name: 'Senzaikyū Confinement Tower',
      jp: '懺罪宮',
      subtitle: 'High Sekkiseki Sanctuary',
      lore: 'White high-security tower overlooking Sōkyoku Valley where condemned Soul Reapers await verdict.',
      focusPos: [-9.0, 8.5, 34.0],
      focusTarget: [0, 5.0, 29.0],
    };
    const towerBedrock = createFloatingIslandBedrock(bank, 6.2, 9.5, 12, 5);
    towerBedrock.position.set(0, 0, 29.5);
    root.add(towerBedrock);

    const tower = createJapanesePavilionGroup(bank, {
      width: 5.4,
      depth: 5.4,
      tiers: 3,
      roofMat: bank.obsidianRoof,
    });
    tower.position.set(0, 0, 29.5);
    tagLandmark(tower, towerInfo);
    root.add(tower);
    interactables.push(tower);
    landmarks.push(towerInfo);

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.35;
      const lantern = createStoneLanternGroup(bank);
      lantern.position.set(Math.cos(a) * 10.6, 0, Math.sin(a) * 10.6);
      root.add(lantern);
    }

    const emberGeo = new THREE.OctahedronGeometry(0.14, 0);
    const emberMat = new THREE.MeshStandardMaterial({
      color: 0xffaa44,
      emissive: 0xff5500,
      emissiveIntensity: 1.9,
      roughness: 0.25,
    });
    const embers = new THREE.InstancedMesh(emberGeo, emberMat, particleCount);
    const emberSeeds = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i * 2.39996) % (Math.PI * 2),
      radius: 1.2 + ((i * 37) % 100) / 15,
      heightOffset: ((i * 53) % 100) / 100,
      speed: 0.65 + (i % 6) * 0.16,
      scale: 0.55 + (i % 4) * 0.28,
    }));
    root.add(embers);

    animUpdate = (elapsed) => {
      cloudSea.shaderMat.uniforms.uTime.value = elapsed;
      halberdGroup.position.y = 6.3 + Math.sin(elapsed * 1.4) * 0.22;
      emberRing.rotation.z = elapsed * 0.65;
      emberRing.scale.setScalar(1 + Math.sin(elapsed * 2.4) * 0.05);

      for (let i = 0; i < particleCount; i++) {
        const e = emberSeeds[i];
        const y = ((e.heightOffset * 14 + elapsed * e.speed) % 14) + 0.3;
        const a = e.angle + elapsed * 0.22;
        _dummy.position.set(
          Math.cos(a) * e.radius,
          y,
          Math.sin(a) * e.radius
        );
        _dummy.rotation.set(elapsed + i, elapsed * 1.3, 0);
        _dummy.scale.setScalar(e.scale * (1 - y / 16));
        _dummy.updateMatrix();
        embers.setMatrixAt(i, _dummy.matrix);
      }
      embers.instanceMatrix.needsUpdate = true;
    };

    const waypoints: WaypointStop[] = [
      {
        id: 'overview',
        code: '01',
        label: 'MESA OVERVIEW',
        jp: '双殛の丘全景',
        narrative:
          'Floating execution plateau crowned by the twin vermilion Torii pillars above the sea of clouds.',
        position: [15.5, 11.5, 18.5],
        target: [0, 4.8, 1.5],
        fov: 46,
        landmarkId: 'sokyoku-scaffold',
      },
      {
        id: 'halberd',
        code: '02',
        label: 'PHOENIX HALBERD',
        jp: '毀鷇王（きこうおう）',
        narrative:
          'Close view of the blazing Kikōō execution halberd suspended by sacred shimenawa rope.',
        position: [6.2, 6.0, 9.8],
        target: [0, 5.2, 0],
        fov: 42,
        landmarkId: 'sokyoku-scaffold',
      },
      {
        id: 'bridge',
        code: '03',
        label: 'SENZAIKYŪ BRIDGE',
        jp: '懺罪宮連絡橋',
        narrative:
          'Arched Sekkiseki sky bridge spanning between Sōkyoku Mesa and the white Repentance Tower.',
        position: [11.5, 5.2, 23.0],
        target: [0, 1.8, 17.5],
        fov: 44,
        landmarkId: 'senzaikyu-bridge',
      },
      {
        id: 'low',
        code: '04',
        label: 'DRAMATIC LOW ANGLE',
        jp: '執行台見上げ',
        narrative:
          'Ground-level vista beneath the towering sacred crossbeams as rising phoenix embers illuminate the sky.',
        position: [-6.5, 1.8, 9.2],
        target: [0, 7.2, 0],
        fov: 48,
        landmarkId: 'senzaikyu-tower',
      },
    ];

    return {
      id: sceneId,
      title: 'Sōkyoku Hill Execution Mesa',
      jpTitle: '双殛の丘 • 懺罪宮',
      fogColorNight: 0x160e20,
      fogColorDawn: 0x453b52,
      fogDensity: 0.01,
      waypoints,
      presets: waypoints.map((w) => ({
        id: w.id,
        label: w.label,
        position: w.position,
        target: w.target,
        fov: w.fov,
      })),
      landmarks,
      interactables,
      update: animUpdate,
      dispose: () => {
        scene.remove(root);
        sky.material.dispose();
        cloudSea.shaderMat.dispose();
        sunbeams.material.dispose();
        skyCrestTex.dispose();
        sigilTex.dispose();
        koiWaterTex.dispose();
        seireiteiBannerTex.dispose();
        goteiBannerTex.dispose();
        paverTex.map.dispose();
        paverTex.bumpMap.dispose();
        cliffRockTex.map.dispose();
        cliffRockTex.bumpMap.dispose();
        sekkisekiTex.map.dispose();
        sekkisekiTex.bumpMap.dispose();
        cobaltRoofTex.map.dispose();
        cobaltRoofTex.bumpMap.dispose();
        obsidianRoofTex.map.dispose();
        obsidianRoofTex.bumpMap.dispose();
        goldRoofTex.map.dispose();
        goldRoofTex.bumpMap.dispose();
        timberTex.map.dispose();
        timberTex.bumpMap.dispose();
        darkTimberTex.map.dispose();
        darkTimberTex.bumpMap.dispose();
        contactShadowTex.dispose();
      },
    };
  }

  // Scene 03: Reiōkyū (Soul King Palace & Five Floating Squad Zero Cities)
  const centralInfo: Landmark3DInfo = {
    id: 'soul-king-tower',
    locationId: 'reiokyu-soul-king-palace',
    name: 'Soul King Great Palace (Reiōkyū)',
    jp: '霊王宮 • 霊王大内裏',
    subtitle: 'Linchpin of the Three Realms',
    lore: 'The transcendent golden-ivory sanctum suspended above Soul Society where the Soul King anchors the balance of all worlds.',
    focusPos: [11.5, 9.5, 13.5],
    focusTarget: [0, 3.8, 0],
  };
  const centralDisc = createReiokyuDiscGroup(bank, 6.2, true);
  tagLandmark(centralDisc, centralInfo);
  root.add(centralDisc);
  interactables.push(centralDisc);
  landmarks.push(centralInfo);

  const outerCitySpecs = [
    {
      id: 'kirinden',
      name: 'Kirinden • Tenjirō Sanctuary',
      jp: '麒麟殿 (Kirinden)',
      subtitle: 'White Bone & Blood Pond Hot Springs',
      lore: 'Home of Squad Zero’s Tenjirō Kirinji, restoring shattered Reiatsu through boiling spiritual springs.',
    },
    {
      id: 'gatonden',
      name: 'Gatonden • Kirio Sanctuary',
      jp: '臥豚殿 (Gatonden)',
      subtitle: 'Ruler of Grain & Soul Cuisine',
      lore: 'Palace of Kirio Hikifune where dense Mod-Soul cuisine elevates Shinigami spirit cores beyond their limits.',
    },
    {
      id: 'hooden',
      name: 'Hōōden • Ōetsu Forge',
      jp: '鳳凰殿 (Hōōden)',
      subtitle: 'Creator of the Zanpakutō',
      lore: 'Where Ōetsu Nimaiya forges every Asauchi blade—and forged Ichigo Kurosaki’s true dual Zangetsu.',
    },
    {
      id: 'senjumaru',
      name: 'Great Weave Pavilion',
      jp: '千手丸御殿 (Shutara Palace)',
      subtitle: 'Senjumaru Shutara’s Loom',
      lore: 'Where Ōken royal garments are woven from the spiritual bones and hair of the Royal Guard.',
    },
    {
      id: 'hyosube',
      name: 'Hyōsube Sanctuary',
      jp: '兵主部御殿 (Ichibē Sanctum)',
      subtitle: 'Monk Who Calls the Real Name',
      lore: 'Domain of Ichibē Hyōsube, custodian of all true names across Soul Society and wielder of Ichimonji.',
    },
  ];

  const outerDiscs: { group: THREE.Group; baseY: number; phase: number }[] = [];
  const bridgeMat = new THREE.MeshStandardMaterial({
    color: 0xa6d8ff,
    emissive: 0x6fb7ff,
    emissiveIntensity: 1.15,
    roughness: 0.18,
    metalness: 0.25,
    transparent: true,
    opacity: 0.88,
  });

  outerCitySpecs.forEach((spec, i) => {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const dist = 16.5;
    const px = Math.cos(angle) * dist;
    const pz = Math.sin(angle) * dist;
    const py = i % 2 === 0 ? 1.4 : -0.8;

    const info: Landmark3DInfo = {
      id: spec.id,
      locationId: 'reiokyu-soul-king-palace',
      name: spec.name,
      jp: spec.jp,
      subtitle: spec.subtitle,
      lore: spec.lore,
      focusPos: [px * 1.45, py + 6.5, pz * 1.45],
      focusTarget: [px, py + 1.8, pz],
    };

    const disc = createReiokyuDiscGroup(bank, 3.6, false);
    disc.position.set(px, py, pz);
    disc.rotation.y = -angle + Math.PI / 2;
    tagLandmark(disc, info);
    root.add(disc);
    interactables.push(disc);
    landmarks.push(info);
    outerDiscs.push({ group: disc, baseY: py, phase: i * 1.25 });

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(angle) * 5.8, 0.35, Math.sin(angle) * 5.8),
      new THREE.Vector3(px * 0.52, py * 0.5 + 1.1, pz * 0.52),
      new THREE.Vector3(
        Math.cos(angle) * (dist - 3.3),
        py + 0.35,
        Math.sin(angle) * (dist - 3.3)
      ),
    ]);
    const bridge = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 24, 0.22, 8, false),
      bridgeMat
    );
    root.add(bridge);
  });

  const okenOuterRing = new THREE.Mesh(
    new THREE.TorusGeometry(23.5, 0.14, 10, 72),
    bank.brass
  );
  okenOuterRing.rotation.x = Math.PI / 2;
  okenOuterRing.position.y = -1.6;
  root.add(okenOuterRing);

  const moteGeo = new THREE.OctahedronGeometry(0.16, 0);
  const moteMat = new THREE.MeshStandardMaterial({
    color: 0xffe4a0,
    emissive: 0xc9a65b,
    emissiveIntensity: 1.4,
    roughness: 0.2,
  });
  const motes = new THREE.InstancedMesh(moteGeo, moteMat, particleCount);
  const moteSeeds = Array.from({ length: particleCount }, (_, i) => ({
    angle: (i * 2.39996) % (Math.PI * 2),
    radius: 3 + ((i * 47) % 100) / 4.2,
    yOff: ((i * 31) % 100) / 100,
    speed: 0.35 + (i % 5) * 0.12,
  }));
  root.add(motes);

  animUpdate = (elapsed) => {
    cloudSea.shaderMat.uniforms.uTime.value = elapsed;
    centralDisc.position.y = Math.sin(elapsed * 0.65) * 0.28;
    okenOuterRing.rotation.z = elapsed * 0.08;

    for (let i = 0; i < outerDiscs.length; i++) {
      const d = outerDiscs[i];
      d.group.position.y = d.baseY + Math.sin(elapsed * 0.8 + d.phase) * 0.35;
    }

    for (let i = 0; i < particleCount; i++) {
      const m = moteSeeds[i];
      const y = ((m.yOff * 22 + elapsed * m.speed) % 22) - 8;
      const a = m.angle + elapsed * 0.06;
      _dummy.position.set(Math.cos(a) * m.radius, y, Math.sin(a) * m.radius);
      _dummy.rotation.set(elapsed * 0.7 + i, elapsed * 0.5, 0);
      _dummy.scale.setScalar(0.85);
      _dummy.updateMatrix();
      motes.setMatrixAt(i, _dummy.matrix);
    }
    motes.instanceMatrix.needsUpdate = true;
  };

  const waypoints: WaypointStop[] = [
    {
      id: 'overview',
      code: '01',
      label: 'FIVE PALACES',
      jp: '零番隊五大都市',
      narrative:
        'Reiōkyū celestial archipelago connected by bridges of pure golden Reishi above the cloud strata.',
      position: [22, 16.5, 25],
      target: [0, 1.5, 0],
      fov: 46,
      landmarkId: 'soul-king-tower',
    },
    {
      id: 'central',
      code: '02',
      label: 'SOUL KING TOWER',
      jp: '霊王大内裏',
      narrative:
        'Central royal sanctuary encircled by the orbital Ōken barrier halo.',
      position: [9.5, 7.2, 11.5],
      target: [0, 3.8, 0],
      fov: 42,
      landmarkId: 'soul-king-tower',
    },
    {
      id: 'hooden',
      code: '03',
      label: 'HŌŌDEN FORGE',
      jp: '鳳凰殿・斬魄刀鍛冶',
      narrative:
        'Outer Squad Zero sanctuary disk hovering silently amidst ascending golden spiritual motes.',
      position: [20, 7.5, 20],
      target: [9.5, 1.5, 13.0],
      fov: 44,
      landmarkId: 'hooden',
    },
    {
      id: 'zenith',
      code: '04',
      label: 'ZENITH ORBIT',
      jp: '天頂眺望',
      narrative:
        'High zenith vantage above the pentagonal Squad Zero formation and luminous Sea of Clouds.',
      position: [0, 32, 14],
      target: [0, 0, 0],
      fov: 48,
      landmarkId: 'hyosube',
    },
  ];

  return {
    id: sceneId,
    title: 'Reiōkyū • The Soul King Palace',
    jpTitle: '霊王宮 • 零番隊五大都市',
    fogColorNight: 0x0a1026,
    fogColorDawn: 0x3b4d74,
    fogDensity: 0.0085,
    waypoints,
    presets: waypoints.map((w) => ({
      id: w.id,
      label: w.label,
      position: w.position,
      target: w.target,
      fov: w.fov,
    })),
    landmarks,
    interactables,
    update: animUpdate,
    dispose: () => {
      scene.remove(root);
      sky.material.dispose();
      cloudSea.shaderMat.dispose();
      sunbeams.material.dispose();
      skyCrestTex.dispose();
      sigilTex.dispose();
      koiWaterTex.dispose();
      seireiteiBannerTex.dispose();
      goteiBannerTex.dispose();
      paverTex.map.dispose();
      paverTex.bumpMap.dispose();
      cliffRockTex.map.dispose();
      cliffRockTex.bumpMap.dispose();
      sekkisekiTex.map.dispose();
      sekkisekiTex.bumpMap.dispose();
      cobaltRoofTex.map.dispose();
      cobaltRoofTex.bumpMap.dispose();
      obsidianRoofTex.map.dispose();
      obsidianRoofTex.bumpMap.dispose();
      goldRoofTex.map.dispose();
      goldRoofTex.bumpMap.dispose();
      timberTex.map.dispose();
      timberTex.bumpMap.dispose();
      darkTimberTex.map.dispose();
      darkTimberTex.bumpMap.dispose();
      contactShadowTex.dispose();
    },
  };
}
