import type { Entry } from "../types";
import { formatDate } from "../lib/date";

export default function MemoryCard({ entry, onOpen }: { entry: Entry; onOpen?: (id: number) => void }) {
  const long = entry.content.length > 150;
  return (
    <div className="card memo">
      <div className="m" style={{ color: "var(--terra)", fontWeight: 600 }}>
        {formatDate(entry.entryDate, { month: "long", day: "numeric", year: "numeric" })}
      </div>
      <h3 style={{ margin: "4px 0" }}>{entry.title}</h3>
      <p style={{ color: "var(--mute)", margin: "0 0 12px" }}>
        {entry.content.slice(0, 150)}{long ? "…" : ""}
      </p>
      <button type="button" className="btn ghost sm" onClick={() => onOpen?.(entry.id)}>
        Read full memory
      </button>
    </div>
  );
}
