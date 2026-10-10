import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import { MoodFace } from "../components/Icon";
import SectionHeader from "../components/SectionHeader";
import { MOODS, mockEntries, sortEntries } from "../data/mock";
import { MOCK_TODAY, addDays, formatDate } from "../lib/date";
import type { MoodKey } from "../types";

const RANGES: [number, string][] = [[7, "Last 7 days"], [30, "Last 30 days"], [90, "Last 90 days"], [0, "All time"]];
const RANGE_DAYS = 30;

export default function MoodTrackerPage() {
  const cutoff = RANGE_DAYS ? addDays(MOCK_TODAY, -RANGE_DAYS) : "0000";
  const inRange = sortEntries(mockEntries.filter((e) => e.mood && e.entryDate >= cutoff));
  const counts = inRange.reduce<Partial<Record<MoodKey, number>>>((acc, e) => {
    if (e.mood) acc[e.mood] = (acc[e.mood] ?? 0) + 1;
    return acc;
  }, {});
  const rows = (Object.entries(counts) as [MoodKey, number][]).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...rows.map(([, n]) => n));
  const strip = Array.from({ length: 28 }, (_, i) => {
    const d = addDays(MOCK_TODAY, i - 27);
    const hit = mockEntries.find((x) => x.entryDate === d && x.mood);
    return { d, color: hit?.mood ? MOODS[hit.mood].color : undefined };
  });

  return (
    <>
      <h2 className="pt">Mood Tracker</h2>
      <p className="lead">A gentle look at how you've been feeling. It's for reflection, not diagnosis.</p>
      <div className="bar">
        <select aria-label="Date range" defaultValue={RANGE_DAYS}>
          {RANGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Mood mix</h3>
        {rows.length ? rows.map(([k, n]) => (
          <button type="button" className="hb" key={k}>
            <span><MoodFace mood={k} /> {MOODS[k].label}</span>
            <u style={{ width: `${(n / max) * 100}%`, background: MOODS[k].color }} />
            <b>{n}</b>
          </button>
        )) : (
          <p style={{ color: "var(--mute)" }}>
            No moods recorded in this range. Add a mood to an entry and it will show up here.
          </p>
        )}
      </div>

      <SectionHeader title="Last 4 weeks" />
      <div className="strip">
        {strip.map((s) => <i key={s.d} title={formatDate(s.d)} style={s.color ? { background: s.color } : undefined} />)}
      </div>

      <SectionHeader title="Recent mood history" />
      <EntryGrid entries={inRange.slice(0, 6)}
        empty={<EmptyState title="Nothing here" message="No entries with this mood in this range." />} />
    </>
  );
}
