import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';

export type AtlasMode = 'administrative' | 'rukongai';

export interface DistrictInfo {
  id: string;
  name: string;
  jp: string;
  category: 'central' | 'gotei' | 'noble' | 'threshold' | 'rukongai';
  quadrant: 'Central' | 'North' | 'South' | 'East' | 'West';
  captainOrLeader?: string;
  dutyOrType: string;
  spiritDensity: 'Extreme' | 'High' | 'Moderate' | 'Low' | 'Lawless Void';
  description: string;
  notableFigures: string[];
  arcEvent: string;
  // Polar coordinate specs for D3 rendering
  innerRadiusRatio: number;
  outerRadiusRatio: number;
  startAngle: number; // in radians
  endAngle: number;
  color: string;
}

const ADMINISTRATIVE_DISTRICTS: DistrictInfo[] = [
  {
    id: 'c46',
    name: 'Central 46 Underground Compound',
    jp: '中央四十六室 (Chūō Shijūrokushitsu)',
    category: 'central',
    quadrant: 'Central',
    captainOrLeader: '40 Sages & 6 Judges',
    dutyOrType: 'Supreme Judiciary & Government of Soul Society',
    spiritDensity: 'Extreme',
    description: 'The sealed subterranean legislative council hall where the laws of the afterlife are issued and enforced under martial penalty.',
    notableFigures: ['Sōsuke Aizen', 'Genryūsai Yamamoto', 'Shunsui Kyōraku'],
    arcEvent: 'Aizen annihilated all 46 magistrates before issuing false execution orders for Rukia Kuchiki from behind closed doors.',
    innerRadiusRatio: 0,
    outerRadiusRatio: 0.16,
    startAngle: 0,
    endAngle: Math.PI * 2,
    color: '#E0564C',
  },
  {
    id: 'div1',
    name: '1st Division • General Command HQ',
    jp: '一番隊 (Ichibantai)',
    category: 'gotei',
    quadrant: 'North',
    captainOrLeader: 'Genryūsai Yamamoto / Shunsui Kyōraku',
    dutyOrType: 'Executive Command & Gotei 13 Leadership',
    spiritDensity: 'Extreme',
    description: 'The monumental central barracks housing the Captain-Commander’s office, war council hall, and historical assembly chambers.',
    notableFigures: ['Genryūsai Shigekuni Yamamoto', 'Chōjirō Sasakibe', 'Genshirō Okikiba', 'Shunsui Kyōraku'],
    arcEvent: 'Site of the Captains’ War Council before the Ryōka invasion and Yamamoto’s final stand against the Quincy Sternritter.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: -Math.PI / 12,
    endAngle: Math.PI / 12,
    color: '#D4AF37',
  },
  {
    id: 'sokyoku',
    name: 'Sōkyoku Hill & Execution Mesa',
    jp: '双殛の丘 (Sōkyoku no Oka)',
    category: 'central',
    quadrant: 'South',
    captainOrLeader: 'Captain-Commander Custody',
    dutyOrType: 'Halberd Execution & Spiritual Verdict Mesa',
    spiritDensity: 'Extreme',
    description: 'The cliff precipice towering over Seireitei where the Phoenix Halberd vaporizes transgressors with the destructive power of a million Zanpakutō.',
    notableFigures: ['Ichigo Kurosaki', 'Rukia Kuchiki', 'Byakuya Kuchiki', 'Jūshirō Ukitake'],
    arcEvent: 'Ichigo shattered the execution scaffold, blocked the giant fiery Phoenix blade with Zangetsu, and unlocked Bankai.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: (11 * Math.PI) / 12,
    endAngle: (13 * Math.PI) / 12,
    color: '#FF6B4A',
  },
  {
    id: 'div2',
    name: '2nd Division • Onmitsukidō Headquarters',
    jp: '二番隊 • 隠密機動 (Omitsukidō)',
    category: 'gotei',
    quadrant: 'North',
    captainOrLeader: 'Suì-Fēng (Soi Fon) / Yoruichi Shihōin',
    dutyOrType: 'Covert Ops, Assassination & Special Detention (Maggot’s Nest)',
    spiritDensity: 'High',
    description: 'Concealed fortified barracks linked to the underground Maggot’s Nest prison where dangerous Shinigami are interned without trial.',
    notableFigures: ['Suì-Fēng', 'Marechiyo Ōmaeda', 'Yoruichi Shihōin', 'Kisuke Urahara (former leader)'],
    arcEvent: 'Site of the historic breakout of Kisuke Urahara and Tessai Tsukabishi 100 years ago during the Turn Back the Pendulum arc.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: Math.PI / 12,
    endAngle: (3 * Math.PI) / 12,
    color: '#38BDF8',
  },
  {
    id: 'div3',
    name: '3rd Division • Barracks & Bell Tower',
    jp: '三番隊 (Sanbantai)',
    category: 'gotei',
    quadrant: 'East',
    captainOrLeader: 'Rōjūrō Ōtoribashi (Rose) / Gin Ichimaru',
    dutyOrType: 'Support Warfare & Bell Warning Sentinels',
    spiritDensity: 'High',
    description: 'Stately tiled barracks with panoramic views over the eastern Seireitei districts and the Hakutōmon approach.',
    notableFigures: ['Gin Ichimaru', 'Izuru Kira', 'Rōjūrō Ōtoribashi'],
    arcEvent: 'Kira confronted Hinamori and Rangiku here as tension flared regarding Captain Aizen’s suspicious demise.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: (3 * Math.PI) / 12,
    endAngle: (5 * Math.PI) / 12,
    color: '#818CF8',
  },
  {
    id: 'div4',
    name: '4th Division • Comprehensive Relief Station',
    jp: '四番隊 (Yonbantai • Sōgō Kyūgojo)',
    category: 'gotei',
    quadrant: 'East',
    captainOrLeader: 'Retsu Unohana / Isane Kotetsu',
    dutyOrType: 'Medical Relief, Healing Kidō & Sanitization',
    spiritDensity: 'High',
    description: 'Expansive medical compound, underground drainage channels, and Reishi-treated triage clinics staffed by Kidō healers.',
    notableFigures: ['Retsu Unohana (Yachiru)', 'Isane Kotetsu', 'Hanatarō Yamada', 'Seinosuke Yamada'],
    arcEvent: 'Hanatarō smuggled Ichigo and Ganju through the underground sewers directly under the 4th Division headquarters.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: (5 * Math.PI) / 12,
    endAngle: (7 * Math.PI) / 12,
    color: '#34D399',
  },
  {
    id: 'div5',
    name: '5th Division • Training Halls & Archives',
    jp: '五番隊 (Gobantai)',
    category: 'gotei',
    quadrant: 'East',
    captainOrLeader: 'Shinji Hirako / Sōsuke Aizen',
    dutyOrType: 'Kidō & Combat Readiness Personnel Training',
    spiritDensity: 'High',
    description: 'Traditional dojos, ornamental gardens, and administrative records rooms where Captain Aizen orchestrated his centuries-long plan.',
    notableFigures: ['Shinji Hirako', 'Momo Hinamori', 'Sōsuke Aizen (former)'],
    arcEvent: 'Where Aizen faked his impalement upon the wall, igniting civil war within the Gotei 13.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: (7 * Math.PI) / 12,
    endAngle: (9 * Math.PI) / 12,
    color: '#A78BFA',
  },
  {
    id: 'div6',
    name: '6th Division • Noble Custody & Kuchiki Manor',
    jp: '六番隊 (Rokubantai)',
    category: 'gotei',
    quadrant: 'South',
    captainOrLeader: 'Byakuya Kuchiki',
    dutyOrType: 'Internal Law Enforcement, Discipline & Noble Security',
    spiritDensity: 'Extreme',
    description: 'Immaculate white barracks adjoining the massive ancestral estate and cherry blossom courtyards of the Great Kuchiki Clan.',
    notableFigures: ['Byakuya Kuchiki', 'Renji Abarai', 'Rikichi Shinba', 'Ginrei Kuchiki'],
    arcEvent: 'Ichigo defeated Lieutenant Renji Abarai in the 6th Division courtyard after learning Roar, Zabimaru.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: (9 * Math.PI) / 12,
    endAngle: (11 * Math.PI) / 12,
    color: '#F472B6',
  },
  {
    id: 'div7',
    name: '7th Division • Honor Watch & Vanguard',
    jp: '七番隊 (Nanabantai)',
    category: 'gotei',
    quadrant: 'South',
    captainOrLeader: 'Sajin Komamura / Tetsuzaemon Iba',
    dutyOrType: 'Heavy Vanguard, Moral Duty & Perimeter Honor Watch',
    spiritDensity: 'High',
    description: 'Stone bastion barracks overlooking the southern approaches, renowned for strict bushido discipline and devotion to Yamamoto.',
    notableFigures: ['Sajin Komamura', 'Tetsuzaemon Iba', 'Jirōbō Ikkanzaka'],
    arcEvent: 'Komamura manifested Kokujō Tengen Myō\'ō against Kenpachi Zaraki during the rescue of Rukia.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: (13 * Math.PI) / 12,
    endAngle: (15 * Math.PI) / 12,
    color: '#FBBF24',
  },
  {
    id: 'div8',
    name: '8th Division • Cultural Courtyards',
    jp: '八番隊 (Hachibantai)',
    category: 'gotei',
    quadrant: 'West',
    captainOrLeader: 'Shunsui Kyōraku / Lisa Yadōmaru',
    dutyOrType: 'Intelligence Oversight, Reserve Troops & Cultural Protocol',
    spiritDensity: 'High',
    description: 'Wisteria arbor pavilions, tea terraces, and relaxed courtyards masking deep strategic command.',
    notableFigures: ['Shunsui Kyōraku', 'Nanao Ise', 'Lisa Yadōmaru'],
    arcEvent: 'Shunsui and Jūshirō planned the destruction of the Sōkyoku execution halberd from these pavilions.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: (15 * Math.PI) / 12,
    endAngle: (17 * Math.PI) / 12,
    color: '#EC4899',
  },
  {
    id: 'div11',
    name: '11th Division • Combat Barracks & Dojos',
    jp: '十一番隊 (Jūichibantai)',
    category: 'gotei',
    quadrant: 'West',
    captainOrLeader: 'Kenpachi Zaraki',
    dutyOrType: 'Direct Swordsmanship Combat & Melee Supremacy',
    spiritDensity: 'Extreme',
    description: 'Roughened wooden halls, sparring arenas, and battle-scarred dojos where no Kidō is permitted and only the strongest survive.',
    notableFigures: ['Kenpachi Zaraki', 'Yachiru Kusajishi', 'Ikkaku Madarame', 'Yumichika Ayasegawa'],
    arcEvent: 'Ichigo’s legendary duel against Kenpachi Zaraki that devastated multiple city blocks in western Seireitei.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: (17 * Math.PI) / 12,
    endAngle: (19 * Math.PI) / 12,
    color: '#EF4444',
  },
  {
    id: 'div12',
    name: '12th Division • Research & Development Institute',
    jp: '十二番隊 • 技術開発局 (S.R.D.I.)',
    category: 'gotei',
    quadrant: 'North',
    captainOrLeader: 'Mayuri Kurotsuchi / Kisuke Urahara',
    dutyOrType: 'Spiritual Technology, Sensor Arrays & Biotechnical Lab',
    spiritDensity: 'Extreme',
    description: 'Hyper-advanced technological facility filled with Reishi analyzers, communication radar domes, and living specimen pods.',
    notableFigures: ['Mayuri Kurotsuchi', 'Nemu Kurotsuchi', 'Akon', 'Kisuke Urahara (founder)'],
    arcEvent: 'Uryū Ishida utilized Quincy: Letzt Stil to obliterate Mayuri Kurotsuchi’s Bankai, Konjiki Ashisogi Jizō.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: (19 * Math.PI) / 12,
    endAngle: (21 * Math.PI) / 12,
    color: '#10B981',
  },
  {
    id: 'div10',
    name: '10th Division • Garrison & Ice Glade',
    jp: '十番隊 (Jūbantai)',
    category: 'gotei',
    quadrant: 'North',
    captainOrLeader: 'Tōshirō Hitsugaya',
    dutyOrType: 'Field Martial Operations & Crisis Response',
    spiritDensity: 'High',
    description: 'Cool mountain-facing barracks where Captain Hitsugaya manages rapid response tactical detachments.',
    notableFigures: ['Tōshirō Hitsugaya', 'Rangiku Matsumoto', 'Isshin Shiba (former captain)'],
    arcEvent: 'Hitsugaya intercepted Gin Ichimaru and Kira outside Central 46, releasing Daiguren Hyōrinmaru.',
    innerRadiusRatio: 0.18,
    outerRadiusRatio: 0.42,
    startAngle: (21 * Math.PI) / 12,
    endAngle: (23 * Math.PI) / 12,
    color: '#06B6D4',
  },
  // Outer Sekkiseki Wall Ring with the 4 Great Gates
  {
    id: 'wall_north',
    name: 'Kokuryōmon • Black Ridge Gate (North)',
    jp: '黒稜門 (Kokuryōmon)',
    category: 'threshold',
    quadrant: 'North',
    captainOrLeader: 'Gatekeeper Danzōmaru',
    dutyOrType: 'Northern Sekkiseki Gateway & Rukongai Defense',
    spiritDensity: 'High',
    description: 'Massive Sekkiseki fortress gate overlooking the rugged northern wasteland of Zaraki District 80.',
    notableFigures: ['Danzōmaru (Gatekeeper)'],
    arcEvent: 'Fortified during the Ryōka alert to prevent intruders escaping toward the northern mountainous wilderness.',
    innerRadiusRatio: 0.43,
    outerRadiusRatio: 0.49,
    startAngle: -Math.PI / 4,
    endAngle: Math.PI / 4,
    color: '#64748B',
  },
  {
    id: 'wall_east',
    name: 'Shuryūmon • Blue Stream Gate (East)',
    jp: '青流門 (Shuryūmon)',
    category: 'threshold',
    quadrant: 'East',
    captainOrLeader: 'Gatekeeper Kaiwan',
    dutyOrType: 'Eastern Sekkiseki Gateway & Commercial Defense',
    spiritDensity: 'High',
    description: 'Direct threshold facing peaceful Junrinan District 1 where noble trade and courier supplies enter the capital.',
    notableFigures: ['Kaiwan (Gatekeeper)'],
    arcEvent: 'Sealed by order of Central 46 with spherical barrier projection.',
    innerRadiusRatio: 0.43,
    outerRadiusRatio: 0.49,
    startAngle: Math.PI / 4,
    endAngle: (3 * Math.PI) / 4,
    color: '#64748B',
  },
  {
    id: 'wall_south',
    name: 'Shōyōmon • Vermilion Red Gate (South)',
    jp: '朱洼門 (Shōyōmon)',
    category: 'threshold',
    quadrant: 'South',
    captainOrLeader: 'Gatekeeper Higonyūdō',
    dutyOrType: 'Southern Sekkiseki Gateway & Shiba Sector',
    spiritDensity: 'High',
    description: 'Imposing gate guarded by Higonyūdō facing the fireworks estates and cliff ranges of South Rukongai.',
    notableFigures: ['Higonyūdō (Gatekeeper)', 'Kūkaku Shiba'],
    arcEvent: 'Secondary security perimeter when the Kukaku Shiba spirit cannon blasted directly over the barrier.',
    innerRadiusRatio: 0.43,
    outerRadiusRatio: 0.49,
    startAngle: (3 * Math.PI) / 4,
    endAngle: (5 * Math.PI) / 4,
    color: '#64748B',
  },
  {
    id: 'wall_west',
    name: 'Hakutōmon • White Way Gate (West)',
    jp: '白道門 (Hakutōmon)',
    category: 'threshold',
    quadrant: 'West',
    captainOrLeader: 'Gatekeeper Jidanbō Ikkanzaka',
    dutyOrType: 'Western Sekkiseki Gateway & Main Ryōka Confrontation',
    spiritDensity: 'Extreme',
    description: 'The monumental double-leaf gate bridged by an abyss where Jidanbō guards the primary public entrance.',
    notableFigures: ['Jidanbō Ikkanzaka', 'Gin Ichimaru', 'Ichigo Kurosaki'],
    arcEvent: 'Ichigo shattered Jidanbō’s giant stone axes in single combat before Gin Ichimaru repelled the Ryōka team.',
    innerRadiusRatio: 0.43,
    outerRadiusRatio: 0.49,
    startAngle: (5 * Math.PI) / 4,
    endAngle: (7 * Math.PI) / 4,
    color: '#38BDF8',
  },
];

const RUKONGAI_DISTRICTS: DistrictInfo[] = [
  // Inner Ring: Districts 1–20 (Peaceful & Cultured)
  {
    id: 'east_inner',
    name: 'East Rukongai • District 1 (Junrinan)',
    jp: '東流魂街 一地区 • 潤林安 (Junrinan)',
    category: 'rukongai',
    quadrant: 'East',
    captainOrLeader: 'Local District Elders',
    dutyOrType: 'Peaceful Residential & Noble Origin Area',
    spiritDensity: 'Moderate',
    description: 'The most tranquil, prosperous district in Soul Society with paved streets, watermills, and seasonal gardens.',
    notableFigures: ['Tōshirō Hitsugaya', 'Momo Hinamori', 'Hitsugaya’s Grandmother'],
    arcEvent: 'Where Hitsugaya awakened his unguided spiritual pressure before Rangiku Matsumoto scouted him for the Shinigami academy.',
    innerRadiusRatio: 0.50,
    outerRadiusRatio: 0.65,
    startAngle: Math.PI / 4,
    endAngle: (3 * Math.PI) / 4,
    color: '#10B981',
  },
  {
    id: 'south_inner',
    name: 'South Rukongai • District 1 (Tominaga)',
    jp: '南流魂街 一地区 • 富永 (Tominaga)',
    category: 'rukongai',
    quadrant: 'South',
    captainOrLeader: 'Merchant Guilds',
    dutyOrType: 'Crafts, Agriculture & Food Distribution',
    spiritDensity: 'Moderate',
    description: 'Lush agricultural terraced farmland supplying vegetables and fresh river fish to Seireitei markets.',
    notableFigures: ['Rukongai Agronomists', 'Kūkaku Shiba associates'],
    arcEvent: 'Staging ground for supply wagons passing through Shōyōmon gate.',
    innerRadiusRatio: 0.50,
    outerRadiusRatio: 0.65,
    startAngle: (3 * Math.PI) / 4,
    endAngle: (5 * Math.PI) / 4,
    color: '#059669',
  },
  {
    id: 'west_inner',
    name: 'West Rukongai • District 1 (Hokutan)',
    jp: '西流魂街 一地区 • 白炭 (Hokutan)',
    category: 'rukongai',
    quadrant: 'West',
    captainOrLeader: 'Elder Jidanbō Clan',
    dutyOrType: 'Mining, Charcoal & Stonemasonry',
    spiritDensity: 'Moderate',
    description: 'Sturdy stone homes and artisan blacksmiths close to Hakutōmon, enjoying high security from patrol squads.',
    notableFigures: ['Jidanbō Ikkanzaka family', 'West Gate Artisans'],
    arcEvent: 'Ichigo and Yoruichi spent the night here planning their airborne assault on the capital.',
    innerRadiusRatio: 0.50,
    outerRadiusRatio: 0.65,
    startAngle: (5 * Math.PI) / 4,
    endAngle: (7 * Math.PI) / 4,
    color: '#0D9488',
  },
  {
    id: 'north_inner',
    name: 'North Rukongai • District 1 (Kitahiba)',
    jp: '北流魂街 一地区 • 北檜 (Kitahiba)',
    category: 'rukongai',
    quadrant: 'North',
    captainOrLeader: 'Foresters of Soul Society',
    dutyOrType: 'Cedar Timber Harvest & Mountain Watch',
    spiritDensity: 'Moderate',
    description: 'Pine-forested foothills with cold alpine streams, tranquil shrine steps, and clean mountain air.',
    notableFigures: ['Mountain Shrine Guardians'],
    arcEvent: 'Where the northern signal fires are maintained to alert Seireitei of incursions.',
    innerRadiusRatio: 0.50,
    outerRadiusRatio: 0.65,
    startAngle: -Math.PI / 4,
    endAngle: Math.PI / 4,
    color: '#047857',
  },

  // Middle Ring: Districts 21–50 (Modest & Industrial)
  {
    id: 'south_mid',
    name: 'South Rukongai • Shiba Fireworks Estate',
    jp: '南流魂街 • 志波家煙火工房 (Shiba Workshop)',
    category: 'rukongai',
    quadrant: 'South',
    captainOrLeader: 'Kūkaku Shiba & Ganju Shiba',
    dutyOrType: 'Pyrotechnic Kidō Launch Systems & Former Noble Clan Estate',
    spiritDensity: 'High',
    description: 'An iconic cliffside compound marked by two colossal sculpted stone arms, featuring a high-altitude spiritual cannon shaft.',
    notableFigures: ['Kūkaku Shiba', 'Ganju Shiba', 'Koganehiko & Shiroganehiko', 'Kaien Shiba'],
    arcEvent: 'Kūkaku loaded Ichigo, Yoruichi, Orihime, Chad, and Uryū into the Reishi sphere cannon, firing them directly into Seireitei.',
    innerRadiusRatio: 0.66,
    outerRadiusRatio: 0.80,
    startAngle: (3 * Math.PI) / 4,
    endAngle: (5 * Math.PI) / 4,
    color: '#F59E0B',
  },
  {
    id: 'west_mid',
    name: 'West Rukongai • District 30',
    jp: '西流魂街 三十地区 (Mid-West Rukongai)',
    category: 'rukongai',
    quadrant: 'West',
    captainOrLeader: 'Local Town Constables',
    dutyOrType: 'Markets, Inns & Caravans',
    spiritDensity: 'Low',
    description: 'Crowded earthen towns and tea houses where common souls without high spiritual pressure live ordinary afterlife lives.',
    notableFigures: ['Wandering Spirits'],
    arcEvent: 'Supply route monitored by 13th Division patrol squads.',
    innerRadiusRatio: 0.66,
    outerRadiusRatio: 0.80,
    startAngle: (5 * Math.PI) / 4,
    endAngle: (7 * Math.PI) / 4,
    color: '#D97706',
  },
  {
    id: 'east_mid',
    name: 'East Rukongai • District 35',
    jp: '東流魂街 三十五地区 (Mid-East Rukongai)',
    category: 'rukongai',
    quadrant: 'East',
    captainOrLeader: 'Town Guilds',
    dutyOrType: 'Pottery & Reishi Textiles',
    spiritDensity: 'Low',
    description: 'Gentle valleys with weaving and ceramic kilns, relatively peaceful with low crime rates.',
    notableFigures: ['Artisan Spirits'],
    arcEvent: 'Regular recruitment grounds for the Shin\'ō Academy entrance examinations.',
    innerRadiusRatio: 0.66,
    outerRadiusRatio: 0.80,
    startAngle: Math.PI / 4,
    endAngle: (3 * Math.PI) / 4,
    color: '#B45309',
  },
  {
    id: 'north_mid',
    name: 'North Rukongai • District 40',
    jp: '北流魂街 四十地区 (Mid-North Rukongai)',
    category: 'rukongai',
    quadrant: 'North',
    captainOrLeader: 'Wandering Ronin Clans',
    dutyOrType: 'Frontier Outposts & Quarrying',
    spiritDensity: 'Low',
    description: 'Rocky scree terrain where resources become scarce and local brawls become frequent.',
    notableFigures: ['Discharged Shinigami'],
    arcEvent: 'Fringe sector where Gotei patrols rarely venture except during war mobilization.',
    innerRadiusRatio: 0.66,
    outerRadiusRatio: 0.80,
    startAngle: -Math.PI / 4,
    endAngle: Math.PI / 4,
    color: '#92400E',
  },

  // Outer Ring: Districts 70–80 (Dangerous, Lawless, Extreme Combat)
  {
    id: 'south_outer',
    name: 'South Rukongai • District 78 (Inuzuri)',
    jp: '南流魂街 七十八地区 • 戌吊 (Inuzuri)',
    category: 'rukongai',
    quadrant: 'South',
    captainOrLeader: 'Street Gangs & Outcasts',
    dutyOrType: 'Impoverished Slums & Renji/Rukia Homeland',
    spiritDensity: 'Moderate',
    description: 'Desolate, poverty-stricken shantytown without law enforcement where orphaned spirits fight tooth and nail for survival.',
    notableFigures: ['Renji Abarai', 'Rukia Kuchiki', 'Kira', 'Childhood Friends of Inuzuri'],
    arcEvent: 'Rukia and Renji grew up together on these harsh streets and watched all their companions die before swearing to become Shinigami.',
    innerRadiusRatio: 0.81,
    outerRadiusRatio: 0.98,
    startAngle: (3 * Math.PI) / 4,
    endAngle: (5 * Math.PI) / 4,
    color: '#E11D48',
  },
  {
    id: 'north_outer',
    name: 'North Rukongai • District 80 (Zaraki)',
    jp: '北流魂街 八十地区 • 更木 (Zaraki)',
    category: 'rukongai',
    quadrant: 'North',
    captainOrLeader: 'Uncontested Duelists • Survival of Strongest',
    dutyOrType: 'Most Lawless, Violent Zone in Soul Society',
    spiritDensity: 'Extreme',
    description: 'A blood-soaked wasteland beyond all laws of Central 46, strewn with rusted blades and constant mortal combat.',
    notableFigures: ['Kenpachi Zaraki', 'Yachiru Unohana (First Kenpachi)'],
    arcEvent: 'Where the nameless warrior who would become Kenpachi Zaraki defeated thousands of swordsmen and encountered Yachiru Unohana in mortal combat.',
    innerRadiusRatio: 0.81,
    outerRadiusRatio: 0.98,
    startAngle: -Math.PI / 4,
    endAngle: Math.PI / 4,
    color: '#991B1B',
  },
  {
    id: 'north_kusajishi',
    name: 'North Rukongai • District 79 (Kusajishi)',
    jp: '北流魂街 七十九地区 • 草鹿 (Kusajishi)',
    category: 'rukongai',
    quadrant: 'North',
    captainOrLeader: 'Bandit Remnants',
    dutyOrType: 'Brutal Wasteland & Yachiru Kusajishi Origin',
    spiritDensity: 'Extreme',
    description: 'The second most violent district where infant Yachiru was found unharmed by Zaraki among corpses, laughing at his bloody Zanpakutō.',
    notableFigures: ['Yachiru Kusajishi (Nozarashi Spirit)'],
    arcEvent: 'Zaraki took the laughing pink-haired infant as his sole companion and named her Yachiru after the only person he ever admired.',
    innerRadiusRatio: 0.81,
    outerRadiusRatio: 0.98,
    startAngle: -Math.PI / 4,
    endAngle: 0,
    color: '#BE123C',
  },
  {
    id: 'east_outer',
    name: 'East Rukongai • District 78–80',
    jp: '東流魂街 八十地区 (Far-East Periphery)',
    category: 'rukongai',
    quadrant: 'East',
    captainOrLeader: 'Shadow Mercenaries',
    dutyOrType: 'Barren Canyon Frontier',
    spiritDensity: 'Low',
    description: 'Windswept sandstone cliffs and forgotten ravines marking the edge of civilization.',
    notableFigures: ['Wild Hollow stragglers'],
    arcEvent: 'Hollow hunting grounds where advanced Academy trainees were once deployed.',
    innerRadiusRatio: 0.81,
    outerRadiusRatio: 0.98,
    startAngle: Math.PI / 4,
    endAngle: (3 * Math.PI) / 4,
    color: '#7F1D1D',
  },
  {
    id: 'west_outer',
    name: 'West Rukongai • District 79 (Kusajishi Border)',
    jp: '西流魂街 七十九地区 (Far-West Outlands)',
    category: 'rukongai',
    quadrant: 'West',
    captainOrLeader: 'Outlaw Factions',
    dutyOrType: 'Dense Fog Swamps & Abandoned Shrines',
    spiritDensity: 'Moderate',
    description: 'Swampy, fog-laden marshes hiding ancient pre-Gotei ruins and renegade spiritualists.',
    notableFigures: ['Exiled Shinigami'],
    arcEvent: 'Historical refuge for rogue Kidō practitioners.',
    innerRadiusRatio: 0.81,
    outerRadiusRatio: 0.98,
    startAngle: (5 * Math.PI) / 4,
    endAngle: (7 * Math.PI) / 4,
    color: '#881337',
  },
];

interface AtlasViewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation?: (siteName: string) => void;
  onPlaySound?: () => void;
}

export const AtlasViewOverlay: React.FC<AtlasViewOverlayProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  onPlaySound,
}) => {
  const [mode, setMode] = useState<AtlasMode>('administrative');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const activeDistricts = useMemo(() => {
    return mode === 'administrative' ? ADMINISTRATIVE_DISTRICTS : RUKONGAI_DISTRICTS;
  }, [mode]);

  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return activeDistricts;
    const q = searchQuery.toLowerCase();
    return activeDistricts.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.jp.toLowerCase().includes(q) ||
        (d.captainOrLeader && d.captainOrLeader.toLowerCase().includes(q)) ||
        d.dutyOrType.toLowerCase().includes(q) ||
        d.notableFigures.some((nf) => nf.toLowerCase().includes(q))
    );
  }, [activeDistricts, searchQuery]);

  // Set default selection when switching mode
  useEffect(() => {
    if (activeDistricts.length > 0) {
      setSelectedDistrict(activeDistricts[0]);
    }
  }, [mode, activeDistricts]);

  // D3 Rendering of Schematic Radial SVG Map
  useEffect(() => {
    if (!isOpen || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 860;
    const height = 760;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(centerX, centerY) - 35;

    // Define defs (gradients & glow filters)
    const defs = svg.append('defs');

    // Subtle glow filter
    const filter = defs.append('filter').attr('id', 'atlas-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    filter.append('feMerge').selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', (d) => d);

    // Root zoom group
    const g = svg.append('g').attr('class', 'atlas-viewport-group');

    // Setup D3 Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.7, 3.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
        setZoomLevel(event.transform.k);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Initial position center
    svg.call(zoom.transform, d3.zoomIdentity.translate(centerX, centerY).scale(1));

    // Background circular radar rings & compass axes
    const bgGroup = g.append('g').attr('class', 'atlas-grid-rings');

    // Concentric coordinate circles
    const gridRatios = [0.16, 0.42, 0.49, 0.65, 0.8, 0.98];
    gridRatios.forEach((ratio) => {
      bgGroup.append('circle')
        .attr('r', maxRadius * ratio)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(111, 183, 255, 0.12)')
        .attr('stroke-dasharray', ratio === 0.49 ? '4,4' : '2,6')
        .attr('stroke-width', ratio === 0.49 ? 2 : 1);
    });

    // Cardinal Crosshair lines
    const cardinalGroup = g.append('g').attr('class', 'atlas-cardinal-axes');
    [
      { x1: 0, y1: -maxRadius, x2: 0, y2: maxRadius, labelTop: 'NORTH (北)', labelBottom: 'SOUTH (南)' },
      { x1: -maxRadius, y1: 0, x2: maxRadius, y2: 0, labelLeft: 'WEST (西)', labelRight: 'EAST (東)' },
    ].forEach((axis) => {
      cardinalGroup.append('line')
        .attr('x1', axis.x1)
        .attr('y1', axis.y1)
        .attr('x2', axis.x2)
        .attr('y2', axis.y2)
        .attr('stroke', 'rgba(201, 166, 91, 0.22)')
        .attr('stroke-dasharray', '3,5');
    });

    // Cardinal Labels
    const labels = [
      { text: 'NORTH • KOKURYŌMON', x: 0, y: -maxRadius - 14, anchor: 'middle' },
      { text: 'SOUTH • SHŌYŌMON', x: 0, y: maxRadius + 22, anchor: 'middle' },
      { text: 'EAST • SHURYŪMON', x: maxRadius + 16, y: 4, anchor: 'start' },
      { text: 'WEST • HAKUTŌMON', x: -maxRadius - 16, y: 4, anchor: 'end' },
    ];
    labels.forEach((l) => {
      cardinalGroup.append('text')
        .attr('x', l.x)
        .attr('y', l.y)
        .attr('text-anchor', l.anchor)
        .attr('fill', 'rgba(201, 166, 91, 0.65)')
        .attr('font-size', '9px')
        .attr('font-family', 'var(--mono, monospace)')
        .attr('letter-spacing', '0.12em')
        .text(l.text);
    });

    // D3 Arc Generator for Districts
    const arcGen = d3.arc<DistrictInfo>()
      .innerRadius((d) => d.innerRadiusRatio * maxRadius)
      .outerRadius((d) => d.outerRadiusRatio * maxRadius)
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle)
      .padAngle(0.018)
      .padRadius(maxRadius * 0.5)
      .cornerRadius(4);

    // Sector group
    const sectorsGroup = g.append('g').attr('class', 'atlas-districts');

    const paths = sectorsGroup.selectAll('path')
      .data(activeDistricts)
      .enter()
      .append('path')
      .attr('d', (d) => arcGen(d))
      .attr('fill', (d) => {
        const isSel = selectedDistrict?.id === d.id;
        const isHov = hoveredDistrict?.id === d.id;
        if (isSel) return d.color;
        if (isHov) return d3.color(d.color)?.brighter(0.4).toString() || d.color;
        return d3.color(d.color)?.copy({ opacity: 0.35 }).toString() || d.color;
      })
      .attr('stroke', (d) => {
        if (selectedDistrict?.id === d.id) return '#FFFFFF';
        if (hoveredDistrict?.id === d.id) return '#C9A65B';
        return d.color;
      })
      .attr('stroke-width', (d) => (selectedDistrict?.id === d.id ? 2.5 : 1))
      .style('cursor', 'pointer')
      .style('transition', 'fill 0.2s, stroke 0.2s, transform 0.2s')
      .on('mouseenter', (_event, d) => {
        setHoveredDistrict(d);
      })
      .on('mouseleave', () => {
        setHoveredDistrict(null);
      })
      .on('click', (_event, d) => {
        setSelectedDistrict(d);
        onPlaySound?.();
      });

    // Add labels onto the sectors using centroid calculation
    const textGroup = g.append('g').attr('class', 'atlas-labels').attr('pointer-events', 'none');

    activeDistricts.forEach((d) => {
      const [cx, cy] = arcGen.centroid(d);
      if (isNaN(cx) || isNaN(cy)) return;

      // Extract short label
      let label = d.name.split('•')[0].trim();
      if (label.length > 18) label = label.slice(0, 16) + '…';

      const text = textGroup.append('text')
        .attr('x', cx)
        .attr('y', cy)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', selectedDistrict?.id === d.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)')
        .attr('font-size', d.category === 'central' ? '10px' : '8.5px')
        .attr('font-weight', selectedDistrict?.id === d.id ? '700' : '600')
        .attr('font-family', 'var(--mono, monospace)')
        .attr('letter-spacing', '0.04em')
        .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.85))');

      text.text(label);
    });

  }, [isOpen, mode, activeDistricts, selectedDistrict, hoveredDistrict, onPlaySound]);

  // Handle Zoom In / Out / Reset
  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    if (direction === 'in') {
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
    } else if (direction === 'out') {
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
    } else {
      svg.transition().duration(400).call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity.translate(430, 380).scale(1)
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="atlas-overlay-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="atlas-title"
      onClick={onClose}
    >
      <div className="atlas-overlay-container" data-lenis-prevent="true" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar */}
        <header className="atlas-modal-header">
          <div className="atlas-header-branding">
            <span className="atlas-badge">BLEACH CARTOGRAPHY & SCHEMATIC</span>
            <h2 id="atlas-title">
              Seireitei & Rukongai <em>Atlas View</em>
            </h2>
            <p className="atlas-subtitle">
              Interactive D3 topological vector schematic of the Shinigami capital and the 80 outer districts.
            </p>
          </div>

          <div className="atlas-header-actions">
            {/* View Mode Toggle: Administrative vs Rukongai */}
            <div className="atlas-mode-toggle" role="group" aria-label="District category toggle">
              <button
                type="button"
                className={`atlas-mode-btn ${mode === 'administrative' ? 'active' : ''}`}
                onClick={() => {
                  setMode('administrative');
                  onPlaySound?.();
                }}
              >
                <span>⚔ GOTEI & CENTRAL 46</span>
                <small>Administrative Divisions</small>
              </button>
              <button
                type="button"
                className={`atlas-mode-btn ${mode === 'rukongai' ? 'active' : ''}`}
                onClick={() => {
                  setMode('rukongai');
                  onPlaySound?.();
                }}
              >
                <span>🏯 80 RUKONGAI DISTRICTS</span>
                <small>Outer Four Quadrants</small>
              </button>
            </div>

            <button
              type="button"
              className="atlas-close-btn"
              onClick={onClose}
              aria-label="Close Atlas View"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Main Content Area: SVG Map Canvas + District Intelligence Sidebar */}
        <div className="atlas-body-layout">
          {/* SVG Map Section */}
          <div className="atlas-map-canvas-container">
            {/* Map Controls */}
            <div className="atlas-map-hud">
              <div className="atlas-zoom-controls">
                <button
                  type="button"
                  onClick={() => handleZoom('in')}
                  title="Zoom In (+)"
                  aria-label="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom('out')}
                  title="Zoom Out (-)"
                  aria-label="Zoom Out"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom('reset')}
                  title="Reset View (100%)"
                  aria-label="Reset View"
                >
                  ⊙
                </button>
              </div>

              <div className="atlas-hud-info">
                <span>ZOOM: {Math.round(zoomLevel * 100)}%</span>
                <span>DRAG TO PAN • SCROLL TO ZOOM</span>
              </div>
            </div>

            {/* D3 SVG Element */}
            <svg
              ref={svgRef}
              viewBox="0 0 860 760"
              className="atlas-d3-svg"
              aria-label="Interactive Seireitei and Rukongai schematic map"
            />

            {/* Hover Tooltip Overlay */}
            {hoveredDistrict && (
              <div className="atlas-live-tooltip">
                <strong>{hoveredDistrict.name}</strong>
                <span>{hoveredDistrict.jp}</span>
                <small>{hoveredDistrict.dutyOrType}</small>
              </div>
            )}
          </div>

          {/* District Intelligence Dossier */}
          <aside className="atlas-intel-dossier" aria-label="District details">
            {/* Filter Search Input */}
            <div className="atlas-search-box">
              <input
                type="text"
                placeholder="Search division, captain, district…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="atlas-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="atlas-search-clear"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick List Strip */}
            <div className="atlas-districts-list" role="tablist">
              {filteredDistricts.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedDistrict?.id === d.id}
                  className={`atlas-district-chip ${selectedDistrict?.id === d.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedDistrict(d);
                    onPlaySound?.();
                  }}
                  style={{
                    borderLeftColor: d.color,
                  }}
                >
                  <span className="chip-name">{d.name}</span>
                  <span className="chip-quadrant">{d.quadrant}</span>
                </button>
              ))}
            </div>

            {/* Active Selected Dossier Card */}
            {selectedDistrict ? (
              <div className="atlas-selected-card">
                <div className="selected-card-header" style={{ borderLeftColor: selectedDistrict.color }}>
                  <span className="card-category-tag" style={{ color: selectedDistrict.color }}>
                    {selectedDistrict.category.toUpperCase()} • {selectedDistrict.quadrant.toUpperCase()}
                  </span>
                  <p className="card-jp">{selectedDistrict.jp}</p>
                  <h3 className="card-name">{selectedDistrict.name}</h3>
                </div>

                <div className="selected-card-meta">
                  {selectedDistrict.captainOrLeader && (
                    <div className="meta-row">
                      <span className="meta-label">LEADERSHIP / CAPTAIN</span>
                      <strong className="meta-val">{selectedDistrict.captainOrLeader}</strong>
                    </div>
                  )}

                  <div className="meta-row">
                    <span className="meta-label">TACTICAL DUTY</span>
                    <span className="meta-val">{selectedDistrict.dutyOrType}</span>
                  </div>

                  <div className="meta-row">
                    <span className="meta-label">REIATSU DENSITY</span>
                    <span
                      className={`meta-pill ${
                        selectedDistrict.spiritDensity === 'Extreme'
                          ? 'pill-extreme'
                          : selectedDistrict.spiritDensity === 'High'
                          ? 'pill-high'
                          : 'pill-mod'
                      }`}
                    >
                      {selectedDistrict.spiritDensity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="selected-card-section">
                  <span className="section-label">ARCHITECTURAL & STRATEGIC OVERVIEW</span>
                  <p className="section-body">{selectedDistrict.description}</p>
                </div>

                <div className="selected-card-section">
                  <span className="section-label">NOTABLE SOUL REAPERS & SOULS</span>
                  <div className="notable-tags">
                    {selectedDistrict.notableFigures.map((fig, idx) => (
                      <span key={idx} className="notable-tag">
                        {fig}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="selected-card-section">
                  <span className="section-label">CANON BLEACH EVENT</span>
                  <p className="section-body event-body">{selectedDistrict.arcEvent}</p>
                </div>

                {onSelectLocation && (
                  <button
                    type="button"
                    className="atlas-survey-btn"
                    onClick={() => {
                      onSelectLocation(selectedDistrict.name);
                      onClose();
                    }}
                  >
                    ⚔ EXPLORE LOCATION FIELD NOTES ↗
                  </button>
                )}
              </div>
            ) : (
              <div className="atlas-empty-state">
                <p>Select any sector on the schematic or from the list above to view its intelligence file.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
