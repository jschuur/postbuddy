export default function formattedDate({ date }: { date: Date | string | null }) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!dateObj) return null;

  return (
    <time dateTime={dateObj.toISOString()}>
      {dateObj.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })}
    </time>
  );
}
