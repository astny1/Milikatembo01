export function formatRange(start: Date, end?: Date) {
  if (!end) {
    return start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return `${start.getDate()}–${end.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;
}

export function isUpcoming(start: Date, end?: Date) {
  const compare = end ?? start;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return compare.getTime() >= today.getTime();
}

export function monthLabel(date: Date) {
  return date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
}
