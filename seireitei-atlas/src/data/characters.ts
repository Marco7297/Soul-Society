import ichigoImg from '../assets/images/anime_ichigo_exact_1792601602155.jpg';
import aizenImg from '../assets/images/anime_aizen_exact_1792601602953.jpg';
import yhwachImg from '../assets/images/anime_yhwach_exact_1792601603996.jpg';
import byakuyaImg from '../assets/images/anime_byakuya_exact_1792601605076.jpg';
import yamamotoImg from '../assets/images/anime_yamamoto_exact_1792601605416.jpg';
import shunsuiImg from '../assets/images/shunsui_kyoraku_1792762489335.jpg';
import zarakiImg from '../assets/images/zaraki_kenpachi_1792762505774.jpg';
import uraharaImg from '../assets/images/kisuke_urahara_1792762525539.jpg';

export interface SpiritualAttributes {
  zanjutsu: number; // 斬術 - Swordsmanship (0-100)
  hakuda: number;   // 白打 - Hand-to-Hand / Physical (0-100)
  hoho: number;     // 歩法 - High-Speed Footwork / Shunpo (0-100)
  kido: number;     // 鬼道 - Demon Arts / Spells (0-100)
  reiatsu: number;  // 霊圧 - Spiritual Pressure Density & Reserves (0-100)
  tactics: number;  // 知略 - Combat Intellect & Strategy (0-100)
}

export interface AttributeDescription {
  key: keyof SpiritualAttributes;
  label: string;
  jp: string;
  description: string;
}

export const ATTRIBUTE_METADATA: AttributeDescription[] = [
  {
    key: 'zanjutsu',
    label: 'Zanjutsu',
    jp: '斬術 (Swordsmanship)',
    description: 'Mastery of the blade, sword fighting instincts, and Zanpakutō weapon handling.',
  },
  {
    key: 'hakuda',
    label: 'Hakuda',
    jp: '白打 (Hand-to-Hand)',
    description: 'Unarmed martial arts, physical strength, body conditioning, and close-quarters strikes.',
  },
  {
    key: 'hoho',
    label: 'Hōhō',
    jp: '歩法 (High-Speed Footwork)',
    description: 'Shunpo agility, evasion speed, aerial mobility, and reaction reflexes.',
  },
  {
    key: 'kido',
    label: 'Kidō',
    jp: '鬼道 (Demon Arts)',
    description: 'Incantation casting of Hadō (destruction), Bakudō (binding), and spiritual barrier spells.',
  },
  {
    key: 'reiatsu',
    label: 'Reiatsu',
    jp: '霊圧 (Spiritual Pressure)',
    description: 'Total spiritual power output, energy density, crushing aura, and stamina reserves.',
  },
  {
    key: 'tactics',
    label: 'Tactics',
    jp: '知略 (Combat Intellect)',
    description: 'Strategic battlefield planning, psychological warfare, enemy analysis, and mental adaptability.',
  },
];

export interface BleachCharacter {
  id: string;
  name: string;
  jpName: string;
  romaji: string;
  title: string;
  rankAndAffiliation: string;
  image: string;
  reiatsuTheme: string;
  accentColor: string;
  spiritualAttributes: SpiritualAttributes;
  attributeNotes: { [K in keyof SpiritualAttributes]: string };
  zanpakutoOrPower: {
    name: string;
    jp: string;
    shikaiCommand?: string;
    bankaiOrRelease?: string;
    classification: string;
    abilities: string[];
  };
  overview: string;
  keyArcsAndBattles: string[];
  tacticalAnalysis: string;
  iconicQuote: string;
}

export const BLEACH_CHARACTERS: BleachCharacter[] = [
  {
    id: 'ichigo',
    name: 'Ichigo Kurosaki',
    jpName: '黒崎 一護',
    romaji: 'Kurosaki Ichigo',
    title: 'The Transcendent Hybrid • Protector of Two Worlds',
    rankAndAffiliation: 'Substitute Shinigami • Gotei 13 Vanguard Ally',
    image: ichigoImg,
    reiatsuTheme: 'Black & Cyan Getsuga Spiral • Transcendent Reishi',
    accentColor: '#38BDF8',
    spiritualAttributes: {
      zanjutsu: 96,
      hakuda: 88,
      hoho: 98,
      kido: 22,
      reiatsu: 100,
      tactics: 80,
    },
    attributeNotes: {
      zanjutsu: 'Instinctive dual-wielding swordsman capable of deflecting millions of Senbonzakura blades and clashing evenly with veteran captains.',
      hakuda: 'Brutal martial combatant who can crack heavy reinforced stone bare-handed; reinforced by Hollow instincts.',
      hoho: 'Exceptional Shunpo speed further amplified by Tensa Zangetsu compression, rivaling the fastest beings in the three realms.',
      kido: 'Lacks formal Kidō training; instead condenses all spiritual energy directly into raw Getsuga Tenshō shockwaves.',
      reiatsu: 'Transcendent hybrid capacity surpassing ordinary captain thresholds, generating overwhelming black-and-cyan spiritual storms.',
      tactics: 'Intuitive battle learner who adapts rapidly during life-and-death encounters rather than calculated pre-battle planning.',
    },
    zanpakutoOrPower: {
      name: 'Zangetsu',
      jp: '斬月 (Slaying Moon)',
      shikaiCommand: 'True Dual Blade Manifestation (Hollow & Quincy Zangetsu)',
      bankaiOrRelease: 'Tensa Zangetsu (天鎖斬月)',
      classification: 'Melee / Spiritual Reiatsu Wave Compression',
      abilities: [
        'Getsuga Tenshō (Moon Fang Heaven-Piercer)',
        'Getsuga Jūjishō (Cross-Shaped Crossfire)',
        'Horn of Salvation (Hollowfication Fusion)',
        'Gran Rey Cero + Getsuga Combination Burst',
        'Blut Vene Defense (Inherited Quincy Bloodline)',
      ],
    },
    overview:
      'Born from the fateful union between former Shinigami Captain Isshin Shiba and pure Quincy maiden Masaki Kurosaki, Ichigo houses the bloodlines of Soul Reaper, Hollow, Quincy, and Human. After obtaining Rukia Kuchiki’s powers, he stormed Seireitei as a Ryōka, overturned Central 46’s execution sentence atop Sōkyoku Hill, and later unlocked his true origin in the Royal Realm by forging dual Zangetsu blades.',
    keyArcsAndBattles: [
      'Infiltration of Seireitei: Duel with Renji Abarai in 6th Division courtyards',
      'Mortal clash against Kenpachi Zaraki in western Seireitei',
      'Bankai breakthrough duel against Byakuya Kuchiki atop Sōkyoku Hill',
      'Hollowfied showdown against Espada #4 Ulquiorra Cifer in Las Noches',
      'Final Getsuga Tenshō (Mugetsu) against transcended Sōsuke Aizen',
      'True Zangetsu awakening in the Royal Realm with Squad Zero',
      'Climactic battle beside Aizen and Renji against the Almighty Yhwach',
    ],
    tacticalAnalysis:
      'Possesses Reiatsu density rivaling Captain-Commander Yamamoto. His combat speed and raw spiritual output exceed normal Shinigami thresholds, capable of bisecting high-density Sekkiseki structures with single Getsuga swings.',
    iconicQuote:
      'If fate is a millstone, then we are the grist. There is nothing we can do. So I wish for strength. If I cannot protect them from the wheel, then give me a blade strong enough to shatter fate itself.',
  },
  {
    id: 'aizen',
    name: 'Sōsuke Aizen',
    jpName: '藍染 惣右介',
    romaji: 'Aizen Sōsuke',
    title: 'The Architect of Deception • Ruler of Muken',
    rankAndAffiliation: 'Former 5th Division Captain • Supreme Traitor • Lord of Las Noches',
    image: aizenImg,
    reiatsuTheme: 'Hypnotic Deep Violet & Spatial Distortion Void',
    accentColor: '#A855F7',
    spiritualAttributes: {
      zanjutsu: 98,
      hakuda: 92,
      hoho: 98,
      kido: 100,
      reiatsu: 100,
      tactics: 100,
    },
    attributeNotes: {
      zanjutsu: 'Flawless precision blade technique; famously stopped Ichigo’s Bankai with a single bare index finger on Sōkyoku Hill.',
      hakuda: 'Deceptive brute physical strength capable of blocking Captain Komamura and Renji with one hand without budging.',
      hoho: 'Near-instantaneous Shunpo movement that appears as effortless teleportation across battlefields.',
      kido: 'Unrivaled master of spiritual arts; effortlessly casts Hadō #90 Kurohitsugi and Hadō #99 Goryūtenmetsu chantless.',
      reiatsu: 'Transcendent pressure so dense that ordinary objects and spirit beings disintegrate upon approaching him in Muken.',
      tactics: 'Mastermind of over a century of Soul Society events, anticipating every variable and manipulating friend and foe alike.',
    },
    zanpakutoOrPower: {
      name: 'Kyōka Suigetsu',
      jp: '鏡花水月 (Mirror Flower, Water Moon)',
      shikaiCommand: 'Shatter, Kyōka Suigetsu (砕けろ、鏡花水月)',
      bankaiOrRelease: 'Undisclosed / Transcended Beyond Zanpakutō Fusion',
      classification: 'Complete Hypnosis (Kanzen Saimin) & Hōgyoku Immortality',
      abilities: [
        'Kanzen Saimin: Total sensory hallucination control over sight, sound, touch, taste, smell, and Reiatsu',
        'Hōgyoku Biological Evolution & Absolute Regenerative Immortality',
        'Hadō #90: Kurohitsugi (Black Coffin) cast chantless with catastrophic gravitational pull',
        'Hadō #99: Goryūtenmetsu (Five Swirling Dragons of Destruction)',
      ],
    },
    overview:
      'Aizen orchestrated over a century of clandestine genetic and spiritual experiments behind the facade of a gentle, studious 5th Division captain. After staging his murder and butchering all Central 46 judges, he ripped the Hōgyoku from Rukia’s soul, shed his glasses, and announced his ascent to the vacant throne of heaven. Even when bound to the Muken execution chair, his spiritual pressure remains so dense it disintegrates objects that merely touch his perimeter.',
    keyArcsAndBattles: [
      'Turn Back the Pendulum: Hollowfication trap sprung upon the Visored and Urahara',
      'Soul Society Arc: Massacre of Central 46 and reveal atop Sōkyoku Hill',
      'Fake Karakura Town: Decimation of the Gotei 13 captains and Visored allies',
      'Deicide Climax: Transcendence battles against Kisuke Urahara, Yoruichi, Isshin, and Ichigo',
      'Muken Awakening: Shunsui Kyōraku unlocks his binding seals for the Quincy War',
      'TYBW Finale: Deceiving the omniscient Almighty of Yhwach through Kyōka Suigetsu',
    ],
    tacticalAnalysis:
      'Intellect that surpasses all Soul Society scholars save Kisuke Urahara. Master of all four Shinigami combat disciplines (Zanjutsu, Hakuda, Hohō, Kidō) who can execute 90th-tier Hadō spells without incantations while maintaining absolute sensory manipulation.',
    iconicQuote:
      'Admiration is the emotion furthest from understanding. Since the beginning, no one has stood atop the heavens. Neither you, nor I, nor even God. But that untenable vacancy on the throne of heaven ends today. From now on, I shall stand in heaven.',
  },
  {
    id: 'yhwach',
    name: 'Yhwach',
    jpName: 'ユーハバッハ',
    romaji: 'Yūhabahha',
    title: 'The Quincy Progenitor • Emperor of the Wandenreich',
    rankAndAffiliation: 'Son of the Soul King • Supreme Sovereign of the Quincy',
    image: yhwachImg,
    reiatsuTheme: 'Midnight Reishi Flame & Piercing All-Seeing Crimson',
    accentColor: '#EF4444',
    spiritualAttributes: {
      zanjutsu: 96,
      hakuda: 94,
      hoho: 95,
      kido: 98,
      reiatsu: 100,
      tactics: 98,
    },
    attributeNotes: {
      zanjutsu: 'Wields massive Reishi broadswords with crushing force, slicing through elite Shinigami defenses with single swings.',
      hakuda: 'Vicious physical power; severed arms and pulverized skulls with bare-handed grips during the Seireitei invasion.',
      hoho: 'Supreme Hirenkyaku speed and instantaneous movement through shadows (Schatten Bereich).',
      kido: 'Ancient Quincy spiritual spellcraft (Kirchenlied, Sankt Altar, Auswählen) capable of stripping divine powers from targets.',
      reiatsu: 'Limitless primordial reservoir augmented by absorbing the Soul King, Mimihagi, and the souls of fallen Sternritter.',
      tactics: 'The Almighty grants omniscient vision of all possible futures, rewriting timeline outcomes to nullify enemy counters.',
    },
    zanpakutoOrPower: {
      name: 'The Almighty ("A")',
      jp: '全知全能 (All-Knowing, All-Powerful)',
      shikaiCommand: 'Soul Distribution & Reishi Absorption',
      bankaiOrRelease: 'Sankt Altar & Soul King Synthesis',
      classification: 'Omniscient Future Sight & Future Manipulation',
      abilities: [
        'The Almighty: Perceiving all possible infinite future timelines simultaneously and rewriting them at will',
        'Auswählen (Holy Selection): Beaming light that reclaims life force and power from Quincies across realms',
        'Sankt Altar: Steals and absorbs divine powers and techniques directly from targets',
        'Kirchenlied: Sankt Zwinger (Holy Domain of Absolute Destruction)',
        'Heilig Bogen & Reishi Broadsword manifestations',
      ],
    },
    overview:
      'The progenitor of all Quincy who was born helpless, blind, and deaf, surviving by bestowing pieces of his soul upon those who touched him and reclaiming their talents upon death. After suffering defeat 1,000 years ago by Yamamoto’s original Gotei 13, he bided his time in the shadow of Seireitei (Schatten Bereich). In the Thousand-Year Blood War, he obliterated Seireitei, stormed the Royal Realm, devoured the Soul King, and sought to collapse the mortal world, Hueco Mundo, and Soul Society into a unified existence devoid of mortality.',
    keyArcsAndBattles: [
      'The First Quincy War (1,000 Years Ago): Brutal battle against Yamamoto and original captains',
      'First Wandenreich Invasion: Slaying Captain-Commander Yamamoto and claiming Ryūjin Jakka',
      'Assault on the Royal Realm: Battle against Squad Zero leader Ichibē Hyōsube',
      'Assassination and absorption of the Soul King and Mimihagi',
      'The Final Throne Clash: Confrontation against Ichigo, Aizen, and Renji',
    ],
    tacticalAnalysis:
      'The ultimate existential threat in the Bleach cosmos. Once The Almighty awakens, any power or technique he perceives in the future becomes incapable of defeating or harming him, requiring metaphysical anomalies like the Still Silver Arrow to interrupt his omnipotence.',
    iconicQuote:
      'A world without death... People would not know the courage to face death. They would never search for hope. It is because humans fear death that they push forward. That is why this journey called Life has meaning.',
  },
  {
    id: 'byakuya',
    name: 'Byakuya Kuchiki',
    jpName: '朽木 白哉',
    romaji: 'Kuchiki Byakuya',
    title: 'The Noble Cherry Blossom Blade • Pride of the Gotei 13',
    rankAndAffiliation: '6th Division Captain • 28th Head of the Kuchiki Clan',
    image: byakuyaImg,
    reiatsuTheme: 'Whirling Pink Sakura Blades & Elegant Pure Silver',
    accentColor: '#F472B6',
    spiritualAttributes: {
      zanjutsu: 96,
      hakuda: 85,
      hoho: 97,
      kido: 95,
      reiatsu: 92,
      tactics: 95,
    },
    attributeNotes: {
      zanjutsu: 'Classical Kuchiki clan sword arts executed with pristine, deadly form and flawless blade edge control.',
      hakuda: 'Disciplined aristocrat martial conditioning; highly proficient though he prefers resolving duels via blade and Kidō.',
      hoho: 'Master of advanced Onmitsukidō techniques including Senka and Utsusemi (Cicada Shell) taught directly by Yoruichi Shihōin.',
      kido: 'Casts high-rank binding and destruction spells (Hadō #33 Sōkatsui, Bakudō #61 Rikujōkōrō) consecutively without incantations.',
      reiatsu: 'Refined noble Reiatsu amplified significantly following divine restorative training in the Royal Realm.',
      tactics: 'Calculated, stoic battlefield strategist who diagnoses enemy weaknesses and exploits spatial gaps with Senbonzakura.',
    },
    zanpakutoOrPower: {
      name: 'Senbonzakura',
      jp: '千本桜 (Thousand Cherry Blossoms)',
      shikaiCommand: 'Scatter, Senbonzakura (散れ、千本桜)',
      bankaiOrRelease: 'Senbonzakura Kageyoshi (千本桜景厳)',
      classification: 'Swarm / Omnidirectional Micro-Blade Torrent',
      abilities: [
        'Senkei (Slaughterscape): Unites all petals into thousands of glowing swords in an enclosed arena',
        'Gōkei (Mawscape): Spherical dome of millions of blades that detonate simultaneously inward',
        'Shūkei: Hakuteiken (Endscape: White Emperor Sword): Condenses all Reiatsu into wings of pure incandescent light',
        'Utsusemi (Cicada Shell): Supreme Onmitsukidō evasion technique learned from Yoruichi',
        'Hadō #33 Sōkatsui & Bakudō #61 Rikujōkōrō mastery',
      ],
    },
    overview:
      'The noble paragon of Soul Society who upholds aristocratic law above all personal attachment. When his adopted sister Rukia was sentenced to execution on Sōkyoku Hill, he suppressed his deep fraternal love to obey Central 46, until Ichigo forced him to confront his oath to his deceased wife Hisana. Nearly slain by Äs Nödt in the first Quincy invasion, he trained in the Royal Realm with Squad Zero to achieve transcendent mastery over every petal of Senbonzakura.',
    keyArcsAndBattles: [
      'Karakura Town Arrest: Stripping Ichigo of his Shinigami powers in an instant',
      'Courtyard Defense: Clashing with Lieutenant Renji Abarai who dared challenge him',
      'Sōkyoku Hill Duel: Legendary clash of Bankais against Ichigo Kurosaki',
      'Hueco Mundo Expedition: Decisive victory against the fastest Espada, Zommari Rureaux',
      'Lost Agent Arc: Slaying the Book of the End wielder Shūkurō Tsukishima',
      'TYBW War: Miraculous return from the Royal Realm to annihilate Äs Nödt and battle Gerard Valkyrie',
    ],
    tacticalAnalysis:
      'Impeccable balance of swordsmanship, shunpo speed, and high-level Kidō without incantations. His upgraded Senbonzakura petals can now be controlled with minuscule finger twitches at three times normal speed.',
    iconicQuote:
      'We must not shed tears. That is surrender of the body to the heart. It is nothing more than proof that we are beings that cannot control our feelings. It has been a long time since I felt fear.',
  },
  {
    id: 'yamamoto',
    name: 'Genryūsai Shigekuni Yamamoto',
    jpName: '山本元柳斎 重國',
    romaji: 'Yamamoto Genryūsai Shigekuni',
    title: 'The Incandescent Father of the Gotei 13 • 1,000-Year Pillar',
    rankAndAffiliation: '1st Division Captain • Captain-Commander of the Gotei 13',
    image: yamamotoImg,
    reiatsuTheme: '15-Million-Degree Solar Fire & Charred Ash Apocalypse',
    accentColor: '#D97706',
    spiritualAttributes: {
      zanjutsu: 100,
      hakuda: 98,
      hoho: 92,
      kido: 96,
      reiatsu: 100,
      tactics: 94,
    },
    attributeNotes: {
      zanjutsu: 'Undisputed greatest swordsman in Soul Society history, undefeated for 1,000 years with Ryūjin Jakka and bare steel.',
      hakuda: 'Devastating unarmed combatant; demolished the genetically engineered Arrancar Wonderweiss with Ikkotsu and Sōkotsu punches.',
      hoho: 'Master of Shunpo outmaneuvering younger prodigies like Shunsui and Ukitake despite advanced millennium age.',
      kido: 'Master of ancient, forbidden high-tier spells including the forbidden sacrifice spell Hadō #96 Ittō Kasō.',
      reiatsu: 'Incandescent 15,000,000°C spiritual aura so overwhelming that keeping his Bankai active risks vaporizing all Seireitei.',
      tactics: 'Millennium-honed military general who founded the Gotei 13 and guided Soul Society through the Quincy First Holy War.',
    },
    zanpakutoOrPower: {
      name: 'Ryūjin Jakka',
      jp: '流刃若火 (Flowing Blade-like Flame)',
      shikaiCommand: 'Reduce All Creation to Ash, Ryūjin Jakka (万象一切灰燼と為せ、流刃若火)',
      bankaiOrRelease: 'Zanka no Tachi (残火の太刀 - Longsword of the Remnant Flame)',
      classification: 'Oldest, Strongest Fire-Type Zanpakutō in Existence',
      abilities: [
        'Zanka no Tachi, Higashi: Kyokujitsujin (East): All flames condensed into the blade’s edge; incinerates anything it touches out of existence',
        'Zanka no Tachi, Nishi: Zanjitsu Gokui (West): Shrouds his body in a 15,000,000°C cloak of solar heat',
        'Zanka no Tachi, Minami: Kaka Jūman\'okushi Daisōjin (South): Reanimates the charred skeletal ashes of every soul he has ever killed',
        'Zanka no Tachi, Kita: Tenchi Kaijin (North): A single concentrated slash of pure heat that erases targets from reality',
        'Jōkaku Enjō: Wall of flame imprisoning targets in inescapable furnace',
        'Sōkotsu & Ikkotsu: Devastating bare-handed Hakuda shockwaves',
      ],
    },
    overview:
      'The monumental founder of the Gotei 13 who governed the Shinigami military for over a thousand years. Born in the primordial era of Soul Society, he transformed a ruthless group of sword-killers into an orderly protective military force and established the Shin’ō Academy. Unmatched in sheer destructive capability, his Bankai burns with the temperature of the core of the sun, drying up all water and moisture across the entire Seireitei within minutes of release.',
    keyArcsAndBattles: [
      'Sōkyoku Hill Crisis: Taking on his prized pupils Shunsui Kyōraku and Jūshirō Ukitake simultaneously',
      'Battle of Fake Karakura: Slaying Ayon effortlessly and surviving the detonation of Ryūjin Jakka',
      'Bare-Handed Victory: Demolishing the Arrancar Wonderweiss Margela with pure Hakuda strikes',
      'The Final Flame: Unleashing all four cardinal directions of Zanka no Tachi against Royd Lloyd in TYBW',
    ],
    tacticalAnalysis:
      'His Reiatsu alone exerts crushing gravity that suffocates vice-captains. His flame output is so terrifying that prolonging his Bankai would vaporize the very atmosphere, ground, and population of Seireitei itself.',
    iconicQuote:
      'Do you wonder why I have served as Captain-Commander of the Gotei 13 for a thousand years? It is because in a thousand years, no Soul Reaper stronger than myself has been born.',
  },
  {
    id: 'shunsui',
    name: 'Shunsui Kyōraku',
    jpName: '京楽 春水',
    romaji: 'Kyōraku Shunsui',
    title: 'The Shadow Player • Captain-Commander of the Gotei 13',
    rankAndAffiliation: '1st Division Captain • Supreme Commander (Former 8th Division Captain)',
    image: shunsuiImg,
    reiatsuTheme: 'Midnight Shadows & Dark Playful Violet Flowered Mist',
    accentColor: '#EC4899',
    spiritualAttributes: {
      zanjutsu: 98,
      hakuda: 90,
      hoho: 96,
      kido: 92,
      reiatsu: 97,
      tactics: 99,
    },
    attributeNotes: {
      zanjutsu: 'Master of two-sword Daisho fighting style, switching between katana and wakizashi with fluid, unpredictable rhythm.',
      hakuda: 'Sneaky and deceptively relaxed martial fighter who seamlessly mixes unarmed deflections into sword exchanges.',
      hoho: 'Exceptional Shunpo speed and evasive agility; seamlessly vanishes into shadow dimensions using Kageoni.',
      kido: 'Accomplished in high-level spells; capable of deploying barrier Kidō and masking his massive Reiatsu signature completely.',
      reiatsu: 'Chilling, heavy spiritual aura capable of casting entire districts into darkness and mutual psychological dread upon Bankai release.',
      tactics: 'Supreme pragmatic strategist who prioritizes survival and victory over rules of chivalry, calculating enemy behavior turns in advance.',
    },
    zanpakutoOrPower: {
      name: 'Katen Kyōkotsu',
      jp: '花天狂骨 (Flower Heaven, Crazy Bone)',
      shikaiCommand: 'Flowered wind rages, flower god roars; heavenly wind rages, heavenly demon sneers (花風紊れて花神啼き、天風紊れて天魔嗤う)',
      bankaiOrRelease: 'Katen Kyōkotsu: Karamatsu Shinjū (花天狂骨・枯松心中 - Withered Pine Lovers’ Suicide)',
      classification: 'Dual Blade / Reality-Warping Children’s Games & Tragic Theater',
      abilities: [
        'Bushōgoma (Lazy Spinning Top): Wind vortex blade strike',
        'Takaoni (Mountain Demon): Whoever is highest up wins the strike',
        'Kageoni (Shadow Demon): Stepping into and attacking from shadows',
        'Irooni (Color Demon): Players declare a color and can only damage that color',
        'Daruma-san ga Koronda: Red Light, Green Light flash attack',
        'Bankai Act 1: Tameiki no Wakachiai (Hesitance Sharing): Any wounds inflicted on him appear identically on his enemy',
        'Bankai Act 2: Zanki no Shitone (Pillow of Shame): Black spots cover the enemy, bleeding them continuously from regret',
        'Bankai Act 3: Dangyo no Fuchi (Abyss of Severance): Both combatants plunge into an endless ocean until their Reiatsu drains',
        'Bankai Final Act: Itokiribasami Chizome no Nodobue (Thread-Cutting Scissors of the Blood-Stained Throat): Swirls white Reiatsu threads to decapitate the target',
      ],
    },
    overview:
      'One of the first two graduates of Yamamoto’s Shin’ō Academy along with his lifelong friend Jūshirō Ukitake. Beneath his laid-back persona, pink flowered haori, straw hat, and love of fine sake lies an ice-cold realist willing to employ any dishonorable tactic to ensure Soul Society’s survival. Following Yamamoto’s demise in the Thousand-Year Blood War, Central 46 appointed him the new Captain-Commander. He made the unprecedented decision to unlock Sōsuke Aizen from Muken, declaring that when facing extinction, morality cannot supersede victory.',
    keyArcsAndBattles: [
      'Sōkyoku Hill Crisis: Taking a stand beside Ukitake to destroy the Sōkyoku execution stand',
      'Battle of Fake Karakura: Defeating Primera Espada Coyote Starrk through shadow and color games',
      'Muken Infiltration: Personally entering the subterranean darkness to unseal Sōsuke Aizen',
      'Wandenreich Defense: Slaying Sternritter Robert Accutrone in close quarters',
      'Royal Realm Climax: Unleashing the four tragic acts of Karamatsu Shinjū against Quincy divine marksman Lille Barro',
    ],
    tacticalAnalysis:
      'Turns combat into a high-stakes playground where childish games become lethal reality. Because his blades make the rules and even he is subject to death if he breaks them, his unpredictability paralyzes both enemies and allies.',
    iconicQuote:
      'From the moment you step onto the battlefield, both sides are evil. Throwing away honor isn’t an option when lives are at stake. When you enter a war, you fight to protect what matters, not for pride.',
  },
  {
    id: 'zaraki',
    name: 'Kenpachi Zaraki',
    jpName: '更木 剣八',
    romaji: 'Zaraki Kenpachi',
    title: 'The Demon of the 11th Division • Indomitable Slasher',
    rankAndAffiliation: '11th Division Captain • 11th Bearer of the Title "Kenpachi"',
    image: zarakiImg,
    reiatsuTheme: 'Golden Skull Pressure • Unbridled Ferocious Savage Reiatsu',
    accentColor: '#EAB308',
    spiritualAttributes: {
      zanjutsu: 99,
      hakuda: 97,
      hoho: 84,
      kido: 10,
      reiatsu: 100,
      tactics: 75,
    },
    attributeNotes: {
      zanjutsu: 'Primal, devastating kendo instincts; cuts through towering skyscrapers, spatial folds, and divine meteors with single two-handed slashes.',
      hakuda: 'Inhuman physical resilience and brutal brawling force; can withstand being hurled through city blocks without losing momentum.',
      hoho: 'Lacks formal Shunpo training; instead closes massive distances through pure explosive leg drive that craters the ground.',
      kido: 'Completely incapable of casting Kidō spells; holds absolute zero interest in spiritual incantations.',
      reiatsu: 'Bottomless primordial Reiatsu manifested as a roaring golden skull aura that causes surrounding Shinigami to collapse from pure fear.',
      tactics: 'Relies entirely on raw battle sense and adrenaline; wears bells and a power-eating eyepatch so enemies have a fighting chance.',
    },
    zanpakutoOrPower: {
      name: 'Nozarashi',
      jp: '野晒 (Weather-Beaten Bones)',
      shikaiCommand: 'Drink, Nozarashi (呑め、野晒)',
      bankaiOrRelease: 'Nameless Demonic Berserker Bankai (Red Oni Awakening)',
      classification: 'Pure Brute Force / Dimension-Cleaving Executioner Cleaver',
      abilities: [
        'Ryōdan (Bisection with two hands): Concentrated kendo swing cleaving anything cleanly in half',
        'Giant War-Cleaver Manifestation: Shikai transforms his blade into a colossal cleaver that severed a falling meteor',
        'Demonic Oni Berserker state: Skin turns crimson, horns erupt, granting reality-ripping physical strength',
        'Eye-Patch Release: Instantly unleashes exponential surges of suffocating yellow spiritual pressure',
        'Limitless Pain Tolerance: Becomes progressively faster and deadlier as he sustains heavy wounds',
      ],
    },
    overview:
      'A nameless monster from District 80 of North Rukongai (Zaraki)—the most lawless and bloodstained territory in Soul Society. Taking the district’s name and adopting the title "Kenpachi" (given only to the strongest swordsman of each era who slays their predecessor), he achieved captaincy without even knowing the name of his Zanpakutō. For centuries he unconsciously locked away his true power so fights wouldn’t end too quickly. In the Thousand-Year Blood War, he fought Captain Unohana (the First Kenpachi) to the death in Muken to break his mental seals, finally hearing the name of his blade: Nozarashi.',
    keyArcsAndBattles: [
      'Seireitei Infiltration: Colossal duel to a draw against Ichigo Kurosaki',
      'Battle with Kaname Tōsen: Overcoming sensory-deprivation Bankai Suzumushi Tsuishiki: Enma Kōro through sheer touch',
      'Hueco Mundo: Cleaving Espada #5 Nnoitra Gilga with the two-handed kendo technique "Ryōdan"',
      'Muken Awakening: Lethal duel against First Kenpachi Yachiru Unohana to unlock true power',
      'Meteor Destruction: Leaping into the upper atmosphere to split Gremmy Thoumeaux’s giant meteor in a single swing',
      'Berserk Bankai Rampage: Tearing off the arm of the giant miracle soldier Gerard Valkyrie with his bare teeth',
    ],
    tacticalAnalysis:
      'The single most physically destructive fighter in the entire Gotei 13. He has no desire for rank, politics, or self-preservation—only the raw ecstasy of crossing blades against opponents who can push him to the brink of death.',
    iconicQuote:
      'Sanity? Sorry, I don’t remember having something that useless. If you want to fight, draw your sword. The only reason to swing a blade is for the sheer thrill of cutting your enemy down.',
  },
  {
    id: 'urahara',
    name: 'Kisuke Urahara',
    jpName: '浦原 喜助',
    romaji: 'Urahara Kisuke',
    title: 'The Genius Outcast • Architect of the Hōgyoku',
    rankAndAffiliation: 'Former 12th Division Captain • Founder & 1st President of the S.R.D.I. (Technological Development Bureau)',
    image: uraharaImg,
    reiatsuTheme: 'Crimson Reishi Mist & Spatial Reconstruction Matrix',
    accentColor: '#10B981',
    spiritualAttributes: {
      zanjutsu: 95,
      hakuda: 94,
      hoho: 98,
      kido: 100,
      reiatsu: 96,
      tactics: 100,
    },
    attributeNotes: {
      zanjutsu: 'Deceptively casual cane-sword style concealing lethal speed, feints, and explosive crimson slash techniques.',
      hakuda: 'Former head of the Onmitsukidō Detention Unit (Maggot’s Nest); subdued unarmed prisoners without drawing a weapon.',
      hoho: 'Exceptional Shunpo master trained alongside Yoruichi Shihōin; utilizes Utsusemi substitutions and inflatable gigai decoys.',
      kido: 'Unrivaled scholar of spiritual spellcraft; casts 90th-tier Hadō and forbidden multi-layered sealing arrays effortlessly.',
      reiatsu: 'Dense, razor-sharp crimson Reiatsu capable of neutralizing foreign energy vectors and piercing biological armor.',
      tactics: 'The ultimate strategist in the Bleach universe; one of the Five Special War Potentials for his endless "Unknown Means".',
    },
    zanpakutoOrPower: {
      name: 'Benihime',
      jp: '紅姫 (Crimson Princess)',
      shikaiCommand: 'Awaken, Benihime (起きろ、紅姫) / Sing, Benihime (啼け、紅姫)',
      bankaiOrRelease: 'Kannonbiraki Benihime Aratame (観音開紅姫改メ - Modification of the Opened Benevolent Princess)',
      classification: 'Crimson Energy Constructs & Physical Anatomical Restructuring',
      abilities: [
        'Nake, Benihime: Piercing crimson arc slashes mimicking Getsuga Tenshō',
        'Chikasumi no Tate (Blood Mist Shield): Hexagonal crimson barrier absorbing heavy spirit impacts',
        'Kirisaki, Benihime: Machine-gun volley of hardened crimson needles',
        'Kamisori, Benihime: Razor-thin energy arc cutting through physical matter',
        'Shibari & Hiusobi: Binding net of crimson ribbons followed by high-explosive chain reaction',
        'Bankai: Kannonbiraki Benihime Aratame: Reconstructs, sews, and opens anything in its area, restoring sight, repairing severed flesh, or bisecting enemy anatomy',
        'Tenshintai (3-Day Bankai Training Doll)',
        'Inflatable Gigai Dummy Substitution',
        'Hadō #91: Senjū Kōten Taihō (Thousand-Hand Bright Heaven Cannon)',
        'Kugutsu Gidān: Custom sealing cuffs specifically engineered to bind Sōsuke Aizen',
      ],
    },
    overview:
      'Former 3rd Seat of the 2nd Division (Stealth Force Maggot’s Nest warden) who was promoted to 12th Division Captain and founded the Soul Society Research and Development Institute (S.R.D.I.). A transcendent intellect who synthesized the wish-granting Hōgyoku, invented the Tenshintai doll for rapid Bankai mastery, and engineered artificial Gigai bodies. Framed by Sōsuke Aizen for the Visored Hollowfication conspiracy 110 years ago, he was rescued by Yoruichi and exiled to the World of the Living, where he runs a quiet Karakura Town candy shop while serving as Soul Society’s ultimate secret weapon.',
    keyArcsAndBattles: [
      'Turn Back the Pendulum: Founding the S.R.D.I. and rescuing the Hollowfied captains from execution',
      'Training Ichigo Kurosaki: Restoring Ichigo’s severed spirit thread in the underground training shaft',
      'Fake Karakura Deicide: Deploying multi-tiered Kidō traps and the sealing spell that defeated transcended Aizen',
      'Shin\'eiyaku Pills: Inventing the Quincy-poison pills that returned stolen Bankai to all 13 Gotei Captains',
      'Royal Realm Climax: Unleashing Kannonbiraki Benihime Aratame to deconstruct and conquer Askin Nakk Le Vaar (The Deathdealing)',
    ],
    tacticalAnalysis:
      'Recognized by Quincy King Yhwach as one of the Five Special War Potentials because of his "Means"—the ability to invent, adapt, or synthesize a countermeasure to literally any opponent or cosmic crisis in real time.',
    iconicQuote:
      'There is nothing but fear reflected in your sword. When you dodge, you fear being cut. When you attack, you fear cutting someone. When you protect someone, you fear you will let them die. In battle, fear has no place. If you are afraid, you have already lost.',
  },
];
