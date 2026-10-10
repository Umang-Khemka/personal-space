import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null; // ProtectedRoute guarantees a user; this satisfies the type
  return (
    <div id="app">
      <Sidebar user={user} />
      <div className="scrim" />
      <main>
        <Topbar user={user} />
        <div id="view"><Outlet /></div>
      </main>
    </div>
  );
}