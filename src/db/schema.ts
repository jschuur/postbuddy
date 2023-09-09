import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const feeds = pgTable('feeds', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: varchar('url').unique(),
  siteUrl: varchar('siteUrl').unique(),
  active: boolean('active').notNull().default(true),
  lastUpdatedAt: timestamp('lastUpdatedAt'),
});

export type FeedUpdate = Partial<InferSelectModel<typeof feeds>>;
export type FeedSelect = InferSelectModel<typeof feeds>;

// export const feedRelations = relations(feeds, ({ many }) => ({
//   entries: many(feedEntries),
// }));

export const feedEntries = pgTable('feedEntries', {
  id: serial('id').primaryKey(),
  feedId: integer('feedId')
    .notNull()
    .references(() => feeds.id),
  title: varchar('title'),
  url: varchar('url').unique(),
  publishedAt: timestamp('publishedAt'),
  guid: varchar('guid').unique(),
  description: text('description'),
  content: text('content'),
  enclosureUrl: text('enclosureUrl'),
  enclosureType: text('enclosureType'),
  enclosureLength: integer('enclosureLength'),
  seen: boolean('seen').notNull().default(false),
});

// export const feedEntryRelations = relations(feedEntries, ({ one }) => ({
//   feed: one(feeds, { fields: [feedEntries.feedId], references: [feeds.id], relationName: 'feed' }),
// }));

export type FeedEntryInsert = InferInsertModel<typeof feedEntries>;
export type FeedEntrySelect = InferSelectModel<typeof feedEntries>;
