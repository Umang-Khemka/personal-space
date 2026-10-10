import type { Entry } from "../types";
import { ENTRY_TYPES, MOOD_KEYS } from "../data/mock";
import { MOCK_TODAY } from "../lib/date";
import { StarIcon } from "./Icon";
import MoodChip from "./MoodChip";

interface Props {
  /** Omit for a blank "new entry" editor. */
  entry?: Entry;
  placeholder?: string;
  error?: string;
  onSave?: (status: Entry["status"]) => void;
  onCancel?: () => void;
}

export default function EntryEditorModal({
  entry, placeholder = "Start writing. This is only for you.", error, onSave, onCancel,
}: Props) {
  const words = entry?.content.trim() ? entry.content.trim().split(/\s+/).length : 0;
  return (
    <div className="ov">
      <div className="ed" role="dialog" aria-modal="true" aria-label="Entry editor">
        <input className="tt" id="etitle" maxLength={150} placeholder="Give it a title (optional)"
          defaultValue={entry?.title} aria-label="Title" />
        <textarea id="econtent" placeholder={placeholder} defaultValue={entry?.content} aria-label="Entry content" />
        <div className="meta">
          <div>
            <label htmlFor="etype">Type</label>
            <select id="etype" defaultValue={entry?.type ?? "diary"}>
              {ENTRY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="edate">Date</label>
            <input type="date" id="edate" defaultValue={entry?.entryDate ?? MOCK_TODAY} />
          </div>
        </div>
        <label htmlFor="etags">Tags</label>
        <input id="etags" placeholder="Separate with commas" defaultValue={entry?.tags.join(", ")} />
        <div style={{ height: 12 }} />
        <label>Mood (optional)</label>
        <div className="moods">
          {MOOD_KEYS.map((m) => <MoodChip key={m} mood={m} selected={entry?.mood === m} />)}
        </div>
        <p className="err">{error}</p>
        <div className="foot">
          <button type="button" className="btn ghost sm"><StarIcon on={!!entry?.isFavorite} /> Favorite</button>
          <span className="sp">{words} words</span>
          <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn ghost" onClick={() => onSave?.("draft")}>Save as draft</button>
          <button type="button" className="btn" onClick={() => onSave?.("complete")}>Save entry</button>
        </div>
      </div>
    </div>
  );
}
