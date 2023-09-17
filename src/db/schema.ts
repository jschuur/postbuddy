import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const feeds = pgTable('feeds', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: varchar('url').notNull().unique(),
  siteUrl: varchar('site_url').unique(),
  active: boolean('active').notNull().default(true),
  lastCheckedAt: timestamp('last_checked_at'),
  lastPublishedAt: timestamp('last_published_at'),
  errorCount: integer('error_count').notNull().default(0),
  lastErrorAt: timestamp('last_error_at'),
  lastErrorMessage: text('last_error_message'),
});

export type FeedUpdate = Partial<InferSelectModel<typeof feeds>>;
export type FeedSelect = InferSelectModel<typeof feeds>;

export const feedItems = pgTable('feed_items', {
  id: serial('id').primaryKey(),
  feedId: integer('feed_id')
    .notNull()
    .references(() => feeds.id),
  title: varchar('title'),
  url: varchar('url').unique(),
  publishedAt: timestamp('published_at'),
  guid: varchar('guid').unique(),
  description: text('description'),
  content: text('content'),
  enclosureUrl: text('enclosure_url'),
  enclosureType: text('enclosure_type'),
  seen: boolean('seen').notNull().default(false),
});

export type FeedItemInsert = InferInsertModel<typeof feedItems>;
export type FeedItemSelect = InferSelectModel<typeof feedItems>;
