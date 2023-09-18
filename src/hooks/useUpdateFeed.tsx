import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { buildURL } from '@/lib/utils';

import { type FeedWithDetails } from '@/db/queries';
import { FeedUpdate } from '@/db/schema';

type MutationProps = {
  feed: FeedWithDetails;
  values: FeedUpdate;
  successMsg?: string | JSX.Element;
};

type APIResponse = {
  status: 'success' | 'error';
  message: string;
};

async function updateFeedCall({ feed, values, successMsg }: MutationProps) {
  const res = await fetch(buildURL(`/api/feed/${feed.id}`), {
    method: 'PATCH',
    body: JSON.stringify({ id: feed.id, ...values }),
  });
  const resBody = (await res.json()) as APIResponse;

  if (res.status !== 200) throw Error(resBody.message);

  return resBody;
}

export default function useUpdateFeed() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: updateFeedCall,
    onMutate: async ({ feed, values }) => {
      const updatedFeed = { feed, ...values };
      await queryClient.cancelQueries({ queryKey: ['feeds'] });

      const previousFeeds = queryClient.getQueryData<FeedWithDetails[]>(['feeds']);

      queryClient.setQueryData(
        ['feeds'],
        previousFeeds?.map((f) => (f.id === feed.id ? { ...f, ...updatedFeed } : f))
      );

      return { previousFeeds };
    },
    onError: (error, { feed }, context) => {
      if (context?.previousFeeds) queryClient.setQueryData(['feeds'], context?.previousFeeds);

      toast({
        title: `Error updating ${feed.name}`,
        className: 'text-red-500',
        description: error.message,
      });
    },
    onSuccess: (data, { values, successMsg }) => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });

      toast({
        description: successMsg || (
          <>
            <span className='font-medium'>{values.name}</span> updated
          </>
        ),
      });
    },
  });

  return { mutate };
}
