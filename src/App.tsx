/**
 * App.tsx — root component.
 *
 * Wraps the entire application in SessionProvider so that all descendant components
 * can access session state and actions via the useSession hook.
 *
 * AppRouter reads currentPage from the session store and renders the appropriate
 * page component. Navigation is state-driven (no URL router) because the app is
 * deployed as a static single-page application with no server-side routing.
 */
import { useSession, SessionProvider } from "./state/sessionStore";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LandingPage } from "./pages/LandingPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { SetupPage } from "./pages/SetupPage";
import { ContactPage } from "./pages/ContactPage";
import { createBlankSession } from "./logic/defaultSession";
import { getLanguageAndThemeFromPath } from "./logic/theme";
import type { BugHuntSession } from "./types/session";
import type { AppPage } from "./state/sessionStore";
import "./styles/globals.css";

const PAGES_WITH_LEAVE_WARNING: AppPage[] = ["setup", "leaderboard", "contact"];

function AppRouter() {
  const { currentPage, startSession, loadSession } = useSession();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { language, theme } = getLanguageAndThemeFromPath(location.pathname);

  const handleStartNewSession = () => startSession(createBlankSession());
  const handleImportSession = (session: BugHuntSession) => loadSession(session);

  useEffect(() => {
    if (i18n.resolvedLanguage !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!PAGES_WITH_LEAVE_WARNING.includes(currentPage)) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      const warningText = t(
        "messages.leave_warning",
        "Leave this page? Session data is not stored automatically and will be lost unless you exported it."
      );
      event.returnValue = warningText;
      return warningText;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentPage, t]);

  if (currentPage === "landing") {
    return (
      <LandingPage
        onStartNewSession={handleStartNewSession}
        onImportSession={handleImportSession}
        currentTheme={theme}
      />
    );
  }

  if (currentPage === "setup") return <SetupPage />;
  if (currentPage === "leaderboard") return <LeaderboardPage />;
  if (currentPage === "contact") return <ContactPage />;

  return null;
}

export default function App() {
  return (
    <Router>
      <SessionProvider>
        <Routes>
          <Route path="/de/*" element={<AppRouter />} />
          <Route path="/*" element={<AppRouter />} />
        </Routes>
      </SessionProvider>
    </Router>
  );
}
