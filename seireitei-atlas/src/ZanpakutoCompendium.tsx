import React, { useState } from 'react';
import { ZANPAKUTO_ENCYCLOPEDIA, ZanpakutoInfo } from './data/zanpakutoList';

interface ZanpakutoCompendiumProps {
  onPlayShikaiSound?: () => void;
}

export const ZanpakutoCompendium: React.FC<ZanpakutoCompendiumProps> = ({ onPlayShikaiSound }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeZanpakutoId, setActiveZanpakutoId] = useState<string>(ZANPAKUTO_ENCYCLOPEDIA[0].id);

  const categories = [
    'All',
    'Direct Combat / Melee',
    'Elemental — Fire',
    'Elemental — Ice & Snow',
    'Kidō & Sensory Illusion',
    'Special & Primordial',
  ];

  const filteredZanpakuto = ZANPAKUTO_ENCYCLOPEDIA.filter((z) => {
    if (selectedCategory !== 'All' && z.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      z.name.toLowerCase().includes(q) ||
      z.jpName.includes(q) ||
      z.wielder.toLowerCase().includes(q) ||
      (z.bankaiName && z.bankaiName.toLowerCase().includes(q)) ||
      z.shikaiCommand.toLowerCase().includes(q)
    );
  });

  const activeZan =
    ZANPAKUTO_ENCYCLOPEDIA.find((z) => z.id === activeZanpakutoId) || ZANPAKUTO_ENCYCLOPEDIA[0];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Elemental — Fire':
        return '#F59E0B';
      case 'Elemental — Ice & Snow':
        return '#38BDF8';
      case 'Kidō & Sensory Illusion':
        return '#A855F7';
      case 'Special & Primordial':
        return '#10B981';
      default:
        return '#EAB308';
    }
  };

  return (
    <div className="zanpakuto-compendium-container">
      {/* Category Pills & Search */}
      <div className="zanpakuto-toolbar">
        <div className="zanpakuto-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`zanpakuto-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="zanpakuto-search-wrap">
          <input
            type="search"
            placeholder="Search Zanpakutō, Bankai, wielder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="zanpakuto-search-input"
          />
        </div>
      </div>

      {/* Main Layout: Selector Grid on left, Featured Detail Dossier on right */}
      <div className="zanpakuto-main-layout">
        {/* Blade List Strip */}
        <div className="zanpakuto-card-list">
          {filteredZanpakuto.map((blade) => {
            const isSelected = blade.id === activeZan.id;
            const catColor = getCategoryColor(blade.category);
            return (
              <button
                key={blade.id}
                type="button"
                className={`zan-selector-item ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setActiveZanpakutoId(blade.id);
                  onPlayShikaiSound?.();
                }}
                style={{
                  borderColor: isSelected ? catColor : 'rgba(255,255,255,0.08)',
                  boxShadow: isSelected ? `0 0 16px ${catColor}30` : 'none',
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <span className="zan-item-name">{blade.name}</span>
                    <span className="zan-item-jp">{blade.jpName}</span>
                  </div>
                  <span className="zan-item-wielder">{blade.wielder}</span>
                </div>
                <div className="zan-item-bottom">
                  <span className="zan-item-cat" style={{ color: catColor }}>
                    {blade.category}
                  </span>
                  {blade.bankaiName && (
                    <span className="zan-item-bankai-tag">卍解 READY</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Featured Blade Deep Dossier */}
        <div
          className="zanpakuto-featured-panel"
          style={{
            borderColor: `${getCategoryColor(activeZan.category)}40`,
            boxShadow: `0 16px 45px rgba(0,0,0,0.7), 0 0 25px ${getCategoryColor(activeZan.category)}18`,
          }}
        >
          <div className="zan-featured-header">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="zan-cat-badge"
                  style={{
                    backgroundColor: `${getCategoryColor(activeZan.category)}20`,
                    color: getCategoryColor(activeZan.category),
                    borderColor: `${getCategoryColor(activeZan.category)}60`,
                  }}
                >
                  ⚔ {activeZan.category}
                </span>
                <span className="text-zinc-500 font-mono text-[11px]">•</span>
                <span className="text-zinc-400 font-mono text-[11px]">{activeZan.divisionOrAffiliation}</span>
              </div>
              <h3 className="zan-featured-title">
                {activeZan.name} <span className="zan-title-jp">{activeZan.jpName}</span>
              </h3>
              <p className="zan-title-trans">“{activeZan.translation}” — Wielder: <b>{activeZan.wielder}</b></p>
            </div>

            <button
              type="button"
              className="shikai-resonate-btn"
              onClick={onPlayShikaiSound}
              title="Resonate Zanpakutō spirit blade"
            >
              <span>⚔ RESONATE SHIKAI ♫</span>
            </button>
          </div>

          {/* Shikai Section */}
          <div className="zan-form-block shikai-block">
            <div className="zan-form-header">
              <span className="zan-form-tag">SHIKAI (始解 - INITIAL RELEASE)</span>
              <p className="zan-command-quote">
                “{activeZan.shikaiCommand}”
                <br />
                <span className="zan-command-jp">{activeZan.shikaiCommandJp}</span>
              </p>
            </div>
            <p className="zan-form-desc">{activeZan.shikaiForm}</p>
          </div>

          {/* Bankai Section */}
          {activeZan.bankaiName && (
            <div className="zan-form-block bankai-block">
              <div className="zan-form-header">
                <span className="zan-form-tag bankai-tag">BANKAI (卍解 - FINAL RELEASE)</span>
                <h4 className="zan-bankai-name">
                  {activeZan.bankaiName} <small className="text-zinc-400">{activeZan.bankaiJp}</small>
                </h4>
              </div>
              <p className="zan-form-desc">{activeZan.bankaiForm}</p>
            </div>
          )}

          {/* Special Abilities */}
          <div className="zan-abilities-block">
            <span className="pane-title">CANON COMBAT TECHNIQUES & SPIRITUAL ARTS</span>
            <ul className="zan-ability-list">
              {activeZan.specialAbilities.map((ab, i) => (
                <li key={i}>
                  <span className="bullet">✦</span>
                  <span>{ab}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Iconic Quote */}
          {activeZan.notableQuote && (
            <div className="zan-quote-box">
              <span className="quote-label">BLADE PHILOSOPHY:</span>
              <p className="quote-text font-serif">“{activeZan.notableQuote}”</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZanpakutoCompendium;
