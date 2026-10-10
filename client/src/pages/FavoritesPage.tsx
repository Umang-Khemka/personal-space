import { useEffect } from "react";
import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import { useEntryStore } from "../store/entry.store"; 

export default function FavoritesPage() {
  const { entries, fetchEntries } = useEntryStore();

  useEffect(() => {
    fetchEntries({ favorite: true, sort: "newest", limit: 100 });
  }, [fetchEntries]);

  const favs = entries.filter((e) => e.isFavorite);

  return (
    <>
      <h2 className="pt">Favorites</h2>
      <p className="lead">The entries you want close.</p>
      <EntryGrid entries={favs}
        empty={<EmptyState title="No favorites yet" message="Tap the star on any entry to keep it here." />} />
    </>
  );
}