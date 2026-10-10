export default function SearchPage() {
  return (
    <>
      <h2 className="pt">Search</h2>
      <p className="lead">Titles, content and tags.</p>
      <div className="bar">
        <input id="sq" type="search" placeholder="Start typing…" aria-label="Search" />
        <button type="button" className="btn ghost">Clear</button>
      </div>
      {/* Results: <EntryGrid entries={results} empty={<EmptyState title="No results" … />} /> */}
      <p style={{ color: "var(--mute)" }}>Your results will appear here.</p>
    </>
  );
}
