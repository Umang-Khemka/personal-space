import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import { mockEntries, sortEntries } from "../data/mock";

export default function FavoritesPage() {
  const favs = sortEntries(mockEntries.filter((e) => e.isFavorite));
  return (
    <>
      <h2 className="pt">Favorites</h2>
      <p className="lead">The entries you want close.</p>
      <EntryGrid entries={favs}
        empty={<EmptyState title="No favorites yet" message="Tap the star on any entry to keep it here." />} />
    </>
  );
}
