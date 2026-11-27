import React, { useState } from 'react';
import { KIDO_SPELLS, KidoSpell } from './data/kidoSpells';

interface KidoSpellbookProps {
  onPlaySpellSound?: (spellType: 'hado' | 'bakudo') => void;
}

export const KidoSpellbook: React.FC<KidoSpellbookProps> = ({ onPlaySpellSound }) => {
  const [selectedType, setSelectedType] = useState<'all' | 'hado' | 'bakudo'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChantSpell, setActiveChantSpell] = useState<KidoSpell | null>(null);

  const filteredSpells = KIDO_SPELLS.filter((spell) => {
    if (selectedType !== 'all' && spell.type !== selectedType) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      spell.name.toLowerCase().includes(term) ||
      spell.jpName.includes(term) ||
      spell.translation.toLowerCase().includes(term) ||
      spell.effect.toLowerCase().includes(term) ||
      spell.notableUsers.some((u) => u.toLowerCase().includes(term)) ||
      String(spell.number).includes(term)
    );
  });

  const handleCastSpell = (spell: KidoSpell) => {
    setActiveChantSpell(spell);
    if (onPlaySpellSound) {
      onPlaySpellSound(spell.type === 'hado' ? 'hado' : 'bakudo');
    }
  };

  return (
    <div className="kido-spellbook-container">
      {/* Top Controls Row */}
      <div className="kido-controls-bar">
        <div className="kido-type-toggle">
          <button
            type="button"
            className={`kido-toggle-btn ${selectedType === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedType('all')}
          >
            ALL SPELLS ({KIDO_SPELLS.length})
          </button>
          <button
            type="button"
            className={`kido-toggle-btn hado-btn ${selectedType === 'hado' ? 'active' : ''}`}
            onClick={() => setSelectedType('hado')}
          >
            破道 • HADŌ (DESTRUCTION)
          </button>
          <button
            type="button"
            className={`kido-toggle-btn bakudo-btn ${selectedType === 'bakudo' ? 'active' : ''}`}
            onClick={() => setSelectedType('bakudo')}
          >
            縛道 • BAKUDŌ (BINDING)
          </button>
        </div>

        <div className="kido-search-box">
          <input
            type="search"
            placeholder="Search Kidō spell by name, number (#90), or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="kido-search-input"
          />
        </div>
      </div>

      {/* Active Incantation / Chant Banner Modal if a spell is currently invoked */}
      {activeChantSpell && (
        <div className="kido-chant-banner" role="region" aria-label="Kidō Chant Inscription">
          <div className="chant-banner-header">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
              <span className="chant-banner-tag">
                {activeChantSpell.type === 'hado' ? '破道の' : '縛道の'}
                {activeChantSpell.number} • {activeChantSpell.jpName} ({activeChantSpell.name})
              </span>
            </div>
            <button
              type="button"
              className="chant-close-btn"
              onClick={() => setActiveChantSpell(null)}
              aria-label="Close incantation window"
            >
              ✕ CLOSE
            </button>
          </div>

          {activeChantSpell.incantation ? (
            <div className="chant-text-block">
              <span className="chant-label">POETIC INCANTATION (詠唱 - EISHŌ):</span>
              <p className="chant-japanese font-serif">{activeChantSpell.incantation.japanese}</p>
              <p className="chant-english">“{activeChantSpell.incantation.english}”</p>
            </div>
          ) : (
            <div className="chant-text-block">
              <span className="chant-label">CAST WITHOUT INCANTATION (詠唱破棄 - EISHŌHAKI):</span>
              <p className="chant-english">
                Executed silently through high-speed Reiatsu compression. Advanced practitioners like Aizen, Urahara, and Byakuya deploy this spell without vocal recitation.
              </p>
            </div>
          )}

          <div className="chant-meta-row">
            <span>NOTABLE CASTER: <b>{activeChantSpell.notableUsers.join(', ')}</b></span>
            <span>ARC: <b>{activeChantSpell.arcAppeared}</b></span>
          </div>
        </div>
      )}

      {/* Grid of Spells */}
      <div className="kido-grid">
        {filteredSpells.map((spell) => {
          const isHado = spell.type === 'hado';
          const badgeColor = isHado ? '#EF4444' : '#38BDF8';
          return (
            <div
              key={spell.id}
              className="kido-card"
              style={{
                borderColor: activeChantSpell?.id === spell.id ? badgeColor : 'rgba(255,255,255,0.08)',
              }}
            >
              <div className="kido-card-top">
                <div className="flex items-center gap-2">
                  <span
                    className="kido-num-badge"
                    style={{
                      backgroundColor: `${badgeColor}20`,
                      color: badgeColor,
                      borderColor: `${badgeColor}50`,
                    }}
                  >
                    #{spell.number}
                  </span>
                  <span className="kido-category-tag" style={{ color: badgeColor }}>
                    {isHado ? 'HADŌ (破道)' : 'BAKUDŌ (縛道)'}
                  </span>
                </div>

                <span
                  className="kido-tier-badge"
                  style={{
                    color:
                      spell.tier.includes('Forbidden') || spell.tier.includes('Transcendent')
                        ? '#F59E0B'
                        : '#A1A1AA',
                  }}
                >
                  {spell.tier}
                </span>
              </div>

              <div className="kido-names-block">
                <h4 className="kido-title">
                  {spell.name} <small className="kido-jp">{spell.jpName}</small>
                </h4>
                <p className="kido-trans">“{spell.translation}”</p>
              </div>

              <p className="kido-effect-text">{spell.effect}</p>

              <div className="kido-users-row">
                <span className="kido-users-label">MASTERS:</span>
                <span className="kido-users-val">{spell.notableUsers.join(', ')}</span>
              </div>

              <div className="kido-card-actions">
                <button
                  type="button"
                  className="kido-cast-btn"
                  onClick={() => handleCastSpell(spell)}
                  style={{
                    borderColor: `${badgeColor}60`,
                    color: badgeColor,
                  }}
                >
                  {spell.incantation ? '✦ RECITE CHANT & CAST ♫' : '✦ EXECUTE EISHŌHAKI ♫'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KidoSpellbook;
