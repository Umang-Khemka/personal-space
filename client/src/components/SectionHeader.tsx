import type { ReactNode } from "react";

export default function SectionHeader({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="sec">
      <h3>{title}</h3>
      {aside}
    </div>
  );
}
