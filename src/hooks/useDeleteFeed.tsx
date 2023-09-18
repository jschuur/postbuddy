import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';

import { type FeedWithDetails } from '@/db/queries';
import { buildURL } from '@/lib/utils';

type MutationProps = {
  feed: FeedWithDetails;
};

type APIResponse = {
  status: 'success' | 'error';
  message: string;
};

async function deleteFeedCall({ feed }: MutationProps) {
  const res = await fetch(buildURL(`/api/feed/${feed.id}`), {
    method: 'DELETE',
  });

  const resBody = (await res.json()) as APIResponse;

  if (res.status !== 200) throw Error(resBody.message);

  return resBody;
}

export default function useDeleteFeed() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: deleteFeedCall,
    onMutate: async ({ feed }) => {
      await queryClient.cancelQueries({ queryKey: ['feeds'] });

      const previousFeeds = queryClient.getQueryData(['feeds']);

      queryClient.setQueryData<FeedWithDetails[]>(['feeds'], (old) =>
        old?.filter((f) => f.id !== feed.id)
      );

      return { previousFeeds };
    },
    onError: (err, { feed }, context) => {
      if (context?.previousFeeds) queryClient.setQueryData(['feeds'], context.previousFeeds);

      toast({
        title: `Error deleting ${feed.name}`,
        className: 'text-red-500',
        description: err.message,
      });
    },
    onSuccess: (data, { feed }) => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });

      toast({
        description: (
          <>
            <span className='font-medium'>{feed.name}</span> deleted
          </>
        ),
      });
    },
  });

  return { mutate };
}
