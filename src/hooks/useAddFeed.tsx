import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { buildURL } from '@/lib/utils';

import { type FeedFormData } from '@/components/feeds/FeedForm';
import { type FeedWithDetails } from '@/db/queries';

type APIResponse = {
  status: 'success' | 'error';
  message: string;
};

async function addFeedCall({ values }: { values: FeedFormData }) {
  const res = await fetch(buildURL('/api/feed'), {
    method: 'POST',
    body: JSON.stringify(values),
  });

  const resBody = (await res.json()) as APIResponse;

  if (res.status !== 200) throw Error(resBody.message);

  return resBody;
}

export default function useAddFeed() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: addFeedCall,
    onMutate: async ({ values }) => {
      const newFeed = values;
      await queryClient.cancelQueries({ queryKey: ['feeds'] });

      const previousFeeds = queryClient.getQueryData<FeedWithDetails[]>(['feeds']);

      queryClient.setQueryData(['feeds'], [...(previousFeeds || []), newFeed]);

      return { previousFeeds };
    },

    onError: (err, variables, context) => {
      if (context?.previousFeeds) queryClient.setQueryData(['feeds'], context.previousFeeds);

      toast({
        title: 'Error adding feed',
        className: 'text-red-500',
        description: err.message,
      });
    },
    onSuccess: (data, { values }) => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });

      toast({
        description: (
          <>
            <span className='font-medium'>{values.name}</span> added
          </>
        ),
      });
    },
  });

  return { mutate };
}
