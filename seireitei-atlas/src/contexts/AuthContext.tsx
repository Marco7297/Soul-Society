import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';

export interface SoulReaperProfile {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  preferredDivision: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyBookmark {
  id: number;
  userUid: string;
  locationId: string;
  locationName: string;
  region: string;
  createdAt: string;
}

export interface FieldNote {
  id: number;
  userUid: string;
  locationId: string;
  title: string;
  content: string;
  scenePreset: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextValue {
  user: User | null;
  loadingAuth: boolean;
  syncingArchive: boolean;
  archiveError: string | null;
  profile: SoulReaperProfile | null;
  bookmarks: SurveyBookmark[];
  notes: FieldNote[];
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshArchive: () => Promise<void>;
  updateDivision: (division: string) => Promise<boolean>;
  toggleBookmark: (params: {
    locationId: string;
    locationName: string;
    region: string;
  }) => Promise<boolean | null>;
  createNote: (params: {
    locationId: string;
    title: string;
    content: string;
    scenePreset?: string;
  }) => Promise<FieldNote | null>;
  deleteNote: (id: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [syncingArchive, setSyncingArchive] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [profile, setProfile] = useState<SoulReaperProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<SurveyBookmark[]>([]);
  const [notes, setNotes] = useState<FieldNote[]>([]);

  // In-memory ID token storage only (never localStorage)
  const idTokenRef = useRef<string | null>(null);

  const getFreshToken = useCallback(async (targetUser?: User | null) => {
    const active = targetUser ?? auth.currentUser;
    if (!active) {
      idTokenRef.current = null;
      return null;
    }
    const token = await active.getIdToken();
    idTokenRef.current = token;
    return token;
  }, []);

  const authorizedFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const token = await getFreshToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      const headers = new Headers(init?.headers || {});
      headers.set('Authorization', `Bearer ${token}`);
      if (init?.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      const res = await fetch(input, { ...init, headers });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error || 'Archive request failed');
      }
      return res;
    },
    [getFreshToken]
  );

  const refreshArchive = useCallback(async () => {
    if (!auth.currentUser) {
      setProfile(null);
      setBookmarks([]);
      setNotes([]);
      return;
    }
    setSyncingArchive(true);
    setArchiveError(null);
    try {
      const res = await authorizedFetch('/api/me');
      const data = (await res.json()) as {
        profile: SoulReaperProfile;
        bookmarks: SurveyBookmark[];
        notes: FieldNote[];
      };
      setProfile(data.profile);
      setBookmarks(data.bookmarks);
      setNotes(data.notes);
    } catch (err: unknown) {
      setArchiveError(
        err instanceof Error ? err.message : 'Unable to synchronize Soul Society archive.'
      );
    } finally {
      setSyncingArchive(false);
    }
  }, [authorizedFetch]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setLoadingAuth(false);
      if (nextUser) {
        await getFreshToken(nextUser);
        await refreshArchive();
      } else {
        idTokenRef.current = null;
        setProfile(null);
        setBookmarks([]);
        setNotes([]);
        setArchiveError(null);
      }
    });
    return () => unsub();
  }, [getFreshToken, refreshArchive]);

  const signInWithGoogle = useCallback(async () => {
    setArchiveError(null);
    try {
      const credential = await signInWithPopup(auth, googleAuthProvider);
      await getFreshToken(credential.user);
      await refreshArchive();
      return true;
    } catch (err: unknown) {
      setArchiveError(
        err instanceof Error ? err.message : 'Google sign-in could not be completed.'
      );
      return false;
    }
  }, [getFreshToken, refreshArchive]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    idTokenRef.current = null;
    setProfile(null);
    setBookmarks([]);
    setNotes([]);
    setArchiveError(null);
  }, []);

  const updateDivision = useCallback(
    async (division: string) => {
      try {
        const res = await authorizedFetch('/api/profile', {
          method: 'PATCH',
          body: JSON.stringify({ preferredDivision: division }),
        });
        const data = (await res.json()) as { profile: SoulReaperProfile };
        if (data.profile) setProfile(data.profile);
        return true;
      } catch (err: unknown) {
        setArchiveError(
          err instanceof Error ? err.message : 'Failed to update division assignment.'
        );
        return false;
      }
    },
    [authorizedFetch]
  );

  const toggleBookmark = useCallback(
    async (params: { locationId: string; locationName: string; region: string }) => {
      try {
        const res = await authorizedFetch('/api/bookmarks/toggle', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        const data = (await res.json()) as {
          bookmarked: boolean;
          bookmarks: SurveyBookmark[];
        };
        setBookmarks(data.bookmarks);
        return data.bookmarked;
      } catch (err: unknown) {
        setArchiveError(
          err instanceof Error ? err.message : 'Unable to update landmark bookmark.'
        );
        return null;
      }
    },
    [authorizedFetch]
  );

  const createNote = useCallback(
    async (params: {
      locationId: string;
      title: string;
      content: string;
      scenePreset?: string;
    }) => {
      try {
        const res = await authorizedFetch('/api/notes', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        const data = (await res.json()) as { note: FieldNote };
        setNotes((prev) => [data.note, ...prev]);
        return data.note;
      } catch (err: unknown) {
        setArchiveError(
          err instanceof Error ? err.message : 'Unable to record field note.'
        );
        return null;
      }
    },
    [authorizedFetch]
  );

  const deleteNote = useCallback(
    async (id: number) => {
      try {
        await authorizedFetch(`/api/notes/${id}`, { method: 'DELETE' });
        setNotes((prev) => prev.filter((n) => n.id !== id));
        return true;
      } catch (err: unknown) {
        setArchiveError(
          err instanceof Error ? err.message : 'Unable to remove field note.'
        );
        return false;
      }
    },
    [authorizedFetch]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loadingAuth,
      syncingArchive,
      archiveError,
      profile,
      bookmarks,
      notes,
      signInWithGoogle,
      signOut,
      refreshArchive,
      updateDivision,
      toggleBookmark,
      createNote,
      deleteNote,
    }),
    [
      user,
      loadingAuth,
      syncingArchive,
      archiveError,
      profile,
      bookmarks,
      notes,
      signInWithGoogle,
      signOut,
      refreshArchive,
      updateDivision,
      toggleBookmark,
      createNote,
      deleteNote,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
