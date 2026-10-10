import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import Icon, { type IconName } from "../components/Icon";
import MemoryCard from "../components/MemoryCard";
import MoodChip from "../components/MoodChip";
import SectionHeader from "../components/SectionHeader";
import { useEntryUI } from "../context/EntryUIContext";
import { MOODS, MOOD_KEYS, PROMPTS } from "../data/constants";
import { greeting } from "../lib/greeting";
import { useEntryStore } from "../store/entry.store";
import type { EntryType, Mood } from "../types/entry";

const QUICK: { type: EntryType; icon: IconName; label: string }[] = [
  { type: "diary", icon: "pen", label: "Write a diary entry" },
  { type: "thought", icon: "idea", label: "Capture a thought" },
  { type: "memory", icon: "leaf", label: "Save a memory" },
  { type: "coding", icon: "code", label: "Add coding notes" },
];

export default function DashboardPage() {
  const { entries, memories, loading, error, fetchEntries, fetchMemories } = useEntryStore();
  const { openNew, openView, toggleFavorite, toast } = useEntryUI();
  const [mood, setMood] = useState<Mood | undefined>();
  const [promptIdx, setPromptIdx] = useState(0);

  const loadRecent = () => fetchEntries({ limit: 4, sort: "newest" });

  useEffect(() => {
    fetchEntries({ limit: 4, sort: "newest" });
    fetchMemories();
  }, [fetchEntries, fetchMemories]);

  const recent = entries.slice(0, 4);
  const memory = memories[0];
  const prompt = PROMPTS[promptIdx % PROMPTS.length];

  // The mood chosen above is attached to the next entry, then cleared once it's saved.
  const write = (opts: { type?: EntryType; placeholder?: string } = {}) =>
    openNew({ ...opts, mood, onSaved: () => setMood(undefined) });

  const pickMood = (m: Mood) => {
    const next = mood === m ? undefined : m;
    setMood(next);
    if (next) toast(`Noted: feeling ${MOODS[next].label.toLowerCase()}. It will attach to your next entry.`);
  };

  return (
    <>
      <section className="card hero">
        <h2>{greeting()}. Take a moment for yourself.</h2>
        <p className="lead" style={{ margin: "6px 0 0" }}>What has been on your mind today?</p>
        <div className="quick">
          {QUICK.map((q) => (
            <button type="button" key={q.type} onClick={() => write({ type: q.type })}>
              <span style={{ color: "var(--sd)" }}><Icon name={q.icon} size={22} /></span>
              {q.label}
            </button>
          ))}
        </div>
      </section>

      <SectionHeader title="How are you feeling?"
        aside={<small style={{ color: "var(--mute)" }}>Optional. It attaches to your next entry.</small>} />
      <div className="moods">
        {MOOD_KEYS.map((m) => <MoodChip key={m} mood={m} selected={mood === m} onClick={pickMood} />)}
      </div>

      <SectionHeader title="Recent entries" aside={<Link className="link" to="/diary">See all</Link>} />
      {loading && !recent.length ? (
        <p style={{ color: "var(--mute)" }} role="status">Loading your entries…</p>
      ) : error && !recent.length ? (
        <div className="banner" role="alert">
          {error}{" "}
          <button type="button" className="link" style={{ background: "none", border: 0 }} onClick={loadRecent}>
            Try again
          </button>
        </div>
      ) : (
        <EntryGrid entries={recent} onOpen={openView} onToggleFavorite={toggleFavorite}
          empty={
            <EmptyState title="Your diary is waiting"
              message="Nothing here yet. The first line is always the hardest, and it can be small."
              actionLabel="Write your first entry" onAction={() => write()} />
          } />
      )}

      <div className="grid" style={{ marginTop: 30, gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
        <div>
          <h3 style={{ marginBottom: 12 }}>On this day</h3>
          {memory ? <MemoryCard entry={memory} onOpen={openView} /> : (
            <EmptyState title="Nothing from past years yet"
              message="Entries you write today will show up here next year." />
          )}
        </div>
        <div>
          <h3 style={{ marginBottom: 12 }}>A prompt, if you want one</h3>
          <div className="card">
            <p style={{ fontFamily: "var(--serif)", fontSize: 20, margin: "0 0 14px" }}>{prompt}</p>
            <div className="row">
              <button type="button" className="btn sm" onClick={() => write({ placeholder: prompt })}>
                Write about this
              </button>
              <button type="button" className="btn ghost sm" onClick={() => setPromptIdx((i) => i + 1)}>
                Another prompt
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}