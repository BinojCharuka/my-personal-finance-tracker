export function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  // Monday is 1, Sunday is 0. We want Monday to be the start of the week.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getEndOfWeek(date: Date) {
  const d = getStartOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export function isSameWeek(d1: Date, d2: Date) {
  const start1 = getStartOfWeek(d1);
  const start2 = getStartOfWeek(d2);
  return start1.getTime() === start2.getTime();
}

export function isSameMonth(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}
