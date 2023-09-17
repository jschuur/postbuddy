'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SheetFooter } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

import { type FeedWithDetails } from '@/db/queries';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  url: z.string().url({
    message: 'Please enter a valid URL.',
  }),
  // TODO: validate URL if provided
  siteUrl: z.string().optional(),
  active: z.boolean(),
});

interface Props {
  feed?: FeedWithDetails;
  closeMenu?: () => void;
  closeSheet?: () => void;
}

export default function FeedForm({ feed, closeMenu, closeSheet }: Props) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: feed?.name || '',
      url: feed?.url || '',
      siteUrl: feed?.siteUrl || '',
      active: feed?.active ?? true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (closeMenu) closeMenu();
    if (closeSheet) closeSheet();

    setTimeout(() => {
      // TODO: Show feed name
      toast({
        title: 'Feed updated',
        description: 'TBD',
      });
    }, 500);
  }

  return (
    <div className='pt-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='url'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feed URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='siteUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='active'
            render={({ field }) => (
              <FormItem>
                <div className='space-y-0.5'>
                  <FormLabel>Active</FormLabel>
                </div>
                <FormControl>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id={'active-switch'}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor='active-switch'>Check feed for new items</Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SheetFooter>
            <Button type='submit'>{feed ? 'Update' : 'Add'}</Button>
          </SheetFooter>
        </form>
      </Form>
    </div>
  );
}
