import pLimit from 'p-limit';
import pluralize from 'pluralize';
import prettyMilliseconds from 'pretty-ms';
import Parser from 'rss-parser';

import { CONCURRENT_FEED_UPDATES } from '@/config';

import {
  addFeedItem,
  getActiveFeeds,
  getLastFeedItemId,
  updateFeed,
  updateFeedsLastPublishedAt,
} from '@/db/queries';
import { FeedSelect } from '@/db/schema';
import { getErrorMessage } from '@/lib/utils';

const parser = new Parser();

let feedsRemaining: number;

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

      try {
        let itemsAdded = 0;

        for (const item of feedResult.items) {
          if (item.link) {
            const [returningItem] = await addFeedItem({
              title: item.title || '[unknown title]',
              url: item.link,
              feedId,
              guid: item.guid || item.link,
              publishedAt: new Date(item.pubDate!),
              description: item.contentSnippet?.trim(),
              content: item.content?.trim(),
              enclosureUrl: item.enclosure?.url,
              enclosureType: item.enclosure?.type,
              enclosureLength: item.enclosure?.length,
            });

            if (returningItem.id > lastFeedItemId) {
              itemsAdded++;

              log(`added '${returningItem.title}'`);
            }
          }
        }

        await updateFeed(feedId, { lastCheckedAt: new Date() });

        log(
          `check completed, ${
            itemsAdded ? `(${pluralize('new item', itemsAdded, true)})` : 'no new items'
          }`
        );
      } catch (err) {
        log(`error adding feed item: ${getErrorMessage(err)})`);
      }
    } catch (err) {
      log(`error checking feed: ${getErrorMessage(err)}`);
    }
  }

  feedsRemaining--;

  if (feedsRemaining > 0) console.log(`${feedsRemaining} feeds still updating`);
}

export default async function updateFeeds() {
  const startTime = new Date();

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
    `END: feeds updated (${prettyMilliseconds(new Date().getTime() - startTime.getTime())})`
  );
}
