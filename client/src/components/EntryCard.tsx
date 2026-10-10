import type { Entry } from "../types/entry";
import { MOODS } from "../data/constants";
import { formatDate } from "../lib/date";
import { MoodFace, StarIcon } from "./Icon";

interface Props {
  entry: Entry;
  onOpen?: (entry: Entry) => void;
  onToggleFavorite?: (entry: Entry) => void;
}

export default function EntryCard({ entry, onOpen, onToggleFavorite }: Props) {
  return (
    <article className="card ent" tabIndex={0} onClick={() => onOpen?.(entry)}
      onKeyDown={(ev) => { if (ev.key === "Enter" && ev.target === ev.currentTarget) onOpen?.(entry); }}>
      <button
        type="button"
        className={`star${entry.isFavorite ? " on" : ""}`}
        aria-label={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={(ev) => {
          ev.stopPropagation();
          onToggleFavorite?.(entry);
        }}
      >
        <StarIcon on={entry.isFavorite} />
      </button>
      <div className="m">
        {formatDate(entry.entryDate)}
        {entry.mood && (<>&nbsp; <MoodFace mood={entry.mood} /> {MOODS[entry.mood].label}</>)}
        {entry.status === "draft" && <>&nbsp; (draft)</>}
      </div>
      <h3>{entry.title || "Untitled"}</h3>
      <p className={entry.type === "coding" ? "code" : undefined}>{entry.content}</p>
      <div className="row">
        <span className="ty">{entry.type}</span>
        {entry.tags.map((t) => <span className="tag" key={t}>#{t}</span>)}
      </div>
    </article>
  );
}