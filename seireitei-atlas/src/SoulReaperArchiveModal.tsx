import React, { useEffect, useState } from 'react';
import { X, Bookmark, FileText, Trash2, LogIn, LogOut, Compass, Shield } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import type { SoulSocietySceneId } from './three/scenes';

interface LocationOption {
  id: string;
  name: string;
  jp: string;
  region: string;
}

interface SoulReaperArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: LocationOption[];
  prefillLocationId?: string;
  prefillScene?: SoulSocietySceneId;
  onJumpToLocation: (locationId: string) => void;
  onLaunch3DScene: (sceneId: SoulSocietySceneId) => void;
  onToast: (msg: string) => void;
}

const GOTEI_DIVISIONS = [
  '1st Division — General Command',
  '2nd Division — Onmitsukidō',
  '3rd Division — Support Command',
  '4th Division — Medical Relief',
  '5th Division — Kidō & Archives',
  '6th Division — Noble Security',
  '7th Division — Honor Guard',
  '8th Division — Intelligence',
  '9th Division — Seireitei Press',
  '10th Division — Field Vanguard',
  '11th Division — Direct Combat',
  '12th Division — S.R.D.I. Science',
  '13th Division — Karakura Watch',
  'Squad Zero — Royal Guard',
];

export function SoulReaperArchiveModal({
  isOpen,
  onClose,
  locations,
  prefillLocationId,
  prefillScene = 'seireitei',
  onJumpToLocation,
  onLaunch3DScene,
  onToast,
}: SoulReaperArchiveModalProps) {
  const {
    user,
    loadingAuth,
    syncingArchive,
    archiveError,
    profile,
    bookmarks,
    notes,
    signInWithGoogle,
    signOut,
    updateDivision,
    toggleBookmark,
    createNote,
    deleteNote,
  } = useAuth();

  const [selectedLocId, setSelectedLocId] = useState<string>(
    prefillLocationId || locations[0]?.id || 'sokyoku-hill'
  );
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [scenePreset, setScenePreset] = useState<SoulSocietySceneId>(prefillScene);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (prefillLocationId) setSelectedLocId(prefillLocationId);
      if (prefillScene) setScenePreset(prefillScene);
    }
  }, [isOpen, prefillLocationId, prefillScene]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    setSubmitting(true);
    const created = await createNote({
      locationId: selectedLocId,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      scenePreset,
    });
    setSubmitting(false);
    if (created) {
      setNoteTitle('');
      setNoteContent('');
      onToast('Field note inscribed into Soul Reaper Archive');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[115] flex items-center justify-center bg-[#04060e]/88 p-3 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Soul Reaper Dossier and Field Archive"
    >
      <div
        className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-2xl bg-[#090d1e] border border-[#c9a65b]/40 shadow-2xl p-5 sm:p-8 text-[#f4f1ea]"
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full border border-[#f4f1ea]/20 flex items-center justify-center text-[#f4f1ea]/80 hover:text-white hover:border-[#c9a65b] transition-colors"
          aria-label="Close archive"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pr-10 pb-5 border-b border-[#f4f1ea]/15">
          <div className="font-mono text-[10px] tracking-[0.2em] text-[#6fb7ff] uppercase mb-1.5">
            護廷十三隊 • SHINIGAMI PERSONAL LOGBOOK
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f4f1ea] m-0">
            Soul Reaper <em className="text-[#c9a65b]">Field Archive</em>
          </h2>
          <p className="text-sm text-[#f4f1ea]/70 mt-1.5 mb-0">
            Sign in with your Google account to save surveyed Soul Society landmarks, select your Gotei 13 division affiliation, and record personal exploration notes across sessions.
          </p>
        </div>

        {/* Graceful Archive Error Notice (sanitized, zero SQL internals) */}
        {archiveError && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-[#381418] border border-[#c8372d]/60 text-xs font-mono text-[#ffd0cc]">
            {archiveError}
          </div>
        )}

        {/* Auth Gate */}
        {!user ? (
          <div className="py-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#121c3a] border border-[#c9a65b]/40 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#c9a65b]" />
            </div>
            <h3 className="font-serif text-xl text-[#f4f1ea] mb-2">
              Authenticate Your Shinigami Crest
            </h3>
            <p className="text-sm text-[#f4f1ea]/65 max-w-md mb-6">
              Sync your Soul Society bookmarks, Gotei 13 squad assignment, and 3D exploration field notes securely across devices.
            </p>
            <button
              type="button"
              disabled={loadingAuth}
              onClick={async () => {
                const ok = await signInWithGoogle();
                if (ok) onToast('Shinigami Crest authenticated');
              }}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#162347] border border-[#c9a65b] text-[#f4f1ea] hover:bg-[#1e2f5e] font-mono text-xs tracking-wider transition-colors"
            >
              <LogIn className="w-4 h-4 text-[#c9a65b]" />
              <span>{loadingAuth ? 'VERIFYING...' : 'SIGN IN WITH GOOGLE'}</span>
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Officer Profile Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0f162e] border border-[#f4f1ea]/15">
              <div>
                <div className="font-mono text-[10px] tracking-widest text-[#c9a65b]">
                  REGISTERED OFFICER
                </div>
                <div className="font-serif text-lg text-[#f4f1ea]">
                  {profile?.displayName || user.displayName || user.email}
                </div>
                <div className="font-mono text-[11px] text-[#f4f1ea]/60">
                  {user.email}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] text-[#6fb7ff] tracking-wider">
                    DIVISION AFFILIATION
                  </span>
                  <select
                    value={profile?.preferredDivision || GOTEI_DIVISIONS[0]}
                    onChange={async (e) => {
                      const ok = await updateDivision(e.target.value);
                      if (ok) onToast(`Division updated: ${e.target.value}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#070b18] border border-[#c9a65b]/40 text-xs font-mono text-[#f4f1ea]"
                  >
                    {GOTEI_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    onToast('Signed out of Soul Reaper Archive');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#070b18] border border-[#f4f1ea]/20 text-[#f4f1ea]/80 hover:border-[#c8372d] hover:text-white font-mono text-[10px] tracking-wider self-end"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            </div>

            {/* Two-column Archive Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Surveyed Landmark Bookmarks */}
              <div className="rounded-xl bg-[#0c1226] border border-[#f4f1ea]/12 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-[#c9a65b]">
                    <Bookmark className="w-4 h-4" />
                    <span>SAVED LANDMARKS ({bookmarks.length})</span>
                  </div>
                  {syncingArchive && (
                    <span className="font-mono text-[9px] text-[#6fb7ff]">SYNCING...</span>
                  )}
                </div>

                {bookmarks.length === 0 ? (
                  <p className="text-xs text-[#f4f1ea]/55 py-6 text-center m-0">
                    No Soul Society landmarks bookmarked yet. Save any landmark from the Survey Panel or 3D Realm Viewer.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {bookmarks.map((bm) => (
                      <div
                        key={bm.id}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#070b18] border border-[#f4f1ea]/10"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onJumpToLocation(bm.locationId);
                          }}
                          className="text-left flex-1 min-w-0 hover:text-[#6fb7ff]"
                        >
                          <div className="font-serif text-sm text-[#f4f1ea] truncate">
                            {bm.locationName}
                          </div>
                          <div className="font-mono text-[10px] text-[#f4f1ea]/55 truncate">
                            {bm.region}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleBookmark({
                              locationId: bm.locationId,
                              locationName: bm.locationName,
                              region: bm.region,
                            })
                          }
                          className="p-1.5 rounded text-[#f4f1ea]/50 hover:text-[#ff786e]"
                          aria-label={`Remove ${bm.locationName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Personal Field Notes */}
              <div className="rounded-xl bg-[#0c1226] border border-[#f4f1ea]/12 p-4">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-[#6fb7ff] mb-3">
                  <FileText className="w-4 h-4" />
                  <span>RECORD FIELD OBSERVATION</span>
                </div>

                <form onSubmit={handleSubmitNote} className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={selectedLocId}
                      onChange={(e) => setSelectedLocId(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#070b18] border border-[#f4f1ea]/20 text-xs font-mono text-[#f4f1ea]"
                      aria-label="Select Soul Society landmark"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={scenePreset}
                      onChange={(e) =>
                        setScenePreset(e.target.value as SoulSocietySceneId)
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-[#070b18] border border-[#f4f1ea]/20 text-xs font-mono text-[#f4f1ea]"
                      aria-label="Select 3D Realm Scene"
                    >
                      <option value="seireitei">3D Scene: Seireitei Citadel</option>
                      <option value="sokyoku">3D Scene: Sōkyoku Mesa</option>
                      <option value="reiokyu">3D Scene: Reiōkyū Palace</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    required
                    maxLength={120}
                    placeholder="Observation title (e.g., Hakutōmon Sekkiseki resonance)"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#070b18] border border-[#f4f1ea]/20 text-xs text-[#f4f1ea] placeholder:text-[#f4f1ea]/40"
                  />

                  <textarea
                    required
                    rows={3}
                    maxLength={1500}
                    placeholder="Record Reishi anomalies, Kidō seals, or architectural notes..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#070b18] border border-[#f4f1ea]/20 text-xs text-[#f4f1ea] placeholder:text-[#f4f1ea]/40 resize-none"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2 rounded-lg bg-[#162347] border border-[#c9a65b]/60 text-[#f4f1ea] hover:bg-[#1e2f5e] font-mono text-[10px] tracking-widest transition-colors"
                  >
                    {submitting ? 'INSCRIBING...' : 'SAVE FIELD NOTE'}
                  </button>
                </form>
              </div>
            </div>

            {/* Saved Field Notes List */}
            <div className="rounded-xl bg-[#0c1226] border border-[#f4f1ea]/12 p-4">
              <div className="font-mono text-[11px] tracking-wider text-[#c9a65b] mb-3">
                RECORDED FIELD NOTES ({notes.length})
              </div>

              {notes.length === 0 ? (
                <p className="text-xs text-[#f4f1ea]/55 py-4 text-center m-0">
                  No personal observations recorded yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {notes.map((note) => {
                    const loc = locations.find((l) => l.id === note.locationId);
                    return (
                      <div
                        key={note.id}
                        className="p-3 rounded-lg bg-[#070b18] border border-[#f4f1ea]/12 flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <strong className="font-serif text-base text-[#f4f1ea] leading-snug">
                              {note.title}
                            </strong>
                            <button
                              type="button"
                              onClick={async () => {
                                const ok = await deleteNote(note.id);
                                if (ok) onToast('Field note removed');
                              }}
                              className="text-[#f4f1ea]/45 hover:text-[#ff786e] shrink-0"
                              aria-label="Delete note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="font-mono text-[10px] text-[#6fb7ff] mt-0.5">
                            {loc?.name || note.locationId}
                          </div>
                          <p className="text-xs text-[#f4f1ea]/75 mt-1.5 mb-0 whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#f4f1ea]/10">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onLaunch3DScene(
                                (note.scenePreset as SoulSocietySceneId) || 'seireitei'
                              );
                            }}
                            className="flex items-center gap-1 font-mono text-[9px] text-[#c9a65b] hover:underline"
                          >
                            <Compass className="w-3 h-3" />
                            <span>OPEN 3D SCENE</span>
                          </button>
                          <span className="font-mono text-[9px] text-[#f4f1ea]/45">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
