import { Link } from "react-router-dom";
import type { User } from "../types/auth";
import Icon from "./Icon";
import { formatDate, MOCK_TODAY } from "../lib/date";

export default function Topbar({ user, greeting = "Good morning" }: { user: User; greeting?: string }) {
  return (
    <header className="top">
      <button type="button" className="ico burger" aria-label="Open menu"><Icon name="menu" /></button>
      <div className="g">
        <b>{greeting}, {user.username}</b>
        <small>
          {formatDate(MOCK_TODAY, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </small>
      </div>
      <Link className="ico" to="/search" aria-label="Search"><Icon name="search" /></Link>
      <Link className="btn nb" to="/"><Icon name="pen" size={16} /> <span>New entry</span></Link>
      <button type="button" className="av" aria-label="Profile menu">{user.username[0].toUpperCase()}</button>
      {/* TODO: profile dropdown (.menu) */}
    </header>
  );
}