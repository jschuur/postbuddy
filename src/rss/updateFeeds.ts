import { pick } from 'lodash';
import pLimit from 'p-limit';
import pluralize from 'pluralize';
import prettyMilliseconds from 'pretty-ms';
import Parser from 'rss-parser';

import { CONCURRENT_FEED_UPDATES, DEFAULT_FEED_ITEM_TITLE } from '@/config';

import {
  addFeedItem,
  getActiveFeeds,
  getLastFeedItemId,
  updateFeed,
  updateFeedsLastPublishedAt,
} from '@/db/queries';
import { FeedSelect } from '@/db/schema';
import { dateOrNull, getErrorMessage } from '@/lib/utils';

const parser = new Parser();

let feedsRemaining: number;
let totalItemsAdded: number;
let totalErrors: number;

async function logError({
  type,
  err,
  feed,
  context,
}: {
  type: string;
  err: unknown;
  feed: FeedSelect;
  context?: string | object;
}) {
  const errorMessage = getErrorMessage(err);
  const contextTxt = context
    ? `, ${
        typeof context === 'object'
          ? JSON.stringify(context).replaceAll(',"', ', "').replaceAll('":{', '": {')
          : context
      }`
    : '';

  const message = `${errorMessage}${contextTxt}`;

  console.log(`[${feed.name}, ${type}] ${message}`);

  await updateFeed(feed.id, {
    errorCount: feed.errorCount + 1,
    lastErrorAt: new Date(),
    lastErrorMessage: `[${type}] ${message}`,
  });

  totalErrors++;
}

async function updateOneFeed({
  feed,
  lastFeedItemId,
}: {
  feed: FeedSelect;
  lastFeedItemId: number;
}) {
  const { name, url: feedUrl, id: feedId } = feed;

  const log = (str: string) => console.log(`[${name}] ${str}`);

  if (!feedUrl) {
    log(`skipped (no feed URL)`);
  } else {
    log(`checking ${feedUrl}`);

    try {
      const feedResult = await parser.parseURL(feedUrl);

      log(
        `feed contained ${pluralize(
          'item',
          feedResult.items.length,
          true
        )}, attempting to add new ones`
      );

      let itemsAdded = 0;

      for (const item of feedResult.items) {
        if (item.link) {
          try {
            const [returningItem] = await addFeedItem({
              title: item.title?.trim() || DEFAULT_FEED_ITEM_TITLE,
              url: item.link,
              feedId,
              guid: item.guid || item.link,
              publishedAt: item.pubDate ? dateOrNull(item.pubDate) : null,
              description: item.contentSnippet?.trim(),
              content: item.content?.trim(),
              enclosureUrl: item.enclosure?.url,
              enclosureType: item.enclosure?.type,
            });

            if (returningItem.id > lastFeedItemId) {
              itemsAdded++;
              totalItemsAdded++;

              log(`added '${returningItem.title}'`);
            }
          } catch (err) {
            await logError({
              type: 'addFeedItem',
              err,
              feed,
              context: {
                feed: pick(feed, ['url']),
                item: pick(item, ['title', 'link', 'guid']),
              },
            });
          }
        }
      }

      log(
        `check completed, ${
          itemsAdded ? `(${pluralize('new item', itemsAdded, true)})` : 'no new items'
        }`
      );

      try {
        await updateFeed(feedId, {
          lastCheckedAt: new Date(),
          checkedCount: feed.checkedCount + 1,
        });
      } catch (err) {
        await logError({
          type: 'updateFeed',
          err,
          feed,
          context: { feed: pick(feed, ['url']) },
        });
      }

      feedsRemaining--;

      if (feedsRemaining > 0) console.log(`${feedsRemaining} feeds still updating`);
    } catch (err) {
      await logError({ type: 'parseURL', err, feed, context: { feed: pick(feed, ['url']) } });
    }
  }
}

export default async function updateFeeds() {
  const startTime = new Date();

  totalItemsAdded = 0;
  totalErrors = 0;

  console.log('START: updating feeds');

  const feeds = await getActiveFeeds();
  feedsRemaining = feeds.length;

  const lastFeedItemId = await getLastFeedItemId();
  const limit = pLimit(CONCURRENT_FEED_UPDATES);

  console.log(
    `Found ${pluralize(
      'active feed',
      feeds.length,
      true
    )}, updating ${CONCURRENT_FEED_UPDATES} at a time`
  );

  await Promise.all(feeds.map((feed) => limit(() => updateOneFeed({ feed, lastFeedItemId }))));

  await updateFeedsLastPublishedAt();

  console.log(
    `END: feeds updated${
      totalItemsAdded > 0 ? `, ${pluralize('total item', totalItemsAdded, true)} added` : ''
    } ${
      totalErrors > 0 ? `, ${pluralize('total error', totalErrors, true)}` : ''
    } (${prettyMilliseconds(new Date().getTime() - startTime.getTime())})`
  );
}
