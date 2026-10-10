import type { ReactNode } from "react";
import type { Entry } from "../types";
import EntryCard from "./EntryCard";

interface Props {
  entries: Entry[];
  empty?: ReactNode;
  onOpen?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
}

export default function EntryGrid({ entries, empty, onOpen, onToggleFavorite }: Props) {
  if (!entries.length) return <>{empty}</>;
  return (
    <div className="grid">
      {entries.map((e) => (
        <EntryCard key={e.id} entry={e} onOpen={onOpen} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}
