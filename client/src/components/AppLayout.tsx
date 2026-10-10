import { useState } from "react";
import { Outlet } from "react-router-dom";
import { EntryUIProvider } from "../context/EntryUIContext";
import { useAuthStore } from "../store/auth.store";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const [collapsed, setCollapsed] = useState(false);
  if (!user) return null;
  return (
    <EntryUIProvider>
      <div id="app" className={collapsed ? "col" : undefined}>
        <Sidebar user={user} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div className="scrim" />
        <main>
          <Topbar user={user} />
          <div id="view"><Outlet /></div>
        </main>
      </div>
    </EntryUIProvider>
  );
}