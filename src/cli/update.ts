import 'dotenv/config';

import updateFeeds from '@/rss/updateFeeds';

(async () => {
  await updateFeeds();

  process.exit(0);
})();
