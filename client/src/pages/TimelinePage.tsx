import CalendarHeader from "../components/CalendarHeader";
import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import { mockEntries, sortEntries } from "../data/mock";
import { formatDate } from "../lib/date";
import type { Entry } from "../types";

export default function TimelinePage() {
  const groups = sortEntries(mockEntries).reduce<Record<string, Entry[]>>((acc, e) => {
    (acc[e.entryDate] ??= []).push(e);
    return acc;
  }, {});
  const days = Object.keys(groups);
  return (
    <>
      <CalendarHeader year={2026} month={9} mode="timeline" />
      <div className="tl">
        {days.length ? days.map((d) => (
          <section key={d}>
            <h3>{formatDate(d, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</h3>
            <EntryGrid entries={groups[d]} />
          </section>
        )) : (
          <EmptyState title="No entries yet" message="Your timeline fills in as you write."
            actionLabel="Write an entry" />
        )}
      </div>
    </>
  );
}
