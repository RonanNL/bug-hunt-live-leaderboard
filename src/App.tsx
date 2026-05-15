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
import { LandingPage } from "./pages/LandingPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { SetupPage } from "./pages/SetupPage";
import { ContactPage } from "./pages/ContactPage";
import { createBlankSession } from "./logic/defaultSession";
import type { BugHuntSession } from "./types/session";
import "./styles/globals.css";

function AppRouter() {
  const { currentPage, startSession, loadSession } = useSession();

  const handleStartNewSession = () => startSession(createBlankSession());
  const handleImportSession = (session: BugHuntSession) => loadSession(session);

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
