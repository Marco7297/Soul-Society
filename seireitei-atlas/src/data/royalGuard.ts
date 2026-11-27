export interface RoyalGuardMember {
  id: string;
  name: string;
  jpName: string;
  romaji: string;
  title: string;
  titleJp: string;
  floatingPalace: string;
  floatingPalaceJp: string;
  divineContribution: string;
  zanpakutoOrAbility: string;
  overview: string;
  tybwRole: string;
}

export const ROYAL_GUARD_MEMBERS: RoyalGuardMember[] = [
  {
    id: 'ichibe',
    name: 'Ichibē Hyōsube',
    jpName: '兵主部 一兵衛',
    romaji: 'Hyōsube Ichibē',
    title: 'Monk of Perception / The One Who Calls the Real Name',
    titleJp: '真名呼和尚 (Manako Oshō)',
    floatingPalace: 'Central Main Palace / Hall of Names',
    floatingPalaceJp: '表参道 (Omotesandō)',
    divineContribution: 'Named all things in Soul Society: Zanpakutō, Shikai, Bankai, and every concept in existence.',
    zanpakutoOrAbility: 'Ichimonji (一文字) / Shin\'uchi: Shirafude Ichimonji (白筆一文字)',
    overview:
      'The primordial leader of the Royal Guard who has existed since before the separation of the Three Worlds. He wields absolute mastery over the concept of "Names" and all the "Black" in the universe. Rather than cutting physical flesh, his brush erases the name and identity of whatever it covers, rendering divine beings as weak as black ants.',
    tybwRole:
      'Trained Ichigo, Renji, Rukia, and Byakuya in the Royal Realm. Engaged Emperor Yhwach in the throne room, rewriting Yhwach’s name to "Black Ant" before being overcome by the awakening of The Almighty.',
  },
  {
    id: 'nimaiya',
    name: 'Ōetsu Nimaiya',
    jpName: '二枚屋 王悦',
    romaji: 'Nimaiya Ōetsu',
    title: 'The God of the Sword / Creator of the Zanpakutō',
    titleJp: '刀神 (Tōshin)',
    floatingPalace: 'Hōōden (Phoenix Palace)',
    floatingPalaceJp: '鳳凰殿 (Hōōden)',
    divineContribution: 'Forged the original Asauchi (blank Zanpakutō) blades used by every Shinigami in Soul Society history.',
    zanpakutoOrAbility: 'Sayafushi (鞘伏 - Sheath Dodger)',
    overview:
      'A flamboyant, eccentric master bladesmith who lives surrounded by sword spirits. Beneath his swagger lies the deadliest swordsman in the Royal Guard. He forged Sayafushi—a blade so razor-sharp and smooth that no sheath could ever contain it, forcing him to store it in a tank of jelly.',
    tybwRole:
      'Single-handedly wiped out the elite Schutzstaffel (Gerard, Lille, Pernida, Askin) in seconds upon their arrival in the Royal Realm before Yhwach revived them with Auswählen. Later re-forged Ichigo’s True Dual Zangetsu from the core of his soul.',
  },
  {
    id: 'shutara',
    name: 'Senjumaru Shutara',
    jpName: '修多羅 千手丸',
    romaji: 'Shutara Senjumaru',
    title: 'Great Weave Guard / Weaver of Divine Silk',
    titleJp: '大織守 (Ōorigami)',
    floatingPalace: 'Senshumaru Silk Palace',
    floatingPalaceJp: '千手丸織殿',
    divineContribution: 'Invented the Shihakushō (死覇装 - Garment of the Dead) worn by all Soul Reapers.',
    zanpakutoOrAbility: 'Bankai: Shatatsu Karagara Shigarami no Tsuji (娑闥迦羅骸刺絡辻)',
    overview:
      'Commands six mechanical needle arms protruding from her back, manipulating threads of Reishi that weave illusions, impenetrable protective garments, and cosmic tapestries. In the Bleach anime adaptation, she unleashed her Bankai, shaking the foundations of the Three Worlds simultaneously.',
    tybwRole:
      'Fought the Schutzstaffel atop the Royal Realm. When four Royal Guards committed ritual suicide to break the seal on her power, she unleashed her colossal loom Bankai, trapping the Sternritter in specialized symbolic cloth cages.',
  },
  {
    id: 'kirinji',
    name: 'Tenjirō Kirinji',
    jpName: '麒麟寺 天示郎',
    romaji: 'Kirinji Tenjirō',
    title: 'Hot Spring Demon / Lightning Fast Healer',
    titleJp: '雷迅の天示郎 (Lightning Tenjirō)',
    floatingPalace: 'Kirinden (Kirin Palace Hot Springs)',
    floatingPalaceJp: '麒麟殿 (Kirinden)',
    divineContribution: 'Pioneered the healing waters and taught healing Kidō (Kaitsū) to Retsu Unohana.',
    zanpakutoOrAbility: 'Kinpika (金 civic / Flashing Gold) & Blood Hell Springs',
    overview:
      'A brash pompadour-sporting fighter who commands the "White Bone Hell" and "Blood Hell" hot springs. These supernatural waters replace damaged flesh and Reiatsu by boiling diseased blood out of the victim’s body, restoring them beyond their previous physical limits.',
    tybwRole:
      'Healed Byakuya, Renji, Rukia, and Ichigo after their near-fatal wounds in the First Quincy Invasion, pushing their bodies into transcendent condition.',
  },
  {
    id: 'hikifune',
    name: 'Kirio Hikifune',
    jpName: '曳舟 桐生',
    romaji: 'Hikifune Kirio',
    title: 'Ruler of Grain / Pioneer of Soul Syntheses',
    titleJp: '穀王 (Kokuō)',
    floatingPalace: 'Gatonden (Grain Palace)',
    floatingPalaceJp: '臥豚殿 (Gatonden)',
    divineContribution: 'Invented Artificial Souls (Gikongan / Soul Candy) and nutritional Reiatsu infusion.',
    zanpakutoOrAbility: 'Cage of Life (産霊の檻 - Sanrei no Ori) & Wooden Staff',
    overview:
      'Former Captain of the 12th Division (preceding Kisuke Urahara). She discovered how to infuse foreign Reiatsu into living bodies through food, cooking feasts that elevate spiritual energy to godlike tiers. Uses the Cage of Life, an organic wooden tree that feeds entirely on spiritual pressure.',
    tybwRole:
      'Fed Ichigo and Renji nourishing spirit feasts that rebuilt their spiritual capacity from within, then deployed the Cage of Life to entrap the Quincy vanguard in an invulnerable Reishi-eating thicket.',
  },
];
