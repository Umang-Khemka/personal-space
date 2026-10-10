import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import { StarIcon } from "../components/Icon";
import { useEntryUI } from "../context/EntryUIContext";
import { ENTRY_TYPES, MOODS, MOOD_KEYS } from "../data/constants";
import { useEntryStore } from "../store/entry.store";
import type { EntryFilters, EntryType, Mood } from "../types/entry";

const PAGE_SIZE = 6;

export default function DiaryPage() {
  const { entries, pagination, loading, error, fetchEntries } = useEntryStore();
  const { openNew, openView, toggleFavorite } = useEntryUI();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<EntryType | "">("");
  const [mood, setMood] = useState<Mood | "">("");
  const [favorite, setFavorite] = useState(false);
  const [sort, setSort] = useState<NonNullable<EntryFilters["sort"]>>("newest");

  // Wait for a pause in typing before hitting the API.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filters = useMemo<EntryFilters>(
    () => ({
      search: search || undefined,
      type: type || undefined,
      mood: mood || undefined,
      favorite: favorite || undefined,
      sort,
    }),
    [search, type, mood, favorite, sort],
  );

  const reload = () => fetchEntries({ ...filters, page: 1, limit: PAGE_SIZE });

  // First load, and again whenever a filter changes (always back to page 1).
  useEffect(() => {
    fetchEntries({ ...filters, page: 1, limit: PAGE_SIZE });
  }, [fetchEntries, filters]);

  const loadMore = () =>
    fetchEntries({ ...filters, page: (pagination?.page ?? 1) + 1, limit: PAGE_SIZE }, true);

  const hasFilters = !!(search || type || mood || favorite);
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setType("");
    setMood("");
    setFavorite(false);
  };
  const left = pagination ? Math.max(0, pagination.total - entries.length) : 0;

  return (
    <>
      <h2 className="pt">My Diary</h2>
      <p className="lead">Everything you've written, only visible to you.</p>

      <div className="bar">
        <input id="fq" type="search" placeholder="Search titles and content" aria-label="Search entries"
          value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value as EntryType | "")}>
          <option value="">All types</option>
          {ENTRY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select aria-label="Mood" value={mood} onChange={(e) => setMood(e.target.value as Mood | "")}>
          <option value="">Any mood</option>
          {MOOD_KEYS.map((k) => <option key={k} value={k}>{MOODS[k].label}</option>)}
        </select>
        <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <button type="button" className="btn ghost" aria-pressed={favorite}
          style={favorite ? { background: "var(--sl)", borderColor: "var(--sage)", color: "var(--sd)" } : undefined}
          onClick={() => setFavorite((f) => !f)}>
          <StarIcon on={favorite} /> {favorite ? "Favorites only" : "Favorites"}
        </button>
      </div>

      {loading && !entries.length ? (
        <p style={{ color: "var(--mute)" }} role="status">Loading your entries…</p>
      ) : error && !entries.length ? (
        <div className="banner" role="alert">
          {error}{" "}
          <button type="button" className="link" style={{ background: "none", border: 0 }} onClick={reload}>
            Try again
          </button>
        </div>
      ) : (
        <EntryGrid entries={entries} onOpen={openView} onToggleFavorite={toggleFavorite}
          empty={hasFilters ? (
            <EmptyState title="No entries match"
              message="Try clearing a filter or searching for something else."
              actionLabel="Clear filters" onAction={clearFilters} />
          ) : (
            <EmptyState title="Your diary is waiting"
              message="Nothing here yet. The first line is always the hardest, and it can be small."
              actionLabel="Write your first entry" onAction={() => openNew({ onSaved: reload })} />
          )} />
      )}

      {pagination?.hasMore && (
        <p style={{ textAlign: "center", marginTop: 20 }}>
          <button type="button" className="btn ghost" disabled={loading} onClick={loadMore}>
            {loading ? "Loading…" : `Load more (${left} left)`}
          </button>
        </p>
      )}
    </>
  );
}