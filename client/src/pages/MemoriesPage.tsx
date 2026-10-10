import { useEffect } from "react";
import EmptyState from "../components/EmptyState";
import MemoryCard from "../components/MemoryCard";
import { formatDate } from "../lib/date";
import { useEntryStore } from "../store/entry.store"; 

const TODAY = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD

export default function MemoriesPage() {
  const { memories, fetchMemories } = useEntryStore();

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  return (
    <>
      <h2 className="pt">On This Day</h2>
      <p className="lead">
        Moments from {formatDate(TODAY, { month: "long", day: "numeric" })} in earlier years.
      </p>
      {memories.length ? (
        <div className="grid">
          {memories.map((e) => <div key={e._id}><MemoryCard entry={e} /></div>)}
        </div>
      ) : (
        <EmptyState title="No memories for today"
          message="Entries from this date in past years will appear here."
          actionLabel="Write something today" />
      )}
    </>
  );
}