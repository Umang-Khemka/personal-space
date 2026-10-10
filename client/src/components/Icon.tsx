import type { MoodKey } from "../types/entry";
import { MOODS } from "../data/mock";

const PATHS = {
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  pen: "M4 20l1-4L16 5l3 3L8 19zM14 7l3 3",
  cal: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  clock: "M4 12a8 8 0 1 0 3-6M4 4v4h4M12 8v4l3 2",
  smile: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8.5 14q3.5 3 7 0M9 10h.01M15 10h.01",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  gear: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1",
  out: "M10 4H5v16h5M15 8l4 4-4 4M19 12H9",
  menu: "M4 7h16M4 12h16M4 17h16",
  idea: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z",
  leaf: "M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7",
  code: "M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4",
  moon: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
  lock: "M5 11h14v9H5zM8 11V8a4 4 0 0 1 8 0v3",
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  fill?: string;
}

export default function Icon({ name, size = 18, fill = "none" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

export const StarIcon = ({ on }: { on: boolean }) => (
  <Icon name="star" fill={on ? "currentColor" : "none"} />
);

const MOUTH: Record<MoodKey, string> = {
  happy: "M8 14q4 4 8 0",
  calm: "M9 14q3 2 6 0",
  excited: "M8 13h8q-1 5-4 5t-4-5z",
  grateful: "M8 14q4 4 8 0",
  neutral: "M9 15h6",
  sad: "M8 17q4-4 8 0",
  anxious: "M8 16q2-2 4 0t4 0",
  stressed: "M9 16h6",
  tired: "M9 16h6",
  angry: "M8 17q4-3 8 0",
  other: "M10 15h.01M12 15h.01M14 15h.01",
};

export function MoodFace({ mood }: { mood: MoodKey }) {
  const c = MOODS[mood].color;
  const closedEyes = mood === "tired" || mood === "grateful" || mood === "calm";
  const eyes = closedEyes ? "M7.5 10h3M13.5 10h3" : "M9 10h.01M15 10h.01";
  const brows =
    mood === "angry" ? "M7.5 7.5l3 1.5M16.5 7.5l-3 1.5"
    : mood === "stressed" ? "M7.5 8.5l3-1M16.5 8.5l-3-1"
    : "";
  return (
    <svg className="face" width="18" height="18" viewBox="0 0 24 24" fill={c} fillOpacity={0.22}
      stroke={c} strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <path fill="none" d={eyes + brows + MOUTH[mood]} />
    </svg>
  );
}