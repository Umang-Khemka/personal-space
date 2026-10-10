import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { GuestRoute, ProtectedRoute } from "./components/RouteGuards";
import { useAuthStore } from "./store/auth.store";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DiaryPage from "./pages/DiaryPage";
import CalendarPage from "./pages/CalendarPage";
import TimelinePage from "./pages/TimelinePage";
import MemoriesPage from "./pages/MemoriesPage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="diary" element={<DiaryPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="calendar/timeline" element={<TimelinePage />} />
          <Route path="on-this-day" element={<MemoriesPage />} />
          <Route path="mood" element={<MoodTrackerPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}