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

  // close the drawer after navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!user) return null;

  const cls = [collapsed && "col", mobileOpen && "open"].filter(Boolean).join(" ");

  return (
    <EntryUIProvider>
      <div id="app" className={cls || undefined}>
        <Sidebar user={user} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div className="scrim" onClick={() => setMobileOpen(false)} />
        <main>
          <Topbar user={user} onMenu={() => setMobileOpen(true)} />
          <div id="view"><Outlet /></div>
        </main>
      </div>
    </EntryUIProvider>
  );
}