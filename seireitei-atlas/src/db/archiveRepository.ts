import { and, desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { fieldNotes, surveyBookmarks } from './schema.ts';

export async function getBookmarksForUser(userUid: string) {
  try {
    return await db
      .select()
      .from(surveyBookmarks)
      .where(eq(surveyBookmarks.userUid, userUid))
      .orderBy(desc(surveyBookmarks.createdAt));
  } catch (error) {
    console.error('Failed to fetch bookmarks:', error);
    throw new Error('Unable to load surveyed bookmarks.', { cause: error });
  }
}

export async function toggleBookmarkForUser(params: {
  userUid: string;
  locationId: string;
  locationName: string;
  region: string;
}) {
  try {
    const existing = await db
      .select()
      .from(surveyBookmarks)
      .where(
        and(
          eq(surveyBookmarks.userUid, params.userUid),
          eq(surveyBookmarks.locationId, params.locationId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .delete(surveyBookmarks)
        .where(eq(surveyBookmarks.id, existing[0].id));
      return { bookmarked: false };
    }

    await db.insert(surveyBookmarks).values({
      userUid: params.userUid,
      locationId: params.locationId,
      locationName: params.locationName,
      region: params.region,
    });

    return { bookmarked: true };
  } catch (error) {
    console.error('Failed to toggle bookmark:', error);
    throw new Error('Unable to update surveyed bookmark.', { cause: error });
  }
}

export async function getFieldNotesForUser(userUid: string) {
  try {
    return await db
      .select()
      .from(fieldNotes)
      .where(eq(fieldNotes.userUid, userUid))
      .orderBy(desc(fieldNotes.createdAt));
  } catch (error) {
    console.error('Failed to fetch field notes:', error);
    throw new Error('Unable to load field notes.', { cause: error });
  }
}

export async function createFieldNoteForUser(params: {
  userUid: string;
  locationId: string;
  title: string;
  content: string;
  scenePreset?: string;
}) {
  try {
    const inserted = await db
      .insert(fieldNotes)
      .values({
        userUid: params.userUid,
        locationId: params.locationId,
        title: params.title,
        content: params.content,
        scenePreset: params.scenePreset || 'seireitei',
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to create field note:', error);
    throw new Error('Unable to record Soul Society field note.', {
      cause: error,
    });
  }
}

export async function deleteFieldNoteForUser(userUid: string, noteId: number) {
  try {
    const deleted = await db
      .delete(fieldNotes)
      .where(and(eq(fieldNotes.id, noteId), eq(fieldNotes.userUid, userUid)))
      .returning();

    return deleted.length > 0;
  } catch (error) {
    console.error('Failed to delete field note:', error);
    throw new Error('Unable to remove field note.', { cause: error });
  }
}
