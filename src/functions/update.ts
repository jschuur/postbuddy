import updateFeeds from '../rss/updateFeeds';

export async function handler() {
  await updateFeeds();
}
