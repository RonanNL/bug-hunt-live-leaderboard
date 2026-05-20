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
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import type { BugHuntSession } from "../types/session";
import {
  buildPathForLanguageAndTheme,
  getLanguageAndThemeFromPath,
  type ThemeId,
} from "../logic/theme";
import { StartSessionCard } from "../components/landing/StartSessionCard";
import { ImportSessionCard } from "../components/landing/ImportSessionCard";
import { InfoPanel } from "../components/landing/InfoPanel";
import { UsageDisclaimerModal } from "../components/modals/UsageDisclaimerModal";
import styles from "./LandingPage.module.css";

type PendingAction = "start-new-session" | "load-existing-session" | null;

type Props = {
  onStartNewSession: () => void;
  onImportSession: (session: BugHuntSession) => void;
  currentTheme: ThemeId;
};

export function LandingPage({ onStartNewSession, onImportSession, currentTheme }: Props) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [pendingSession, setPendingSession] = useState<BugHuntSession | null>(null);

  const { language } = getLanguageAndThemeFromPath(location.pathname);
  const isGerman = language === "de";

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

  const handleLanguageSwitch = (language: "en" | "de") => {
    const targetPath = buildPathForLanguageAndTheme(language, currentTheme);
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
    void i18n.changeLanguage(language);
  };

  const handleThemeChange = (theme: ThemeId) => {
    const targetPath = buildPathForLanguageAndTheme(language, theme);
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.languageSwitcher} role="group" aria-label={t("common.language")}>
        <button
          type="button"
          className={`${styles.languageButton} ${!isGerman ? styles.languageButtonActive : ""}`}
          onClick={() => handleLanguageSwitch("en")}
          aria-pressed={!isGerman}
        >
          EN
        </button>
        <button
          type="button"
          className={`${styles.languageButton} ${isGerman ? styles.languageButtonActive : ""}`}
          onClick={() => handleLanguageSwitch("de")}
          aria-pressed={isGerman}
        >
          DE
        </button>
      </div>

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

        <p className={styles.subtitle}>
          {t("landing.subtitle").split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </p>
      </header>

      <main className={styles.main}>
        <div className={styles.cardsGrid}>
          <StartSessionCard onStartNewSession={handleStartClick} />
          <ImportSessionCard onImportSession={handleLoadReady} />
        </div>

        <InfoPanel />
      </main>

      <div className={styles.themeSelectorRow}>
        <label htmlFor="theme-selector" className={styles.themeSelectorLabel}>
          {t("landing.theme_label")}
        </label>
        <select
          id="theme-selector"
          className={styles.themeSelector}
          value={currentTheme}
          onChange={(e) => handleThemeChange(e.target.value as ThemeId)}
        >
          <option value="yellow">Yellow</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>
      </div>

      <footer className={styles.footer}>
        <p className={styles.version}>{t("common.version")}</p>
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
