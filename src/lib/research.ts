export function formatRange(start: Date, end?: Date) {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  if (!end) return start.toLocaleDateString('en-GB', opts);
  return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}–${end.toLocaleDateString('en-GB', opts)}`;
}

export function isUpcoming(start: Date, end?: Date) {
  const compare = end ?? start;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return compare.getTime() >= today.getTime();
}
