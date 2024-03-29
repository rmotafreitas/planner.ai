import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { HomePage } from "./pages";
import { ThemeProvider } from "./components/theme-provider";
import { useMemo, useState } from "react";
import { UserIdContext } from "./contexts/user.context";
import { LoginPage } from "./pages/Login";
import { ProfilePage } from "./pages/me/Profile";
import { TripPageVisualizer } from "./pages/me/Trip";
import { LogPage } from "./pages/me/logs/Log";
import { NotFoundPage } from "./pages/NotFound";

export function App() {
  const [userId, setUserId] = useState("");

  const providerUser = useMemo(
    () => ({
      userId,
      setUserId,
    }),
    [userId, setUserId]
  );

  return (
    <ThemeProvider defaultTheme="white" storageKey="vite-ui-theme">
      <UserIdContext.Provider value={providerUser}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/me" element={<ProfilePage />} />
            <Route path="/me/trip/:tripId" element={<TripPageVisualizer />} />
            <Route path="/me/logs" element={<LogPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </UserIdContext.Provider>
    </ThemeProvider>
  );
}
