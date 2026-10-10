import { NavLink } from "react-router-dom";
import type { User } from "../types/auth";
import { useAuthStore } from "../store/auth.store";
import Icon, { type IconName } from "./Icon";
import Logo from "./Logo";

const NAV: { to: string; icon: IconName; label: string; end?: boolean }[] = [
  { to: "/", icon: "home", label: "Home", end: true },
  { to: "/diary", icon: "pen", label: "My Diary" },
  { to: "/calendar", icon: "cal", label: "Calendar" },
  { to: "/on-this-day", icon: "clock", label: "On This Day" },
  { to: "/mood", icon: "smile", label: "Mood Tracker" },
  { to: "/favorites", icon: "star", label: "Favorites" },
  { to: "/search", icon: "search", label: "Search" },
  { to: "/settings", icon: "gear", label: "Settings" },
];

export default function Sidebar({ user, collapsed = false, onToggle }: { user: User; collapsed?: boolean; onToggle?: () => void }) {
  const logout = useAuthStore((s) => s.logout);
  return (
    <aside className="side">
      <Logo />
      <nav className="nav">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} title={n.label}
            className={({ isActive }) => (isActive ? "on" : undefined)}>
            <span className="i"><Icon name={n.icon} /></span>
            <span className="t">{n.label}</span>
          </NavLink>
        ))}
        {/* TODO: wire to a collapsed state in AppLayout */}
        <button type="button" style={{ marginTop: "auto" }} onClick={onToggle}>
          <span className="i"><Icon name={collapsed ? "right" : "left"} /></span>
          <span className="t">Collapse</span>
        </button>
        <button type="button" onClick={logout}>
          <span className="i"><Icon name="out" /></span>
          <span className="t">Log out</span>
        </button>
      </nav>
      <div className="who">
        <span className="av">{user.username[0].toUpperCase()}</span>
        <span className="t">
          <b>{user.username}</b><br /><small style={{ color: "var(--mute)" }}>Private to you</small>
        </span>
      </div>
    </aside>
  );
}