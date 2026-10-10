import type { Memory } from "../types/entry";
import { MOODS } from "../data/constants";
import { formatDate } from "../lib/date";
import { MoodFace } from "./Icon";

/** A full Entry, or a Memory (which has no tags). */
export type ViewableEntry = Memory & { tags?: string[] };

interface Props {
  entry: ViewableEntry;
  /** Omit onEdit/onDelete for a read-only view. */
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
}

export default function EntryViewModal({ entry, onEdit, onDelete, onClose }: Props) {
  return (
    <div className="ov">
      <div className="ed" role="dialog" aria-modal="true">
        <div className="m" style={{ color: "var(--mute)", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {formatDate(entry.entryDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          {" · "}{entry.type}
          {entry.mood && (<>{" · "}<MoodFace mood={entry.mood} /> {MOODS[entry.mood].label}</>)}
        </div>
        <h1 style={{ margin: "6px 0 16px" }}>{entry.title || "Untitled"}</h1>
        <div className={`view-body${entry.type === "coding" ? " code" : ""}`}>{entry.content}</div>
        {!!entry.tags?.length && (
          <div className="row" style={{ marginTop: 16 }}>
            {entry.tags.map((t) => <span className="tag" key={t}>#{t}</span>)}
          </div>
        )}
        <div className="foot">
          <span className="sp" />
          {onDelete && <button type="button" className="btn ghost" onClick={onDelete}>Delete</button>}
          <button type="button" className="btn ghost" onClick={onClose}>Close</button>
          {onEdit && <button type="button" className="btn" onClick={onEdit}>Edit</button>}
        </div>
      </div>
    </div>
  );
}