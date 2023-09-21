import { desc, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { DEFAULT_ITEM_LIST_LIMIT } from '@/config';

import { FeedCreate, FeedItemInsert, FeedUpdate, feedItems, feeds } from './schema';

const connectionString = process.env.DB_URL;

if (!connectionString) throw new Error('DB_URL not set');

const client = postgres(connectionString);
export const db = drizzle(client);

export const getFeeds = () => db.select().from(feeds);
export const getActiveFeeds = () => db.select().from(feeds).where(eq(feeds.active, true));

export const getFeedsWithDetails = () =>
  db
    .select({
      id: feeds.id,
      name: feeds.name,
      siteUrl: feeds.siteUrl,
      url: feeds.url,
      active: feeds.active,
      checkedCount: feeds.checkedCount,
      lastCheckedAt: feeds.lastCheckedAt,
      lastPublishedAt: feeds.lastPublishedAt,
      lastErrorAt: feeds.lastErrorAt,
      lastErrorMessage: feeds.lastErrorMessage,
      errorCount: feeds.errorCount,
      errorsResetAt: feeds.errorsResetAt,
      itemCount: sql<number>`count(${feedItems.id})::INTEGER`,
      createdAt: feeds.createdAt,
      updatedAt: feeds.updatedAt,
    })
    .from(feeds)
    .leftJoin(feedItems, eq(feeds.id, feedItems.feedId))
    .groupBy(feeds.id)
    .orderBy(sql`${feeds.lastPublishedAt} DESC NULLS LAST`)
    .execute();

export type FeedWithDetails = Awaited<ReturnType<typeof getFeedsWithDetails>>[number];

export const getFeedCount = () =>
  db
    .select({ count: sql<number>`count(*)` })
    .from(feeds)
    .then((res) => res[0].count);

export const addFeed = (values: FeedCreate) =>
  db.insert(feeds).values(values).returning().execute();

export const updateFeed = (feedId: number, set: FeedUpdate) =>
  db
    .update(feeds)
    .set({ ...set, updatedAt: new Date() })
    .where(eq(feeds.id, feedId));

export const deleteFeed = (id: number) => db.delete(feeds).where(eq(feeds.id, id));

export const getRecentFeedItems = ({
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
    .from(feedItems)
    .where(includeSeen ? sql`true` : eq(feedItems.seen, false))
    .orderBy(sql`${feedItems.publishedAt} DESC NULLS LAST`)
    .limit(limit)
    .offset(offset)
    .leftJoin(feeds, eq(feeds.id, feedItems.feedId))
    .execute();

export const addFeedItem = (values: FeedItemInsert) =>
  db
    .insert(feedItems)
    .values(values)
    .onConflictDoUpdate({ target: feedItems.url, set: values })
    .returning();

export const getLastFeedItemId = () =>
  db
    .select()
    .from(feedItems)
    .orderBy(desc(feedItems.id))
    .limit(1)
    .then((res) => res[0]?.id);

export const getFeedItemCount = () =>
  db
    .select({ count: sql<number>`count(*)` })
    .from(feedItems)
    .then((res) => res[0].count);

export const updateFeedsLastPublishedAt = () =>
  db.execute(sql`
      UPDATE feeds AS f
        SET last_published_at = (
          SELECT MAX(fi.published_at)
          FROM feed_items AS fi
          WHERE fi.feed_id = f.id
        );`);
