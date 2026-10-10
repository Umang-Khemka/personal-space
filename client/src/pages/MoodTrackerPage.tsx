import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import { MoodFace } from "../components/Icon";
import SectionHeader from "../components/SectionHeader";
import { MOODS } from "../data/mock";
import { addDays, formatDate } from "../lib/date";
import { useEntryStore } from "../store/entry.store";
import type { MoodKey } from "../types/entry";

const RANGES: [number, string][] = [[7, "Last 7 days"], [30, "Last 30 days"], [90, "Last 90 days"], [0, "All time"]];
const TODAY = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD

export default function MoodTrackerPage() {
  const [range, setRange] = useState(30);
  const { moodStats, entries, fetchMoodStats, fetchEntries } = useEntryStore();

  const cutoff = range ? addDays(TODAY, -range) : "0000";

  // mood mix: server-side counts for the selected range
  useEffect(() => {
    fetchMoodStats(range ? cutoff : undefined, TODAY);
  }, [range, cutoff, fetchMoodStats]);

  // strip + history: always cover at least the last 28 days
  useEffect(() => {
    const from = range ? addDays(TODAY, -Math.max(range, 27)) : undefined;
    fetchEntries({ from, to: TODAY, sort: "newest", limit: 100 });
  }, [range, fetchEntries]);

  const rows = ((moodStats?.moods ?? []).filter((m) => m.mood !== "unset") as { mood: MoodKey; count: number }[])
    .sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...rows.map((r) => r.count));

  const inRange = entries.filter((e) => e.mood && e.entryDate.slice(0, 10) >= cutoff);
  const strip = Array.from({ length: 28 }, (_, i) => {
    const d = addDays(TODAY, i - 27);
    const hit = entries.find((x) => x.entryDate.slice(0, 10) === d && x.mood);
    return { d, color: hit?.mood ? MOODS[hit.mood].color : undefined };
  });

  return (
    <>
      <h2 className="pt">Mood Tracker</h2>
      <p className="lead">A gentle look at how you've been feeling. It's for reflection, not diagnosis.</p>
      <div className="bar">
        <select aria-label="Date range" value={range} onChange={(e) => setRange(Number(e.target.value))}>
          {RANGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Mood mix</h3>
        {rows.length ? rows.map(({ mood: k, count: n }) => (
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