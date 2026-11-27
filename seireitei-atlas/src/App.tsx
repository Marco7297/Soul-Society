import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import rawLocations from './data/locations.json';
import { LiveAnimeAtmosphere, AnimeAtmosphereMode } from './LiveAnimeAtmosphere';
import { ReiatsuVisualizer } from './ReiatsuVisualizer';
import { AtlasViewOverlay } from './AtlasViewOverlay';
import LoadingLines from '@/components/ui/loading-lines';
import { CharacterLoreSection } from './CharacterLoreSection';
import { GoteiDivisionsDirectory } from './GoteiDivisionsDirectory';
import { KidoSpellbook } from './KidoSpellbook';
import { ZanpakutoCompendium } from './ZanpakutoCompendium';
import { RoyalGuardDossier } from './RoyalGuardDossier';
import { BleachAudioSynthesizer } from './BleachAudioSynthesizer';
import { BleachSoundboardModal } from './BleachSoundboardModal';
import { SoulSociety3DView } from './three/SoulSociety3DView';
import type { SoulSocietySceneId } from './three/scenes';
import { SoulReaperArchiveModal } from './SoulReaperArchiveModal';
import { useAuth } from './contexts/AuthContext';

gsap.registerPlugin(ScrollTrigger);

export interface LocationImage {
  url: string;
  title: string;
  caption: string;
}

interface LocationItem {
  id: string;
  name: string;
  jp: string;
  region: string;
  position: { x: number; y: number };
  cameraPose: { x: number; y: number; zoom: number };
  modelComponent: string;
  summary: string;
  architecture: string;
  purpose: string;
  residents: string[];
  events: string[];
  trivia: string;
  spoilerLevel: string;
  sources: string[];
  details: string;
  images?: LocationImage[];
}

interface PictureDetail {
  id: string;
  name: string;
  jp: string;
  badge: string;
  image: string;
  animeArc: string;
  episodes: string;
  visualBreakdown: string;
  animeEvents: string[];
  characters: string[];
  spiritualProperties: string;
  trivia: string;
}

const locations: LocationItem[] = rawLocations as LocationItem[];

const symbol = (
  <svg className="wordmark-symbol" viewBox="0 0 42 42" aria-hidden="true">
    <path d="M7 18h28M11 13h20M14 18v17M28 18v17M9 35h24M17 13V8h8v5M20 35V23h4v12" />
    <circle cx="30" cy="8" r="4" />
    <path className="moon-cut" d="M31 5a5 5 0 1 0 0 8 4 4 0 1 1 0-8Z" />
  </svg>
);

const sceneWaypoints = [
  { index: 0, progress: 0.0, label: '01 / 瀞霊廷全景 • SEIREITEI CITADEL', title: 'Seireitei Citadel' },
  { index: 1, progress: 0.125, label: '02 / 四大瀞霊門 • 4 PURE SOUL GATES', title: 'Four Pure Soul Gates' },
  { index: 2, progress: 0.25, label: '03 / 中央大通 • GOTEI 13 PROMENADE', title: 'Gotei 13 Promenade' },
  { index: 3, progress: 0.375, label: '04 / 双殛の丘 • SŌKYOKU EXECUTION MESA', title: 'Sōkyoku Hill' },
  { index: 4, progress: 0.50, label: '05 / 結界開門 • THE INNER BARRIER GATE', title: 'Inner Barrier Gate' },
  { index: 5, progress: 0.625, label: '06 / 一番隊舎 • 1ST DIVISION COMMAND', title: 'First Division Barracks' },
  { index: 6, progress: 0.75, label: '07 / 中央四十六室 • CENTRAL 46 ASSEMBLY', title: 'Central 46 Assembly' },
  { index: 7, progress: 0.875, label: '08 / 大霊書回廊 • DAIREISHOSHITSU ARCHIVES', title: 'Great Spirit Archives' },
  { index: 8, progress: 1.0, label: '09 / 霊王宮 • THE ROYAL REALM (REIŌKYŪ)', title: 'Royal Realm (Reiōkyū)' },
];

const pictureDetailsData: Record<string, PictureDetail> = {
  hero: {
    id: 'hero',
    name: 'Citadel of the Soul Reapers',
    jp: '瀞霊廷 (Seireitei — Court of Pure Souls)',
    badge: 'SCENE 01 / PANORAMA',
    image: '/seireitei-home.webp',
    animeArc: 'Soul Society Arc & Thousand-Year Blood War',
    episodes: 'Bleach Episodes 21–63, TYBW Ep 1–26',
    visualBreakdown:
      'A high-altitude celestial survey of Seireitei floating above the sea of clouds. White Sekkiseki battlements ring the circular metropolis, with concentric military barracks and pagodas rising toward the Captain-Commander’s palace and the Sōkyoku execution mesa.',
    animeEvents: [
      'Kūkaku Shiba’s spirit cannon launches Ichigo, Orihime, Uryū, and Chad into the upper barrier of Seireitei in a sphere of compressed spiritual pressure.',
      'The Gotei 13 sounds the emergency alarm across all districts, initiating martial law against the Ryōka (spiritual intruders).',
      'During the Thousand-Year Blood War, Yhwach’s Quincy army replaces the physical buildings of Seireitei with the ice towers of the Silbern.',
    ],
    characters: ['Genryūsai Shigekuni Yamamoto', 'Shunsui Kyōraku', 'Byakuya Kuchiki', 'Yhwach', 'All 13 Gotei Captains'],
    spiritualProperties:
      'The city is constructed from concentrated Reishi (spirit matter). Living beings in Seireitei age at a drastically reduced rate and possess spiritual metabolism, requiring food to restore Reiatsu.',
    trivia:
      'Seireitei measures approximately 400 ri (around 1,570 kilometers) in circumference, surrounded completely by the 80 outer districts of Rukongai.',
  },
  gate: {
    id: 'gate',
    name: 'The Four Great Pure Soul Gates',
    jp: '四大瀞霊門 (Shidai Seireimon)',
    badge: 'SCENE 02 / OUTER THRESHOLD',
    image: '/seireitei-gate.webp',
    animeArc: 'The Sneak Entry Arc',
    episodes: 'Bleach Episodes 21–24',
    visualBreakdown:
      'The monumental Sekkiseki portal and stone ramparts marking the western White Road Gate (Hakutōmon). The gateway bridges an abyss, framed by imposing battle towers, high banners, and deep spiritual defensive arrays.',
    animeEvents: [
      'Ichigo Kurosaki engages and defeats the western gatekeeper, the giant Jidanbō Ikkanzaka, winning his respect.',
      'When Jidanbō raises the heavy gate to let Ichigo pass, 3rd Division Captain Gin Ichimaru appears behind the threshold, critically wounding Jidanbō and repelling Ichigo’s group with his extending Zanpakutō, Shinsō (“Shoot to kill!”).',
    ],
    characters: ['Jidanbō Ikkanzaka', 'Gin Ichimaru', 'Ichigo Kurosaki', 'Yoruichi Shihōin', 'Genshirō Okikiba'],
    spiritualProperties:
      'Carved from rare Sekkiseki stone that repels and diffuses spiritual energy. When closed, it projects a spherical barrier over and underneath the capital, neutralizing spirit-based flight or spatial teleportation.',
    trivia:
      'The four gates are named Hakutōmon (West), Shuryūmon (East), Kokuryōmon (North), and Shōyōmon (South), each guarded by an elite giant chosen for immense physical strength.',
  },
  promenade: {
    id: 'promenade',
    name: 'Inner Processional Promenade',
    jp: '瀞霊廷 大路 (Seireitei Processional Avenue)',
    badge: 'SCENE 03 / CEREMONIAL AXIS',
    image: '/seireitei-promenade.webp',
    animeArc: 'Soul Society Rescue Arc',
    episodes: 'Bleach Episodes 25–40',
    visualBreakdown:
      'A wide, polished stone thoroughfare bordered by decorative balustrades, blue squad pennants, and spirit lanterns. The avenue connects the perimeter gates with the inner military quarters and the elevated skyway leading to the execution tower.',
    animeEvents: [
      'Ichigo, Uryū, Chad, and Orihime scatter through these avenues after breaching the aerial barrier, evading patrol squads.',
      '11th Division officers Ikkaku Madarame and Yumichika Ayasegawa intercept the intruders along these paved avenues.',
      'Lieutenant Renji Abarai ambushes Ichigo along this path, sparking their high-stakes duel where Ichigo awakens his Shikai mastery.',
    ],
    characters: ['Ichigo Kurosaki', 'Renji Abarai', 'Ikkaku Madarame', 'Yumichika Ayasegawa', 'Hanatarō Yamada'],
    spiritualProperties:
      'Paved with Reiatsu-absorbing pavers that insulate military quarters against collateral damage from Hadō spells during peacetime duels.',
    trivia:
      'Lower-ranked Shinigami are legally required to step aside and bow when a Captain wearing the white Haori cloak walks along the center flagstones.',
  },
  palace: {
    id: 'palace',
    name: 'Central Palace & Sōkyoku Rise',
    jp: '中央本宮・双殛の丘 (Central Palace & Sōkyoku Hill)',
    badge: 'SCENE 04 / SANCTUARY & EXECUTION',
    image: '/seireitei-palace.webp',
    animeArc: 'Soul Society Climax & Execution Arc',
    episodes: 'Bleach Episodes 54–62',
    visualBreakdown:
      'The sacred vertical heart of Soul Society, where white stone towers and blue-roofed halls crown the rocky mesa overlooking the capital. Here sits the Sōkyoku execution stand, surrounded by panoramic views of the afterlife realm.',
    animeEvents: [
      'Rukia Kuchiki is led to the Sōkyoku hill for execution. Ichigo arrives at the final second and stops the flaming Phoenix halberd barehanded.',
      'Shunsui Kyōraku and Jūshirō Ukitake deploy the Shihōin crest shield to shatter the execution halberd.',
      'Ichigo unleashes Bankai (Tensa Zangetsu) in an epic duel against Captain Byakuya Kuchiki’s Senbonzakura Kageyoshi.',
      'Sōsuke Aizen reveals his betrayal, rips the Hōgyoku from Rukia’s soul, and ascends to Hueco Mundo via Menos Grande Negación beams.',
    ],
    characters: ['Ichigo Kurosaki', 'Byakuya Kuchiki', 'Rukia Kuchiki', 'Sōsuke Aizen', 'Shunsui Kyōraku', 'Jūshirō Ukitake'],
    spiritualProperties:
      'The Sōkyoku halberd holds the destructive energy of one million Zanpakutō, multiplying tenfold upon piercing its target to vaporize the soul down to raw Reishi particles.',
    trivia:
      'Beneath Sōkyoku Hill is a secret underground training cavern built by Kisuke Urahara and Yoruichi Shihōin, shielded from spiritual detection and used for rapid Bankai training.',
  },
  openingGate: {
    id: 'openingGate',
    name: 'The Opening Inner Gate',
    jp: '結界昇殿門 (Inner Barrier Shōden Gate)',
    badge: 'SCENE 05 / SACRED PORTAL',
    image: '/seireitei-opening-gate.webp',
    animeArc: 'Infiltration & Central Penetration',
    episodes: 'Bleach Episodes 28–35',
    visualBreakdown:
      'Massive blue-and-gold ceremonial double doors reinforced with spiritual iron filigree, sacred Shimenawa rope, and gold crests. As you scroll, the double doors part outward, revealing the inner spiritual city in radiant sunlight.',
    animeEvents: [
      'Central 46 orders the inner security gates locked during the Ryōka alert, creating isolated defensive sectors for each squad.',
      'Lieutenant Nanao Ise and squad sentries establish checkpoints here to restrict movement and isolate potential traitors.',
    ],
    characters: ['Gotei 13 Sentries', 'Nanao Ise', 'Kira Izuru', 'Momo Hinamori'],
    spiritualProperties:
      'Infused with Bakudō #81 Dankū seals that repel spiritual projection and contain explosive Kidō shockwaves from escaping into noble residential sectors.',
    trivia:
      'Interactive feature: As you scroll past this scene, the double doors physically swing open in real time to welcome the viewer deeper into Soul Society.',
  },
  mainBuilding: {
    id: 'mainBuilding',
    name: 'First Division Headquarters',
    jp: '一番隊舎 (First Division Barracks & Supreme Command)',
    badge: 'SCENE 06 / SUPREME HEADQUARTERS',
    image: '/seireitei-main-building.webp',
    animeArc: 'War Councils & Central Administration',
    episodes: 'Bleach Episodes 24, 53, 367+',
    visualBreakdown:
      'The grand traditional Japanese castle estate of the First Division. Featuring curved cobalt blue gables, multi-tiered watchtowers, expansive tatami meeting suites, and the black-and-white chrysanthemum standard of the Captain-Commander.',
    animeEvents: [
      'Captain-Commander Genryūsai Yamamoto convenes emergency war councils with all 13 captains in the central hall.',
      'After the fall of Yamamoto in the Quincy invasion, Shunsui Kyōraku takes command of the First Division and addresses the surviving officers here.',
    ],
    characters: ['Genryūsai Shigekuni Yamamoto', 'Shunsui Kyōraku', 'Chōjirō Sasakibe', 'Nanao Ise'],
    spiritualProperties:
      'Permeated by the residual spiritual warmth of Yamamoto’s flame Zanpakutō, Ryūjin Jakka, the oldest and most devastating fire-type blade in Soul Society history.',
    trivia:
      'The compound includes the Captain-Commander’s private tea arbor where Yamamoto, Kyōraku, and Ukitake met for over 200 years to discuss the balance of worlds.',
  },
  throneHall: {
    id: 'throneHall',
    name: 'Captains’ Council Chamber & Central 46',
    jp: '隊首会議室・中央四十六室 (Council Hall & Central 46)',
    badge: 'SCENE 07 / SUPREME TRIBUNAL',
    image: '/seireitei-throne-hall.webp',
    animeArc: 'Soul Society Arc Climax & Aizen Betrayal',
    episodes: 'Bleach Episodes 34, 58–61',
    visualBreakdown:
      'A majestic vaulted hall with high stained-glass windows, a long ceremonial indigo carpet, towering pillars, and rows of Captains in white Haori cloaks gathered before the Supreme Dais.',
    animeEvents: [
      'The 13 Gotei Captains assemble in two formal rows to hear judicial proclamations regarding the human world and treason charges.',
      'Tōshirō Hitsugaya and Rangiku Matsumoto break into the underground chamber only to discover that Aizen had slaughtered the entire Central 46 council weeks earlier.',
    ],
    characters: ['Sōsuke Aizen', 'Tōshirō Hitsugaya', 'Rangiku Matsumoto', 'Gin Ichimaru', 'The Central 46'],
    spiritualProperties:
      'Protected by Tenteikūra spiritual silence barriers that prevent auditory and Reiatsu signals from leaking outside the judicial perimeter.',
    trivia:
      'Central 46 comprises 40 wise scholars and 6 high judges chosen from across Soul Society; its decrees carry absolute legal authority over all Shinigami.',
  },
  library: {
    id: 'library',
    name: 'Archives of the Spiritual Arts',
    jp: '真央霊術院大文庫 (Shin’ō Academy Great Archives)',
    badge: 'SCENE 08 / SACRED ARCHIVE',
    image: '/seireitei-library.webp',
    animeArc: 'Turn Back the Pendulum & Lore Foundations',
    episodes: 'Bleach Episodes 206–212',
    visualBreakdown:
      'A vast cathedral-like repository with soaring carved wooden bookshelves, spiral staircases, golden armillary celestial spheres, and sun-drenched arched windows illuminating thousands of ancient scrolls.',
    animeEvents: [
      'Academy students master the foundational arts: Zanjutsu (swordsmanship), Hakuda (unarmed combat), Hōhō (movement), and Kidō (Hadō and Bakudō incantations).',
      'Kisuke Urahara and Mayuri Kurotsuchi referenced these classified archives when constructing the Soul Society Research and Development Institute (S.R.D.I.).',
    ],
    characters: ['Kisuke Urahara', 'Mayuri Kurotsuchi', 'Shunsui Kyōraku', 'Jūshirō Ukitake', 'Academy Scholars'],
    spiritualProperties:
      'Ancient parchment scrolls are coated with spirit-sealing lacquer to prevent the ink and Reiatsu records from degrading over centuries.',
    trivia:
      'The archives house the historical register of all Soul Burials (Konsō) performed since the inception of the Gotei 13 over one millennium ago.',
  },
  reiokyu: {
    id: 'reiokyu',
    name: 'Reiōkyū (Soul King Palace)',
    jp: '霊王宮 (Royal Realm & Five Floating Discs)',
    badge: 'SCENE 09 / THE PINNACLE',
    image: '/seireitei-reiokyu.webp',
    animeArc: 'Thousand-Year Blood War Arc',
    episodes: 'Bleach: TYBW Episodes 8–26',
    visualBreakdown:
      'The transcendent holy domain floating far above the cloud ceiling of Soul Society. Five circular disc cities—Kirinden, Gatonden, Hōōden, Senjumaru Palace, and the Hyōsube Sanctuary—orbit the great central palace tower of the Soul King, connected by divine light bridges with waterfalls cascading into the heavens below.',
    animeEvents: [
      'Squad Zero descends in the Tenchūren pillar palanquin to evacuate the grievously injured Ichigo, Rukia, Renji, and Byakuya Kuchiki after the initial Quincy slaughter.',
      'Tenjirō Kirinji subjects Ichigo and Byakuya to the restorative waters of the White Bone Hell and Blood Pond Hell hot springs.',
      'Kirio Hikifune feeds the soul reapers spirit-dense cuisine in Gatonden to dramatically bolster their spiritual core.',
      'Ōetsu Nimaiya forces Ichigo to confront his true origin among hundreds of Asauchi in Hōōden, culminating in the historic forging of the true dual-blade Zangetsu.',
      'Senjumaru Shutara weaves Reiatsu-dense protective clothes, and later unleashes her catastrophic Bankai Shatshu Gagara Garami, shaking all three realms simultaneously.',
      'Ichibē Hyōsube battles Quincy King Yhwach at the palace entrance using Ichimonji, blotting out names and reducing Yhwach’s power to that of a black ant.',
    ],
    characters: [
      'Reiō (The Soul King)',
      'Ichibē Hyōsube (Monk of the Real Name)',
      'Ōetsu Nimaiya (Sword God)',
      'Senjumaru Shutara (Great Weave Guard)',
      'Tenjirō Kirinji (Hot Spring Demon)',
      'Kirio Hikifune (Ruler of Grain)',
      'Ichigo Kurosaki',
      'Yhwach',
    ],
    spiritualProperties:
      'The realm possesses the highest Reishi density in existence. Shielded by 72 separate spiritual barriers and spatial folds, entry without an Ōken (Royal Key) woven into one’s bones leads to instant cellular obliteration.',
    trivia:
      'The Soul King is the primordial linchpin whose passive spiritual regulation prevents the World of the Living, Soul Society, and Hueco Mundo from colliding and collapsing back into primordial chaos.',
  },
};

function ProceduralModelSvg({ kind = 'city', accent = '#6FB7FF' }: { kind?: 'city' | 'gate'; accent?: string }) {
  const roof = (x: number, y: number, w: number, h: number, color = accent) => (
    <g key={`${x}-${y}`}>
      <path d={`M${x - 8} ${y}L${x + w / 2} ${y - h}L${x + w + 8} ${y}Z`} fill={color} opacity="0.9" />
      <path d={`M${x + 5} ${y + 5}h${w - 10}v${h * 0.72}H${x + 5}z`} fill="#e9e5da" opacity="0.9" />
    </g>
  );

  const lanterns = Array.from({ length: 7 }, (_, i) => (
    <circle key={i} cx={130 + i * 92} cy={342 - (i % 2) * 22} r="4" fill="#C9A65B" className="lantern-glow" />
  ));

  return (
    <svg className="procedural-model-svg" viewBox="0 0 1100 520" role="img" aria-label="Procedural architectural model of Soul Society">
      <defs>
        <linearGradient id="fog" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#6FB7FF" stopOpacity="0.3" />
          <stop offset="1" stopColor="#05060F" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d="M0 438Q240 362 550 420T1100 414v106H0Z" fill="#11182a" />
      <path d="M0 430Q260 360 540 414T1100 405" fill="none" stroke="#6FB7FF" strokeOpacity="0.38" strokeWidth="2" />
      <g className="model-structures">
        {kind === 'gate' ? (
          <>
            {roof(420, 300, 300, 112, '#C8372D')}
            <path d="M380 430v-110h90v110M670 430V320h90v110" fill="#ece9df" />
            <path d="M500 430V275h140v155" fill="none" stroke="#F4F1EA" strokeWidth="18" />
            <path d="M498 275h144" stroke="#C9A65B" strokeWidth="5" />
          </>
        ) : (
          <>
            {roof(180, 328, 190, 118)}
            {roof(420, 304, 240, 142, '#C9A65B')}
            {roof(730, 332, 200, 100, '#6FB7FF')}
            <path d="M178 330h194v105H178M418 307h244v128H418M728 335h204v100H728" fill="#e8e4d8" opacity="0.88" />
            <path d="M515 307v-85h50v85M538 222v-58" stroke="#F4F1EA" strokeWidth="13" fill="none" />
            <path d="M508 165h60" stroke="#C9A65B" strokeWidth="3" />
          </>
        )}
      </g>
      <path d="M70 410h980" stroke="#C9A65B" strokeOpacity="0.7" />
      <path d="M90 450h930" stroke="#F4F1EA" strokeOpacity="0.18" strokeDasharray="3 10" />
      {lanterns}
      <path d="M0 372Q280 295 560 350T1100 338v110H0Z" fill="url(#fog)" opacity="0.55" />
      <g fill={accent} opacity="0.8" filter="url(#glow)">
        <circle cx="112" cy="116" r="2" />
        <circle cx="870" cy="92" r="3" />
        <circle cx="965" cy="205" r="2" />
      </g>
    </svg>
  );
}

const particles = Array.from({ length: 72 }, (_, i) => {
  const x = (i * 47) % 100;
  const y = (i * 71) % 100;
  const size = 1 + (i % 3);
  return {
    key: i,
    style: {
      '--x': `${x}%`,
      '--y': `${y}%`,
      '--s': `${size}px`,
      '--d': `${7 + (i % 7)}s`,
      '--delay': `-${i % 9}s`,
    } as React.CSSProperties,
  };
});

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const ramp = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
const ease = (value: number) => 1 - Math.pow(1 - value, 3);

function sceneOpacity(progress: number, start: number, end: number) {
  return ease(ramp(progress, start, end)) * (1 - ease(ramp(progress, end, end + 0.1)));
}

function getSceneParallax(progress: number, center: number) {
  const diff = progress - center;
  const clampedDiff = Math.max(-0.25, Math.min(0.25, diff));
  const translateY = clampedDiff * -85;
  const scale = Math.max(0.97, Math.min(1.05, 1.025 - Math.abs(clampedDiff) * 0.22));
  const copyTranslateY = clampedDiff * 35;
  return {
    imageTransform: `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
    copyTransform: `translate3d(0, ${copyTranslateY.toFixed(1)}px, 0)`,
  };
}

/**
 * Procedural Web Audio Synthesizer for low-volume ambient 'Temple Wind' & Chimes
 * Generates soft pink-noise wind breeze with organic LFO modulation and
 * ethereal pentatonic temple bell resonances (風鈴 - Fūrin) without external audio files.
 */
class TempleWindAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private lfo: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private windGain: GainNode | null = null;
  private chimesInterval: number | null = null;
  private isPlaying: boolean = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public async start(): Promise<boolean> {
    try {
      this.init();
      if (!this.ctx) return false;
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Master gain node with safe, low-volume ambient ceiling
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.09, now + 1.2);
      this.masterGain.connect(this.ctx.destination);

      // Soft pink noise buffer for warm wind gusts
      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      // Resonant bandpass filter
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'bandpass';
      this.filter.frequency.setValueAtTime(320, now);
      this.filter.Q.setValueAtTime(1.8, now);

      // Lowpass warming filter to eliminate harshness
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(750, now);

      // LFO for slow ambient wind gusts (~8.3s cycle)
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = 'sine';
      this.lfo.frequency.setValueAtTime(0.12, now);

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(160, now);

      this.lfo.connect(lfoGain);
      lfoGain.connect(this.filter.frequency);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.45, now);

      this.noiseNode.connect(this.filter);
      this.filter.connect(lowpass);
      lowpass.connect(this.windGain);
      this.windGain.connect(this.masterGain);

      this.noiseNode.start(now);
      this.lfo.start(now);

      // Ethereal temple wind bells (Hirajōshi/pentatonic resonant ringing)
      const chimeFreqs = [587.33, 659.25, 783.99, 880.0, 987.77, 1174.66, 1318.51];
      const triggerChime = () => {
        if (!this.ctx || !this.masterGain || !this.isPlaying) return;
        const time = this.ctx.currentTime;
        const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        const overtone = this.ctx.createOscillator();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2.756, time);

        const chimeGain = this.ctx.createGain();
        chimeGain.gain.setValueAtTime(0.0001, time);
        chimeGain.gain.linearRampToValueAtTime(0.024, time + 0.03);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, time + 2.8);

        const overtoneGain = this.ctx.createGain();
        overtoneGain.gain.setValueAtTime(0.0001, time);
        overtoneGain.gain.linearRampToValueAtTime(0.006, time + 0.02);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

        osc.connect(chimeGain);
        overtone.connect(overtoneGain);
        chimeGain.connect(this.masterGain);
        overtoneGain.connect(this.masterGain);

        osc.start(time);
        overtone.start(time);
        osc.stop(time + 3.0);
        overtone.stop(time + 1.5);
      };

      setTimeout(triggerChime, 800);

      this.chimesInterval = window.setInterval(() => {
        if (Math.random() > 0.25) {
          triggerChime();
        }
      }, 3400);

      this.isPlaying = true;
      return true;
    } catch {
      return false;
    }
  }

  public stop() {
    if (!this.ctx || !this.masterGain) {
      this.isPlaying = false;
      return;
    }
    try {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      if (this.chimesInterval) {
        clearInterval(this.chimesInterval);
        this.chimesInterval = null;
      }

      setTimeout(() => {
        try {
          this.noiseNode?.stop();
          this.noiseNode?.disconnect();
          this.lfo?.stop();
          this.lfo?.disconnect();
          this.masterGain?.disconnect();
        } catch {
          // ignore
        }
        this.isPlaying = false;
      }, 700);
    } catch {
      this.isPlaying = false;
    }
  }

  public get active(): boolean {
    return this.isPlaying;
  }
}

/**
 * Synthesizes the authentic 'Shikai' (始解) Zanpakutō activation sound effect
 * from the Bleach anime using Web Audio API:
 * - High-tensile steel blade draw & metallic ring overtone
 * - Spiritual energy (Reiatsu) resonant burst whoosh
 * - Pentatonic high Reishi bell shimmer
 * - Deep sub-bass resonance anchoring the spiritual pressure
 */
class ShikaiSoundEffect {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public async play() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Master output gain / limiter
      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.32, now);
      master.connect(this.ctx.destination);

      // 1. ZANPAKUTŌ BLADE DRAW / METALLIC SHEEN RESONANCE (Crystalline ringing steel)
      const bladeHarmonics = [
        { freq: 1174.66, gain: 0.28, type: 'sine' as OscillatorType, decay: 1.1 },
        { freq: 1760.0, gain: 0.18, type: 'triangle' as OscillatorType, decay: 0.95 },
        { freq: 2349.32, gain: 0.14, type: 'sine' as OscillatorType, decay: 0.75 },
        { freq: 3520.0, gain: 0.08, type: 'sine' as OscillatorType, decay: 0.5 },
      ];

      bladeHarmonics.forEach((h) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = h.type;
        // Pitch settled curve mimicking blade drawn from saya
        osc.frequency.setValueAtTime(h.freq * 1.07, now);
        osc.frequency.exponentialRampToValueAtTime(h.freq, now + 0.05);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(h.gain, now + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

        osc.connect(g);
        g.connect(master);
        osc.start(now);
        osc.stop(now + h.decay + 0.05);
      });

      // 2. REIATSU SPIRIT PRESSURE SWELL (Anime energy sweep)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.75);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.Q.setValueAtTime(5.0, now);
      bandpass.frequency.setValueAtTime(280, now);
      bandpass.frequency.exponentialRampToValueAtTime(1600, now + 0.16);
      bandpass.frequency.exponentialRampToValueAtTime(400, now + 0.65);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(0.26, now + 0.035);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(master);
      noise.start(now);
      noise.stop(now + 0.75);

      // 3. REISHI ETHEREAL CHIME (High spiritual shimmer)
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(987.77, now + 0.04); // B5
      chime.frequency.exponentialRampToValueAtTime(1479.98, now + 0.14); // F#6

      chimeGain.gain.setValueAtTime(0.0001, now);
      chimeGain.gain.setValueAtTime(0.001, now + 0.04);
      chimeGain.gain.linearRampToValueAtTime(0.19, now + 0.12);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

      chime.connect(chimeGain);
      chimeGain.connect(master);
      chime.start(now + 0.04);
      chime.stop(now + 1.0);

      // 4. SUB-BASS REIATSU SLAM (Impact presence)
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(130, now);
      sub.frequency.exponentialRampToValueAtTime(50, now + 0.3);

      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.linearRampToValueAtTime(0.24, now + 0.02);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      sub.connect(subGain);
      subGain.connect(master);
      sub.start(now);
      sub.stop(now + 0.45);
    } catch (e) {
      console.warn('Shikai sound effect error:', e);
    }
  }
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [activeRegion, setActiveRegion] = useState('All regions');
  const [activeLocation, setActiveLocation] = useState(0);
  const [carouselSlide, setCarouselSlide] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
    caption: string;
    index: number;
  } | null>(null);
  const [activePictureDetail, setActivePictureDetail] = useState<PictureDetail | null>(null);
  const { user, bookmarks, toggleBookmark, signInWithGoogle } = useAuth();
  const [threeDViewOpen, setThreeDViewOpen] = useState(false);
  const [threeDSceneId, setThreeDSceneId] = useState<SoulSocietySceneId>('seireitei');
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archivePrefillLoc, setArchivePrefillLoc] = useState<string | undefined>(undefined);
  const [archivePrefillScene, setArchivePrefillScene] = useState<SoulSocietySceneId>('seireitei');
  const [compendiumOpen, setCompendiumOpen] = useState(false);
  const [atlasOpen, setAtlasOpen] = useState(false);
  const [soundboardOpen, setSoundboardOpen] = useState(false);
  const [isCookingView, setIsCookingView] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [bladeFlash, setBladeFlash] = useState(false);
  const [compendiumTab, setCompendiumTab] = useState<
    'characters' | 'gotei' | 'zanpakuto' | 'kido' | 'royalguard' | 'balance' | 'rukongai' | 'nobles' | 'corps'
  >('characters');
  const [panelOpen, setPanelOpen] = useState(false);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [spoilerLevel, setSpoilerLevel] = useState<'all' | 'soul' | 'tybw'>('all');
  const [isDawn, setIsDawn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSoundscapePlaying, setIsSoundscapePlaying] = useState(false);
  const [liveAnimeEnabled, setLiveAnimeEnabled] = useState(true);
  const [animeAtmosphereMode, setAnimeAtmosphereMode] = useState<AnimeAtmosphereMode>('all');
  const [reiatsuVisualizerEnabled, setReiatsuVisualizerEnabled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const soundscapeRef = useRef<TempleWindAudio | null>(null);
  const shikaiSoundRef = useRef<ShikaiSoundEffect | null>(null);
  const bleachAudioRef = useRef<BleachAudioSynthesizer | null>(null);
  const targetProgressRef = useRef(0);
  const displayedProgressRef = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const headerHideTimeoutRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const isHeaderHoveredRef = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Dynamic Bleach synthesis stage title
  const cookingStageMessage = useMemo(() => {
    if (loadPercent < 22) return 'CALIBRATING SEKKISEKI SPATIAL BARRIER...';
    if (loadPercent < 48) return 'SYNTHESIZING GOTEI 13 BARRACKS & SŌKYOKU HILL...';
    if (loadPercent < 72) return 'HARMONIZING 80 RUKONGAI QUADRANT WARDS...';
    if (loadPercent < 94) return 'STABILIZING REIŌKYŪ (ROYAL REALM) CONDUITS...';
    return '始解 • CITADEL OF PURE SOULS MANIFESTED';
  }, [loadPercent]);

  // Trigger Cooking Soul Society View Sequence
  const triggerCookingSequence = useCallback(() => {
    setIsCookingView(true);
    setLoadPercent(0);
    setBladeFlash(false);
    const startTime = Date.now();
    const duration = 2400; // 2.4s cinematic preloader

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setLoadPercent(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setBladeFlash(true);
        shikaiSoundRef.current?.play();
        setTimeout(() => {
          setBladeFlash(false);
          setIsCookingView(false);
        }, 420);
      }
    }, 28);
  }, []);


  useEffect(() => {
    soundscapeRef.current = new TempleWindAudio();
    shikaiSoundRef.current = new ShikaiSoundEffect();
    bleachAudioRef.current = new BleachAudioSynthesizer();
    return () => {
      soundscapeRef.current?.stop();
    };
  }, []);

  // Automatic menubar disappearance on idle / scroll down, and reveal on mouse move to top edge or scroll up
  useEffect(() => {
    // Initial auto-disappear timer on mount after 3.2s
    headerHideTimeoutRef.current = window.setTimeout(() => {
      if (!isHeaderHoveredRef.current && !menuOpen) {
        setIsHeaderVisible(false);
      }
    }, 3200);

    const handleMouseMove = (e: MouseEvent) => {
      // If mouse is near top edge (within 85px), immediately bring down menubar
      if (e.clientY <= 85) {
        if (headerHideTimeoutRef.current) clearTimeout(headerHideTimeoutRef.current);
        setIsHeaderVisible(true);
      } else if (!isHeaderHoveredRef.current && !menuOpen) {
        // When mouse moves down into the page, schedule auto-hide after 2.2s
        if (headerHideTimeoutRef.current) clearTimeout(headerHideTimeoutRef.current);
        headerHideTimeoutRef.current = window.setTimeout(() => {
          if (!isHeaderHoveredRef.current && !menuOpen) {
            setIsHeaderVisible(false);
          }
        }, 2200);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      if (currentScrollY <= 15) {
        // At the very top of the page, show header and then auto-hide after 3.5s
        setIsHeaderVisible(true);
        if (headerHideTimeoutRef.current) clearTimeout(headerHideTimeoutRef.current);
        headerHideTimeoutRef.current = window.setTimeout(() => {
          if (!isHeaderHoveredRef.current && !menuOpen) {
            setIsHeaderVisible(false);
          }
        }, 3500);
      } else if (diff > 8) {
        // Scrolling down -> automatically disappear
        if (headerHideTimeoutRef.current) clearTimeout(headerHideTimeoutRef.current);
        if (!isHeaderHoveredRef.current && !menuOpen) {
          setIsHeaderVisible(false);
        }
      } else if (diff < -12) {
        // Scrolling up -> reveal menubar
        setIsHeaderVisible(true);
        if (headerHideTimeoutRef.current) clearTimeout(headerHideTimeoutRef.current);
        headerHideTimeoutRef.current = window.setTimeout(() => {
          if (!isHeaderHoveredRef.current && !menuOpen) {
            setIsHeaderVisible(false);
          }
        }, 2500);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (headerHideTimeoutRef.current) clearTimeout(headerHideTimeoutRef.current);
    };
  }, [menuOpen]);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  const openPictureDetailWithShikai = useCallback(
    (detail: PictureDetail | null) => {
      if (detail) {
        shikaiSoundRef.current?.play();
        showToast(`始解 • Shikai Release: ${detail.name}`);
      }
      setActivePictureDetail(detail);
    },
    [showToast]
  );

  const toggleLiveAnime = useCallback(() => {
    setLiveAnimeEnabled((prev) => {
      const next = !prev;
      showToast(next ? 'Live anime atmosphere active (60FPS)' : 'Live anime atmosphere paused');
      return next;
    });
  }, [showToast]);

  const toggleReiatsuVisualizer = useCallback(() => {
    setReiatsuVisualizerEnabled((prev) => {
      const next = !prev;
      showToast(next ? 'Reiatsu Spiritual Pressure Visualization Active' : 'Reiatsu Visualization Paused');
      return next;
    });
  }, [showToast]);

  const toggleSoundscape = useCallback(async () => {
    if (!soundscapeRef.current) return;
    if (isSoundscapePlaying) {
      soundscapeRef.current.stop();
      setIsSoundscapePlaying(false);
      showToast('Ambient Reishi wind soundscape paused');
    } else {
      const ok = await soundscapeRef.current.start();
      if (ok) {
        setIsSoundscapePlaying(true);
        showToast('Ambient Reishi wind active (low volume)');
      } else {
        showToast('Audio playback could not be started');
      }
    }
  }, [isSoundscapePlaying, showToast]);

  const scrollToProgress = useCallback((target: number) => {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetScroll = clamp(target) * max;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScroll, {
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleSelectLocation = useCallback((index: number, updateHash = true) => {
    const nextIdx = (index + locations.length) % locations.length;
    setActiveLocation(nextIdx);
    setCarouselSlide(0);
    setPanelOpen(true);
    if (updateHash) {
      window.history.replaceState(null, '', `#${locations[nextIdx].id}`);
    }
  }, []);

  // Lenis Smooth Scroll Engine + GSAP Ticker & ScrollTrigger synchronization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    const onLenisScroll = (e: { scroll: number; limit: number; progress: number }) => {
      ScrollTrigger.update();
      const maxScroll = Math.max(1, e.limit || (document.documentElement.scrollHeight - window.innerHeight));
      const currentProgress = clamp(e.scroll / maxScroll);
      targetProgressRef.current = currentProgress;
      displayedProgressRef.current = currentProgress;
      setProgress(currentProgress);
    };

    lenis.on('scroll', onLenisScroll);

    // Synchronize Lenis with GSAP's high-precision 60/120fps ticker
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const currentProgress = clamp(window.scrollY / maxScroll);
      targetProgressRef.current = currentProgress;
      displayedProgressRef.current = currentProgress;
      setProgress(currentProgress);
    };

    window.addEventListener('resize', onResize, { passive: true });

    // Initial sync
    const initialMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const initialProg = clamp(window.scrollY / initialMax);
    targetProgressRef.current = initialProg;
    displayedProgressRef.current = initialProg;
    setProgress(initialProg);

    return () => {
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause / resume Lenis smooth scroll when fullscreen modal overlays are open
  useEffect(() => {
    if (compendiumOpen || activePictureDetail || atlasOpen || soundboardOpen || threeDViewOpen || archiveOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [compendiumOpen, activePictureDetail, atlasOpen, soundboardOpen, threeDViewOpen, archiveOpen]);

  // GSAP reishi toast message entrance animation
  useEffect(() => {
    if (toastMessage) {
      const toastEl = document.querySelector('.reishi-toast');
      if (toastEl) {
        gsap.fromTo(
          toastEl,
          { y: 24, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.38, ease: 'power3.out' }
        );
      }
    }
  }, [toastMessage]);

  // Sync hash
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const idx = locations.findIndex((l) => l.id === hash);
      if (idx >= 0) {
        handleSelectLocation(idx, false);
      }
    };
    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [handleSelectLocation]);

  // Dawn class toggle on body
  useEffect(() => {
    if (isDawn) {
      document.body.classList.add('dawn');
    } else {
      document.body.classList.remove('dawn');
    }
  }, [isDawn]);

  const currentLoc = locations[activeLocation];

  // Matched picture detail for currently selected location
  const currentPictureDetail = useMemo(() => {
    if (!currentLoc) return pictureDetailsData.hero;
    const nameLower = (currentLoc.name || '').toLowerCase();
    const idLower = (currentLoc.id || '').toLowerCase();
    if (
      nameLower.includes('royal') ||
      nameLower.includes('reiō') ||
      nameLower.includes('reio') ||
      idLower.includes('royal') ||
      idLower.includes('reio')
    ) {
      return pictureDetailsData.reiokyu;
    }
    if (nameLower.includes('gate') || idLower.includes('gate')) {
      return pictureDetailsData.gate;
    }
    if (
      nameLower.includes('sōkyoku') ||
      nameLower.includes('sokyoku') ||
      nameLower.includes('hill') ||
      idLower.includes('sokyoku') ||
      nameLower.includes('execution')
    ) {
      return pictureDetailsData.palace;
    }
    if (nameLower.includes('promenade') || nameLower.includes('road') || idLower.includes('promenade')) {
      return pictureDetailsData.promenade;
    }
    if (
      nameLower.includes('barracks') ||
      nameLower.includes('division') ||
      idLower.includes('barracks') ||
      idLower.includes('division') ||
      idLower.includes('squad')
    ) {
      return pictureDetailsData.mainBuilding;
    }
    if (
      nameLower.includes('council') ||
      nameLower.includes('46') ||
      idLower.includes('council') ||
      idLower.includes('46') ||
      nameLower.includes('central')
    ) {
      return pictureDetailsData.throneHall;
    }
    if (
      nameLower.includes('archive') ||
      nameLower.includes('library') ||
      idLower.includes('archive') ||
      idLower.includes('library') ||
      nameLower.includes('daireishoshitsu')
    ) {
      return pictureDetailsData.library;
    }
    if (nameLower.includes('opening') || idLower.includes('opening')) {
      return pictureDetailsData.openingGate;
    }
    return pictureDetailsData.hero;
  }, [currentLoc]);

  // Current active scene index
  const currentSceneIdx = useMemo(() => {
    let closestIdx = 0;
    let minDiff = 999;
    sceneWaypoints.forEach((wp, idx) => {
      const diff = Math.abs(progress - wp.progress);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    return closestIdx;
  }, [progress]);

  // GSAP micro-animation for scenic wayfinder active dot pulse
  useEffect(() => {
    const activeDot = document.querySelector('.wayfinder-btn.active .wayfinder-dot');
    if (activeDot) {
      gsap.fromTo(
        activeDot,
        { scale: 0.8, boxShadow: '0 0 4px #38BDF8' },
        { scale: 1.55, boxShadow: '0 0 16px #38BDF8, 0 0 26px rgba(56, 189, 248, 0.8)', duration: 0.45, ease: 'back.out(2)' }
      );
    }
  }, [currentSceneIdx]);

  // GSAP scene title & eyebrow subtle entrance on scene transitions
  useEffect(() => {
    const sceneEls = document.querySelectorAll('.scene');
    const activeSceneEl = sceneEls[currentSceneIdx];
    if (activeSceneEl) {
      const heading = activeSceneEl.querySelector('h1, h2');
      const eyebrow = activeSceneEl.querySelector('.eyebrow');
      if (heading && eyebrow) {
        gsap.fromTo(
          [eyebrow, heading],
          { opacity: 0.35, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
        );
      }
    }
  }, [currentSceneIdx]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (soundboardOpen) {
          setSoundboardOpen(false);
          return;
        }
        if (isCookingView) {
          setIsCookingView(false);
          return;
        }
        if (activePictureDetail) {
          setActivePictureDetail(null);
          return;
        }
        if (lightboxImage) {
          setLightboxImage(null);
          return;
        }
        if (compendiumOpen) {
          setCompendiumOpen(false);
          return;
        }
        if (atlasOpen) {
          setAtlasOpen(false);
          return;
        }
        if (entryModalOpen) setEntryModalOpen(false);
        if (menuOpen) setMenuOpen(false);
        if (panelOpen) setPanelOpen(false);
        return;
      }

      // Lightbox navigation
      if (lightboxImage && currentLoc.images && currentLoc.images.length > 1) {
        if (e.key === 'ArrowLeft') {
          const newIdx = (lightboxImage.index - 1 + currentLoc.images.length) % currentLoc.images.length;
          setLightboxImage({ ...currentLoc.images[newIdx], index: newIdx });
          setCarouselSlide(newIdx);
          return;
        }
        if (e.key === 'ArrowRight') {
          const newIdx = (lightboxImage.index + 1) % currentLoc.images.length;
          setLightboxImage({ ...currentLoc.images[newIdx], index: newIdx });
          setCarouselSlide(newIdx);
          return;
        }
      }

      // Atlas panel navigation
      if (panelOpen && !lightboxImage && !activePictureDetail && !compendiumOpen && !entryModalOpen) {
        if (e.key === 'ArrowLeft') handleSelectLocation(activeLocation - 1);
        if (e.key === 'ArrowRight') handleSelectLocation(activeLocation + 1);
        return;
      }

      // Smooth Page / Arrow gliding
      if (!lightboxImage && !activePictureDetail && !compendiumOpen && !entryModalOpen && !panelOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          e.preventDefault();
          const nextScene = Math.min(sceneWaypoints.length - 1, currentSceneIdx + 1);
          scrollToProgress(sceneWaypoints[nextScene].progress);
        }
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
          const prevScene = Math.max(0, currentSceneIdx - 1);
          scrollToProgress(sceneWaypoints[prevScene].progress);
        }
        if (e.key === 'Home') {
          e.preventDefault();
          scrollToProgress(0);
        }
        if (e.key === 'End') {
          e.preventDefault();
          scrollToProgress(1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    entryModalOpen,
    menuOpen,
    panelOpen,
    activeLocation,
    handleSelectLocation,
    lightboxImage,
    currentLoc,
    activePictureDetail,
    compendiumOpen,
    soundboardOpen,
    currentSceneIdx,
    scrollToProgress,
  ]);

  // Focus search input on open
  useEffect(() => {
    if (entryModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [entryModalOpen]);

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => activeRegion === 'All regions' || loc.region.includes(activeRegion));
  }, [activeRegion]);

  const searchedLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter(
      (loc) => loc.name.toLowerCase().includes(q) || loc.jp.toLowerCase().includes(q) || loc.region.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Opacities for the 9 scenes
  const heroOpacity = 1 - ease(ramp(progress, 0.02, 0.11));
  const gateOpacity = sceneOpacity(progress, 0.07, 0.19);
  const promenadeOpacity = sceneOpacity(progress, 0.18, 0.31);
  const palaceOpacity = sceneOpacity(progress, 0.30, 0.44);
  const openingGateOpacity = sceneOpacity(progress, 0.43, 0.56);
  const mainBuildingOpacity = sceneOpacity(progress, 0.55, 0.68);
  const throneHallOpacity = sceneOpacity(progress, 0.67, 0.80);
  const libraryOpacity = sceneOpacity(progress, 0.79, 0.91);
  const reiokyuOpacity = ease(ramp(progress, 0.88, 0.99));

  // Cinematic camera parallax & depth transforms
  const heroParallax = getSceneParallax(progress, 0.0);
  const gateParallax = getSceneParallax(progress, 0.125);
  const promenadeParallax = getSceneParallax(progress, 0.25);
  const palaceParallax = getSceneParallax(progress, 0.375);
  const openingGateParallax = getSceneParallax(progress, 0.50);
  const mainBuildingParallax = getSceneParallax(progress, 0.625);
  const throneHallParallax = getSceneParallax(progress, 0.75);
  const libraryParallax = getSceneParallax(progress, 0.875);
  const reiokyuParallax = getSceneParallax(progress, 1.0);

  // Dynamic gate parting mechanics
  const gateOpen = ease(ramp(progress, 0.44, 0.56));
  const gateStyle = {
    '--gate-open': gateOpen.toFixed(3),
    '--gate-left-x': `${(-gateOpen * 100).toFixed(2)}%`,
    '--gate-right-x': `${(gateOpen * 100).toFixed(2)}%`,
    '--gate-light-scale': (0.25 + gateOpen * 0.75).toFixed(3),
    '--gate-light-opacity': (0.1 + gateOpen * 0.55).toFixed(3),
    '--gate-copy-y': `${(-gateOpen * 12).toFixed(2)}px`,
    opacity: openingGateOpacity,
    pointerEvents: openingGateOpacity > 0.45 ? 'auto' : 'none',
  } as React.CSSProperties;

  const headerOpacity = progress < 0.1 ? 1 : progress > 0.96 ? 1 : 0.65;

  return (
    <>
      <div className="scroll-track" style={{ height: '750vh' }} aria-hidden="true" />
      <div className="app-shell">
        {/* Live Anime Atmosphere Engine (Canvas 60fps petals, reishi motes & god rays) */}
        <LiveAnimeAtmosphere
          enabled={liveAnimeEnabled}
          mode={animeAtmosphereMode}
          isDawn={isDawn}
          isAudioPlaying={isSoundscapePlaying}
          onToggleEnabled={toggleLiveAnime}
          onChangeMode={(m) => {
            setAnimeAtmosphereMode(m);
            showToast(`Live Atmosphere: ${m.toUpperCase()}`);
          }}
          showControls={false}
        />

        {/* Reiatsu Spiritual Pressure Visualization Overlay */}
        <ReiatsuVisualizer
          enabled={reiatsuVisualizerEnabled}
          sceneIndex={currentSceneIdx}
          locationSpoilerLevel={panelOpen ? currentLoc.spoilerLevel : undefined}
          locationImportanceBonus={panelOpen}
          onToggleEnabled={toggleReiatsuVisualizer}
          showHud={false}
        />

        {/* Reishi particles field */}
        <div className="reishi-field" aria-hidden="true">
          {particles.map((p) => (
            <i key={p.key} className="reishi-particle" style={p.style} />
          ))}
        </div>

        <div className="ambient-fog fog-one" aria-hidden="true" />
        <div className="ambient-fog fog-two" aria-hidden="true" />

        {/* Top edge sensor to immediately reveal menubar on hover */}
        <div
          className="top-edge-sensor"
          onMouseEnter={() => {
            setIsHeaderVisible(true);
            if (headerHideTimeoutRef.current) clearTimeout(headerHideTimeoutRef.current);
          }}
          aria-hidden="true"
        />

        {/* Floating subtle reveal indicator pill when menubar automatically disappears */}
        <button
          className={`header-reveal-pill ${!isHeaderVisible ? 'active' : ''}`}
          type="button"
          onClick={() => {
            setIsHeaderVisible(true);
            if (headerHideTimeoutRef.current) clearTimeout(headerHideTimeoutRef.current);
          }}
          aria-label="Reveal top menubar"
        >
          SOUL SOCIETY MENU ▾
        </button>

        {/* Site Header */}
        <header
          className={`site-header ${isHeaderVisible ? 'header-visible' : 'header-hidden'}`}
          onMouseEnter={() => {
            isHeaderHoveredRef.current = true;
            setIsHeaderVisible(true);
            if (headerHideTimeoutRef.current) clearTimeout(headerHideTimeoutRef.current);
          }}
          onMouseLeave={() => {
            isHeaderHoveredRef.current = false;
            if (headerHideTimeoutRef.current) clearTimeout(headerHideTimeoutRef.current);
            headerHideTimeoutRef.current = window.setTimeout(() => {
              if (!isHeaderHoveredRef.current && !menuOpen) {
                setIsHeaderVisible(false);
              }
            }, 2200);
          }}
        >
          <button className="brand" onClick={() => scrollToProgress(0)} aria-label="Return to Seireitei arrival">
            <span className="brand-symbol">{symbol}</span>
            <span>
              <b>SOUL SOCIETY • 尸魂界</b>
              <small>SEIREITEI & GOTEI 13 CANON GUIDE</small>
            </span>
          </button>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <button onClick={() => scrollToProgress(0.125)}>4 SOUL GATES</button>
            <button onClick={() => scrollToProgress(0.25)}>GOTEI PROMENADE</button>
            <button onClick={() => scrollToProgress(0.375)}>SŌKYOKU HILL</button>
            <button onClick={() => scrollToProgress(0.625)}>1ST DIVISION</button>
            <button onClick={() => scrollToProgress(0.75)}>CENTRAL 46</button>
            <button onClick={() => scrollToProgress(0.875)}>DAIREISHOSHITSU</button>
            <button onClick={() => scrollToProgress(1.0)}>ROYAL REALM</button>
            <button
              style={{ color: 'var(--blue)', fontWeight: 600 }}
              onClick={() => handleSelectLocation(activeLocation)}
              title="Open surveyed Bleach landmarks and ambient Reishi soundscape"
            >
              SEIREITEI SURVEY ♫
            </button>
            <button
              style={{ color: 'var(--gold)', fontWeight: 600 }}
              onClick={() => setCompendiumOpen(true)}
            >
              BLEACH COMPENDIUM ⚔
            </button>
            <button
              style={{ color: '#F59E0B', fontWeight: 600, borderColor: 'rgba(245, 158, 11, 0.4)' }}
              onClick={() => {
                setCompendiumTab('characters');
                setCompendiumOpen(true);
                shikaiSoundRef.current?.play();
              }}
              title="Open Bleach character dossiers (Ichigo, Aizen, Yhwach, Byakuya, Yamamoto)"
            >
              CAPTAINS & LORE ⚔
            </button>
            <button
              style={{ color: '#38BDF8', fontWeight: 600, borderColor: 'rgba(56, 189, 248, 0.45)' }}
              onClick={() => {
                setAtlasOpen(true);
                shikaiSoundRef.current?.play();
              }}
              title="Open schematic D3 vector Atlas View of Seireitei and Rukongai"
            >
              🗺 SEIREITEI ATLAS
            </button>
            <button
              style={{ color: '#6FB7FF', fontWeight: 600, borderColor: 'rgba(111, 183, 255, 0.5)' }}
              onClick={() => {
                setThreeDSceneId(
                  currentSceneIdx === 3 ? 'sokyoku' : currentSceneIdx === 8 ? 'reiokyu' : 'seireitei'
                );
                setThreeDViewOpen(true);
                shikaiSoundRef.current?.play();
              }}
              title="Enter interactive Three.js 3D Soul Society Diorama"
            >
              ◈ 3D REALMS
            </button>
            <button
              style={{ color: '#C9A65B', fontWeight: 600, borderColor: 'rgba(201, 166, 91, 0.5)' }}
              onClick={() => {
                setArchivePrefillLoc(locations[activeLocation]?.id);
                setArchiveOpen(true);
              }}
              title="Open personal Soul Reaper Field Archive & saved landmarks"
            >
              {user ? `⚑ ARCHIVE (${bookmarks.length})` : '⚑ SOUL ARCHIVE'}
            </button>
          </nav>

          <div className="header-actions">
            <button
              className={`header-soundscape-btn ${isCookingView ? 'active' : ''}`}
              type="button"
              onClick={triggerCookingSequence}
              title="Initiate Reishi spiritual particle convergence sequence"
              aria-label="Initiate Reishi convergence sequence"
            >
              <span style={{ fontSize: '12px' }}>✦</span>
              <span>REISHI SYNC</span>
            </button>
            <button
              className={`header-soundscape-btn ${reiatsuVisualizerEnabled ? 'active' : ''}`}
              type="button"
              onClick={toggleReiatsuVisualizer}
              title={reiatsuVisualizerEnabled ? 'Disable Reiatsu spiritual pressure visualization' : 'Overlay Reiatsu spiritual pressure pulsing waves'}
              aria-label={reiatsuVisualizerEnabled ? 'Reiatsu visualization active' : 'Reiatsu visualization paused'}
            >
              <span style={{ fontSize: '12px' }}>⚔</span>
              <span>{reiatsuVisualizerEnabled ? 'REIATSU ON' : 'REIATSU'}</span>
            </button>
            <button
              className={`header-soundscape-btn ${liveAnimeEnabled ? 'active' : ''}`}
              type="button"
              onClick={toggleLiveAnime}
              title={liveAnimeEnabled ? 'Pause Senbonzakura sakura atmosphere' : 'Enable Senbonzakura sakura atmosphere'}
              aria-label={liveAnimeEnabled ? 'Live anime animation active' : 'Live anime animation paused'}
            >
              <span style={{ fontSize: '12px' }}>{liveAnimeEnabled ? '🌸' : '✦'}</span>
              <span>{liveAnimeEnabled ? 'SAKURA ON' : 'SAKURA OFF'}</span>
            </button>
            <button
              className={`header-soundscape-btn ${isSoundscapePlaying ? 'active' : ''}`}
              type="button"
              onClick={toggleSoundscape}
              aria-pressed={isSoundscapePlaying}
              title="Toggle low-volume ambient Reishi wind audio effect"
              aria-label={isSoundscapePlaying ? 'Mute ambient Reishi wind' : 'Play ambient Reishi wind'}
            >
              <span className="sound-bars" aria-hidden="true">
                <span className="sound-bar" />
                <span className="sound-bar" />
                <span className="sound-bar" />
                <span className="sound-bar" />
              </span>
              <span>{isSoundscapePlaying ? 'REISHI WIND ON' : 'REISHI WIND'}</span>
            </button>
            <button
              className={`header-soundscape-btn ${soundboardOpen ? 'active' : ''}`}
              type="button"
              onClick={() => {
                setSoundboardOpen(true);
                bleachAudioRef.current?.playShikai();
              }}
              title="Open procedural Bleach soundboard (Shikai, Bankai, Shunpo, Kidō)"
              aria-label="Open Reiatsu soundboard"
            >
              <span style={{ fontSize: '12px' }}>🔊</span>
              <span>SOUNDBOARD</span>
            </button>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setIsDawn(!isDawn)}
              aria-label={isDawn ? 'Switch to Seireitei night view' : 'Switch to Seireitei dawn view'}
            >
              {isDawn ? 'NIGHT ' : 'DAWN '}
              <span />
            </button>
            <button className="enter-button" type="button" onClick={() => setEntryModalOpen(true)}>
              SEARCH SEIREITEI <b>↗</b>
            </button>
            <button
              className="menu-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span />
              <span />
            </button>
          </div>
        </header>

        {/* Smooth Scenic Wayfinder Navigator with Reishi Luminescent Progress Rail */}
        <aside className="scenic-wayfinder" aria-label="Scenic Waypoints Navigator">
          <div className="scenic-wayfinder-rail" aria-hidden="true">
            <div className="scenic-wayfinder-fill" style={{ height: `${(progress * 100).toFixed(1)}%` }} />
          </div>
          {sceneWaypoints.map((wp, idx) => (
            <button
              key={wp.index}
              className={`wayfinder-btn ${currentSceneIdx === idx ? 'active' : ''}`}
              onClick={() => scrollToProgress(wp.progress)}
              aria-label={`Jump to ${wp.title}`}
            >
              <span className="wayfinder-label">{wp.label}</span>
              <span className="wayfinder-dot" />
            </button>
          ))}
          <div className="wayfinder-pct-badge" title="Soul Society Spatial Progress">
            <span>{Math.round(progress * 100)}%</span>
          </div>
        </aside>

        {/* Main Stage */}
        <main className="stage">
          {/* Scene 1: Hero Scene */}
          <section
            className="scene hero-scene"
            aria-labelledby="hero-title"
            style={{ opacity: heroOpacity, pointerEvents: heroOpacity > 0.45 ? 'auto' : 'none' }}
          >
            <div className="hero-backdrop">
              <div className="hero-image" style={{ transform: heroParallax.imageTransform }}>
                <img
                  src="/seireitei-home.webp"
                  alt="A luminous floating Soul Society citadel from Bleach with white Sekkiseki walls, blue-roofed towers and central palace."
                />
              </div>
              <div className="hero-wall" />
              <div className="sekkiseki-barrier-pulse" aria-hidden="true" />
              <div
                className="hero-model"
                style={{
                  transform: `translate3d(${ramp(progress, 0, 0.16) * -35}px, ${ramp(progress, 0, 0.16) * 22}px, 0) scale(${1 + ramp(progress, 0, 0.2) * 0.08})`,
                }}
              >
                <ProceduralModelSvg kind="gate" />
              </div>
            </div>

            <div className="hero-copy" style={{ transform: heroParallax.copyTransform }}>
              <p className="eyebrow">
                <span>BLEACH ANIME CANON · SOUL SOCIETY</span>
                <i />
                <span>01 / 瀞霊廷 · SEIREITEI CITADEL</span>
              </p>
              <h1 id="hero-title">
                Soul Society
                <br />
                <em>Court of Pure Souls • 瀞霊廷</em>
              </h1>
              <p className="hero-deck">
                The spiritual afterlife realm from Tite Kubo’s <em>Bleach</em>. Enclosed within concentric walls of
                spirit-repelling <strong>Sekkiseki stone</strong>, governed by the <strong>Central 46</strong> supreme judiciary,
                defended by the 13 Court Guard Squads (<strong>Gotei 13</strong>), and ringed by the 320 districts of <strong>Rukongai</strong>.
              </p>

              {/* Refined Minimalist Telemetry & Details Trigger */}
              <div className="hero-details-telemetry-bar">
                <button
                  type="button"
                  className="hero-details-telemetry-btn"
                  onClick={() => openPictureDetailWithShikai(pictureDetailsData.hero)}
                  title="Open Seireitei Citadel Architectural Dossier & Canon Specifications"
                >
                  <span className="telemetry-crest" aria-hidden="true">◈</span>
                  <span className="telemetry-label">瀞霊廷 SPECIFICATIONS:</span>
                  <span className="telemetry-metrics">400 RI CIRCUMFERENCE • SEKKISEKI BARRIER • CENTRAL 46</span>
                  <span className="telemetry-cta">SHOW DETAILS ↗</span>
                </button>
              </div>

              <div className="hero-actions">
                <button className="hero-cta" onClick={() => scrollToProgress(0.125)}>
                  EXPLORE SEIREITEI <b>↓</b>
                </button>
                <button
                  className="hero-cta"
                  style={{ borderColor: 'var(--blue)', color: 'var(--blue)' }}
                  onClick={() => {
                    setCompendiumOpen(true);
                    bleachAudioRef.current?.playShikai();
                  }}
                >
                  GOTEI 13 &amp; REALM LORE ⚔
                </button>
                <button
                  type="button"
                  className="hero-cta"
                  onClick={() => openPictureDetailWithShikai(pictureDetailsData.hero)}
                >
                  CITADEL DETAILS ↗
                </button>
                <button
                  type="button"
                  className="hero-cta hero-cta--citadel-3d"
                  onClick={() => {
                    setThreeDSceneId('seireitei');
                    setThreeDViewOpen(true);
                    shikaiSoundRef.current?.play();
                  }}
                  title="Launch interactive fullscreen 3D Floating Seireitei Citadel explorer with guided waypoints"
                >
                  ENTER 3D CITADEL <span className="citadel-crest-glyph" aria-hidden="true">◈</span>
                </button>
              </div>
            </div>

            <div className="hero-coordinates">
              <span>BLEACH CANON / SOUL SOCIETY 尸魂界</span>
              <span>SEIREITEI &amp; GOTEI 13 CARTOGRAPHY</span>
            </div>

            <div className="marquee">
              <span>BLEACH ANIME &nbsp;&nbsp;·&nbsp;&nbsp; 尸魂界 (SOUL SOCIETY) &nbsp;&nbsp;·&nbsp;&nbsp; 護廷十三隊 (GOTEI 13) &nbsp;&nbsp;·&nbsp;&nbsp; 瀞霊廷 (SEIREITEI) &nbsp;&nbsp;·&nbsp;&nbsp; </span>
              <span>BLEACH ANIME &nbsp;&nbsp;·&nbsp;&nbsp; 尸魂界 (SOUL SOCIETY) &nbsp;&nbsp;·&nbsp;&nbsp; 護廷十三隊 (GOTEI 13) &nbsp;&nbsp;·&nbsp;&nbsp; 瀞霊廷 (SEIREITEI) &nbsp;&nbsp;·&nbsp;&nbsp; </span>
            </div>

            <div className="scroll-cue">
              <span>SCROLL TO EXPLORE SOUL SOCIETY</span>
              <b>↓</b>
            </div>
          </section>

          {/* Scene 2: Gate Scene */}
          <section
            className="scene gate-scene"
            aria-labelledby="gate-title"
            style={{ opacity: gateOpacity, pointerEvents: gateOpacity > 0.45 ? 'auto' : 'none' }}
          >
            <div className="gate-image" style={{ transform: gateParallax.imageTransform }}>
              <img src="/seireitei-gate.webp" alt="The monumental Sekkiseki outer gate of Soul Society from Bleach, guarded by giant gatekeepers." />
            </div>
            <div className="gate-copy" style={{ transform: gateParallax.copyTransform }}>
              <p className="eyebrow">
                <span>02 / THRESHOLD</span>
                <i />
                <span>SEKKISEKI BARRIER</span>
              </p>
              <h2 id="gate-title">
                The Four
                <br />
                <em>Pure Soul Gates.</em>
              </h2>
              <p>
                The legendary boundary between Rukongai and the Shinigami capital. Carved from rare spirit-negating Sekkiseki stone, guarded
                by Jidanbō and the four titan gatekeepers.
              </p>
              <div className="scene-stamp-row">
                <span className="gate-stamp">BLEACH EPISODES 21–24 / JIDANBŌ &amp; GIN ICHIMARU</span>
                <button
                  type="button"
                  className="picture-detail-inline-btn"
                  onClick={() => openPictureDetailWithShikai(pictureDetailsData.gate)}
                >
                  <span className="badge">DETAILS</span> <span>VIEW GATE LORE ↗</span>
                </button>
              </div>
            </div>

            <div className="gate-index">
              <span>02</span>
              <i />
              <small>OF 09 / BLEACH SCENES</small>
            </div>
          </section>

          {/* Scene 3: Promenade Scene */}
          <section
            className="scene promenade-scene"
            aria-labelledby="promenade-title"
            style={{ opacity: promenadeOpacity, pointerEvents: promenadeOpacity > 0.45 ? 'auto' : 'none' }}
          >
            <div className="promenade-image" style={{ transform: promenadeParallax.imageTransform }}>
              <img
                src="/seireitei-promenade.webp"
                alt="The ceremonial promenade avenue of Seireitei lined with blue division banners and lanterns leading to the palace."
              />
            </div>
            <div className="promenade-copy" style={{ transform: promenadeParallax.copyTransform }}>
              <p className="eyebrow">
                <span>03 / MILITARY THOROUGHFARE</span>
                <i />
                <span>CENTRAL AVENUE</span>
              </p>
              <h2 id="promenade-title">
                Avenues of
                <br />
                <em>the Gotei 13.</em>
              </h2>
              <p>
                Past the Sekkiseki perimeter, polished stone avenues link the 13 division barracks. Here Ichigo’s infiltration team clashed
                with 11th Division officers and Renji Abarai.
              </p>
              <div className="scene-stamp-row">
                <span className="promenade-stamp">BLEACH EPISODES 25–35 / RYŌKA INFILTRATION</span>
                <button
                  type="button"
                  className="picture-detail-inline-btn"
                  onClick={() => openPictureDetailWithShikai(pictureDetailsData.promenade)}
                >
                  <span className="badge">DETAILS</span> <span>PROMENADE LORE ↗</span>
                </button>
              </div>
            </div>

            <div className="promenade-index">
              <span>03</span>
              <i />
              <small>OF 09 / BLEACH SCENES</small>
            </div>
          </section>

          {/* Scene 4: Palace & Sōkyoku Scene */}
          <section
            className="scene palace-scene"
            aria-labelledby="palace-title"
            style={{ opacity: palaceOpacity, pointerEvents: palaceOpacity > 0.45 ? 'auto' : 'none' }}
          >
            <div className="palace-image" style={{ transform: palaceParallax.imageTransform }}>
              <img
                src="/seireitei-palace.webp"
                alt="A radiant central palace and Sōkyoku rise rising beyond the inner promenade from Bleach anime."
              />
            </div>
            <div className="palace-copy" style={{ transform: palaceParallax.copyTransform }}>
              <p className="eyebrow">
                <span>04 / THE EXECUTION MESA</span>
                <i />
                <span>SŌKYOKU &amp; SENZAIKYŪ</span>
              </p>
              <h2 id="palace-title">
                The climax on
                <br />
                <em>Sōkyoku Hill.</em>
              </h2>
              <p>
                The sheer execution mesa where Rukia was condemned. Site of Ichigo stopping the fiery Phoenix halberd, his Bankai duel
                with Byakuya Kuchiki, and Sōsuke Aizen’s betrayal.
              </p>
              <div className="scene-stamp-row">
                <span className="palace-stamp">BLEACH EPISODES 54–62 / TENSA ZANGETSU AWAKENS</span>
                <button
                  type="button"
                  className="picture-detail-inline-btn"
                  onClick={() => openPictureDetailWithShikai(pictureDetailsData.palace)}
                >
                  <span className="badge">DETAILS</span> <span>SŌKYOKU LORE ↗</span>
                </button>
                <button
                  type="button"
                  className="picture-detail-inline-btn picture-detail-inline-btn--3d"
                  onClick={() => {
                    setThreeDSceneId('sokyoku');
                    setThreeDViewOpen(true);
                    shikaiSoundRef.current?.play();
                  }}
                >
                  <span className="badge">3D</span> <span>EXPLORE SŌKYOKU ◈</span>
                </button>
              </div>
            </div>

            <div className="palace-index">
              <span>04</span>
              <i />
              <small>OF 09 / BLEACH SCENES</small>
            </div>
          </section>

          {/* Scene 5: Opening Gate Scene */}
          <section
            className={`scene opening-gate-scene ${gateOpen > 0.04 ? 'gate-opening' : ''}`}
            aria-labelledby="opening-gate-title"
            style={gateStyle}
          >
            <div className="opening-gate-image" style={{ transform: openingGateParallax.imageTransform }}>
              <img src="/seireitei-opening-gate.webp" alt="Monumental blue-and-gold gate opening onto the bright inner citadel of Soul Society." />
              <div className="gate-doors" aria-hidden="true">
                <i className="gate-door gate-door-left" />
                <i className="gate-door gate-door-right" />
                <b className="gate-light" />
              </div>
            </div>
            <div className="opening-gate-copy" style={{ transform: openingGateParallax.copyTransform }}>
              <p className="eyebrow">
                <span>05 / INNER SANCTUM</span>
                <i />
                <span>THE PARTING GATE</span>
              </p>
              <h2 id="opening-gate-title">
                The gates part
                <br />
                <em>to the citadel.</em>
              </h2>
              <p>
                Watch the massive gilded doors part as you scroll inward, unlocking the restricted administrative heart where the Head Captain
                and judicial chambers preside.
              </p>
              <div className="scene-stamp-row">
                <span className="opening-gate-stamp">BLEACH / SPIRITUAL BARRIER LEVEL 1</span>
                <button
                  type="button"
                  className="picture-detail-inline-btn"
                  onClick={() => openPictureDetailWithShikai(pictureDetailsData.openingGate)}
                >
                  <span className="badge">DETAILS</span> <span>GATEWAY LORE ↗</span>
                </button>
              </div>
            </div>

            <div className="opening-gate-index">
              <span>05</span>
              <i />
              <small>OF 09 / BLEACH SCENES</small>
            </div>
          </section>

          {/* Scene 6: Main Building Scene */}
          <section
            className="scene main-building-scene"
            aria-labelledby="main-building-title"
            style={{ opacity: mainBuildingOpacity, pointerEvents: mainBuildingOpacity > 0.45 ? 'auto' : 'none' }}
          >
            <div className="main-building-image" style={{ transform: mainBuildingParallax.imageTransform }}>
              <img src="/seireitei-main-building.webp" alt="The First Division barracks and Supreme Command building in Bleach." />
            </div>
            <div className="main-building-copy" style={{ transform: mainBuildingParallax.copyTransform }}>
              <p className="eyebrow">
                <span>06 / SUPREME COMMAND</span>
                <i />
                <span>FIRST DIVISION BARRACKS</span>
              </p>
              <h2 id="main-building-title">
                Headquarters of
                <br />
                <em>the Gotei 13.</em>
              </h2>
              <p>
                The grand castle of the First Division, seat of Captain-Commander Genryūsai Shigekuni Yamamoto for over a thousand years,
                later passed to Shunsui Kyōraku during the Quincy War.
              </p>
              <div className="scene-stamp-row">
                <span className="main-building-stamp">一番隊舎 / SEAT OF HEAD CAPTAIN YAMAMOTO</span>
                <button
                  type="button"
                  className="picture-detail-inline-btn"
                  onClick={() => openPictureDetailWithShikai(pictureDetailsData.mainBuilding)}
                >
                  <span className="badge">DETAILS</span> <span>1ST DIVISION LORE ↗</span>
                </button>
              </div>
            </div>

            <div className="main-building-index">
              <span>06</span>
              <i />
              <small>OF 09 / BLEACH SCENES</small>
            </div>
          </section>

          {/* Scene 7: Throne Hall Scene */}
          <section
            className="scene throne-hall-scene"
            aria-labelledby="throne-hall-title"
            style={{ opacity: throneHallOpacity, pointerEvents: throneHallOpacity > 0.45 ? 'auto' : 'none' }}
          >
            <div className="throne-hall-image" style={{ transform: throneHallParallax.imageTransform }}>
              <img
                src="/seireitei-throne-hall.webp"
                alt="The great Captains assembly hall and Central 46 chamber in Bleach anime with blue carpet and banners."
              />
            </div>
            <div className="throne-hall-copy" style={{ transform: throneHallParallax.copyTransform }}>
              <p className="eyebrow">
                <span>07 / JUDICIAL COUNCIL</span>
                <i />
                <span>CAPTAINS’ ASSEMBLY CHAMBER</span>
              </p>
              <h2 id="throne-hall-title">
                Where the Captains
                <br />
                <em>convene.</em>
              </h2>
              <p>
                The cavernous ceremonial chamber where the 13 Gotei captains line up before the Head Captain, and where Aizen’s deception
                and the slaughter of Central 46 was unveiled.
              </p>
              <div className="scene-stamp-row">
                <span className="throne-hall-stamp">隊首会議室 / CENTRAL 46 SUPREME TRIBUNAL</span>
                <button
                  type="button"
                  className="picture-detail-inline-btn"
                  onClick={() => openPictureDetailWithShikai(pictureDetailsData.throneHall)}
                >
                  <span className="badge">DETAILS</span> <span>COUNCIL LORE ↗</span>
                </button>
              </div>
            </div>

            <div className="throne-hall-index">
              <span>07</span>
              <i />
              <small>OF 09 / BLEACH SCENES</small>
            </div>
          </section>

          {/* Scene 8: Library Scene */}
          <section
            className="scene library-scene"
            aria-labelledby="library-title"
            style={{ opacity: libraryOpacity, pointerEvents: libraryOpacity > 0.45 ? 'auto' : 'none' }}
          >
            <div className="library-image" style={{ transform: libraryParallax.imageTransform }}>
              <img
                src="/seireitei-library.webp"
                alt="The celestial grand library and Spiritual Arts Archives of the Shin'ō Academy in Bleach."
              />
            </div>
            <div className="library-copy" style={{ transform: libraryParallax.copyTransform }}>
              <p className="eyebrow">
                <span>08 / SACRED ARCHIVE</span>
                <i />
                <span>SHIN’Ō ACADEMY REPOSITORY</span>
              </p>
              <h2 id="library-title">
                Every soul
                <br />
                <em>leaves a record.</em>
              </h2>
              <p>
                The grand archives founded by Yamamoto over two millennia ago. Preserves all 99 Hadō and Bakudō Kidō spells, Hollow
                classifications, Zanpakutō forging manuscripts, and ancient Soul Burial rites.
              </p>
              <div className="scene-stamp-row">
                <span className="library-stamp">真央霊術院大文庫 / KISUKE URAHARA RESEARCH ARCHIVE</span>
                <button
                  type="button"
                  className="picture-detail-inline-btn"
                  onClick={() => openPictureDetailWithShikai(pictureDetailsData.library)}
                >
                  <span className="badge">DETAILS</span> <span>ARCHIVE LORE ↗</span>
                </button>
              </div>
            </div>

            <div className="library-index">
              <span>08</span>
              <i />
              <small>OF 09 / BLEACH SCENES</small>
            </div>
          </section>

          {/* Scene 9: The Royal Realm (Reiōkyū) & Soul King Sanctuary */}
          <section
            className="scene reiokyu-scene"
            aria-labelledby="reiokyu-title"
            style={{ opacity: reiokyuOpacity, pointerEvents: reiokyuOpacity > 0.45 ? 'auto' : 'none' }}
          >
            <div className="reiokyu-image" style={{ transform: reiokyuParallax.imageTransform }}>
              <img
                src="/seireitei-reiokyu.webp"
                alt="The celestial Royal Realm (Reiōkyū) and Soul King Palace floating above Soul Society, with the five palaces of Squad Zero."
              />
              <div className="reiokyu-golden-haze" aria-hidden="true" />
              <div className="reiokyu-celestial-rays" aria-hidden="true" />
              <div className="sekkiseki-barrier-pulse" aria-hidden="true" />
            </div>

            <div className="reiokyu-copy" style={{ transform: reiokyuParallax.copyTransform }}>
              <p className="eyebrow">
                <span>09 / THE PINNACLE OF EXISTENCE</span>
                <i />
                <span>THE ROYAL REALM (REIŌKYŪ)</span>
              </p>
              <h2 id="reiokyu-title">
                The Soul King Palace:
                <br />
                <em>Linchpin of the Three Realms.</em>
              </h2>
              <p className="reiokyu-deck">
                Floating high above Soul Society within a transcendent dimensional envelope, the Royal Realm houses the Soul King (Reiō)—the
                divine anchor preserving the delicate balance between Soul Society, the Human World, and Hueco Mundo.
              </p>

              <div className="reiokyu-lore-cards">
                <article className="reiokyu-lore-card">
                  <span>SQUAD ZERO (ROYAL GUARD)</span>
                  <strong>The Five Supreme Officers</strong>
                  <p>
                    Ichibē Hyōsube, Ōetsu Nimaiya, Tenjirō Kirinji, Kirio Hikifune, and Senjumaru Shutara. Their combined combat power
                    surpasses all 13 Gotei Divisions.
                  </p>
                </article>
                <article className="reiokyu-lore-card">
                  <span>THE DIVINE ŌKEN KEY</span>
                  <strong>72 Spirit Barriers</strong>
                  <p>
                    Shielded by 72 spatial barriers. The Royal Key is infused directly into the bones and hair of Squad Zero, granting safe passage through the heavens.
                  </p>
                </article>
                <article className="reiokyu-lore-card">
                  <span>BLEACH TYBW CLIMAX</span>
                  <strong>The Cosmic War</strong>
                  <p>
                    Where Yhwach and the Schutzstaffel breach the palace, leading to Senjumaru’s universe-shaking Bankai and the battle for all existence.
                  </p>
                </article>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
                <button
                  type="button"
                  className="hero-cta hero-cta--citadel-3d"
                  onClick={() => {
                    setThreeDSceneId('reiokyu');
                    setThreeDViewOpen(true);
                    shikaiSoundRef.current?.play();
                  }}
                  title="Explore the Royal Realm (Reiōkyū) and Five Squad Zero Palaces in interactive 3D"
                >
                  ENTER 3D REIŌKYŪ <span className="citadel-crest-glyph" aria-hidden="true">◈</span>
                </button>
                <button
                  type="button"
                  className="hero-cta"
                  style={{ borderColor: 'var(--gold)', color: 'var(--gold)', background: 'rgba(5, 6, 15, 0.7)' }}
                  onClick={() => openPictureDetailWithShikai(pictureDetailsData.reiokyu)}
                >
                  VIEW ROYAL REALM PICTURE DETAILS ↗
                </button>
                <button
                  type="button"
                  className="hero-cta"
                  style={{ borderColor: 'var(--blue)', color: 'var(--paper)', background: 'rgba(5, 6, 15, 0.7)' }}
                  onClick={() => handleSelectLocation(activeLocation)}
                >
                  SURVEYED SITES &amp; SOUNDSCAPE ♫
                </button>
                <button
                  type="button"
                  className="hero-cta"
                  style={{ borderColor: 'var(--blue)', color: 'var(--blue)', background: 'rgba(5, 6, 15, 0.7)' }}
                  onClick={() => setCompendiumOpen(true)}
                >
                  FULL SOUL SOCIETY COMPENDIUM ⚔
                </button>
                <button
                  type="button"
                  className="hero-cta"
                  style={{ borderColor: 'var(--hair)', color: 'var(--paper)', background: 'rgba(5, 6, 15, 0.7)' }}
                  onClick={() => scrollToProgress(0)}
                >
                  RETURN TO CITADEL ARRIVAL ↑
                </button>
              </div>
            </div>

            <div className="reiokyu-index">
              <span>09</span>
              <i />
              <small>OF 09 / BLEACH SCENES</small>
            </div>
          </section>
        </main>

        {/* Location Detail Panel & Floating Soundscape */}
        <div
          className={`location-panel-backdrop ${panelOpen ? 'is-open' : ''}`}
          onClick={() => setPanelOpen(false)}
          aria-hidden={!panelOpen}
        />
        <aside
          className={`location-panel ${panelOpen ? 'is-open' : ''}`}
          aria-labelledby="location-title"
          hidden={!panelOpen}
          data-lenis-prevent="true"
        >
          <button className="panel-close" onClick={() => setPanelOpen(false)} aria-label="Close location notes">
            ×
          </button>

          {/* Floating Soundscape Ambient Audio Toggle Bar */}
          <div className="floating-soundscape-bar" role="region" aria-label="Location soundscape ambient control">
            <button
              type="button"
              className={`soundscape-pill-btn ${isSoundscapePlaying ? 'playing' : ''}`}
              onClick={toggleSoundscape}
              aria-pressed={isSoundscapePlaying}
              aria-label={isSoundscapePlaying ? 'Mute ambient temple wind' : 'Play ambient temple wind'}
              title="Toggle low-volume ambient temple wind audio effect"
            >
              <span className="sound-bars" aria-hidden="true">
                <span className="sound-bar" />
                <span className="sound-bar" />
                <span className="sound-bar" />
                <span className="sound-bar" />
              </span>
              <span>{isSoundscapePlaying ? 'REISHI WIND ACTIVE' : 'PLAY REISHI WIND'}</span>
            </button>
            <span className="soundscape-status-text">
              {isSoundscapePlaying ? (
                <span>
                  REISHI WIND <b>ON</b> (LOW VOL)
                </span>
              ) : (
                <span>REISHI WIND AMBIENCE</span>
              )}
            </span>
          </div>

          {/* Reiatsu Spiritual Pressure Rating Pill for this location */}
          <div className="location-reiatsu-bar" role="status" aria-label="Location Reiatsu Pressure Rating">
            <span className="location-reiatsu-tag">
              <span className="reiatsu-glyph">⚔</span>
              <b>REIATSU:</b>
            </span>
            <span className="location-reiatsu-level">
              {currentLoc.spoilerLevel.toLowerCase().includes('tybw') || currentLoc.id.includes('reiokyu')
                ? '10/10 GOD-TIER (TYBW)'
                : currentLoc.spoilerLevel.toLowerCase().includes('soul society')
                ? '8.5/10 HIGH (CAPTAIN)'
                : '9.0/10 COMMAND TIER'}
            </span>
            <button
              type="button"
              className={`panel-reiatsu-btn ${reiatsuVisualizerEnabled ? 'active' : ''}`}
              onClick={toggleReiatsuVisualizer}
              title="Toggle Reiatsu pulsing overlay on map and background"
            >
              {reiatsuVisualizerEnabled ? 'PULSE ON' : 'VIEW PULSE'}
            </button>
          </div>

          {/* Quick Region Filter Chips */}
          <div className="panel-region-chips" role="tablist" aria-label="Filter landmarks by region">
            {['All regions', 'Seireitei', 'Central Rise', 'Gotei Quarter', 'Royal Realm'].map((reg) => (
              <button
                key={reg}
                type="button"
                role="tab"
                aria-selected={activeRegion === reg}
                className={`panel-region-chip ${activeRegion === reg ? 'active' : ''}`}
                onClick={() => {
                  setActiveRegion(reg);
                  if (reg !== 'All regions') {
                    const firstInReg = locations.findIndex((l) =>
                      l.region.toLowerCase().includes(reg.toLowerCase())
                    );
                    if (firstInReg >= 0) handleSelectLocation(firstInReg);
                  }
                }}
              >
                {reg.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Filtered Region Landmark Selector */}
          <div className="panel-location-pills" role="navigation" aria-label="Surveyed sites in selected region">
            {filteredLocations.map((loc) => {
              const globalIdx = locations.findIndex((item) => item.id === loc.id);
              const isCurrent = locations[activeLocation]?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  className={`panel-location-pill ${isCurrent ? 'active' : ''}`}
                  onClick={() => {
                    if (globalIdx >= 0) handleSelectLocation(globalIdx);
                  }}
                >
                  <span className="pill-idx">{String(globalIdx + 1).padStart(2, '0')}</span>
                  <span className="pill-name">{loc.name}</span>
                </button>
              );
            })}
          </div>

          <div className="panel-top">
            <span>{currentLoc.region}</span>
            <span>
              {String(activeLocation + 1).padStart(2, '0')} / {String(locations.length).padStart(2, '0')}
            </span>
          </div>
          <p className="panel-jp">{currentLoc.jp}</p>
          <h3 id="location-title">{currentLoc.name}</h3>
          <p className="panel-summary">{currentLoc.summary}</p>

          {/* Shikai Picture Details & Persistent Archive Actions */}
          <div className="location-shikai-action-box" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="location-shikai-btn"
              onClick={() => openPictureDetailWithShikai(currentPictureDetail)}
              title="Release Shikai audio cue and examine full anime reference breakdown"
            >
              <span className="shikai-btn-icon" aria-hidden="true">⚔</span>
              <div className="shikai-btn-text">
                <span className="shikai-btn-primary">VIEW PICTURE DETAILS ↗</span>
                <small className="shikai-btn-secondary">始解 SHIKAI ACTIVATION • ANIME CONTEXT & LORE</small>
              </div>
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={async () => {
                  if (!user) {
                    const ok = await signInWithGoogle();
                    if (!ok) return;
                  }
                  const saved = await toggleBookmark({
                    locationId: currentLoc.id,
                    locationName: currentLoc.name,
                    region: currentLoc.region,
                  });
                  if (saved !== null) {
                    showToast(saved ? `Saved ${currentLoc.name} to Soul Archive` : `Removed ${currentLoc.name}`);
                  }
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: bookmarks.some((b) => b.locationId === currentLoc.id)
                    ? '1px solid #c9a65b'
                    : '1px solid rgba(244,241,234,0.2)',
                  background: bookmarks.some((b) => b.locationId === currentLoc.id)
                    ? 'rgba(201,166,91,0.16)'
                    : 'rgba(11,16,36,0.75)',
                  color: bookmarks.some((b) => b.locationId === currentLoc.id) ? '#c9a65b' : '#f4f1ea',
                  fontFamily: 'var(--mono)',
                  fontSize: '9px',
                  letterSpacing: '0.06em',
                }}
              >
                {bookmarks.some((b) => b.locationId === currentLoc.id) ? '★ SAVED' : '☆ SAVE SITE'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setArchivePrefillLoc(currentLoc.id);
                  setArchivePrefillScene(
                    currentLoc.id.includes('sokyoku') || currentLoc.id.includes('senzaikyu')
                      ? 'sokyoku'
                      : currentLoc.id.includes('reiokyu')
                      ? 'reiokyu'
                      : 'seireitei'
                  );
                  setArchiveOpen(true);
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(111,183,255,0.35)',
                  background: 'rgba(11,16,36,0.75)',
                  color: '#6fb7ff',
                  fontFamily: 'var(--mono)',
                  fontSize: '9px',
                  letterSpacing: '0.06em',
                }}
              >
                ✎ FIELD NOTE
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetScene: SoulSocietySceneId =
                    currentLoc.id.includes('sokyoku') || currentLoc.id.includes('senzaikyu')
                      ? 'sokyoku'
                      : currentLoc.id.includes('reiokyu')
                      ? 'reiokyu'
                      : 'seireitei';
                  setThreeDSceneId(targetScene);
                  setThreeDViewOpen(true);
                  shikaiSoundRef.current?.play();
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(201,166,91,0.4)',
                  background: 'rgba(20,28,56,0.85)',
                  color: '#f4f1ea',
                  fontFamily: 'var(--mono)',
                  fontSize: '9px',
                  letterSpacing: '0.06em',
                }}
              >
                ◈ 3D VIEW
              </button>
            </div>
          </div>

          {/* Visual References Carousel */}
          {currentLoc.images && currentLoc.images.length > 0 && (
            <div className="location-carousel" aria-label="Visual reference gallery">
              <div className="carousel-header">
                <span>VISUAL REFERENCES</span>
                <span className="carousel-counter">
                  {String(carouselSlide + 1).padStart(2, '0')} / {String(currentLoc.images.length).padStart(2, '0')}
                </span>
              </div>

              <div
                className="carousel-viewport"
                onClick={() =>
                  setLightboxImage({
                    ...currentLoc.images![carouselSlide],
                    index: carouselSlide,
                  })
                }
                title="Click to expand high-resolution visual reference"
              >
                <div
                  className="carousel-track"
                  style={{ transform: `translateX(-${carouselSlide * 100}%)` }}
                >
                  {currentLoc.images.map((img, idx) => (
                    <div key={idx} className="carousel-slide">
                      <img src={img.url} alt={img.title} loading="lazy" />
                    </div>
                  ))}
                </div>

                {currentLoc.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="carousel-arrow prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCarouselSlide(
                          (prev) => (prev - 1 + currentLoc.images!.length) % currentLoc.images!.length
                        );
                      }}
                      aria-label="Previous visual reference"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="carousel-arrow next"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCarouselSlide((prev) => (prev + 1) % currentLoc.images!.length);
                      }}
                      aria-label="Next visual reference"
                    >
                      ›
                    </button>
                  </>
                )}

                <span className="carousel-zoom-hint">EXPAND ↗</span>
              </div>

              {/* Active Slide Metadata */}
              <div className="carousel-meta">
                <strong>{currentLoc.images[carouselSlide].title}</strong>
                <p>{currentLoc.images[carouselSlide].caption}</p>
              </div>

              {/* Thumbnails */}
              {currentLoc.images.length > 1 && (
                <div className="carousel-thumbs" role="tablist" aria-label="Reference image thumbnails">
                  {currentLoc.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={carouselSlide === idx}
                      className={`carousel-thumb ${carouselSlide === idx ? 'active' : ''}`}
                      onClick={() => setCarouselSlide(idx)}
                      aria-label={`View ${img.title}`}
                    >
                      <img src={img.url} alt={img.title} />
                    </button>
                  ))}
                </div>
              )}

              {/* Dot Indicators */}
              {currentLoc.images.length > 1 && (
                <div className="carousel-dots" aria-hidden="true">
                  {currentLoc.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`carousel-dot ${carouselSlide === idx ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="panel-sections">
            <section>
              <span>ARCHITECTURE & SEKKISEKI</span>
              <p>{currentLoc.architecture}</p>
            </section>
            <section>
              <span>MILITARY & SPIRITUAL PURPOSE</span>
              <p>{currentLoc.purpose}</p>
            </section>
            <section>
              <span>NOTABLE BLEACH SOUL REAPERS</span>
              <ul>
                {currentLoc.residents.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </section>
            <section className="spoiler-section">
              <span>
                KEY STORY EVENTS <b>{currentLoc.spoilerLevel}</b>
              </span>
              <ul>
                {spoilerLevel === 'soul' && currentLoc.spoilerLevel.toLowerCase().includes('tybw') ? (
                  <li>Higher-arc events (Thousand-Year Blood War) are hidden at this spoiler level. Raise the selector to ALL FILES to view this record.</li>
                ) : (
                  currentLoc.events.map((ev, idx) => <li key={idx}>{ev}</li>)
                )}
              </ul>
            </section>
            <section>
              <span>BLEACH CANON TRIVIA</span>
              <p>{currentLoc.trivia}</p>
            </section>
          </div>

          <div className="panel-nav">
            <button onClick={() => handleSelectLocation(activeLocation - 1)}>← PREVIOUS SITE</button>
            <button onClick={() => handleSelectLocation(activeLocation + 1)}>NEXT SITE →</button>
          </div>
        </aside>

        {/* Picture Detail Modal / Bleach Anime Context */}
        {activePictureDetail && (
          <div
            className="picture-detail-modal"
            onClick={() => setActivePictureDetail(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${activePictureDetail.name} Bleach Anime Details`}
          >
            <div className="picture-detail-panel" data-lenis-prevent="true" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="panel-close"
                onClick={() => setActivePictureDetail(null)}
                aria-label="Close picture details"
              >
                ×
              </button>

              <div className="picture-detail-header">
                <div>
                  <p className="jp-name">{activePictureDetail.jp}</p>
                  <h2>
                    {activePictureDetail.name} <em>Details</em>
                  </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--blue)', font: '500 10px/1 var(--mono)', display: 'block' }}>
                    {activePictureDetail.animeArc}
                  </span>
                  <span style={{ color: 'var(--muted)', font: '500 9px/1 var(--mono)', display: 'block', marginTop: '4px' }}>
                    {activePictureDetail.episodes}
                  </span>
                </div>
              </div>

              <div className="picture-detail-grid">
                <div>
                  <div className="picture-detail-section">
                    <span className="section-tag">WHAT IS SHOWN IN THIS PICTURE</span>
                    <p>{activePictureDetail.visualBreakdown}</p>
                  </div>

                  <div className="picture-detail-section">
                    <span className="section-tag">KEY ANIME MOMENTS & BATTLES HERE</span>
                    <ul>
                      {activePictureDetail.animeEvents.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>

                  {activePictureDetail.id === 'hero' && (
                    <div className="picture-detail-section canon-metrics-card">
                      <span className="section-tag">SOUL SOCIETY ARCHITECTURAL &amp; DEFENSE SPECIFICATIONS</span>
                      <div className="modal-specs-grid">
                        <div className="modal-spec-cell">
                          <span className="modal-spec-lbl">METROPOLIS SCALE</span>
                          <strong className="modal-spec-val">瀞霊廷 (Seireitei)</strong>
                          <small className="modal-spec-sub">400 Ri (~1,570 km) Circumference</small>
                        </div>
                        <div className="modal-spec-cell">
                          <span className="modal-spec-lbl">DEFENSE MATRIX</span>
                          <strong className="modal-spec-val">殺気石 (Sekkiseki)</strong>
                          <small className="modal-spec-sub">Spiritual Negation Wall &amp; Barrier</small>
                        </div>
                        <div className="modal-spec-cell">
                          <span className="modal-spec-lbl">MILITARY CITADEL</span>
                          <strong className="modal-spec-val">護廷十三隊 (Gotei 13)</strong>
                          <small className="modal-spec-sub">13 Divisions &amp; Captain Zanpakutō</small>
                        </div>
                        <div className="modal-spec-cell">
                          <span className="modal-spec-lbl">OUTER PROVINCES</span>
                          <strong className="modal-spec-val">流魂街 (Rukongai)</strong>
                          <small className="modal-spec-sub">320 Districts (80 × 4 Quadrants)</small>
                        </div>
                        <div className="modal-spec-cell">
                          <span className="modal-spec-lbl">SUPREME JUDICIARY</span>
                          <strong className="modal-spec-val">中央四十六室 (Central 46)</strong>
                          <small className="modal-spec-sub">40 Sages &amp; 6 Judges of Soul King Law</small>
                        </div>
                        <div className="modal-spec-cell">
                          <span className="modal-spec-lbl">CELESTIAL ZENITH</span>
                          <strong className="modal-spec-val">霊王宮 (Royal Realm)</strong>
                          <small className="modal-spec-sub">Reiōkyū Sanctuary &amp; Squad Zero</small>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="picture-detail-section">
                    <span className="section-tag">BLEACH ANIME TRIVIA</span>
                    <p>{activePictureDetail.trivia}</p>
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      aspectRatio: '16/9',
                      overflow: 'hidden',
                      border: '1px solid var(--hair)',
                      marginBottom: '16px',
                      background: '#05060f',
                    }}
                  >
                    <img
                      src={activePictureDetail.image}
                      alt={activePictureDetail.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div className="picture-detail-section">
                    <span className="section-tag">KEY CHARACTERS TIED TO THIS SITE</span>
                    <div className="character-tag-list">
                      {activePictureDetail.characters.map((c, i) => (
                        <span key={i} className="character-tag">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="picture-detail-section">
                    <span className="section-tag">SPIRITUAL DEFENSE & REISHI DYNAMICS</span>
                    <p>{activePictureDetail.spiritualProperties}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Soul Society Compendium Modal */}
        {compendiumOpen && (
          <div
            className="compendium-modal"
            onClick={() => setCompendiumOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Soul Society Compendium"
          >
            <div className="compendium-panel" data-lenis-prevent="true" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="panel-close"
                onClick={() => setCompendiumOpen(false)}
                aria-label="Close compendium"
              >
                ×
              </button>

              <div className="compendium-header">
                <p className="eyebrow" style={{ margin: '0 0 8px' }}>
                  <span>BLEACH ANIME ENCYCLOPEDIA</span>
                  <i />
                  <span>尸魂界・ソウル・ソサエティ</span>
                </p>
                <h2>
                  Soul Society <em>Deep Lore</em>
                </h2>
                <p>
                  The afterlife realm in Tite Kubo’s <em>Bleach</em> anime where human souls reside after passing from the Living World.
                  Ruled by the Central 46 judicial elders and defended by the Shinigami (Soul Reapers) of the Gotei 13.
                </p>
              </div>

              <div className="compendium-tabs">
                <button
                  type="button"
                  className={`compendium-tab-btn ${compendiumTab === 'characters' ? 'active' : ''}`}
                  onClick={() => {
                    setCompendiumTab('characters');
                    bleachAudioRef.current?.playShikai();
                  }}
                  style={{
                    color: compendiumTab === 'characters' ? 'var(--gold)' : undefined,
                    borderColor: compendiumTab === 'characters' ? 'var(--gold)' : undefined,
                  }}
                >
                  ⚔ KEY CHARACTERS (DOSSIERS)
                </button>
                <button
                  type="button"
                  className={`compendium-tab-btn ${compendiumTab === 'gotei' ? 'active' : ''}`}
                  onClick={() => {
                    setCompendiumTab('gotei');
                    bleachAudioRef.current?.playShikai();
                  }}
                  style={{
                    color: compendiumTab === 'gotei' ? '#D4AF37' : undefined,
                    borderColor: compendiumTab === 'gotei' ? '#D4AF37' : undefined,
                  }}
                >
                  🌸 THE 13 GOTEI SQUADS (全十三隊)
                </button>
                <button
                  type="button"
                  className={`compendium-tab-btn ${compendiumTab === 'zanpakuto' ? 'active' : ''}`}
                  onClick={() => {
                    setCompendiumTab('zanpakuto');
                    bleachAudioRef.current?.playShikai();
                  }}
                  style={{
                    color: compendiumTab === 'zanpakuto' ? '#38BDF8' : undefined,
                    borderColor: compendiumTab === 'zanpakuto' ? '#38BDF8' : undefined,
                  }}
                >
                  ⚔ ZANPAKUTŌ ENCYCLOPEDIA (斬魄刀)
                </button>
                <button
                  type="button"
                  className={`compendium-tab-btn ${compendiumTab === 'kido' ? 'active' : ''}`}
                  onClick={() => {
                    setCompendiumTab('kido');
                    bleachAudioRef.current?.playKido('hado');
                  }}
                  style={{
                    color: compendiumTab === 'kido' ? '#EF4444' : undefined,
                    borderColor: compendiumTab === 'kido' ? '#EF4444' : undefined,
                  }}
                >
                  🔥 KIDŌ SPELLBOOK (鬼道全集)
                </button>
                <button
                  type="button"
                  className={`compendium-tab-btn ${compendiumTab === 'royalguard' ? 'active' : ''}`}
                  onClick={() => {
                    setCompendiumTab('royalguard');
                    bleachAudioRef.current?.playBankai();
                  }}
                  style={{
                    color: compendiumTab === 'royalguard' ? '#F59E0B' : undefined,
                    borderColor: compendiumTab === 'royalguard' ? '#F59E0B' : undefined,
                  }}
                >
                  👑 SQUAD ZERO & ROYAL REALM (零番隊)
                </button>
                <button
                  type="button"
                  className={`compendium-tab-btn ${compendiumTab === 'balance' ? 'active' : ''}`}
                  onClick={() => setCompendiumTab('balance')}
                >
                  THE THREE REALMS & COSMIC BALANCE
                </button>
                <button
                  type="button"
                  className={`compendium-tab-btn ${compendiumTab === 'rukongai' ? 'active' : ''}`}
                  onClick={() => setCompendiumTab('rukongai')}
                >
                  SEIREITEI VS RUKONGAI DISTRICTS
                </button>
                <button
                  type="button"
                  className={`compendium-tab-btn ${compendiumTab === 'nobles' ? 'active' : ''}`}
                  onClick={() => setCompendiumTab('nobles')}
                >
                  FOUR NOBLE CLANS & ARISTOCRACY
                </button>
                <button
                  type="button"
                  className={`compendium-tab-btn ${compendiumTab === 'corps' ? 'active' : ''}`}
                  onClick={() => setCompendiumTab('corps')}
                >
                  SPECIAL FORCES (STEALTH, S.R.D.I. & MUKEN)
                </button>
              </div>

              {compendiumTab === 'characters' && (
                <CharacterLoreSection onPlaySound={() => bleachAudioRef.current?.playShikai()} />
              )}

              {compendiumTab === 'gotei' && (
                <GoteiDivisionsDirectory onPlaySound={() => bleachAudioRef.current?.playShikai()} />
              )}

              {compendiumTab === 'zanpakuto' && (
                <ZanpakutoCompendium onPlayShikaiSound={() => bleachAudioRef.current?.playShikai()} />
              )}

              {compendiumTab === 'kido' && (
                <KidoSpellbook onPlaySpellSound={(type) => bleachAudioRef.current?.playKido(type)} />
              )}

              {compendiumTab === 'royalguard' && (
                <RoyalGuardDossier onPlaySound={() => bleachAudioRef.current?.playShikai()} />
              )}

              {compendiumTab === 'balance' && (
                <div className="compendium-grid">
                  <article className="compendium-card highlight">
                    <span className="card-label">THE BALANCE OF SOULS</span>
                    <h3>The Tripartite Cycle</h3>
                    <p>
                      The universe is held in delicate equilibrium between the World of the Living (現世), Soul Society (尸魂界), and
                      Hueco Mundo (虚圏). Shinigami perform Soul Burials (Konsō) to send wandering Plus spirits to Soul Society and purify
                      corrupted Hollows with Zanpakutō. If the balance collapses, all three worlds would crumble into primordial chaos.
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">SOUL KING & ROYAL GUARDS</span>
                    <h3>The Linchpin of Existence</h3>
                    <p>
                      Floating high in the Royal Realm (Reiōkyū) above Soul Society sits the Soul King (Reiō), the passive linchpin
                      governing the flow of souls. Defended exclusively by the Zero Squad (Royal Guard), including figures such as Ichibē
                      Hyōsube, Senjumaru Shutara, Tenjirō Kirinji, Kirio Hikifune, and Ōetsu Nimaiya.
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">THE DANGAI PRECIPICE</span>
                    <h3>The Dimensional Corridor</h3>
                    <p>
                      The dangerous hyperspace tunnel connecting Soul Society to the Human World (Karakura Town). Time flows 2,000 times
                      faster inside the Dangai. Governed by the Kōtotsu (Cleaner), a giant spatial vacuum that sweeps away unauthorized
                      travelers unless guided by a Hell Butterfly (Jigokuchō).
                    </p>
                  </article>
                </div>
              )}

              {compendiumTab === 'rukongai' && (
                <div className="compendium-grid">
                  <article className="compendium-card highlight">
                    <span className="card-label">THE 80 DISTRICTS</span>
                    <h3>Outer Rukongai</h3>
                    <p>
                      The sprawling afterlife province divided into four directions (North, South, East, West), each containing 80
                      districts numbered 1 to 80. District 1 (such as Junrinan) is orderly, peaceful, and prosperous, while outer districts
                      like District 78 (Inuzuri) and District 80 (Zaraki) are barren, violent frontier territories where survival is a daily
                      battle.
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">ORIGINS OF HEROES</span>
                    <h3>Born Beyond the Walls</h3>
                    <p>
                      Many of Soul Society’s most legendary figures grew up as orphans in poor Rukongai districts: Rukia Kuchiki and Renji
                      Abarai survived together in Inuzuri (District 78); Gin Ichimaru and Rangiku Matsumoto shared dried persimmons in
                      District 62; and Kenpachi Zaraki took his name from the most bloodstained territory of all, District 80 (Zaraki).
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">POVERTY VS REIATSU</span>
                    <h3>The Hunger Paradox</h3>
                    <p>
                      Ordinary deceased souls in Rukongai feel neither hunger nor cold as long as they consume ambient spiritual water.
                      However, souls born with latent Reiryoku (spiritual power) experience intense biological hunger and must eat food,
                      frequently forcing impoverished spiritual children to steal or join the Shin’ō Academy for survival.
                    </p>
                  </article>
                </div>
              )}

              {compendiumTab === 'nobles' && (
                <div className="compendium-grid">
                  <article className="compendium-card highlight">
                    <span className="card-label">THE KUCHIKI CLAN (朽木家)</span>
                    <h3>Guardians of Law & Aristocracy</h3>
                    <p>
                      Led by the 28th Clan Head Byakuya Kuchiki. The foremost noble house in Seireitei, responsible for upholding the absolute
                      sanctity of Soul Society laws and historical customs. Their sprawling manor houses private cherry blossom groves and the
                      ancestral Senbonzakura lineage. Byakuya caused aristocratic uproar by marrying commoner Hisana and adopting her sister Rukia.
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">THE SHIHŌIN CLAN (四楓院家)</span>
                    <h3>Masters of Stealth & Heavenly Relics</h3>
                    <p>
                      Led by the 22nd Clan Head Yoruichi Shihōin ("Tenshitōsoku / God of Flash"). Hereditary commanders of the Onmitsukidō (Stealth Force)
                      and keepers of sacred divine tools: the Shield of Tenma, the Cape of Flight, and the Tenshintai doll used for rapid 3-day Bankai training.
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">THE SHIBA CLAN (志波家)</span>
                    <h3>Fallen Great Nobles & Firework Artificers</h3>
                    <p>
                      The former Fifth Great Noble Family, stripped of status after tragic conflicts. Guided by matriarch Kūkaku Shiba and Ganju Shiba,
                      they command the giant Flower Crane Fireworks Cannon (Kakkaku Hō) that fired Ichigo’s strike team through the Sekkiseki barrier.
                      Isshin Shiba (Ichigo’s father and former 10th Division Captain) sacrificed his Soul Reaper powers to save Masaki Kurosaki.
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">THE TSUNAYASHIRO CLAN (綱彌代家)</span>
                    <h3>Chronicle Keepers & The Primordial Sin</h3>
                    <p>
                      The ancient aristocratic house entrusted with recording all Soul Society history. According to Bleach light novel canon
                      (Can’t Fear Your Own World), their ancestor orchestrated the original sin of dismembering the Soul King to separate the primordial
                      chaos into the Three Worlds. Possess the ancestral blade Enrakyōten which copies any Shikai power.
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">THE KASŌŌJI CLAN (霞大路家)</span>
                    <h3>Palace Weaponsmiths & Bakkōtō</h3>
                    <p>
                      A high-ranking aristocratic family from Bleach anime canon who traditionally forge ceremonial blades for the Royal Palace.
                      Infiltrated during the Kasōōji Conspiracy Arc when rogue retainers manufactured Bakkōtō—parasitic spiritual blades that consume the wielder’s
                      own Reiatsu in exchange for immense mutated power.
                    </p>
                  </article>
                </div>
              )}

              {compendiumTab === 'corps' && (
                <div className="compendium-grid">
                  <article className="compendium-card highlight">
                    <span className="card-label">ONMITSUKIDŌ (隠密機動)</span>
                    <h3>The Stealth Force & Maggot’s Nest</h3>
                    <p>
                      The covert operations branch consisting of five units: Executive Militia (Punishment Force), Patrol Corps, Detention Unit,
                      Infiltration, and Messengers. Headquartered at the 2nd Division barracks (Sui-Fēng / Yoruichi). The Detention Unit guards
                      the Maggot’s Nest (Ujimushinosu)—an underground prison where Shinigami deemed psychologically dangerous are detained without committing crimes.
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">KIDŌ CORPS (鬼道衆)</span>
                    <h3>The Masters of Dimensional Spells</h3>
                    <p>
                      An autonomous spiritual detachment independent from the Gotei 13. Commanded by the Grand Kidō Chief (Tessai Tsukabishi) and
                      Lieutenant Chief (Hachigen Ushōda). Charged with opening the Senkaimon gateway, casting high-density Sekkiseki wards, and executing
                      classified forbidden spells capable of stopping time and teleporting space.
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">S.R.D.I. (技術開発局)</span>
                    <h3>Technological Development Bureau</h3>
                    <p>
                      Founded 110 years ago by 12th Division Captain Kisuke Urahara and later governed by Mayuri Kurotsuchi. Responsible for creating
                      artificial Gigai bodies, Denreishinki cell phones, Spirit Particle radars, the Tenshintai doll, and the Shin'eiyaku pills that restored
                      stolen Bankai during the Quincy Thousand-Year Blood War.
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">THE GREAT UNDERGROUND PRISON (地下監獄)</span>
                    <h3>The 8th Level Void: Muken (無間)</h3>
                    <p>
                      The maximum-security subterranean abyss beneath the 1st Division barracks, divided into eight descending tiers of increasing severity.
                      The bottom level, Muken ("Avīci / Infinite Darkness"), is a vast void of pitch darkness and sensory deprivation where immortal beings
                      who cannot be killed—most notably Sōsuke Aizen—are bound to containment chairs with spiritual seals for 20,000-year terms.
                    </p>
                  </article>
                  <article className="compendium-card">
                    <span className="card-label">SHIN’Ō ACADEMY (真央霊術院)</span>
                    <h3>The 2,000-Year Cradle of Shinigami</h3>
                    <p>
                      Founded by Captain-Commander Genryūsai Shigekuni Yamamoto two millennia ago. Prospective Soul Reapers train here for six years,
                      receiving unprinted Asauchi swords and mastering the four foundational disciplines of combat (Zankensōki): Zanjutsu (swordsmanship),
                      Hakuda (unarmed combat), Hōhō (high-speed footwork / Shunpō), and Kidō (spiritual arts).
                    </p>
                  </article>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen} data-lenis-prevent="true">
          <div
            className="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="SEIREITEI ATLAS navigation"
            data-lenis-prevent="true"
          >
            <nav>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToProgress(0);
                }}
              >
                01 / 瀞霊廷全景 • SEIREITEI CITADEL
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToProgress(0.125);
                }}
              >
                02 / 四大瀞霊門 • 4 PURE SOUL GATES
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToProgress(0.25);
                }}
              >
                03 / 中央大通 • GOTEI 13 PROMENADE
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToProgress(0.375);
                }}
              >
                04 / 双殛の丘 • SŌKYOKU EXECUTION MESA
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToProgress(0.50);
                }}
              >
                05 / 結界開門 • THE INNER BARRIER GATE
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToProgress(0.625);
                }}
              >
                06 / 一番隊舎 • 1ST DIVISION COMMAND
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToProgress(0.75);
                }}
              >
                07 / 中央四十六室 • CENTRAL 46 ASSEMBLY
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToProgress(0.875);
                }}
              >
                08 / 大霊書回廊 • DAIREISHOSHITSU ARCHIVES
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToProgress(1.0);
                }}
              >
                09 / 霊王宮 • THE ROYAL REALM (REIŌKYŪ)
              </button>
              <button
                style={{ color: 'var(--blue)' }}
                onClick={() => {
                  setMenuOpen(false);
                  handleSelectLocation(activeLocation);
                }}
              >
                ♫ SEIREITEI SURVEY &amp; REISHI WIND
              </button>
              <button
                style={{ color: 'var(--gold)' }}
                onClick={() => {
                  setMenuOpen(false);
                  setCompendiumOpen(true);
                }}
              >
                ⚔ BLEACH COMPENDIUM &amp; REALM LORE
              </button>
              <button
                style={{ color: '#F59E0B', fontWeight: 600 }}
                onClick={() => {
                  setMenuOpen(false);
                  setCompendiumTab('characters');
                  setCompendiumOpen(true);
                  bleachAudioRef.current?.playShikai();
                }}
              >
                ⚔ CAPTAINS &amp; CHARACTERS (DOSSIERS)
              </button>
              <button
                style={{ color: '#D4AF37', fontWeight: 600 }}
                onClick={() => {
                  setMenuOpen(false);
                  setCompendiumTab('gotei');
                  setCompendiumOpen(true);
                  bleachAudioRef.current?.playShikai();
                }}
              >
                🌸 13 GOTEI SQUADS DIRECTORY (全十三隊)
              </button>
              <button
                style={{ color: '#38BDF8', fontWeight: 600 }}
                onClick={() => {
                  setMenuOpen(false);
                  setCompendiumTab('zanpakuto');
                  setCompendiumOpen(true);
                  bleachAudioRef.current?.playShikai();
                }}
              >
                ⚔ ZANPAKUTŌ ENCYCLOPEDIA (斬魄刀)
              </button>
              <button
                style={{ color: '#EF4444', fontWeight: 600 }}
                onClick={() => {
                  setMenuOpen(false);
                  setCompendiumTab('kido');
                  setCompendiumOpen(true);
                  bleachAudioRef.current?.playKido('hado');
                }}
              >
                🔥 KIDŌ SPELLBOOK &amp; CHANTS (鬼道全集)
              </button>
              <button
                style={{ color: '#EAB308', fontWeight: 600 }}
                onClick={() => {
                  setMenuOpen(false);
                  setCompendiumTab('royalguard');
                  setCompendiumOpen(true);
                  bleachAudioRef.current?.playBankai();
                }}
              >
                👑 SQUAD ZERO &amp; ROYAL REALM (零番隊)
              </button>
              <button
                style={{ color: '#10B981', fontWeight: 600 }}
                onClick={() => {
                  setMenuOpen(false);
                  setSoundboardOpen(true);
                  bleachAudioRef.current?.playShikai();
                }}
              >
                🔊 REIATSU SOUNDBOARD ♫
              </button>
              <button
                style={{ color: '#38BDF8', fontWeight: 600 }}
                onClick={() => {
                  setMenuOpen(false);
                  setAtlasOpen(true);
                  bleachAudioRef.current?.playShikai();
                }}
              >
                🗺 SEIREITEI ATLAS (D3 VECTOR MAP)
              </button>
              <button
                style={{ color: '#6FB7FF', fontWeight: 600 }}
                onClick={() => {
                  setMenuOpen(false);
                  setThreeDSceneId('seireitei');
                  setThreeDViewOpen(true);
                  shikaiSoundRef.current?.play();
                }}
              >
                ◈ INTERACTIVE 3D SOUL SOCIETY SCENES
              </button>
              <button
                style={{ color: '#C9A65B', fontWeight: 600 }}
                onClick={() => {
                  setMenuOpen(false);
                  setArchivePrefillLoc(locations[activeLocation]?.id);
                  setArchiveOpen(true);
                }}
              >
                ⚑ SOUL REAPER FIELD ARCHIVE ({bookmarks.length})
              </button>
            </nav>
            <button
              className="mobile-enter"
              onClick={() => {
                setMenuOpen(false);
                setEntryModalOpen(true);
              }}
            >
              SEARCH SEIREITEI ARCHIVES ↗
            </button>
          </div>
        </div>

        {/* Entry / Search Modal */}
        <div
          className={`entry-backdrop ${entryModalOpen ? 'is-visible' : ''}`}
          hidden={!entryModalOpen}
          onClick={() => setEntryModalOpen(false)}
        />
        <section
          className={`entry-modal ${entryModalOpen ? 'is-open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="entry-title"
          hidden={!entryModalOpen}
        >
          <button className="modal-close" onClick={() => setEntryModalOpen(false)} aria-label="Close entry modal">
            ×
          </button>
          <p className="eyebrow">
            <span>SEIREITEI ARCHIVES / SEARCH • 霊書探訪</span>
          </p>
          <h2 id="entry-title">Search Soul Society Archives.</h2>
          <p className="modal-lede">Search surveyed landmarks of Soul Society, Gotei 13 barracks, and Rukongai districts from Bleach anime canon.</p>

          <label className="search-label">
            LOCATION SEARCH
            <input
              ref={searchInputRef}
              id="location-search"
              type="search"
              placeholder="Try Sōkyoku Hill, First Division, Senkaimon, or Central 46..."
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>

          <div id="search-results" className="search-results">
            {searchedLocations.length > 0 ? (
              searchedLocations.map((loc) => {
                const idx = locations.findIndex((l) => l.id === loc.id);
                return (
                  <button
                    key={loc.id}
                    className="search-result"
                    onClick={() => {
                      setEntryModalOpen(false);
                      handleSelectLocation(idx);
                    }}
                  >
                    <span>{loc.region}</span>
                    <strong>{loc.name}</strong>
                    <small>{loc.jp}</small>
                  </button>
                );
              })
            ) : (
              <p className="empty-search">No matching Soul Society record found in the Gotei archives.</p>
            )}
          </div>

          <label className="search-label">
            SPOILER LEVEL
            <select
              id="spoiler-select"
              value={spoilerLevel}
              onChange={(e) => {
                const val = e.target.value as 'all' | 'soul' | 'tybw';
                setSpoilerLevel(val);
                showToast(`Spoiler level: ${e.target.options[e.target.selectedIndex].text}`);
              }}
            >
              <option value="all">ALL FILES (FULL SERIES)</option>
              <option value="soul">SOUL SOCIETY ARC ONLY</option>
              <option value="tybw">THOUSAND-YEAR BLOOD WAR</option>
            </select>
          </label>

          <p className="modal-footnote">Bleach © Tite Kubo / Shueisha / TV Tokyo / Studio Pierrot. Unofficial fan field guide.</p>
        </section>

        {/* Full-screen Lightbox for expanded visual references */}
        {lightboxImage && (
          <div
            className="lightbox-backdrop"
            onClick={() => setLightboxImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Expanded visual reference"
          >
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="lightbox-close"
                onClick={() => setLightboxImage(null)}
                aria-label="Close enlarged view"
              >
                ×
              </button>

              <div className="lightbox-image-wrap">
                <img src={lightboxImage.url} alt={lightboxImage.title} />
              </div>

              <div className="lightbox-info">
                <div>
                  <strong>{lightboxImage.title}</strong>
                  <p>{lightboxImage.caption}</p>
                </div>

                {currentLoc.images && currentLoc.images.length > 1 && (
                  <div className="lightbox-nav">
                    <button
                      type="button"
                      className="lightbox-nav-btn"
                      onClick={() => {
                        const newIdx = (lightboxImage.index - 1 + currentLoc.images!.length) % currentLoc.images!.length;
                        setLightboxImage({
                          ...currentLoc.images![newIdx],
                          index: newIdx,
                        });
                        setCarouselSlide(newIdx);
                      }}
                      aria-label="Previous visual reference"
                    >
                      ← PREV
                    </button>
                    <span style={{ fontSize: '10px', color: 'var(--gold)', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>
                      {String(lightboxImage.index + 1).padStart(2, '0')} / {String(currentLoc.images.length).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      className="lightbox-nav-btn"
                      onClick={() => {
                        const newIdx = (lightboxImage.index + 1) % currentLoc.images!.length;
                        setLightboxImage({
                          ...currentLoc.images![newIdx],
                          index: newIdx,
                        });
                        setCarouselSlide(newIdx);
                      }}
                      aria-label="Next visual reference"
                    >
                      NEXT →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* D3 Atlas View Overlay */}
        <AtlasViewOverlay
          isOpen={atlasOpen}
          onClose={() => setAtlasOpen(false)}
          onSelectLocation={(siteName) => {
            const q = siteName.toLowerCase();
            let locIdx = locations.findIndex(
              (l) => l.name.toLowerCase().includes(q) || q.includes(l.name.toLowerCase())
            );
            if (locIdx < 0) {
              const idMap: Array<[string, string]> = [
                ['1st division', 'first-division-barracks-captains-meeting-hall'],
                ['4th division', 'fourth-division-relief-station'],
                ['6th division', 'sixth-division-barracks'],
                ['kuchiki', 'sixth-division-barracks'],
                ['central 46', 'central-46-chamber'],
                ['sōkyoku', 'sokyoku-hill'],
                ['senzaikyū', 'senzaikyu'],
                ['academy', 'shino-academy'],
                ['gate', 'seireitei-outer-wall-four-gates'],
                ['wall', 'seireitei-outer-wall-four-gates'],
                ['senkaimon', 'seireitei-outer-wall-four-gates'],
                ['reiōkyū', 'reiokyu-soul-king-palace'],
                ['soul king', 'reiokyu-soul-king-palace'],
              ];
              const mapped = idMap.find(([key]) => q.includes(key));
              if (mapped) {
                locIdx = locations.findIndex((l) => l.id === mapped[1]);
              }
            }
            if (locIdx >= 0) {
              handleSelectLocation(locIdx);
              showToast(`Navigated to: ${locations[locIdx].name}`);
            } else if (q.includes('division') || q.includes('central 46')) {
              setCompendiumTab('gotei');
              setCompendiumOpen(true);
              showToast(`Opened Gotei 13 Lore for ${siteName}`);
            } else {
              setCompendiumTab('rukongai');
              setCompendiumOpen(true);
              showToast(`Opened Rukongai Lore for ${siteName}`);
            }
          }}
          onPlaySound={() => shikaiSoundRef.current?.play()}
        />

        {/* Procedural Reiatsu Soundboard Modal */}
        <BleachSoundboardModal
          isOpen={soundboardOpen}
          onClose={() => setSoundboardOpen(false)}
          synth={bleachAudioRef.current || new BleachAudioSynthesizer()}
        />

        {/* Interactive Three.js 3D Soul Society Scenes */}
        <SoulSociety3DView
          isOpen={threeDViewOpen}
          initialScene={threeDSceneId}
          isDawn={isDawn}
          onClose={() => setThreeDViewOpen(false)}
          onOpenLocationPanel={(locationId) => {
            const idx = locations.findIndex((l) => l.id === locationId);
            if (idx >= 0) {
              handleSelectLocation(idx);
            } else {
              setCompendiumOpen(true);
              showToast('Opened Soul Society Lore Dossier');
            }
          }}
          onOpenArchiveModal={(prefillLoc, prefillScene) => {
            setThreeDViewOpen(false);
            setArchivePrefillLoc(prefillLoc);
            if (prefillScene) setArchivePrefillScene(prefillScene);
            setArchiveOpen(true);
          }}
          onToast={showToast}
        />

        {/* Authenticated Soul Reaper Dossier & Field Archive (Cloud SQL) */}
        <SoulReaperArchiveModal
          isOpen={archiveOpen}
          onClose={() => setArchiveOpen(false)}
          locations={locations}
          prefillLocationId={archivePrefillLoc}
          prefillScene={archivePrefillScene}
          onJumpToLocation={(locationId) => {
            const idx = locations.findIndex((l) => l.id === locationId);
            if (idx >= 0) handleSelectLocation(idx);
          }}
          onLaunch3DScene={(sceneId) => {
            setThreeDSceneId(sceneId);
            setThreeDViewOpen(true);
          }}
          onToast={showToast}
        />


        {/* Full-Screen Website Loading Animation (Cooking Soul Society View) */}
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05060f] transition-all duration-700 ease-out select-none ${
            isCookingView ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none scale-105'
          }`}
          role="status"
          aria-label="Website loading screen: Cooking Soul Society View"
          onClick={() => setIsCookingView(false)}
        >
          {/* Deep celestial Reiatsu aura */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#6fb7ff]/10 via-transparent to-transparent pointer-events-none" />

          {/* Floating Reishi spirit embers */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-[#6fb7ff] opacity-40 animate-[emberFloat_4.5s_ease-in-out_infinite]"
                style={{
                  width: `${(i % 3) + 2}px`,
                  height: `${(i % 3) + 2}px`,
                  left: `${(i * 17) % 100}%`,
                  bottom: `-${(i * 5) % 15}%`,
                  animationDelay: `${i * 0.22}s`,
                  animationDuration: `${3.2 + (i % 5) * 0.7}s`,
                  filter: 'blur(0.5px) drop-shadow(0 0 8px #6fb7ff)',
                }}
              />
            ))}
          </div>

          {/* Background Japanese Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] -z-10">
            <span className="font-serif text-[clamp(12rem,28vw,26rem)] font-bold text-[#f4f1ea] leading-none tracking-widest">
              尸魂界
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center px-4 max-w-xl text-center">
            <LoadingLines text="SOUL SOCIETY REALM • 尸魂界" />

            {/* Cinematic Progress Bar & Live Status */}
            <div className="w-[300px] sm:w-[420px] mt-6 flex flex-col gap-2.5">
              <div className="flex justify-between items-center font-mono text-[9.5px] sm:text-[10px] text-[#f4f1ea]/80 tracking-wider">
                <span className="flex items-center gap-2 text-left truncate pr-2">
                  <span className="text-[#c9a65b] text-xs flex-shrink-0" aria-hidden="true">◈</span>
                  <span className="text-[#38bdf8] font-semibold">{cookingStageMessage}</span>
                </span>
                <span className="font-semibold text-[#c9a65b] font-mono text-[11px] flex-shrink-0">
                  {loadPercent}%
                </span>
              </div>

              {/* Glowing High-Tech Reishi Progress Rail */}
              <div className="w-full h-[5px] bg-white/10 rounded-full overflow-hidden p-[0.5px] border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#6fb7ff] via-[#c9a65b] to-[#f4f1ea] rounded-full transition-all duration-75 ease-out shadow-[0_0_14px_rgba(111,183,255,0.95)]"
                  style={{ width: `${loadPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center font-mono text-[8.5px] text-zinc-500 tracking-wider mt-0.5">
                <span>SEIREITEI SECTOR 01–13</span>
                <span>SEKKISEKI WARDS 100% CANON</span>
              </div>
            </div>

            <p className="font-mono text-[10px] tracking-[0.2em] text-[#c9a65b]/80 uppercase mt-6">
              始解 • Synthesizing Reishi Atmosphere & Concentric Sekkiseki Wards
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsCookingView(false);
              }}
              className="mt-6 px-4 py-1.5 rounded border border-white/15 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-mono text-[9px] tracking-widest transition-all cursor-pointer"
            >
              SKIP PRELOADER [ESC]
            </button>
          </div>

          {/* Zanpakutō Blade Flash on Finish */}
          <div
            className={`absolute inset-0 bg-white transition-opacity duration-300 pointer-events-none z-[10000] ${
              bladeFlash ? 'opacity-90' : 'opacity-0'
            }`}
          />
        </div>

        {/* Toast Alert */}
        <div className={`toast ${toastMessage ? 'visible' : ''}`} role="status" aria-live="polite">
          {toastMessage}
        </div>
      </div>
    </>
  );
}
