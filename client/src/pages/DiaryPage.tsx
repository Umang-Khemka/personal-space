import EntryGrid from "../components/EntryGrid";
import EmptyState from "../components/EmptyState";
import { StarIcon } from "../components/Icon";
import { ENTRY_TYPES, MOODS, MOOD_KEYS, mockEntries, sortEntries } from "../data/mock";

const PAGE_SIZE = 6;

export default function DiaryPage() {
  const all = sortEntries(mockEntries);
  const tags = [...new Set(mockEntries.flatMap((e) => e.tags))].sort();
  const visible = all.slice(0, PAGE_SIZE);
  const left = all.length - visible.length;
  return (
    <>
      <h2 className="pt">My Diary</h2>
      <p className="lead">Everything you've written, only visible to you.</p>
      <div className="bar">
        <input id="fq" type="search" placeholder="Search titles and content" aria-label="Search entries" />
        <select aria-label="Type">
          <option value="">All types</option>
          {ENTRY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select aria-label="Mood">
          <option value="">Any mood</option>
          {MOOD_KEYS.map((k) => <option key={k} value={k}>{MOODS[k].label}</option>)}
        </select>
        <select aria-label="Tag">
          <option value="">Any tag</option>
          {tags.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select aria-label="Sort">
          <option value="new">Newest first</option>
          <option value="old">Oldest first</option>
        </select>
        <button type="button" className="btn ghost"><StarIcon on={false} /> Favorites</button>
      </div>
      <EntryGrid entries={visible} empty={
        <EmptyState title="Your diary is waiting"
          message="Nothing here yet. The first line is always the hardest, and it can be small."
          actionLabel="Write your first entry" />
      } />
      {left > 0 && (
        <p style={{ textAlign: "center", marginTop: 20 }}>
          <button type="button" className="btn ghost">Load more ({left} left)</button>
        </p>
      )}
    </>
  );
}
