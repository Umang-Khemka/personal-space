import type { Entry } from "../types";
import { MOODS } from "../data/mock";
import { formatDate } from "../lib/date";
import { MoodFace } from "./Icon";

interface Props {
  entry: Entry;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export default function EntryViewModal({ entry, onEdit, onDelete, onClose }: Props) {
  return (
    <div className="ov">
      <div className="ed" role="dialog" aria-modal="true">
        <div className="m" style={{ color: "var(--mute)", display: "flex", gap: 6, alignItems: "center" }}>
          {formatDate(entry.entryDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          {" · "}{entry.type}
          {entry.mood && (<>{" · "}<MoodFace mood={entry.mood} /> {MOODS[entry.mood].label}</>)}
        </div>
        <h1 style={{ margin: "6px 0 16px" }}>{entry.title || "Untitled"}</h1>
        <div className={`view-body${entry.type === "coding" ? " code" : ""}`}>{entry.content}</div>
        <div className="row" style={{ marginTop: 16 }}>
          {entry.tags.map((t) => <span className="tag" key={t}>#{t}</span>)}
        </div>
        <div className="foot">
          <span className="sp" />
          <button type="button" className="btn ghost" onClick={onDelete}>Delete</button>
          <button type="button" className="btn ghost" onClick={onClose}>Close</button>
          <button type="button" className="btn" onClick={onEdit}>Edit</button>
        </div>
      </div>
    </div>
  );
}
