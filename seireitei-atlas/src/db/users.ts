import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string | null
) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to sync user profile:', error);
    throw new Error('Unable to synchronize Soul Reaper profile.', {
      cause: error,
    });
  }
}

export async function updateUserProfile(
  uid: string,
  updates: { preferredDivision?: string; displayName?: string }
) {
  try {
    const result = await db
      .update(users)
      .set({
        ...(updates.preferredDivision !== undefined
          ? { preferredDivision: updates.preferredDivision }
          : {}),
        ...(updates.displayName !== undefined
          ? { displayName: updates.displayName }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.uid, uid))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw new Error('Unable to update Soul Reaper dossier.', { cause: error });
  }
}
