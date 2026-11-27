import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  preferredDivision: text('preferred_division').notNull().default('1st Division'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const surveyBookmarks = pgTable(
  'survey_bookmarks',
  {
    id: serial('id').primaryKey(),
    userUid: text('user_uid')
      .references(() => users.uid, { onDelete: 'cascade' })
      .notNull(),
    locationId: text('location_id').notNull(),
    locationName: text('location_name').notNull(),
    region: text('region').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('survey_bookmarks_user_location_idx').on(
      table.userUid,
      table.locationId
    ),
  ]
);

export const fieldNotes = pgTable('field_notes', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid')
    .references(() => users.uid, { onDelete: 'cascade' })
    .notNull(),
  locationId: text('location_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  scenePreset: text('scene_preset').notNull().default('seireitei'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookmarks: many(surveyBookmarks),
  fieldNotes: many(fieldNotes),
}));

export const surveyBookmarksRelations = relations(
  surveyBookmarks,
  ({ one }) => ({
    user: one(users, {
      fields: [surveyBookmarks.userUid],
      references: [users.uid],
    }),
  })
);

export const fieldNotesRelations = relations(fieldNotes, ({ one }) => ({
  user: one(users, {
    fields: [fieldNotes.userUid],
    references: [users.uid],
  }),
}));
