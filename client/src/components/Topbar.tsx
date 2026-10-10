import { Link } from "react-router-dom";
import type { User } from "../types/auth";
import { useEntryUI } from "../context/EntryUIContext";
import { greeting } from "../lib/greeting";
import Icon from "./Icon";

export default function Topbar({ user }: { user: User }) {
  const { openNew } = useEntryUI();
  return (
    <header className="top">
      <button type="button" className="ico burger" aria-label="Open menu"><Icon name="menu" /></button>
      <div className="g">
        <b>{greeting()}, {user.username}</b>
        <small>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </small>
      </div>
      <Link className="ico" to="/search" aria-label="Search"><Icon name="search" /></Link>
      <button type="button" className="btn nb" onClick={() => openNew()}>
        <Icon name="pen" size={16} /> <span>New entry</span>
      </button>
      <button type="button" className="av" aria-label="Profile menu">{user.username[0].toUpperCase()}</button>
      {/* TODO: profile dropdown (.menu) */}
    </header>
  );
}