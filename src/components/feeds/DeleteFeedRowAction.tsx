import pluralize from 'pluralize';

import { type FeedWithDetails } from '@/db/queries';

import ConfirmationAlert from '@/components/ConfirmationAlert';

import useDeleteFeed from '@/hooks/useDeleteFeed';

type Props = {
  feed: FeedWithDetails;
  children: React.ReactNode;
  closeMenu: () => void;
};

export default function DeleteFeedRowAction({ children, feed, closeMenu }: Props) {
  const { mutate: deleteFeedMutation } = useDeleteFeed();

  const deleteFeed = () => {
    closeMenu();

    deleteFeedMutation({ feed });
  };

  return (
    <ConfirmationAlert
      title={`Really delete ${feed.name}?`}
      description={
        <>
          <div>
            Feed URL:{' '}
            <a target='_blank' href={feed.url}>
              {feed.url}
            </a>
          </div>
          {feed.siteUrl ? (
            <div>
              Site URL:{' '}
              <a target='_blank' href={feed.siteUrl}>
                {feed.siteUrl}
              </a>
            </div>
          ) : null}
          {feed.itemCount > 0 ? (
            <div className='py-2'>
              This will not delete the{' '}
              <span className='font-semibold'>{pluralize('item', feed.itemCount, true)}</span>{' '}
              previously found for this feed.
            </div>
          ) : null}
        </>
      }
      confirm='Yes, Delete'
      onConfirm={deleteFeed}
      closeMenu={closeMenu}
    >
      {children}
    </ConfirmationAlert>
  );
}
