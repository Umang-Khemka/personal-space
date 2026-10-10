import type { MoodKey } from "../types";
import { MOODS } from "../data/mock";
import { MoodFace } from "./Icon";

interface Props {
  mood: MoodKey;
  selected?: boolean;
  onClick?: (mood: MoodKey) => void;
}

export default function MoodChip({ mood, selected = false, onClick }: Props) {
  return (
    <button type="button" className={`mood${selected ? " on" : ""}`} onClick={() => onClick?.(mood)}>
      <MoodFace mood={mood} /> {MOODS[mood].label}
    </button>
  );
}
