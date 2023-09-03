import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Hello() {
  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Header</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>Hello!</CardContent>
      <CardFooter className='flex justify-between'>footer</CardFooter>
    </Card>
  );
}
