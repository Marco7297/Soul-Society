import React, { useState } from 'react';
import { ROYAL_GUARD_MEMBERS, RoyalGuardMember } from './data/royalGuard';

interface RoyalGuardDossierProps {
  onPlaySound?: () => void;
}

export const RoyalGuardDossier: React.FC<RoyalGuardDossierProps> = ({ onPlaySound }) => {
  const [activeMemberId, setActiveMemberId] = useState<string>(ROYAL_GUARD_MEMBERS[0].id);

  const activeMember: RoyalGuardMember =
    ROYAL_GUARD_MEMBERS.find((m) => m.id === activeMemberId) || ROYAL_GUARD_MEMBERS[0];

  return (
    <div className="royal-guard-container">
      {/* Introduction banner */}
      <div className="royal-intro-card">
        <span className="card-label">王属特務 • THE ROYAL GUARD (SQUAD ZERO)</span>
        <h3>Guardians of the Soul King • 霊王宮の守護神</h3>
        <p>
          Squad Zero consists of exactly five elite Shinigami whose combined combat power is canonically confirmed to surpass
          the entire 13 Court Guard Squads combined. Each officer was personally elevated to the Royal Guard by the Soul King
          for creating a foundational invention that permanently advanced the history and culture of Soul Society.
        </p>
      </div>

      {/* Member Selection Strip */}
      <div className="royal-members-strip" role="tablist" aria-label="Squad Zero Officers">
        {ROYAL_GUARD_MEMBERS.map((member) => {
          const isSelected = member.id === activeMember.id;
          return (
            <button
              key={member.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`royal-nav-card ${isSelected ? 'active' : ''}`}
              onClick={() => {
                setActiveMemberId(member.id);
                onPlaySound?.();
              }}
            >
              <div className="royal-nav-icon">⚔</div>
              <div className="text-left">
                <span className="royal-nav-name">{member.name}</span>
                <span className="royal-nav-title">{member.titleJp}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Member Dossier */}
      <div className="royal-dossier-card">
        <div className="royal-dossier-header">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="royal-tag">SQUAD ZERO • 零番隊</span>
              <span className="text-zinc-500 font-mono text-[11px]">•</span>
              <span className="royal-palace-tag">{activeMember.floatingPalace} ({activeMember.floatingPalaceJp})</span>
            </div>
            <h3 className="royal-member-name">
              {activeMember.name} <small className="text-zinc-400 font-serif">{activeMember.jpName}</small>
            </h3>
            <p className="royal-member-title font-serif italic text-amber-300">“{activeMember.title}”</p>
          </div>
        </div>

        {/* Contribution Highlight Box */}
        <div className="royal-contrib-box">
          <span className="contrib-label">DIVINE FOUNDATIONAL CONTRIBUTION TO SOUL SOCIETY:</span>
          <p className="contrib-text">{activeMember.divineContribution}</p>
        </div>

        {/* Powers & Zanpakutō */}
        <div className="royal-power-row">
          <span className="power-tag-label">ZANPAKUTŌ & PRIMORDIAL ART:</span>
          <strong className="power-name-text">{activeMember.zanpakutoOrAbility}</strong>
        </div>

        {/* Detailed Lore Overview */}
        <div className="royal-narrative-block">
          <h4 className="pane-title">CANON BIOGRAPHY & ANCIENT ORIGIN</h4>
          <p className="royal-text">{activeMember.overview}</p>
        </div>

        {/* TYBW Climax & Role */}
        <div className="royal-tybw-block">
          <h4 className="pane-title">THOUSAND-YEAR BLOOD WAR ROLE & SACRIFICE</h4>
          <p className="royal-text">{activeMember.tybwRole}</p>
        </div>
      </div>
    </div>
  );
};

export default RoyalGuardDossier;
