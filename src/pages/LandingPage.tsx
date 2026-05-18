/**
 * LandingPage — the application entry screen, shown before any session is active.
 *
 * Contains two action cards side-by-side:
 *   StartSessionCard  — creates a blank session and proceeds after disclaimer
 *   ImportSessionCard — validates and loads an exported JSON session after disclaimer
 *
 * Both actions are gated behind the UsageDisclaimerModal. The user must tick the
 * acknowledgement checkbox before proceeding. This is achieved by:
 *   1. Storing a "pending action" (start-new-session | load-existing-session)
 *   2. Opening the disclaimer modal with the action type and optional session payload
 *   3. Only calling the real onStartNewSession / onImportSession callbacks after
 *      the user clicks "ACKNOWLEDGE & CONTINUE"
 *
 * InfoPanel below the cards reinforces the privacy-first / no-server-storage message.
 */
import { useState } from "react";
import type { BugHuntSession } from "../types/session";
import { StartSessionCard } from "../components/landing/StartSessionCard";
import { ImportSessionCard } from "../components/landing/ImportSessionCard";
import { InfoPanel } from "../components/landing/InfoPanel";
import { UsageDisclaimerModal } from "../components/modals/UsageDisclaimerModal";
import styles from "./LandingPage.module.css";

type PendingAction = "start-new-session" | "load-existing-session" | null;

type Props = {
  onStartNewSession: () => void;
  onImportSession: (session: BugHuntSession) => void;
};

export function LandingPage({ onStartNewSession, onImportSession }: Props) {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [pendingSession, setPendingSession] = useState<BugHuntSession | null>(null);

  const openDisclaimer = (action: PendingAction, session?: BugHuntSession) => {
    setPendingAction(action);
    setPendingSession(session ?? null);
    setIsAcknowledged(false);
    setIsDisclaimerOpen(true);
  };

  const resetDisclaimer = () => {
    setIsDisclaimerOpen(false);
    setIsAcknowledged(false);
    setPendingAction(null);
    setPendingSession(null);
  };

  const handleStartClick = () => openDisclaimer("start-new-session");

  const handleLoadReady = (session: BugHuntSession) =>
    openDisclaimer("load-existing-session", session);

  const handleAcknowledgeAndContinue = () => {
    if (!isAcknowledged) return;
    if (pendingAction === "start-new-session") {
      resetDisclaimer();
      onStartNewSession();
    } else if (pendingAction === "load-existing-session" && pendingSession) {
      const session = pendingSession;
      resetDisclaimer();
      onImportSession(session);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <svg
            className={styles.targetIcon}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="4" fill="currentColor" />
            <line x1="24" y1="1" x2="24" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="38" x2="24" y2="47" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="1" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="38" y1="24" x2="47" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className={styles.title}>
          LIVE{" "}
          <span className={styles.titleAccent}>BUG HUNT</span>
        </h1>

        <hr className={styles.divider} aria-hidden="true" />

        <p className={styles.subtitle}>A free gamified testing tool for live exploratory test sessions. Create a session, project it on-screen, and motivate teams to find bugs together.</p>
      </header>

      <main className={styles.main}>
        <div className={styles.cardsGrid}>
          <StartSessionCard onStartNewSession={handleStartClick} />
          <ImportSessionCard onImportSession={handleLoadReady} />
        </div>

        <InfoPanel />
      </main>

      <footer className={styles.footer}>
        <p className={styles.version}>Version 1.0.0</p>
      </footer>

      <UsageDisclaimerModal
        isOpen={isDisclaimerOpen}
        isAcknowledged={isAcknowledged}
        onAcknowledgedChange={setIsAcknowledged}
        onCancel={resetDisclaimer}
        onAcknowledgeAndContinue={handleAcknowledgeAndContinue}
      />
    </div>
  );
}
