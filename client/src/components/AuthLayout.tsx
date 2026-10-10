import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import Logo from "./Logo";
import { useTheme } from "../context/ThemeContext";

const MONTH_DOTS = ["", "a", "", "c", "a", "", "", "b", "", "a", "a", "", "c", "", "", "a", "", "b", "", "a", ""];

function ArtPanel() {
  return (
    <div className="art" aria-hidden="true">
      <div className="stage">
        <div className="pc p1">
          <small>Saturday, August 22</small>
          <h4>Slow brew Saturday</h4>
          <p>Woke before the alarm, ground fresh beans and watched steam curl up from the mug…</p>
          <div className="chips"><span>calm</span><span>mornings</span></div>
        </div>
        <div className="pc p2">
          <small>August</small>
          <div className="mc">
            {MONTH_DOTS.map((c, i) => <i key={i} className={c || undefined} />)}
          </div>
        </div>
        <div className="pc p3">
          <small>On this day, two years ago</small>
          <h4>The long train ride</h4>
          <p>Eleven hours, one notebook, and no signal. I wrote more that day than all month.</p>
        </div>
      </div>
      <div className="cap">
        <h2>A quiet place to think, write and remember.</h2>
        <p>Private by design. Only you can read what you write.</p>
      </div>
    </div>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const tab = ({ isActive }: { isActive: boolean }) => (isActive ? "on" : undefined);
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <div id="auth">
      <ArtPanel />
      <div className="formside">
        <button type="button" className="ico theme-toggle" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => setTheme(dark ? "light" : "dark")}>
          <Icon name={dark ? "sun" : "moon"} />
        </button>
        <div className="formbox">
          <Logo />
          <div className="atabs" role="tablist">
            <NavLink to="/login" className={tab}>Sign in</NavLink>
            <NavLink to="/register" className={tab}>Create account</NavLink>
          </div>
          {children}
          <p className="note">
            <Icon name="lock" size={15} />Your entries are private. No feeds, no sharing.
          </p>
        </div>
      </div>
    </div>
  );
}