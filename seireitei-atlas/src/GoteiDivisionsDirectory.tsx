import React, { useState } from 'react';
import { GOTEI_DIVISIONS, GoteiDivision } from './data/goteiDivisions';

interface GoteiDivisionsDirectoryProps {
  onPlaySound?: () => void;
}

export const GoteiDivisionsDirectory: React.FC<GoteiDivisionsDirectoryProps> = ({ onPlaySound }) => {
  const [selectedSquadNum, setSelectedSquadNum] = useState<number>(1);
  const [filterCategory, setFilterCategory] = useState<'all' | 'command' | 'combat' | 'support'>('all');

  const filteredDivisions = GOTEI_DIVISIONS.filter((div) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'command') return [1, 6, 8].includes(div.number);
    if (filterCategory === 'combat') return [2, 3, 7, 9, 10, 11].includes(div.number);
    if (filterCategory === 'support') return [4, 5, 12, 13].includes(div.number);
    return true;
  });

  const activeDivision: GoteiDivision =
    GOTEI_DIVISIONS.find((d) => d.number === selectedSquadNum) || GOTEI_DIVISIONS[0];

  return (
    <div className="gotei-directory-container">
      {/* Category filter tabs */}
      <div className="gotei-filter-row">
        <span className="gotei-filter-label">FILTER DIVISION CLASSIFICATION:</span>
        <div className="gotei-filter-buttons">
          <button
            type="button"
            className={`gotei-filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            ALL 13 SQUADS (全十三隊)
          </button>
          <button
            type="button"
            className={`gotei-filter-btn ${filterCategory === 'command' ? 'active' : ''}`}
            onClick={() => setFilterCategory('command')}
          >
            COMMAND & NOBILITY (1, 6, 8)
          </button>
          <button
            type="button"
            className={`gotei-filter-btn ${filterCategory === 'combat' ? 'active' : ''}`}
            onClick={() => setFilterCategory('combat')}
          >
            FRONTLINE & COMBAT (2, 3, 7, 9, 10, 11)
          </button>
          <button
            type="button"
            className={`gotei-filter-btn ${filterCategory === 'support' ? 'active' : ''}`}
            onClick={() => setFilterCategory('support')}
          >
            SPECIALIZED & LOGISTICS (4, 5, 12, 13)
          </button>
        </div>
      </div>

      {/* Squad Badge Selector Strip */}
      <div className="squad-selector-strip" role="tablist" aria-label="Gotei 13 Divisions">
        {filteredDivisions.map((squad) => {
          const isSelected = squad.number === activeDivision.number;
          return (
            <button
              key={squad.number}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`squad-badge-card ${isSelected ? 'active' : ''}`}
              onClick={() => {
                setSelectedSquadNum(squad.number);
                onPlaySound?.();
              }}
              style={{
                borderColor: isSelected ? squad.color : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isSelected ? `0 0 16px ${squad.color}35` : 'none',
              }}
            >
              <span className="squad-badge-num" style={{ color: squad.color }}>
                {String(squad.number).padStart(2, '0')}
              </span>
              <span className="squad-badge-kanji">{squad.kanji}</span>
              <span className="squad-badge-caption">{squad.currentCaptain.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Selected Squad Dossier */}
      <div
        className="squad-dossier-card"
        style={{
          borderTopColor: activeDivision.color,
          boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 30px ${activeDivision.color}15`,
        }}
      >
        {/* Header Header */}
        <div className="squad-dossier-header">
          <div>
            <div className="squad-number-pill" style={{ borderColor: activeDivision.color, color: activeDivision.color }}>
              <span>DIV. {activeDivision.number}</span>
              <span>•</span>
              <span>{activeDivision.kanji}</span>
            </div>
            <h3 className="squad-dossier-title">{activeDivision.name}</h3>
            <p className="squad-role-tag">{activeDivision.role}</p>
          </div>

          <div className="squad-flower-badge" style={{ borderColor: `${activeDivision.color}40` }}>
            <span className="flower-label">DIVISION FLOWER & MOTTO</span>
            <strong className="flower-name" style={{ color: activeDivision.color }}>
              {activeDivision.flower}
            </strong>
            <small className="flower-meaning">“{activeDivision.flowerMeaning}”</small>
          </div>
        </div>

        {/* Division Core Details Grid */}
        <div className="squad-details-grid">
          {/* Officers Column */}
          <div className="squad-info-pane">
            <h4 className="pane-title">COMMANDING OFFICERS</h4>
            <div className="officer-row">
              <span className="officer-rank">CAPTAIN (隊長)</span>
              <span className="officer-name" style={{ color: activeDivision.color }}>
                {activeDivision.currentCaptain}
              </span>
            </div>
            <div className="officer-row">
              <span className="officer-rank">LIEUTENANT (副隊長)</span>
              <span className="officer-name">{activeDivision.currentLieutenant}</span>
            </div>
            {activeDivision.thirdSeat && (
              <div className="officer-row">
                <span className="officer-rank">3RD SEAT (三席)</span>
                <span className="officer-name">{activeDivision.thirdSeat}</span>
              </div>
            )}
            {activeDivision.formerCaptains && activeDivision.formerCaptains.length > 0 && (
              <div className="officer-row mt-2">
                <span className="officer-rank">FORMER CAPTAINS</span>
                <span className="officer-subtext">{activeDivision.formerCaptains.join(', ')}</span>
              </div>
            )}

            <div className="officer-row mt-3">
              <span className="officer-rank">SEIREITEI HEADQUARTERS</span>
              <span className="officer-subtext">{activeDivision.headquarters}</span>
            </div>
          </div>

          {/* Special Duties Column */}
          <div className="squad-info-pane">
            <h4 className="pane-title">SPECIAL MANDATES & RESPONSIBILITIES</h4>
            <ul className="squad-duties-list">
              {activeDivision.specialDuties.map((duty, idx) => (
                <li key={idx}>
                  <span className="bullet" style={{ color: activeDivision.color }}>✦</span>
                  <span>{duty}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-white/10">
              <span className="officer-rank">INSIGNIA SYMBOLISM</span>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                {activeDivision.insigniaDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Description */}
        <div className="squad-summary-box">
          <h4 className="pane-title">TACTICAL CANON SUMMARY</h4>
          <p className="squad-summary-text">{activeDivision.summary}</p>
        </div>

        {/* Notable Battles and Arcs */}
        <div className="squad-battles-box">
          <span className="officer-rank">HISTORIC BATTLES & SOUL SOCIETY ARCS</span>
          <div className="battle-tags-container">
            {activeDivision.notableBattles.map((battle, bIdx) => (
              <span key={bIdx} className="battle-tag" style={{ borderColor: `${activeDivision.color}35` }}>
                ⚔ {battle}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoteiDivisionsDirectory;
