import EmptyState from "../components/EmptyState";
import MemoryCard from "../components/MemoryCard";
import { mockMemories } from "../data/mock";
import { MOCK_TODAY, formatDate } from "../lib/date";

export default function MemoriesPage() {
  return (
    <>
      <h2 className="pt">On This Day</h2>
      <p className="lead">
        Moments from {formatDate(MOCK_TODAY, { month: "long", day: "numeric" })} in earlier years.
      </p>
      {mockMemories.length ? (
        <div className="grid">
          {mockMemories.map((e) => <div key={e.id}><MemoryCard entry={e} /></div>)}
        </div>
      ) : (
        <EmptyState title="No memories for today"
          message="Entries from this date in past years will appear here."
          actionLabel="Write something today" />
      )}
    </>
  );
}
