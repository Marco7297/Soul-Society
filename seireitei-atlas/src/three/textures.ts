import * as THREE from 'three';

function createPrng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export interface MaterialTextureSet {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap?: THREE.CanvasTexture;
}

export function createSekkisekiTextures(maxAniso: number): MaterialTextureSet {
  const size = 512;
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const ctx = albedoCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  const rand = createPrng(1307);

  ctx.fillStyle = '#e5e0d4';
  ctx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#a8a8a8';
  bCtx.fillRect(0, 0, size, size);

  const rows = 8;
  const rowH = size / rows;
  const cols = 4;
  const colW = size / cols;

  for (let r = 0; r < rows; r++) {
    const offsetX = r % 2 === 0 ? 0 : colW * 0.5;
    for (let c = -1; c <= cols; c++) {
      const x = c * colW + offsetX;
      const y = r * rowH;
      const tone = 224 + Math.floor((rand() - 0.5) * 18);
      const warm = Math.floor((rand() - 0.5) * 8);
      ctx.fillStyle = `rgb(${tone}, ${tone - 2 + warm}, ${tone - 10})`;
      ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);

      const bVal = 178 + Math.floor((rand() - 0.5) * 32);
      bCtx.fillStyle = `rgb(${bVal}, ${bVal}, ${bVal})`;
      bCtx.fillRect(x + 3, y + 3, colW - 6, rowH - 6);

      for (let k = 0; k < 22; k++) {
        const fx = x + 4 + rand() * (colW - 8);
        const fy = y + 4 + rand() * (rowH - 8);
        const alpha = 0.04 + rand() * 0.07;
        ctx.fillStyle =
          rand() > 0.5
            ? `rgba(110,122,145,${alpha})`
            : `rgba(255,252,246,${alpha})`;
        ctx.fillRect(fx, fy, 2 + rand() * 3, 1.5);
      }

      ctx.fillStyle = 'rgba(255, 252, 246, 0.28)';
      ctx.fillRect(x + 2, y + 2, colW - 4, 2);
      bCtx.fillStyle = '#dadada';
      bCtx.fillRect(x + 3, y + 3, colW - 6, 2);
    }

    ctx.fillStyle = '#9a968b';
    ctx.fillRect(0, r * rowH, size, 3);
    bCtx.fillStyle = '#484848';
    bCtx.fillRect(0, r * rowH, size, 3);
  }

  const map = new THREE.CanvasTexture(albedoCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 2);
  map.anisotropy = maxAniso;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 2);
  bumpMap.anisotropy = maxAniso;

  return { map, bumpMap };
}

export function createCliffRockTextures(maxAniso: number): MaterialTextureSet {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  const rand = createPrng(2903);

  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, '#4d536c');
  grad.addColorStop(0.5, '#353a50');
  grad.addColorStop(1, '#222638');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  bCtx.fillStyle = '#7a7a7a';
  bCtx.fillRect(0, 0, size, size);

  // Sedimentary cliff strata ledges & craggy vertical fractures
  for (let i = 0; i < 64; i++) {
    const y = rand() * size;
    const h = 4 + rand() * 14;
    const shade = 42 + Math.floor(rand() * 34);
    ctx.fillStyle = `rgba(${shade}, ${shade + 6}, ${shade + 22}, 0.45)`;
    ctx.fillRect(0, y, size, h);

    const bShade = 80 + Math.floor(rand() * 110);
    bCtx.fillStyle = `rgba(${bShade}, ${bShade}, ${bShade}, 0.45)`;
    bCtx.fillRect(0, y, size, h);
  }

  // Highlight sunlit warm rock edges + deep crevices
  for (let i = 0; i < 110; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const w = 10 + rand() * 48;
    const h = 3 + rand() * 9;
    ctx.fillStyle =
      rand() > 0.65
        ? 'rgba(182, 168, 152, 0.16)'
        : 'rgba(12, 15, 28, 0.35)';
    ctx.fillRect(x, y, w, h);

    bCtx.fillStyle = rand() > 0.5 ? 'rgba(220,220,220,0.35)' : 'rgba(25,25,25,0.45)';
    bCtx.fillRect(x, y, w, h);
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 2);
  map.anisotropy = maxAniso;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3, 2);
  bumpMap.anisotropy = maxAniso;

  return { map, bumpMap };
}

export function createRoofTileTextures(
  maxAniso: number,
  palette: 'cobalt' | 'obsidian' | 'gold'
): MaterialTextureSet {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  const baseColors =
    palette === 'cobalt'
      ? ['#1d325c', '#2a467d', '#142240']
      : palette === 'gold'
      ? ['#c49a4e', '#dfb667', '#947030']
      : ['#1f232c', '#2b3140', '#14171e'];

  ctx.fillStyle = baseColors[0];
  ctx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#7c7c7c';
  bCtx.fillRect(0, 0, size, size);

  const cols = 16;
  const rows = 12;
  const colW = size / cols;
  const rowH = size / rows;

  for (let c = 0; c < cols; c++) {
    const x = c * colW;
    const grad = ctx.createLinearGradient(x, 0, x + colW, 0);
    grad.addColorStop(0, baseColors[2]);
    grad.addColorStop(0.5, baseColors[1]);
    grad.addColorStop(1, baseColors[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, colW, size);

    const bGrad = bCtx.createLinearGradient(x, 0, x + colW, 0);
    bGrad.addColorStop(0, '#383838');
    bGrad.addColorStop(0.5, '#dcdcdc');
    bGrad.addColorStop(1, '#383838');
    bCtx.fillStyle = bGrad;
    bCtx.fillRect(x, 0, colW, size);
  }

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, y, size, 3);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, y + 3, size, 2);

    bCtx.fillStyle = '#242424';
    bCtx.fillRect(0, y, size, 3);
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 2);
  map.anisotropy = maxAniso;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3, 2);
  bumpMap.anisotropy = maxAniso;

  return { map, bumpMap };
}

export function createTimberTextures(
  maxAniso: number,
  dark = false
): MaterialTextureSet {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bump = document.createElement('canvas');
  bump.width = size;
  bump.height = size;
  const bCtx = bump.getContext('2d')!;

  const rand = createPrng(dark ? 911 : 407);
  ctx.fillStyle = dark ? '#312119' : '#613e2a';
  ctx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#888888';
  bCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 90; i++) {
    const x = rand() * size;
    const w = 1 + rand() * 3;
    ctx.fillStyle =
      rand() > 0.5
        ? dark
          ? 'rgba(20, 12, 8, 0.35)'
          : 'rgba(48, 28, 18, 0.25)'
        : dark
        ? 'rgba(84, 58, 42, 0.18)'
        : 'rgba(130, 88, 60, 0.22)';
    ctx.fillRect(x, 0, w, size);

    bCtx.fillStyle =
      rand() > 0.5 ? 'rgba(40,40,40,0.4)' : 'rgba(210,210,210,0.3)';
    bCtx.fillRect(x, 0, w, size);
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = maxAniso;

  const bumpMap = new THREE.CanvasTexture(bump);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.anisotropy = maxAniso;

  return { map, bumpMap };
}

export function createCourtyardPaverTextures(
  maxAniso: number
): MaterialTextureSet {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;

  const rand = createPrng(513);
  ctx.fillStyle = '#8d96ab';
  ctx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#c8c8c8';
  rCtx.fillRect(0, 0, size, size);

  const grid = 8;
  const step = size / grid;
  for (let gy = 0; gy < grid; gy++) {
    for (let gx = 0; gx < grid; gx++) {
      const shade = 152 + Math.floor((rand() - 0.5) * 26);
      ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 12})`;
      ctx.fillRect(gx * step + 2, gy * step + 2, step - 4, step - 4);

      const rVal = 175 + Math.floor(rand() * 45);
      rCtx.fillStyle = `rgb(${rVal}, ${rVal}, ${rVal})`;
      rCtx.fillRect(gx * step + 2, gy * step + 2, step - 4, step - 4);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(12, 12);
  map.anisotropy = maxAniso;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(12, 12);
  roughnessMap.anisotropy = maxAniso;

  return { map, bumpMap: roughnessMap, roughnessMap };
}

export function createKoiPondTexture(maxAniso: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const rand = createPrng(777);

  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
  grad.addColorStop(0, '#1e5b7a');
  grad.addColorStop(0.55, '#133f5e');
  grad.addColorStop(1, '#0c2740');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Gentle water ripples
  ctx.strokeStyle = 'rgba(130, 212, 255, 0.22)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 14; i++) {
    const cx = 64 + rand() * 384;
    const cy = 64 + rand() * 384;
    const r = 18 + rand() * 48;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Stylized Koi silhouettes (coral-gold & white)
  for (let i = 0; i < 8; i++) {
    const kx = 90 + rand() * 330;
    const ky = 90 + rand() * 330;
    const angle = rand() * Math.PI * 2;
    ctx.save();
    ctx.translate(kx, ky);
    ctx.rotate(angle);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 138, 72, 0.82)' : 'rgba(248, 240, 224, 0.78)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Lily pads
  for (let i = 0; i < 18; i++) {
    const lx = 48 + rand() * 416;
    const ly = 48 + rand() * 416;
    ctx.fillStyle = 'rgba(56, 118, 92, 0.78)';
    ctx.beginPath();
    ctx.arc(lx, ly, 7 + rand() * 7, 0.2, Math.PI * 1.9);
    ctx.lineTo(lx, ly);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  return tex;
}

export function createKanjiBannerTexture(
  chars: string,
  variant: 'cobalt' | 'ivory' = 'cobalt'
): THREE.CanvasTexture {
  const w = 256;
  const h = 640;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const isCobalt = variant === 'cobalt';
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  if (isCobalt) {
    bg.addColorStop(0, '#13244b');
    bg.addColorStop(0.5, '#1b356b');
    bg.addColorStop(1, '#0e1b38');
  } else {
    bg.addColorStop(0, '#ece6d8');
    bg.addColorStop(0.5, '#f6f2e9');
    bg.addColorStop(1, '#dcd4c2');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Ornate gold double trim border
  ctx.strokeStyle = isCobalt ? '#d4af5a' : '#253c6e';
  ctx.lineWidth = 8;
  ctx.strokeRect(14, 14, w - 28, h - 28);
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, w - 48, h - 48);

  // Top Soul Society diamond / lotus emblem
  const cx = w / 2;
  ctx.strokeStyle = isCobalt ? '#f5dc99' : '#b88b32';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, 44);
  ctx.lineTo(cx + 34, 82);
  ctx.lineTo(cx, 120);
  ctx.lineTo(cx - 34, 82);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = isCobalt ? '#f5dc99' : '#253c6e';
  ctx.beginPath();
  ctx.arc(cx, 82, 10, 0, Math.PI * 2);
  ctx.fill();

  // Vertical Kanji Characters
  const glyphList = Array.from(chars);
  const startY = 175;
  const availableH = h - 220;
  const stepY = availableH / Math.max(1, glyphList.length);
  const fontSize = glyphList.length <= 3 ? 86 : 62;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${fontSize}px "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif`;

  glyphList.forEach((ch, idx) => {
    const cy = startY + stepY * (idx + 0.4);
    ctx.fillStyle = isCobalt ? 'rgba(0,0,0,0.45)' : 'rgba(201,166,91,0.35)';
    ctx.fillText(ch, cx + 3, cy + 3);
    ctx.fillStyle = isCobalt ? '#f7e5b4' : '#182b52';
    ctx.fillText(ch, cx, cy);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSkyCrestTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const c = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Outer celestial aura
  const glow = ctx.createRadialGradient(c, c, 24, c, c, 235);
  glow.addColorStop(0, 'rgba(255, 224, 150, 0.55)');
  glow.addColorStop(0.45, 'rgba(201, 166, 91, 0.25)');
  glow.addColorStop(1, 'rgba(201, 166, 91, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  // Fine outer halo ring
  ctx.strokeStyle = 'rgba(255, 228, 162, 0.82)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(c, c, 198, 0, Math.PI * 2);
  ctx.stroke();

  // Inner crescent moon crest (characteristic Soul Society sky emblem)
  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, 148, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 238, 188, 0.9)';
  ctx.fill();

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(c - 34, c - 26, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Center four-point star diamond
  ctx.fillStyle = 'rgba(255, 244, 210, 0.92)';
  ctx.beginPath();
  ctx.moveTo(c - 18, c - 52);
  ctx.lineTo(c - 6, c - 30);
  ctx.lineTo(c + 16, c - 18);
  ctx.lineTo(c - 6, c - 6);
  ctx.lineTo(c - 18, c + 16);
  ctx.lineTo(c - 30, c - 6);
  ctx.lineTo(c - 52, c - 18);
  ctx.lineTo(c - 30, c - 30);
  ctx.closePath();
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    size * 0.08,
    size * 0.5,
    size * 0.5,
    size * 0.5
  );
  grad.addColorStop(0, 'rgba(3, 5, 14, 0.72)');
  grad.addColorStop(0.5, 'rgba(3, 5, 14, 0.34)');
  grad.addColorStop(1, 'rgba(3, 5, 14, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createReiatsuSigilTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const c = size / 2;

  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(201, 166, 91, 0.85)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(c, c, 215, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(111, 183, 255, 0.65)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(c, c, 175, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.strokeStyle =
      i % 3 === 0 ? 'rgba(201, 166, 91, 0.75)' : 'rgba(111, 183, 255, 0.4)';
    ctx.lineWidth = i % 3 === 0 ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(a) * 115, c + Math.sin(a) * 115);
    ctx.lineTo(c + Math.cos(a) * 212, c + Math.sin(a) * 212);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(244, 241, 234, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const x = c + Math.cos(a) * 110;
    const y = c + Math.sin(a) * 110;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
