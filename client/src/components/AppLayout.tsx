import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { EntryUIProvider } from "../context/EntryUIContext";
import { useAuthStore } from "../store/auth.store";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!user) return null;

  return (
    <EntryUIProvider>
      <div id="app" className={collapsed ? "col" : undefined}>
        <Sidebar
          user={user}
          collapsed={collapsed}
          open={mobileOpen}
          onToggle={() => setCollapsed((c) => !c)}
        />
        <div className={mobileOpen ? "scrim open" : "scrim"} onClick={() => setMobileOpen(false)} />
        <main>
          <Topbar user={user} onMenu={() => setMobileOpen(true)} />
          <div id="view"><Outlet /></div>
        </main>
      </div>
    </EntryUIProvider>
  );
}