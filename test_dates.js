// test script
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameWeek(d1, d2) {
  const start1 = getStartOfWeek(d1);
  const start2 = getStartOfWeek(d2);
  return start1.getTime() === start2.getTime();
}

const today = new Date("2026-10-10T17:51:06.000Z"); // simulate server current time
console.log("today is", today.toISOString());

const dates = [
  "2026-10-10",
  "2026-10-11",
  "2026-10-12",
  "2026-10-13",
  "2026-10-14",
  "2026-10-15"
];

dates.forEach(dStr => {
  const d = new Date(dStr);
  console.log(`${dStr} -> ${d.toISOString()} (Day ${d.getDay()}) | Same week as today? ${isSameWeek(d, today)}`);
});
