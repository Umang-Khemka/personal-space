import { useAuthStore } from "../store/auth.store";
import { useTheme } from "../context/ThemeContext";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  if (!user) return null;
  return (
    <>
      <h2 className="pt">Settings</h2>
      <p className="lead">Changes here only affect this prototype.</p>
      <div className="card" style={{ maxWidth: 520 }}>
        <h3 style={{ marginBottom: 12 }}>Account</h3>
        <label>Username</label>
        <input value={user.username} disabled readOnly />
        <div style={{ height: 10 }} />
        <label>Email</label>
        <input value={user.email} disabled readOnly />

        <h3 style={{ margin: "22px 0 10px" }}>Appearance</h3>
        <div className="seg">
          <button type="button" className={theme === "light" ? "on" : undefined}
            aria-pressed={theme === "light"} onClick={() => setTheme("light")}>Light</button>
          <button type="button" className={theme === "dark" ? "on" : undefined}
            aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>Dark</button>
        </div>

        <h3 style={{ margin: "22px 0 10px" }}>Coming later</h3>
        <div className="row">
          <button type="button" className="btn ghost sm" disabled>Change password</button>
          <button type="button" className="btn ghost sm" disabled>Delete account</button>
        </div>
        <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "22px 0" }} />
        <button type="button" className="btn ghost" onClick={logout}>Log out</button>
      </div>
    </>
  );
}