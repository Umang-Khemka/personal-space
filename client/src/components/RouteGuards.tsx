import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export function Splash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  return (
    <div className="splash" role="status" aria-label="Loading">
      <div className="spinner" />
    </div>
  );
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