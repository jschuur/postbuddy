import { boolean as parseBoolean } from 'boolean';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const feeds = pgTable('feeds', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: varchar('url').notNull().unique(),
  siteUrl: varchar('site_url').notNull().default(''),
  active: boolean('active').notNull().default(true),
  checkedCount: integer('checked_count').notNull().default(0),
  lastCheckedAt: timestamp('last_checked_at'),
  lastPublishedAt: timestamp('last_published_at'),
  errorCount: integer('error_count').notNull().default(0),
  lastErrorAt: timestamp('last_error_at'),
  lastErrorMessage: text('last_error_message'),
  errorsResetAt: timestamp('errors_reset_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type FeedCreate = Omit<InferInsertModel<typeof feeds>, 'id'>;
export type FeedUpdate = Partial<InferSelectModel<typeof feeds>>;
export type FeedSelect = InferSelectModel<typeof feeds>;

export const FeedInsertSchema = createInsertSchema(feeds);

// should be able to reuse feeds schema and just override numbers to coerce into integers via zod
// https://orm.drizzle.team/docs/zod
export const FeedAPISchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  url: z.string(),
  siteUrl: z.string().default(''),
  active: z.preprocess((val) => parseBoolean(val), z.boolean()).optional(),
  errorCount: z.number().optional(),
  lastErrorAt: z
    .preprocess((val) => (val ? new Date(val as string) : null), z.date())
    .optional()
    .nullable(),
  lastErrorMessage: z.nullable(z.string().optional()),
  errorsResetAt: z.preprocess((val) => (val ? new Date(val as string) : null), z.date()).optional(),
});

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
