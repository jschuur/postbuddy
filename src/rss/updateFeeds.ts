import ora from 'ora';
import pluralize from 'pluralize';
import Parser from 'rss-parser';

import { getErrorMessage } from '@/lib/utils';
import { addFeedEntry, getActiveFeeds, updateFeed } from '../db/queries';

const parser = new Parser();

export default async function updateFeeds() {
  const feeds = await getActiveFeeds();
  let spinner;

  console.log(`Found ${pluralize('feed', feeds.length, true)}\n`);

  for (const feed of feeds) {
    console.log(`${feed.name} (${feed.url})`);

    try {
      if (!feed.url) {
        console.log(`  skipping (no feed URL)`);
        continue;
      }

      spinner = ora(`  fetching items`).start();

      const feedResult = await parser.parseURL(feed.url);
      spinner.succeed(`  found ${pluralize('item', feedResult.items.length, true)}`);

      spinner = ora(`  adding items`).start();
      try {
        for (const item of feedResult.items) {
          if (item.link)
            // TODO: maintain updatedAt field
            await addFeedEntry({
              title: item.title || '[unknown title]',
              url: item.link,
              feedId: feed.id,
              guid: item.guid || item.link,
              publishedAt: new Date(item.pubDate!),
              description: item.contentSnippet?.trim(),
              content: item.content?.trim(),
              enclosureUrl: item.enclosure?.url,
              enclosureType: item.enclosure?.type,
              enclosureLength: item.enclosure?.length,
            });
        }

        await updateFeed(feed.id, { lastUpdatedAt: new Date() });

        spinner.succeed('  added items');
      } catch (err) {
        spinner?.fail(`Error adding feed entry: ${getErrorMessage(err)})`);
      }
    } catch (err) {
      spinner?.fail(`Error querying feed ${feed.url}: ${getErrorMessage(err)}}`);
    }
  }
}
