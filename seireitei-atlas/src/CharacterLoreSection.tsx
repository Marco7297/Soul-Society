import React, { useState } from 'react';
import { BLEACH_CHARACTERS, BleachCharacter } from './data/characters';
import { SpiritualRadarChart } from './SpiritualRadarChart';

interface CharacterLoreSectionProps {
  onPlaySound?: () => void;
}

export const CharacterLoreSection: React.FC<CharacterLoreSectionProps> = ({ onPlaySound }) => {
  const [activeCharId, setActiveCharId] = useState<string>(BLEACH_CHARACTERS[0].id);

  const activeChar = BLEACH_CHARACTERS.find((c) => c.id === activeCharId) || BLEACH_CHARACTERS[0];

  return (
    <div className="bleach-character-archive">
      {/* Character Selector Nav Strip */}
      <div className="char-nav-strip" data-lenis-prevent="true" role="tablist" aria-label="Bleach Characters Selector">
        {BLEACH_CHARACTERS.map((char) => {
          const isSelected = char.id === activeChar.id;
          return (
            <button
              key={char.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`char-nav-card ${isSelected ? 'active' : ''}`}
              onClick={() => {
                setActiveCharId(char.id);
                onPlaySound?.();
              }}
              style={{
                borderColor: isSelected ? char.accentColor : 'transparent',
              }}
            >
              <div className="char-nav-thumb-box">
                <img
                  src={char.image}
                  alt={char.name}
                  referrerPolicy="no-referrer"
                  className="char-nav-thumb-img"
                />
              </div>
              <div className="char-nav-text">
                <span className="char-nav-jp">{char.jpName}</span>
                <strong className="char-nav-name">{char.name}</strong>
                <small className="char-nav-role">{char.rankAndAffiliation.split('•')[0].trim()}</small>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Character Dossier Card */}
      <div className="char-profile-dossier" style={{ borderColor: `${activeChar.accentColor}33` }}>
        {/* Left Column: Character Visual & Zanpakutō Card */}
        <div className="char-visual-col">
          <div className="char-portrait-frame" style={{ borderColor: activeChar.accentColor }}>
            <img
              src={activeChar.image}
              alt={`${activeChar.name} - ${activeChar.title}`}
              referrerPolicy="no-referrer"
              className="char-portrait-img"
            />
            <div
              className="char-portrait-glow"
              style={{
                background: `radial-gradient(circle at bottom, ${activeChar.accentColor}40 0%, transparent 70%)`,
              }}
            />
            <div className="char-portrait-tag">
              <span className="char-reiatsu-badge" style={{ backgroundColor: `${activeChar.accentColor}26`, color: activeChar.accentColor }}>
                ⚔ {activeChar.reiatsuTheme}
              </span>
            </div>
          </div>

          {/* Zanpakutō / Power Manifestation Card */}
          <div className="char-power-box">
            <div className="power-box-header">
              <span className="power-box-tag">ZANPAKUTŌ & SPECIAL POWER</span>
              <h4 className="power-name">{activeChar.zanpakutoOrPower.name}</h4>
              <span className="power-jp">{activeChar.zanpakutoOrPower.jp}</span>
            </div>

            {activeChar.zanpakutoOrPower.shikaiCommand && (
              <div className="power-row">
                <span className="power-label">SHIKAI RELEASE COMMAND</span>
                <p className="power-command">“{activeChar.zanpakutoOrPower.shikaiCommand}”</p>
              </div>
            )}

            {activeChar.zanpakutoOrPower.bankaiOrRelease && (
              <div className="power-row">
                <span className="power-label">BANKAI / ULTIMATE MANIFESTATION</span>
                <p className="power-bankai" style={{ color: activeChar.accentColor }}>
                  {activeChar.zanpakutoOrPower.bankaiOrRelease}
                </p>
              </div>
            )}

            <div className="power-row">
              <span className="power-label">TECHNIQUES & ABILITIES</span>
              <div className="power-chips">
                {activeChar.zanpakutoOrPower.abilities.map((ab, i) => (
                  <span key={i} className="power-chip">
                    {ab}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Character Details & Canon Lore */}
        <div className="char-info-col">
          {/* Header Title Section */}
          <div className="char-header-section">
            <span className="char-kanji-stamp">{activeChar.jpName}</span>
            <div className="char-title-wrap">
              <p className="char-romaji">{activeChar.romaji} • {activeChar.rankAndAffiliation}</p>
              <h3 className="char-display-name" style={{ color: 'var(--paper)' }}>
                {activeChar.name}
              </h3>
              <p className="char-epithet" style={{ color: activeChar.accentColor }}>
                {activeChar.title}
              </p>
            </div>
          </div>

          {/* Iconic Quote */}
          <blockquote className="char-quote-card" style={{ borderLeftColor: activeChar.accentColor }}>
            <p>“{activeChar.iconicQuote}”</p>
          </blockquote>

          {/* D3 Spiritual Combat Attributes Radar Visual */}
          <SpiritualRadarChart
            attributes={activeChar.spiritualAttributes}
            attributeNotes={activeChar.attributeNotes}
            accentColor={activeChar.accentColor}
            characterName={activeChar.name}
            reiatsuTheme={activeChar.reiatsuTheme}
            onPlaySound={onPlaySound}
          />

          {/* Narrative Overview */}
          <div className="char-section">
            <h5 className="char-section-title">BIOGRAPHY & SEIREITEI IMPACT</h5>
            <p className="char-section-body">{activeChar.overview}</p>
          </div>

          {/* Tactical Intelligence */}
          <div className="char-section">
            <h5 className="char-section-title">TACTICAL DOSSIER & REIATSU LEVEL</h5>
            <p className="char-section-body">{activeChar.tacticalAnalysis}</p>
          </div>

          {/* Canon Battles & Arcs */}
          <div className="char-section">
            <h5 className="char-section-title">DEFINING BLEACH ANIME MOMENTS</h5>
            <ul className="char-battles-list">
              {activeChar.keyArcsAndBattles.map((battle, idx) => (
                <li key={idx} className="char-battle-item">
                  <span className="battle-bullet" style={{ color: activeChar.accentColor }}>✦</span>
                  <span>{battle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
