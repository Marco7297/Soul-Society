import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';
import { requireAuth, type AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, updateUserProfile } from './src/db/users.ts';
import {
  createFieldNoteForUser,
  deleteFieldNoteForUser,
  getBookmarksForUser,
  getFieldNotesForUser,
  toggleBookmarkForUser,
} from './src/db/archiveRepository.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Authenticated Soul Society Archive API routes
  app.get('/api/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || 'shinigami@seireitei.jp';
      const name = typeof req.user?.name === 'string' ? req.user.name : null;
      if (!uid) {
        return res.status(401).json({ error: 'Unauthorized: Missing user identity' });
      }

      const profile = await getOrCreateUser(uid, email, name);
      const [bookmarks, notes] = await Promise.all([
        getBookmarksForUser(uid),
        getFieldNotesForUser(uid),
      ]);

      res.json({ profile, bookmarks, notes });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to load Soul Reaper archive.';
      res.status(500).json({ error: message });
    }
  });

  app.patch('/api/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const body = req.body as { preferredDivision?: string; displayName?: string };
      const preferredDivision =
        typeof body.preferredDivision === 'string'
          ? body.preferredDivision.trim().slice(0, 60)
          : undefined;
      const displayName =
        typeof body.displayName === 'string'
          ? body.displayName.trim().slice(0, 80)
          : undefined;

      const updated = await updateUserProfile(uid, {
        ...(preferredDivision ? { preferredDivision } : {}),
        ...(displayName !== undefined ? { displayName } : {}),
      });

      res.json({ profile: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update profile.';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/bookmarks/toggle', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || 'shinigami@seireitei.jp';
      const name = typeof req.user?.name === 'string' ? req.user.name : null;
      if (!uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const body = req.body as {
        locationId?: string;
        locationName?: string;
        region?: string;
      };
      if (!body.locationId || !body.locationName || !body.region) {
        return res.status(400).json({ error: 'Missing required landmark fields.' });
      }

      await getOrCreateUser(uid, email, name);
      const result = await toggleBookmarkForUser({
        userUid: uid,
        locationId: String(body.locationId).slice(0, 120),
        locationName: String(body.locationName).slice(0, 160),
        region: String(body.region).slice(0, 120),
      });
      const bookmarks = await getBookmarksForUser(uid);

      res.json({ bookmarked: result.bookmarked, bookmarks });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update bookmark.';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/notes', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || 'shinigami@seireitei.jp';
      const name = typeof req.user?.name === 'string' ? req.user.name : null;
      if (!uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const body = req.body as {
        locationId?: string;
        title?: string;
        content?: string;
        scenePreset?: string;
      };

      const title = typeof body.title === 'string' ? body.title.trim() : '';
      const content = typeof body.content === 'string' ? body.content.trim() : '';
      const locationId =
        typeof body.locationId === 'string' && body.locationId.trim()
          ? body.locationId.trim().slice(0, 120)
          : 'seireitei-citadel';
      const scenePreset =
        typeof body.scenePreset === 'string' && body.scenePreset.trim()
          ? body.scenePreset.trim().slice(0, 40)
          : 'seireitei';

      if (!title || !content) {
        return res.status(400).json({ error: 'Field note title and content are required.' });
      }

      await getOrCreateUser(uid, email, name);
      const note = await createFieldNoteForUser({
        userUid: uid,
        locationId,
        title: title.slice(0, 140),
        content: content.slice(0, 2000),
        scenePreset,
      });

      res.status(201).json({ note });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save field note.';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/notes/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const noteId = Number(req.params.id);
      if (!Number.isInteger(noteId) || noteId <= 0) {
        return res.status(400).json({ error: 'Invalid field note identifier.' });
      }

      const removed = await deleteFieldNoteForUser(uid, noteId);
      if (!removed) {
        return res.status(404).json({ error: 'Field note not found.' });
      }

      res.json({ deleted: true, id: noteId });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete field note.';
      res.status(500).json({ error: message });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.use((_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Soul Society server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
