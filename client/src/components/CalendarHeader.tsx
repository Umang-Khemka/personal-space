import { Link } from "react-router-dom";
import Icon from "./Icon";
import { monthYear } from "../lib/date";

interface Props {
  year: number;
  /** 0-11 */
  month: number;
  mode: "calendar" | "timeline";
  onPrev?: () => void;
  onNext?: () => void;
}

export default function CalendarHeader({ year, month, mode, onPrev, onNext }: Props) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 6 }}>
      <h2 className="pt">{monthYear(year, month)}</h2>
      <div className="row">
        <button type="button" className="ico" aria-label="Previous month" onClick={onPrev}><Icon name="left" /></button>
        <button type="button" className="ico" aria-label="Next month" onClick={onNext}><Icon name="right" /></button>
        <div className="seg">
          <Link to="/calendar" className={mode === "calendar" ? "on" : undefined}>Calendar</Link>
          <Link to="/calendar/timeline" className={mode === "timeline" ? "on" : undefined}>Timeline</Link>
        </div>
      </div>
    </div>
  );
}
