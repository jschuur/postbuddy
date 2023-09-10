import { desc, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { DEFAULT_ITEM_LIST_LIMIT } from '@/config';

import { FeedItemInsert, FeedUpdate, feedItems, feeds } from './schema';

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
      active: feeds.active,
      lastCheckedAt: feeds.lastCheckedAt,
      lastPublishedAt: feeds.lastPublishedAt,
      feedItemCount: sql<number>`count(${feedItems.id})`,
    })
    .from(feedItems)
    .leftJoin(feeds, eq(feeds.id, feedItems.feedId))
    .groupBy(feeds.id)
    // .orderBy(desc(feedItems.publishedAt))
    .execute();

export const getFeedCount = () =>
  db
    .select({ count: sql<number>`count(*)` })
    .from(feeds)
    .then((res) => res[0].count);

export const updateFeed = (feedId: number, set: FeedUpdate) =>
  db.update(feeds).set(set).where(eq(feeds.id, feedId));

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
    .orderBy(desc(feedItems.publishedAt))
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
