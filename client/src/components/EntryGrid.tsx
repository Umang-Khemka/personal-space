import type { ReactNode } from "react";
import type { Entry } from "../types/entry";
import EntryCard from "./EntryCard";

interface Props {
  entries: Entry[];
  empty?: ReactNode;
  onOpen?: (entry: Entry) => void;
  onToggleFavorite?: (entry: Entry) => void;
}

export default function EntryGrid({ entries, empty, onOpen, onToggleFavorite }: Props) {
  if (!entries.length) return <>{empty}</>;
  return (
    <div className="grid">
      {entries.map((e) => (
        <EntryCard key={e._id} entry={e} onOpen={onOpen} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}