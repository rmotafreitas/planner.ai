import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { HomePage } from "./pages";
import { ThemeProvider } from "./components/theme-provider";

export function App() {
  /*
  const [userId, setUserId] = useState("");

  const providerUser = useMemo(
    () => ({
      userId,
      setUserId,
    }),
    [userId, setUserId]
  ); */
  return (
    <ThemeProvider defaultTheme="white" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="*" element={<NotFound />} />*/}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
