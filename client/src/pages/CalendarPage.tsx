import CalendarHeader from "../components/CalendarHeader";
import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import SectionHeader from "../components/SectionHeader";
import { MOODS, mockEntries } from "../data/mock";
import { MOCK_TODAY, formatDate } from "../lib/date";

const YEAR = 2026;
const MONTH = 9; // October (0-based)
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const pad = (n: number) => String(n).padStart(2, "0");

export default function CalendarPage() {
  const selected = MOCK_TODAY;
  const firstWeekday = new Date(YEAR, MONTH, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const dayEntries = mockEntries.filter((e) => e.entryDate === selected);

  return (
    <>
      <CalendarHeader year={YEAR} month={MONTH} mode="calendar" />
      <div className="cal">
        {WEEKDAYS.map((d, i) => <div className="h" key={i}>{d}</div>)}
        {Array.from({ length: firstWeekday }, (_, i) => <div className="day o" key={`o${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const ds = `${YEAR}-${pad(MONTH + 1)}-${pad(d)}`;
          const es = mockEntries.filter((e) => e.entryDate === ds);
          const cls = ["day", ds === selected && "sel", ds === MOCK_TODAY && "today"].filter(Boolean).join(" ");
          return (
            <button type="button" key={ds} className={cls} aria-label={`${formatDate(ds)}, ${es.length} entries`}>
              <b>{d}</b>
              <span className="dots">
                {es.slice(0, 3).map((e) => (
                  <i key={e.id} style={{ background: e.mood ? MOODS[e.mood].color : "var(--sage)" }} />
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
      <EntryGrid entries={dayEntries}
        empty={<EmptyState title="A quiet day" message="No entries for this date yet." />} />
    </>
  );
}
