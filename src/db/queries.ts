import { desc, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { DEFAULT_ITEM_LIST_LIMIT } from '@/config';

import { FeedEntryInsert, FeedUpdate, feedEntries, feeds } from './schema';

const connectionString = process.env.DB_URL;

if (!connectionString) throw new Error('DB_URL not set');

const client = postgres(connectionString);
const db = drizzle(client);

export const getFeeds = () => db.select().from(feeds);
export const getActiveFeeds = () => db.select().from(feeds).where(eq(feeds.active, true));

export const getFeedsWithDetails = () =>
  db
    .select({
      id: feeds.id,
      name: feeds.name,
      siteUrl: feeds.siteUrl,
      active: feeds.active,
      lastUpdatedAt: feeds.lastUpdatedAt,
      entryCount: sql<number>`count(${feedEntries.id})`,
    })
    .from(feedEntries)
    .leftJoin(feeds, eq(feeds.id, feedEntries.feedId))
    .groupBy(feeds.id)
    // .orderBy(desc(feedEntries.publishedAt))
    .execute();

export const getFeedsCount = () =>
  db
    .select({ count: sql<number>`count(*)` })
    .from(feeds)
    .then((res) => res[0].count);

export const updateFeed = (feedId: number, set: FeedUpdate) =>
  db.update(feeds).set(set).where(eq(feeds.id, feedId));

export const getRecentEntries = ({
  limit = DEFAULT_ITEM_LIST_LIMIT,
  offset = 0,
  includeSeen = true,
}: {
  limit?: number;
  offset?: number;
  includeSeen?: boolean;
}) =>
  db
    .select()
    .from(feedEntries)
    .where(includeSeen ? sql`true` : eq(feedEntries.seen, false))
    .orderBy(desc(feedEntries.publishedAt))
    .limit(limit)
    .offset(offset)
    .leftJoin(feeds, eq(feeds.id, feedEntries.feedId))
    .execute();

export const addFeedEntry = (values: FeedEntryInsert) =>
  db
    .insert(feedEntries)
    .values(values)
    .onConflictDoUpdate({ target: feedEntries.url, set: values });

export const getFeedEntriesCount = () =>
  db
    .select({ count: sql<number>`count(*)` })
    .from(feedEntries)
    .then((res) => res[0].count);
