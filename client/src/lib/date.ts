/** Fixed "today" so the static UI renders the same every time. Replace with `new Date()` when going dynamic. */
export const MOCK_TODAY = "2026-10-10";

const parse = (s: string) => new Date(`${s}T00:00`);
const pad = (n: number) => String(n).padStart(2, "0");
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const addDays = (s: string, n: number) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return toISO(d);
};

export const formatDate = (
  s: string,
  opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" },
) => parse(s).toLocaleDateString("en-US", opts);

export const monthYear = (y: number, m: number) =>
  new Date(y, m).toLocaleDateString("en-US", { month: "long", year: "numeric" });
