import { useEffect, useState } from "react";
import CalendarHeader from "../components/CalendarHeader";
import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import SectionHeader from "../components/SectionHeader";
import { MOODS } from "../data/mock";
import { formatDate } from "../lib/date";
import { useEntryStore } from "../store/entry.store"; 

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const pad = (n: number) => String(n).padStart(2, "0");
const toDs = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const TODAY = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD

export default function CalendarPage() {
  const now = new Date();
  const [{ year, month }, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selected, setSelected] = useState(TODAY);
  const { calendarEntries, entries, fetchCalendar, fetchEntries } = useEntryStore();

  // dots: refetch when the month changes
  useEffect(() => {
    fetchCalendar(`${year}-${pad(month + 1)}`);
  }, [year, month, fetchCalendar]);

  // list below: refetch when the selected day changes
  useEffect(() => {
    fetchEntries({ from: selected, to: selected, sort: "newest" });
  }, [selected, fetchEntries]);

  const changeMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
    setSelected(toDs(d.getFullYear(), d.getMonth(), 1));
  };

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <>
      <CalendarHeader
        year={year}
        month={month}
        mode="calendar"
        onPrev={() => changeMonth(-1)}
        onNext={() => changeMonth(1)}
      />
      <div className="cal">
        {WEEKDAYS.map((d, i) => <div className="h" key={i}>{d}</div>)}
        {Array.from({ length: firstWeekday }, (_, i) => <div className="day o" key={`o${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const ds = toDs(year, month, d);
          const es = calendarEntries.filter((e) => e.entryDate.slice(0, 10) === ds);
          const cls = ["day", ds === selected && "sel", ds === TODAY && "today"].filter(Boolean).join(" ");
          return (
            <button
              type="button"
              key={ds}
              className={cls}
              onClick={() => setSelected(ds)}
              aria-label={`${formatDate(ds)}, ${es.length} entries`}
            >
              <b>{d}</b>
              <span className="dots">
                {es.slice(0, 3).map((e) => (
                  <i key={e._id} style={{ background: e.mood ? MOODS[e.mood].color : "var(--sage)" }} />
                ))}
              </span>
            </button>
          );
        })}
      </div>
      <SectionHeader
        title={formatDate(selected, { weekday: "long", month: "long", day: "numeric" })}
        aside={<button type="button" className="btn sm">Write for this date</button>}
      />
      <EntryGrid
        entries={entries}
        empty={<EmptyState title="A quiet day" message="No entries for this date yet." />}
      />
    </>
  );
}