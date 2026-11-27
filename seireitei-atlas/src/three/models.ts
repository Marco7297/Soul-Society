import * as THREE from 'three';
import type { MaterialTextureSet } from './textures';

export interface SceneMaterialBank {
  sekkiseki: THREE.MeshStandardMaterial;
  cliffRock: THREE.MeshStandardMaterial;
  plaster: THREE.MeshStandardMaterial;
  timber: THREE.MeshStandardMaterial;
  darkTimber: THREE.MeshStandardMaterial;
  cobaltRoof: THREE.MeshStandardMaterial;
  obsidianRoof: THREE.MeshStandardMaterial;
  goldRoof: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  vermilionLacquer: THREE.MeshStandardMaterial;
  shojiGlow: THREE.MeshStandardMaterial;
  lanternGlow: THREE.MeshStandardMaterial;
  sakuraBlossom: THREE.MeshStandardMaterial;
  pineFoliage: THREE.MeshStandardMaterial;
  koiWater: THREE.MeshStandardMaterial;
  seireiteiBanner: THREE.MeshStandardMaterial;
  goteiBanner: THREE.MeshStandardMaterial;
  reishiCrystal: THREE.MeshPhysicalMaterial;
  phoenixFlame: THREE.MeshStandardMaterial;
  mesaRock: THREE.MeshStandardMaterial;
  contactShadowTex: THREE.CanvasTexture;
}

export function createMaterialBank(params: {
  sekkisekiTex: MaterialTextureSet;
  cliffRockTex: MaterialTextureSet;
  cobaltRoofTex: MaterialTextureSet;
  obsidianRoofTex: MaterialTextureSet;
  goldRoofTex: MaterialTextureSet;
  timberTex: MaterialTextureSet;
  darkTimberTex: MaterialTextureSet;
  koiWaterTex: THREE.CanvasTexture;
  seireiteiBannerTex: THREE.CanvasTexture;
  goteiBannerTex: THREE.CanvasTexture;
  contactShadowTex: THREE.CanvasTexture;
}): SceneMaterialBank {
  return {
    sekkiseki: new THREE.MeshStandardMaterial({
      map: params.sekkisekiTex.map,
      bumpMap: params.sekkisekiTex.bumpMap,
      bumpScale: 0.08,
      color: 0xeee9dd,
      roughness: 0.86,
      metalness: 0.04,
    }),
    cliffRock: new THREE.MeshStandardMaterial({
      map: params.cliffRockTex.map,
      bumpMap: params.cliffRockTex.bumpMap,
      bumpScale: 0.18,
      color: 0x747b96,
      roughness: 0.94,
      metalness: 0.05,
      flatShading: true,
    }),
    plaster: new THREE.MeshStandardMaterial({
      color: 0xf6f2e8,
      roughness: 0.8,
      metalness: 0.02,
    }),
    timber: new THREE.MeshStandardMaterial({
      map: params.timberTex.map,
      bumpMap: params.timberTex.bumpMap,
      bumpScale: 0.05,
      color: 0x7c5338,
      roughness: 0.62,
      metalness: 0.05,
    }),
    darkTimber: new THREE.MeshStandardMaterial({
      map: params.darkTimberTex.map,
      bumpMap: params.darkTimberTex.bumpMap,
      bumpScale: 0.05,
      color: 0x3b2a22,
      roughness: 0.56,
      metalness: 0.08,
    }),
    cobaltRoof: new THREE.MeshStandardMaterial({
      map: params.cobaltRoofTex.map,
      bumpMap: params.cobaltRoofTex.bumpMap,
      bumpScale: 0.07,
      color: 0x315291,
      roughness: 0.4,
      metalness: 0.24,
    }),
    obsidianRoof: new THREE.MeshStandardMaterial({
      map: params.obsidianRoofTex.map,
      bumpMap: params.obsidianRoofTex.bumpMap,
      bumpScale: 0.07,
      color: 0x262d3d,
      roughness: 0.44,
      metalness: 0.28,
    }),
    goldRoof: new THREE.MeshStandardMaterial({
      map: params.goldRoofTex.map,
      bumpMap: params.goldRoofTex.bumpMap,
      bumpScale: 0.06,
      color: 0xdfb96a,
      roughness: 0.34,
      metalness: 0.72,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: 0xdfba66,
      roughness: 0.24,
      metalness: 0.9,
    }),
    vermilionLacquer: new THREE.MeshStandardMaterial({
      color: 0xc2352a,
      roughness: 0.32,
      metalness: 0.14,
    }),
    shojiGlow: new THREE.MeshStandardMaterial({
      color: 0xfff0c8,
      emissive: 0xffb964,
      emissiveIntensity: 0.95,
      roughness: 0.72,
      metalness: 0.0,
    }),
    lanternGlow: new THREE.MeshStandardMaterial({
      color: 0xffe4a8,
      emissive: 0xffa63d,
      emissiveIntensity: 1.55,
      roughness: 0.45,
      metalness: 0.0,
    }),
    sakuraBlossom: new THREE.MeshStandardMaterial({
      color: 0xffb6d0,
      emissive: 0x99426a,
      emissiveIntensity: 0.36,
      roughness: 0.75,
      metalness: 0.02,
      flatShading: true,
    }),
    pineFoliage: new THREE.MeshStandardMaterial({
      color: 0x284e43,
      roughness: 0.85,
      metalness: 0.04,
      flatShading: true,
    }),
    koiWater: new THREE.MeshStandardMaterial({
      map: params.koiWaterTex,
      color: 0x95dcf7,
      roughness: 0.14,
      metalness: 0.32,
      emissive: 0x0b2e4a,
      emissiveIntensity: 0.35,
    }),
    seireiteiBanner: new THREE.MeshStandardMaterial({
      map: params.seireiteiBannerTex,
      roughness: 0.65,
      metalness: 0.08,
      emissive: 0x1e3a6e,
      emissiveIntensity: 0.22,
      side: THREE.DoubleSide,
    }),
    goteiBanner: new THREE.MeshStandardMaterial({
      map: params.goteiBannerTex,
      roughness: 0.65,
      metalness: 0.08,
      side: THREE.DoubleSide,
    }),
    reishiCrystal: new THREE.MeshPhysicalMaterial({
      color: 0x6fb7ff,
      emissive: 0x2b6cb0,
      emissiveIntensity: 0.85,
      roughness: 0.14,
      metalness: 0.1,
      transmission: 0.45,
      thickness: 0.8,
      ior: 1.45,
      clearcoat: 0.8,
    }),
    phoenixFlame: new THREE.MeshStandardMaterial({
      color: 0xff7b29,
      emissive: 0xff4500,
      emissiveIntensity: 1.85,
      roughness: 0.28,
      metalness: 0.2,
    }),
    mesaRock: new THREE.MeshStandardMaterial({
      bumpMap: params.cliffRockTex.bumpMap,
      bumpScale: 0.16,
      color: 0x454959,
      roughness: 0.94,
      metalness: 0.04,
      flatShading: true,
    }),
    contactShadowTex: params.contactShadowTex,
  };
}

export function attachContactShadow(
  parent: THREE.Object3D,
  tex: THREE.CanvasTexture,
  width: number,
  depth: number,
  opacity = 0.8
) {
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), mat);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0.015;
  parent.add(plane);
}

function createExtrudedBeveledBox(
  w: number,
  h: number,
  d: number,
  bevel = 0.08
): THREE.ExtrudeGeometry {
  const hw = w / 2 - bevel;
  const hd = d / 2 - bevel;
  const shape = new THREE.Shape();
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.lineTo(hw, hd);
  shape.lineTo(-hw, hd);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.05, h - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, bevel, 0);
  geo.computeVertexNormals();
  return geo;
}

export function createFlaredPagodaRoof(
  baseWidth: number,
  baseDepth: number,
  height: number,
  material: THREE.Material
): THREE.Mesh {
  const hw = baseWidth / 2;
  const hd = baseDepth / 2;
  const ridgeHalf = Math.max(0.22, hw - hd * 0.55);

  const vertices = new Float32Array([
    -hw, 0.14, -hd,
    hw, 0.14, -hd,
    hw, 0.14, hd,
    -hw, 0.14, hd,
    -hw * 0.68, height * 0.52, -hd * 0.65,
    hw * 0.68, height * 0.52, -hd * 0.65,
    hw * 0.68, height * 0.52, hd * 0.65,
    -hw * 0.68, height * 0.52, hd * 0.65,
    -ridgeHalf, height, 0,
    ridgeHalf, height, 0,
  ]);

  const indices = [
    3, 2, 6, 3, 6, 7,
    1, 0, 4, 1, 4, 5,
    0, 3, 7, 0, 7, 4,
    2, 1, 5, 2, 5, 6,
    7, 6, 9, 7, 9, 8,
    5, 4, 8, 5, 8, 9,
    4, 7, 8,
    6, 5, 9,
    0, 1, 2, 0, 2, 3,
  ];

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  const posAttr = geo.attributes.position;
  const uvs = new Float32Array(posAttr.count * 2);
  for (let i = 0; i < posAttr.count; i++) {
    uvs[i * 2] = (posAttr.getX(i) + hw) / baseWidth;
    uvs[i * 2 + 1] = (posAttr.getZ(i) + hd) / baseDepth;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Sculpted craggy floating mountain underside matching seireitei-home.webp */
export function createFloatingIslandBedrock(
  bank: SceneMaterialBank,
  radiusTop: number,
  depth: number,
  radialSegs = 28,
  heightSegs = 12
): THREE.Group {
  const group = new THREE.Group();

  const geo = new THREE.CylinderGeometry(
    radiusTop,
    radiusTop * 0.08,
    depth,
    radialSegs,
    heightSegs,
    false
  );
  const pos = geo.attributes.position;
  const halfH = depth / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Normalized depth fraction: 0 at top rim, 1 at bottom spire tip
    const t = Math.max(0, Math.min(1, (halfH - y) / depth));
    const angle = Math.atan2(z, x);

    // Deterministic craggy rock stratification & jutting spires
    const ridge1 = Math.sin(angle * 5.0 + t * 4.2) * 0.16;
    const ridge2 = Math.cos(angle * 9.0 - t * 6.5) * 0.09;
    const ridge3 = Math.sin(angle * 15.0 + t * 11.0) * 0.04;
    const stepLedge = Math.floor(t * 7) % 2 === 0 ? 0.04 : -0.03;

    // Taper smoothly toward jagged bottom tip
    const envelope = Math.pow(1 - t, 0.72);
    const radialScale =
      t < 0.04
        ? 1.0
        : Math.max(0.05, 1.0 + (ridge1 + ridge2 + ridge3 + stepLedge) * (0.45 + t * 0.9));

    pos.setX(i, x * radialScale * (0.45 + 0.55 * envelope));
    pos.setZ(i, z * radialScale * (0.45 + 0.55 * envelope));

    // Slightly undulate lower tips
    if (t > 0.15 && y > -halfH + 0.2) {
      pos.setY(i, y + (ridge2 + ridge3) * 1.4);
    }
  }
  geo.computeVertexNormals();

  const crag = new THREE.Mesh(geo, bank.cliffRock);
  crag.position.y = -depth / 2 - 0.15;
  crag.castShadow = true;
  crag.receiveShadow = true;
  group.add(crag);

  // Secondary flanking hanging rock spires for dramatic cliff silhouette
  const spireOffsets: [number, number, number, number][] = [
    [-radiusTop * 0.58, -depth * 0.36, radiusTop * 0.28, depth * 0.56],
    [radiusTop * 0.62, -depth * 0.3, radiusTop * 0.25, depth * 0.48],
    [-radiusTop * 0.22, -depth * 0.44, radiusTop * 0.32, depth * 0.65],
    [radiusTop * 0.18, -depth * 0.48, radiusTop * 0.24, depth * 0.55],
  ];
  spireOffsets.forEach(([sx, sy, sr, sh], idx) => {
    const sub = new THREE.Mesh(
      new THREE.ConeGeometry(sr, sh, 7),
      bank.cliffRock
    );
    sub.rotation.x = Math.PI;
    sub.rotation.y = idx * 0.9;
    sub.position.set(sx, sy, (idx % 2 === 0 ? 1 : -1) * radiusTop * 0.34);
    sub.castShadow = true;
    sub.receiveShadow = true;
    group.add(sub);
  });

  // White Sekkiseki upper rim apron crowning the rocky crag
  const cliffCap = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop * 1.01, radiusTop * 0.97, 0.72, radialSegs),
    bank.sekkiseki
  );
  cliffCap.position.y = -0.36;
  cliffCap.receiveShadow = true;
  cliffCap.castShadow = true;
  group.add(cliffCap);

  return group;
}

export function createStoneLanternGroup(bank: SceneMaterialBank): THREE.Group {
  const group = new THREE.Group();

  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.38, 0.22, 6),
    bank.sekkiseki
  );
  plinth.position.y = 0.11;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 0.85, 8),
    bank.sekkiseki
  );
  shaft.position.y = 0.64;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  group.add(shaft);

  const collar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.18, 0.14, 6),
    bank.darkTimber
  );
  collar.position.y = 1.14;
  collar.castShadow = true;
  group.add(collar);

  const firebox = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.32, 6),
    bank.lanternGlow
  );
  firebox.position.y = 1.37;
  group.add(firebox);

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const rib = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.36, 6),
      bank.brass
    );
    rib.position.set(Math.cos(angle) * 0.19, 1.37, Math.sin(angle) * 0.19);
    group.add(rib);
  }

  const capPoints = [
    new THREE.Vector2(0.0, 0.32),
    new THREE.Vector2(0.15, 0.2),
    new THREE.Vector2(0.42, 0.06),
    new THREE.Vector2(0.46, 0.0),
    new THREE.Vector2(0.0, 0.0),
  ];
  const cap = new THREE.Mesh(
    new THREE.LatheGeometry(capPoints, 6),
    bank.obsidianRoof
  );
  cap.position.y = 1.53;
  cap.castShadow = true;
  group.add(cap);

  const finial = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 10, 8),
    bank.brass
  );
  finial.position.y = 1.9;
  group.add(finial);

  attachContactShadow(group, bank.contactShadowTex, 1.25, 1.25, 0.6);
  return group;
}

export function createJapanesePavilionGroup(
  bank: SceneMaterialBank,
  options: {
    width?: number;
    depth?: number;
    tiers?: number;
    roofMat?: THREE.Material;
    glowShoji?: boolean;
  } = {}
): THREE.Group {
  const width = options.width ?? 6.4;
  const depth = options.depth ?? 5.2;
  const tiers = options.tiers ?? 2;
  const roofMat = options.roofMat ?? bank.cobaltRoof;

  const group = new THREE.Group();

  const plinthH = 0.65;
  const plinth = new THREE.Mesh(
    createExtrudedBeveledBox(width + 1.0, plinthH, depth + 1.0, 0.09),
    bank.sekkiseki
  );
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  for (let s = 0; s < 3; s++) {
    const step = new THREE.Mesh(
      createExtrudedBeveledBox(2.0 - s * 0.15, 0.2, 0.42, 0.03),
      bank.sekkiseki
    );
    step.position.set(0, s * 0.18, (depth + 1.0) / 2 + 0.52 - s * 0.25);
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  }

  let currentY = plinthH;

  for (let t = 0; t < tiers; t++) {
    const scale = Math.pow(0.75, t);
    const tierW = width * scale;
    const tierD = depth * scale;
    const tierH = 1.95 * (t === 0 ? 1 : 0.84);

    const core = new THREE.Mesh(
      createExtrudedBeveledBox(tierW - 0.35, tierH, tierD - 0.35, 0.05),
      bank.plaster
    );
    core.position.y = currentY;
    core.castShadow = true;
    core.receiveShadow = true;
    group.add(core);

    if (options.glowShoji !== false) {
      const shoji = new THREE.Mesh(
        new THREE.BoxGeometry(tierW - 0.28, tierH * 0.5, tierD - 0.28),
        bank.shojiGlow
      );
      shoji.position.y = currentY + tierH * 0.52;
      group.add(shoji);
    }

    const colsX = 4;
    const colsZ = 3;
    for (let ix = 0; ix < colsX; ix++) {
      for (let iz = 0; iz < colsZ; iz++) {
        if (ix > 0 && ix < colsX - 1 && iz > 0 && iz < colsZ - 1) continue;
        const px = -tierW / 2 + 0.18 + (ix / (colsX - 1)) * (tierW - 0.36);
        const pz = -tierD / 2 + 0.18 + (iz / (colsZ - 1)) * (tierD - 0.36);

        const col = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.12, tierH, 8),
          bank.timber
        );
        col.position.set(px, currentY + tierH / 2, pz);
        col.castShadow = true;
        group.add(col);
      }
    }

    const roof = createFlaredPagodaRoof(
      tierW + 1.5,
      tierD + 1.4,
      1.3 * scale + 0.35,
      roofMat
    );
    roof.position.y = currentY + tierH - 0.12;
    group.add(roof);

    const ridgeTrim = new THREE.Mesh(
      new THREE.BoxGeometry(Math.max(0.55, tierW - tierD * 0.45), 0.14, 0.18),
      bank.brass
    );
    ridgeTrim.position.y = currentY + tierH - 0.12 + (1.3 * scale + 0.35);
    group.add(ridgeTrim);

    currentY += tierH + (1.3 * scale + 0.15);
  }

  const spirePts = [
    new THREE.Vector2(0.0, 0),
    new THREE.Vector2(0.24, 0.04),
    new THREE.Vector2(0.12, 0.22),
    new THREE.Vector2(0.16, 0.5),
    new THREE.Vector2(0.06, 0.95),
    new THREE.Vector2(0.1, 1.15),
    new THREE.Vector2(0.0, 1.45),
  ];
  const spire = new THREE.Mesh(new THREE.LatheGeometry(spirePts, 12), bank.brass);
  spire.position.y = currentY - 0.12;
  spire.castShadow = true;
  group.add(spire);

  attachContactShadow(
    group,
    bank.contactShadowTex,
    width + 3.0,
    depth + 3.0,
    0.82
  );
  return group;
}

/** Towering Central Seireitei Keep with ishigaki stone batter, chidori gables, shachihoko horns, and giant 瀞霊廷 banner */
export function createCitadelKeepGroup(bank: SceneMaterialBank): THREE.Group {
  const group = new THREE.Group();

  // 1. Sloped Sekkiseki fortress rampart base (ishigaki)
  const rampart = new THREE.Mesh(
    new THREE.CylinderGeometry(6.8, 8.2, 2.4, 4),
    bank.sekkiseki
  );
  rampart.rotation.y = Math.PI / 4;
  rampart.position.y = 1.2;
  rampart.scale.set(1.18, 1, 0.95);
  rampart.castShadow = true;
  rampart.receiveShadow = true;
  group.add(rampart);

  // Crown parapet ledge on rampart
  const parapet = new THREE.Mesh(
    createExtrudedBeveledBox(11.4, 0.42, 9.2, 0.08),
    bank.sekkiseki
  );
  parapet.position.y = 2.38;
  parapet.castShadow = true;
  parapet.receiveShadow = true;
  group.add(parapet);

  // 2. Four ascending castle keep tiers
  const tiers = [
    { w: 9.6, d: 7.4, h: 2.35, roofH: 1.55 },
    { w: 7.6, d: 6.0, h: 2.1, roofH: 1.35 },
    { w: 5.8, d: 4.7, h: 1.85, roofH: 1.2 },
    { w: 4.1, d: 3.6, h: 1.65, roofH: 1.35 },
  ];

  let yCursor = 2.75;
  tiers.forEach((tier, idx) => {
    const body = new THREE.Mesh(
      createExtrudedBeveledBox(tier.w, tier.h, tier.d, 0.06),
      bank.plaster
    );
    body.position.y = yCursor;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Illuminated amber shoji bands
    const shoji = new THREE.Mesh(
      new THREE.BoxGeometry(tier.w + 0.06, tier.h * 0.44, tier.d + 0.06),
      bank.shojiGlow
    );
    shoji.position.y = yCursor + tier.h * 0.55;
    group.add(shoji);

    // Timber corner pilasters
    [-1, 1].forEach((sx) => {
      [-1, 1].forEach((sz) => {
        const pillar = new THREE.Mesh(
          new THREE.BoxGeometry(0.24, tier.h, 0.24),
          bank.darkTimber
        );
        pillar.position.set(
          sx * (tier.w / 2 - 0.1),
          yCursor + tier.h / 2,
          sz * (tier.d / 2 - 0.1)
        );
        group.add(pillar);
      });
    });

    const roof = createFlaredPagodaRoof(
      tier.w + 2.2,
      tier.d + 2.0,
      tier.roofH,
      bank.cobaltRoof
    );
    roof.position.y = yCursor + tier.h - 0.1;
    group.add(roof);

    // Ornamental Chidori-hafū triangular front gable on tiers 0, 1, 2
    if (idx < 3) {
      const gable = new THREE.Mesh(
        new THREE.ConeGeometry(tier.w * 0.24, tier.roofH * 0.85, 3),
        bank.cobaltRoof
      );
      gable.rotation.x = Math.PI / 2;
      gable.rotation.z = Math.PI;
      gable.position.set(0, yCursor + tier.h + tier.roofH * 0.28, tier.d * 0.5 + 0.35);
      gable.castShadow = true;
      group.add(gable);

      const gableFace = new THREE.Mesh(
        new THREE.BoxGeometry(tier.w * 0.28, tier.roofH * 0.42, 0.22),
        bank.plaster
      );
      gableFace.position.set(0, yCursor + tier.h + 0.2, tier.d * 0.5 + 0.22);
      group.add(gableFace);
    }

    const ridge = new THREE.Mesh(
      new THREE.BoxGeometry(Math.max(0.8, tier.w - tier.d * 0.35), 0.16, 0.22),
      bank.brass
    );
    ridge.position.y = yCursor + tier.h - 0.1 + tier.roofH;
    group.add(ridge);

    yCursor += tier.h + tier.roofH - 0.18;
  });

  // 3. Crown Twin Golden Shachihoko Roof Finials & Central Crest Spire
  [-1.1, 1.1].forEach((xSide) => {
    const shachi = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.85, 6),
      bank.brass
    );
    shachi.position.set(xSide, yCursor + 0.42, 0);
    shachi.rotation.z = xSide > 0 ? -0.18 : 0.18;
    shachi.castShadow = true;
    group.add(shachi);
  });

  const crownSpire = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.32, 0),
    bank.brass
  );
  crownSpire.position.y = yCursor + 0.65;
  group.add(crownSpire);

  // 4. Giant Vertical Hanging "瀞霊廷" Crest Banner on Front Facade (per seireitei-home.webp)
  const bannerBacking = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 4.9, 0.14),
    bank.brass
  );
  bannerBacking.position.set(0, 5.75, 4.02);
  bannerBacking.castShadow = true;
  group.add(bannerBacking);

  const bannerFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.62, 4.75),
    bank.seireiteiBanner
  );
  bannerFace.position.set(0, 5.75, 4.11);
  group.add(bannerFace);

  // 5. Twin Flanking Sentinel Towers behind main hall (per seireitei-palace.webp)
  [-6.8, 6.8].forEach((tx) => {
    const wingTower = createJapanesePavilionGroup(bank, {
      width: 3.1,
      depth: 3.1,
      tiers: 3,
      roofMat: bank.cobaltRoof,
    });
    wingTower.position.set(tx, 0.2, -1.8);
    group.add(wingTower);
  });

  attachContactShadow(group, bank.contactShadowTex, 18.5, 15.0, 0.88);
  return group;
}

/** Corner perimeter Sekkiseki bastion watchtower with pointed cobalt spire */
export function createWallWatchtowerGroup(bank: SceneMaterialBank): THREE.Group {
  const group = new THREE.Group();

  const plinth = new THREE.Mesh(
    createExtrudedBeveledBox(2.9, 3.6, 2.9, 0.1),
    bank.sekkiseki
  );
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  const room = new THREE.Mesh(
    createExtrudedBeveledBox(2.15, 1.5, 2.15, 0.06),
    bank.plaster
  );
  room.position.y = 3.6;
  room.castShadow = true;
  group.add(room);

  const windowBand = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.55, 2.2),
    bank.shojiGlow
  );
  windowBand.position.y = 4.45;
  group.add(windowBand);

  const roof = createFlaredPagodaRoof(3.15, 3.15, 1.65, bank.cobaltRoof);
  roof.position.y = 5.0;
  group.add(roof);

  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.58, 6), bank.brass);
  finial.position.y = 6.88;
  group.add(finial);

  return group;
}

/** Monumental Hakutōmon White Way Gate with vertical 瀞霊廷 & 護廷十三隊 banners */
export function createHakutomonGateGroup(bank: SceneMaterialBank): THREE.Group {
  const group = new THREE.Group();

  [-3.8, 3.8].forEach((xPos, idx) => {
    const bastion = new THREE.Mesh(
      createExtrudedBeveledBox(3.4, 4.4, 3.8, 0.14),
      bank.sekkiseki
    );
    bastion.position.set(xPos, 0, 0);
    bastion.castShadow = true;
    bastion.receiveShadow = true;
    group.add(bastion);

    const turret = new THREE.Mesh(
      createExtrudedBeveledBox(2.4, 1.6, 2.5, 0.06),
      bank.plaster
    );
    turret.position.set(xPos, 4.4, 0);
    turret.castShadow = true;
    group.add(turret);

    const turretRoof = createFlaredPagodaRoof(3.45, 3.45, 1.4, bank.cobaltRoof);
    turretRoof.position.set(xPos, 5.9, 0);
    group.add(turretRoof);

    const finial = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.22, 0),
      bank.brass
    );
    finial.position.set(xPos, 7.42, 0);
    group.add(finial);

    // Vertical Royal Banners facing forward (inspired by seireitei-gate.webp)
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(0.95, 2.75),
      idx === 0 ? bank.seireiteiBanner : bank.goteiBanner
    );
    banner.position.set(xPos, 2.6, 1.96);
    group.add(banner);
  });

  [-1.95, 1.95].forEach((xPos) => {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.3, 4.5, 10),
      bank.vermilionLacquer
    );
    post.position.set(xPos, 2.25, 0.35);
    post.castShadow = true;
    group.add(post);
  });

  [-1, 1].forEach((side) => {
    const leafGroup = new THREE.Group();
    leafGroup.position.set(side * 1.85, 0, 0.25);
    leafGroup.rotation.y = side * -0.34;

    const panel = new THREE.Mesh(
      createExtrudedBeveledBox(1.85, 4.1, 0.24, 0.04),
      bank.darkTimber
    );
    panel.position.set(-side * 0.92, 0, 0);
    panel.castShadow = true;
    panel.receiveShadow = true;
    leafGroup.add(panel);

    const crestRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.05, 8, 20),
      bank.brass
    );
    crestRing.position.set(-side * 0.92, 2.35, 0.14);
    leafGroup.add(crestRing);

    group.add(leafGroup);
  });

  const lintel = new THREE.Mesh(
    createExtrudedBeveledBox(5.6, 0.9, 2.8, 0.08),
    bank.darkTimber
  );
  lintel.position.set(0, 4.2, 0);
  lintel.castShadow = true;
  group.add(lintel);

  const mainRoof = createFlaredPagodaRoof(6.6, 3.8, 1.65, bank.cobaltRoof);
  mainRoof.position.set(0, 5.05, 0);
  group.add(mainRoof);

  const crestMedallion = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.46, 0.12, 16),
    bank.brass
  );
  crestMedallion.rotation.x = Math.PI / 2;
  crestMedallion.position.set(0, 4.65, 1.44);
  group.add(crestMedallion);

  attachContactShadow(group, bank.contactShadowTex, 12.2, 5.6, 0.85);
  return group;
}

/** Arched Sekkiseki masonry bridge spanning cloud abyss to outpost terrace (per seireitei-home.webp & seireitei-gate.webp) */
export function createArchedBridgeGroup(
  bank: SceneMaterialBank,
  span = 11.5,
  width = 3.4
): THREE.Group {
  const group = new THREE.Group();

  // Gently arched deck curve using discrete masonry deck segments
  const segs = 12;
  const segLen = span / segs;
  for (let i = 0; i < segs; i++) {
    const t = (i + 0.5) / segs - 0.5;
    const archY = Math.cos(t * Math.PI) * 0.95;
    const slopeAngle = Math.sin(t * Math.PI) * 0.24;

    const plank = new THREE.Mesh(
      createExtrudedBeveledBox(width, 0.42, segLen + 0.12, 0.04),
      bank.sekkiseki
    );
    plank.position.set(0, archY, t * span);
    plank.rotation.x = slopeAngle;
    plank.castShadow = true;
    plank.receiveShadow = true;
    group.add(plank);

    // Side parapet rails & posts
    [-width * 0.46, width * 0.46].forEach((rx) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.55, segLen + 0.1),
        bank.sekkiseki
      );
      rail.position.set(rx, archY + 0.45, t * span);
      rail.rotation.x = slopeAngle;
      rail.castShadow = true;
      group.add(rail);

      if (i % 3 === 0 || i === segs - 1) {
        const post = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 0.85, 0.32),
          bank.sekkiseki
        );
        post.position.set(rx, archY + 0.65, t * span);
        group.add(post);

        const cap = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 8, 6),
          bank.brass
        );
        cap.position.set(rx, archY + 1.12, t * span);
        group.add(cap);
      }
    });
  }

  // Deep arched stone support ribs underneath
  [-width * 0.38, width * 0.38].forEach((ax) => {
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(ax, -2.4, -span * 0.48),
      new THREE.Vector3(ax, 0.1, -span * 0.24),
      new THREE.Vector3(ax, 0.65, 0),
      new THREE.Vector3(ax, 0.1, span * 0.24),
      new THREE.Vector3(ax, -2.4, span * 0.48),
    ]);
    const archRib = new THREE.Mesh(
      new THREE.TubeGeometry(archCurve, 20, 0.28, 6, false),
      bank.sekkiseki
    );
    archRib.castShadow = true;
    group.add(archRib);
  });

  return group;
}

/** Koi pond reflecting pool with twin arched footbridges (per seireitei-palace.webp) */
export function createKoiPondCourtyardGroup(
  bank: SceneMaterialBank,
  width = 8.4,
  depth = 5.4
): THREE.Group {
  const group = new THREE.Group();

  // Outer carved Sekkiseki basin curb
  const curb = new THREE.Mesh(
    new THREE.CylinderGeometry(width * 0.56, width * 0.6, 0.36, 24),
    bank.sekkiseki
  );
  curb.scale.set(1, 1, depth / width);
  curb.position.y = 0.16;
  curb.receiveShadow = true;
  group.add(curb);

  // Shimmering Koi Water Surface
  const water = new THREE.Mesh(
    new THREE.CylinderGeometry(width * 0.51, width * 0.51, 0.38, 24),
    bank.koiWater
  );
  water.scale.set(1, 1, depth / width);
  water.position.y = 0.18;
  water.receiveShadow = true;
  group.add(water);

  // Delicate curved crimson/dark-timber garden footbridge across pond center
  const span = depth * 0.92;
  const bridgeSegs = 8;
  for (let i = 0; i < bridgeSegs; i++) {
    const t = (i + 0.5) / bridgeSegs - 0.5;
    const y = 0.38 + Math.cos(t * Math.PI) * 0.55;
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 0.12, span / bridgeSegs + 0.08),
      bank.darkTimber
    );
    step.position.set(0, y, t * span);
    step.rotation.x = Math.sin(t * Math.PI) * 0.32;
    step.castShadow = true;
    group.add(step);

    [-0.64, 0.64].forEach((rx) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.32, span / bridgeSegs + 0.08),
        bank.vermilionLacquer
      );
      rail.position.set(rx, y + 0.2, t * span);
      rail.rotation.x = Math.sin(t * Math.PI) * 0.32;
      group.add(rail);
    });
  }

  return group;
}

/** Lush sculpted Sakura cherry blossom tree */
export function createSakuraTreeGroup(
  bank: SceneMaterialBank,
  scale = 1.0
): THREE.Group {
  const group = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14 * scale, 0.24 * scale, 1.55 * scale, 7),
    bank.darkTimber
  );
  trunk.position.y = 0.75 * scale;
  trunk.rotation.z = 0.08;
  trunk.castShadow = true;
  group.add(trunk);

  const puffs: [number, number, number, number][] = [
    [0, 1.85, 0, 1.05],
    [-0.75, 1.6, 0.35, 0.82],
    [0.78, 1.65, -0.3, 0.85],
    [0.25, 2.05, 0.55, 0.72],
    [-0.35, 1.9, -0.58, 0.75],
  ];
  const puffGeo = new THREE.IcosahedronGeometry(1, 1);
  puffs.forEach(([px, py, pz, r]) => {
    const cloud = new THREE.Mesh(puffGeo, bank.sakuraBlossom);
    cloud.position.set(px * scale, py * scale, pz * scale);
    cloud.scale.set(r * scale * 1.15, r * scale * 0.72, r * scale * 1.1);
    cloud.castShadow = true;
    cloud.receiveShadow = true;
    group.add(cloud);
  });

  attachContactShadow(group, bank.contactShadowTex, 2.6 * scale, 2.6 * scale, 0.55);
  return group;
}

export function createSokyokuScaffoldGroup(bank: SceneMaterialBank): {
  group: THREE.Group;
  halberdGroup: THREE.Group;
  emberRing: THREE.Mesh;
} {
  const group = new THREE.Group();

  const step1 = new THREE.Mesh(
    new THREE.CylinderGeometry(5.6, 6.2, 0.55, 12),
    bank.sekkiseki
  );
  step1.position.y = 0.275;
  step1.receiveShadow = true;
  step1.castShadow = true;
  group.add(step1);

  const step2 = new THREE.Mesh(
    new THREE.CylinderGeometry(4.2, 4.6, 0.5, 12),
    bank.sekkiseki
  );
  step2.position.y = 0.8;
  step2.receiveShadow = true;
  step2.castShadow = true;
  group.add(step2);

  [-3.2, 3.2].forEach((x) => {
    const footing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.68, 0.6, 10),
      bank.sekkiseki
    );
    footing.position.set(x, 1.35, 0);
    footing.castShadow = true;
    group.add(footing);

    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.44, 10.6, 12),
      bank.vermilionLacquer
    );
    pillar.position.set(x, 6.8, 0);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    group.add(pillar);

    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 0.4, 0.45, 12),
      bank.brass
    );
    cap.position.set(x, 12.15, 0);
    group.add(cap);
  });

  const topBeam = new THREE.Mesh(
    createExtrudedBeveledBox(9.4, 0.65, 0.88, 0.08),
    bank.darkTimber
  );
  topBeam.position.set(0, 11.4, 0);
  topBeam.castShadow = true;
  group.add(topBeam);

  const lowerBeam = new THREE.Mesh(
    createExtrudedBeveledBox(7.8, 0.44, 0.56, 0.06),
    bank.vermilionLacquer
  );
  lowerBeam.position.set(0, 9.8, 0);
  lowerBeam.castShadow = true;
  group.add(lowerBeam);

  const ropeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.0, 9.55, 0.34),
    new THREE.Vector3(-1.4, 9.1, 0.42),
    new THREE.Vector3(0, 8.95, 0.46),
    new THREE.Vector3(1.4, 9.1, 0.42),
    new THREE.Vector3(3.0, 9.55, 0.34),
  ]);
  const rope = new THREE.Mesh(
    new THREE.TubeGeometry(ropeCurve, 28, 0.16, 8, false),
    bank.plaster
  );
  group.add(rope);

  const halberdGroup = new THREE.Group();
  halberdGroup.position.set(0, 6.3, 0);

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.16, 7.2, 10),
    bank.darkTimber
  );
  shaft.castShadow = true;
  halberdGroup.add(shaft);

  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 1.2);
  bladeShape.quadraticCurveTo(1.25, 0.4, 0.85, -1.6);
  bladeShape.lineTo(0, -2.55);
  bladeShape.lineTo(-0.55, -1.55);
  bladeShape.quadraticCurveTo(-0.4, 0.25, 0, 1.2);

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2,
  });
  bladeGeo.translate(0, 0, -0.08);
  const blade = new THREE.Mesh(bladeGeo, bank.phoenixFlame);
  blade.position.y = -1.65;
  blade.castShadow = true;
  halberdGroup.add(blade);

  const collarRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.45, 0.09, 10, 24),
    bank.brass
  );
  collarRing.rotation.x = Math.PI / 2;
  collarRing.position.y = -0.35;
  halberdGroup.add(collarRing);

  const emberRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.15, 0.07, 10, 48),
    bank.phoenixFlame
  );
  emberRing.rotation.x = Math.PI / 2;
  emberRing.position.y = -2.35;
  halberdGroup.add(emberRing);

  group.add(halberdGroup);

  attachContactShadow(group, bank.contactShadowTex, 13.5, 13.5, 0.85);
  return { group, halberdGroup, emberRing };
}

export function createReiokyuDiscGroup(
  bank: SceneMaterialBank,
  radius: number,
  isCentral = false
): THREE.Group {
  const group = new THREE.Group();

  const pts = [
    new THREE.Vector2(0.0, -radius * 0.48),
    new THREE.Vector2(radius * 0.28, -radius * 0.36),
    new THREE.Vector2(radius * 0.72, -radius * 0.18),
    new THREE.Vector2(radius, -0.15),
    new THREE.Vector2(radius * 1.03, 0.0),
    new THREE.Vector2(radius * 0.96, 0.22),
    new THREE.Vector2(0.0, 0.22),
  ];
  const disc = new THREE.Mesh(new THREE.LatheGeometry(pts, 28), bank.sekkiseki);
  disc.castShadow = true;
  disc.receiveShadow = true;
  group.add(disc);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.99, 0.14, 10, 40),
    bank.brass
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.18;
  group.add(rim);

  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(radius * 0.22, 0),
    bank.reishiCrystal
  );
  core.position.y = -radius * 0.56;
  group.add(core);

  const pavilion = createJapanesePavilionGroup(bank, {
    width: isCentral ? 5.6 : 3.2,
    depth: isCentral ? 5.6 : 3.0,
    tiers: isCentral ? 3 : 2,
    roofMat: bank.goldRoof,
    glowShoji: true,
  });
  pavilion.position.y = 0.22;
  group.add(pavilion);

  if (isCentral) {
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.85, 0.11, 10, 48),
      bank.brass
    );
    halo.position.y = 7.4;
    halo.rotation.x = Math.PI / 3;
    group.add(halo);
  }

  return group;
}
