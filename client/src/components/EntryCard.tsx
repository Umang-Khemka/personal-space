import type { Entry } from "../types";
import { MOODS } from "../data/mock";
import { formatDate } from "../lib/date";
import { MoodFace, StarIcon } from "./Icon";

interface Props {
  entry: Entry;
  onOpen?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
}

export default function EntryCard({ entry, onOpen, onToggleFavorite }: Props) {
  const mood = entry.mood ? MOODS[entry.mood] : null;
  return (
    <article className="card ent" tabIndex={0} onClick={() => onOpen?.(entry.id)}>
      <button
        type="button"
        className={`star${entry.isFavorite ? " on" : ""}`}
        aria-label="Toggle favorite"
        onClick={(ev) => {
          ev.stopPropagation();
          onToggleFavorite?.(entry.id);
        }}
      >
        <StarIcon on={entry.isFavorite} />
      </button>
      <div className="m">
        {formatDate(entry.entryDate)}
        {mood && entry.mood && (<>&nbsp; <MoodFace mood={entry.mood} /> {mood.label}</>)}
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
