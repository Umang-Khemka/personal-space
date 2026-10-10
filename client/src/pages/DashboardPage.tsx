import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import EntryGrid from "../components/EntryGrid";
import Icon, { type IconName } from "../components/Icon";
import MemoryCard from "../components/MemoryCard";
import MoodChip from "../components/MoodChip";
import SectionHeader from "../components/SectionHeader";
import { MOOD_KEYS, PROMPTS, mockEntries, mockMemories, sortEntries } from "../data/mock";

const QUICK: { type: string; icon: IconName; label: string }[] = [
  { type: "diary", icon: "pen", label: "Write a diary entry" },
  { type: "thought", icon: "idea", label: "Capture a thought" },
  { type: "memory", icon: "leaf", label: "Save a memory" },
  { type: "coding", icon: "code", label: "Add coding notes" },
];

export default function DashboardPage() {
  const recent = sortEntries(mockEntries).slice(0, 4);
  const memory = mockMemories[0];
  return (
    <>
      <section className="card hero">
        <h2>Good morning. Take a moment for yourself.</h2>
        <p className="lead" style={{ margin: "6px 0 0" }}>What has been on your mind today?</p>
        <div className="quick">
          {QUICK.map((q) => (
            <button type="button" key={q.type}>
              <span style={{ color: "var(--sd)" }}><Icon name={q.icon} size={22} /></span>
              {q.label}
            </button>
          ))}
        </div>
      </section>

      <SectionHeader title="How are you feeling?"
        aside={<small style={{ color: "var(--mute)" }}>Optional. It attaches to your next entry.</small>} />
      <div className="moods">
        {MOOD_KEYS.map((m) => <MoodChip key={m} mood={m} />)}
      </div>

      <SectionHeader title="Recent entries" aside={<Link className="link" to="/diary">See all</Link>} />
      <EntryGrid entries={recent} />

      <div className="grid" style={{ marginTop: 30, gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
        <div>
          <h3 style={{ marginBottom: 12 }}>On this day</h3>
          {memory ? <MemoryCard entry={memory} /> : (
            <EmptyState title="Nothing from past years yet"
              message="Entries you write today will show up here next year." />
          )}
        </div>
        <div>
          <h3 style={{ marginBottom: 12 }}>A prompt, if you want one</h3>
          <div className="card">
            <p style={{ fontFamily: "var(--serif)", fontSize: 20, margin: "0 0 14px" }}>{PROMPTS[0]}</p>
            <div className="row">
              <button type="button" className="btn sm">Write about this</button>
              <button type="button" className="btn ghost sm">Another prompt</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
