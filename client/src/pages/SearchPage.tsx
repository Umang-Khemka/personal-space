import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import { useEntryStore } from "../store/entry.store";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const { entries, loading, fetchEntries } = useEntryStore();

  // debounce: only update `term` after the user stops typing
  useEffect(() => {
    const t = setTimeout(() => setTerm(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (term) fetchEntries({ search: term, sort: "newest", limit: 50 });
  }, [term, fetchEntries]);

  const clear = () => {
    setQuery("");
    setTerm("");
  };

  return (
    <>
      <h2 className="pt">Search</h2>
      <p className="lead">Titles, content and tags.</p>
      <div className="bar">
        <input
          id="sq"
          type="search"
          placeholder="Start typing…"
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn ghost" onClick={clear}>Clear</button>
      </div>
      {!term ? (
        <p style={{ color: "var(--mute)" }}>Your results will appear here.</p>
      ) : loading ? (
        <p style={{ color: "var(--mute)" }}>Searching…</p>
      ) : (
        <EntryGrid entries={entries}
          empty={<EmptyState title="No results" message={`Nothing matched "${term}".`} />} />
      )}
    </>
  );
}