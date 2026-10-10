import { useEffect, useState } from "react";
import CalendarHeader from "../components/CalendarHeader";
import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import { formatDate } from "../lib/date";
import { useEntryStore } from "../store/entry.store";
import type { Entry } from "../types/entry";

const pad = (n: number) => String(n).padStart(2, "0");

export default function TimelinePage() {
  const now = new Date();
  const [{ year, month }, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const { entries, fetchEntries } = useEntryStore();

  const prefix = `${year}-${pad(month + 1)}`;
  const lastDay = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    fetchEntries({ from: `${prefix}-01`, to: `${prefix}-${pad(lastDay)}`, sort: "newest", limit: 100 });
  }, [prefix, lastDay, fetchEntries]);

  const changeMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
  };

  // client filter avoids flashing another page's entries before the fetch lands
  const groups = entries
    .filter((e) => e.entryDate.slice(0, 7) === prefix)
    .reduce<Record<string, Entry[]>>((acc, e) => {
      (acc[e.entryDate.slice(0, 10)] ??= []).push(e);
      return acc;
    }, {});
  const days = Object.keys(groups);

  return (
    <>
      <CalendarHeader
        year={year}
        month={month}
        mode="timeline"
        onPrev={() => changeMonth(-1)}
        onNext={() => changeMonth(1)}
      />
      <div className="tl">
        {days.length ? days.map((d) => (
          <section key={d}>
            <h3>{formatDate(d, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</h3>
            <EntryGrid entries={groups[d]} />
          </section>
        )) : (
          <EmptyState title="No entries this month" message="Your timeline fills in as you write."
            actionLabel="Write an entry" />
        )}
      </div>
    </>
  );
}