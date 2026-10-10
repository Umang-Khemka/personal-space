import { useEffect, useState } from "react";
import type { Entry, EntryInput, EntryStatus, EntryType, Mood } from "../types/entry";
import { ENTRY_TYPES, MOOD_KEYS } from "../data/constants";
import { todayISO } from "../lib/date";
import ConfirmDialog from "./ConfirmDialog";
import { StarIcon } from "./Icon";
import MoodChip from "./MoodChip";

export interface EditorInitial {
  type?: EntryType;
  mood?: Mood;
  /** YYYY-MM-DD */
  entryDate?: string;
}

interface Props {
  /** Pass an entry to edit it; omit to create a new one. */
  entry?: Entry;
  initial?: EditorInitial;
  placeholder?: string;
  saving?: boolean;
  /** Server error to show under the form. */
  error?: string | null;
  onSave: (data: EntryInput) => void;
  onCancel: () => void;
}

const DEFAULT_PLACEHOLDER = "Start writing. This is only for you.";

const parseTags = (s: string) =>
  s.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);

export default function EntryEditorModal({
  entry, initial, placeholder = DEFAULT_PLACEHOLDER, saving = false, error, onSave, onCancel,
}: Props) {
  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [type, setType] = useState<EntryType>(entry?.type ?? initial?.type ?? "diary");
  const [date, setDate] = useState((entry?.entryDate ?? initial?.entryDate ?? todayISO()).slice(0, 10));
  const [tags, setTags] = useState(entry?.tags.join(", ") ?? "");
  const [mood, setMood] = useState<Mood | undefined>(entry?.mood ?? initial?.mood);
  const [fav, setFav] = useState(entry?.isFavorite ?? false);
  const [dirty, setDirty] = useState(false);
  const [localError, setLocalError] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const touch = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setDirty(true);
    setLocalError("");
  };

  const requestClose = () => (dirty ? setConfirmDiscard(true) : onCancel());

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape" && !confirmDiscard) requestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const submit = (status: EntryStatus) => {
    const text = content.trim();
    if (!text) {
      setLocalError("Write something first. Content is required.");
      return;
    }
    onSave({
      title: title.trim().slice(0, 150),
      content: text,
      type,
      entryDate: date || todayISO(),
      tags: parseTags(tags),
      mood,
      isFavorite: fav,
      status,
    });
  };

  const prompted = placeholder !== DEFAULT_PLACEHOLDER; // a writing prompt was given: focus the body
  const trimmed = content.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;

  return (
    <div className="ov">
      <div className="ed" role="dialog" aria-modal="true" aria-label="Entry editor">
        <input className="tt" maxLength={150} placeholder="Give it a title (optional)" aria-label="Title"
          value={title} onChange={(e) => touch(setTitle)(e.target.value)} autoFocus={!prompted} />
        <textarea autoFocus={prompted} placeholder={placeholder} aria-label="Entry content" value={content}
          onChange={(e) => touch(setContent)(e.target.value)} />
        <div className="meta">
          <div>
            <label htmlFor="etype">Type</label>
            <select id="etype" value={type} onChange={(e) => touch(setType)(e.target.value as EntryType)}>
              {ENTRY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="edate">Date</label>
            <input type="date" id="edate" value={date} onChange={(e) => touch(setDate)(e.target.value)} />
          </div>
        </div>
        <label htmlFor="etags">Tags</label>
        <input id="etags" placeholder="Separate with commas" value={tags}
          onChange={(e) => touch(setTags)(e.target.value)} />
        <div style={{ height: 12 }} />
        <label>Mood (optional)</label>
        <div className="moods">
          {MOOD_KEYS.map((m) => (
            <MoodChip key={m} mood={m} selected={mood === m}
              onClick={(k) => touch(setMood)(mood === k ? undefined : k)} />
          ))}
        </div>
        <p className="err" role="alert">{localError || error}</p>
        <div className="foot">
          <button type="button" className="btn ghost sm" aria-pressed={fav}
            onClick={() => touch(setFav)(!fav)}><StarIcon on={fav} /> Favorite</button>
          <span className="sp">{words} words · {trimmed.length} characters</span>
          <button type="button" className="btn ghost" onClick={requestClose}>Cancel</button>
          <button type="button" className="btn ghost" disabled={saving} onClick={() => submit("draft")}>Save as draft</button>
          <button type="button" className="btn" disabled={saving} onClick={() => submit("complete")}>
            {saving ? "Saving…" : "Save entry"}
          </button>
        </div>
      </div>
      {confirmDiscard && (
        <ConfirmDialog title="Discard changes?" message="You have unsaved changes in this entry."
          confirmLabel="Discard" onConfirm={onCancel} onCancel={() => setConfirmDiscard(false)} />
      )}
    </div>
  );
}