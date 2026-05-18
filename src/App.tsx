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
import { LandingPage } from "./pages/LandingPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { SetupPage } from "./pages/SetupPage";
import { ContactPage } from "./pages/ContactPage";
import { createBlankSession } from "./logic/defaultSession";
import type { BugHuntSession } from "./types/session";
import type { AppPage } from "./state/sessionStore";
import "./styles/globals.css";

const PAGES_WITH_LEAVE_WARNING: AppPage[] = ["setup", "leaderboard", "contact"];
const LEAVE_WARNING_TEXT =
  "Leave this page? Session data is not stored automatically and will be lost. Please export your session first.";

function AppRouter() {
  const { currentPage, startSession, loadSession } = useSession();

  const handleStartNewSession = () => startSession(createBlankSession());
  const handleImportSession = (session: BugHuntSession) => loadSession(session);

  useEffect(() => {
    if (!PAGES_WITH_LEAVE_WARNING.includes(currentPage)) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = LEAVE_WARNING_TEXT;
      return LEAVE_WARNING_TEXT;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentPage]);

  if (currentPage === "landing") {
    return (
      <LandingPage
        onStartNewSession={handleStartNewSession}
        onImportSession={handleImportSession}
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
    <SessionProvider>
      <AppRouter />
    </SessionProvider>
  );
}
