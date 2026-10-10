import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export function Splash() {
  return <div className="splash" role="status">Opening your space…</div>;
}

/** Only logged-in users get through; everyone else goes to /login. */
export function ProtectedRoute() {
  const { user, checkingAuth } = useAuthStore();
  if (checkingAuth) return <Splash />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Login/register are for logged-out users only. */
export function GuestRoute() {
  const { user, checkingAuth } = useAuthStore();
  if (checkingAuth) return <Splash />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}