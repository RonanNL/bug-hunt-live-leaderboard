/**
 * LeaderboardPage — the main live scoring screen shown during a bug hunt.
 *
 * Layout (top → bottom):
 *   1. AppHeader          — export + close session controls
 *   2. DashboardMetricCard row — four at-a-glance metrics
 *   3. AppTabs            — navigation between Leaderboard / Setup / Contact
 *   4. Section header     — title + visibility filter (when entries exist)
 *   5. Empty state panel  — shown when no participants/teams have been added yet
 *   6. LeaderboardEntryCard list — one card per participant/team, sorted by rank
 *   7. TimerPanel         — start/pause/reset the bug hunt timer
 *
 * The timer tick runs in a useEffect that sets a 1-second interval whenever the
 * timer status is "running". The interval is cleared automatically on pause/reset
 * or when the component unmounts.
 *
 * Rankings use dense ranking (1,1,2,3,3,4 — no gaps) computed by getRankedEntries
 * in logic/ranking.ts. Scores and ranks update immediately on every + / − click.
 */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "../state/sessionStore";
import { AppHeader } from "../components/layout/AppHeader";
import { DashboardMetricCard } from "../components/leaderboard/DashboardMetricCard";
import { AppTabs, type TabId } from "../components/layout/AppTabs";
import { LeaderboardEntryCard } from "../components/leaderboard/LeaderboardEntryCard";
import { VisibilitySelector } from "../components/leaderboard/VisibilitySelector";
import { TimerPanel } from "../components/leaderboard/TimerPanel";
import { CloseSessionModal } from "../components/modals/CloseSessionModal";
import { exportSessionAsJSON } from "../logic/exportSession";
import {
  getRankedEntries,
  getMaxBugs,
  isEntryVisible,
  getEntryLabel,
  getCurrentLeaderSummary,
} from "../logic/ranking";
import { formatTime, formatTimeHoursMinutes } from "../logic/timer";
import type { VisibilityMode } from "../types/session";
import styles from "./LeaderboardPage.module.css";

export function LeaderboardPage() {
  const { t } = useTranslation();
  const {
    session,
    clearSession,
    tickTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    incrementBugs,
    decrementBugs,
    setVisibilityMode,
    setMode,
    navigateTo,
  } = useSession();

  const [activeTab, setActiveTab] = useState<TabId>("leaderboard");
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Increment elapsed seconds every second while the timer is running.
  // The interval is cleared automatically when status changes away from "running".
  useEffect(() => {
    if (session?.timer.status !== "running") return;
    const id = setInterval(tickTimer, 1000);
    return () => clearInterval(id);
  }, [session?.timer.status, tickTimer]);

  if (!session) {
    return (
      <div className={styles.page}>
        <p style={{ padding: "2rem", color: "#6b7280" }}>{t("leaderboard.empty")}</p>
      </div>
    );
  }

  const ranked = getRankedEntries(session);
  const maxBugs = getMaxBugs(ranked);
  const totalBugs = ranked.reduce((sum, e) => sum + e.bugsFound, 0);
  const leaderSummary = getCurrentLeaderSummary(ranked);
  const entryLabel = getEntryLabel(session.mode);
  const hasEntries = ranked.length > 0;

  const handleTabChange = (tab: TabId) => {
    if (tab === "setup") navigateTo("setup");
    else if (tab === "contact") navigateTo("contact");
    else setActiveTab(tab);
  };

  const handleVisibilityChange = (mode: VisibilityMode) => setVisibilityMode(mode);

  return (
    <div className={styles.page}>
      <AppHeader
        onExport={() => exportSessionAsJSON(session)}
        onCloseSession={() => setShowCloseConfirm(true)}
      />

      {/* Four summary metric cards */}
      <div className={styles.dashboardRow}>
        <DashboardMetricCard
          label={entryLabel.count}
          compactLabel={session.mode === "team" ? "Teams:" : "Participants:"}
          value={String(session.mode === "team" ? session.teams.length : session.participants.length)}
          helperText={entryLabel.helper}
          iconBg="#eff6ff"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20H7a4 4 0 01-4-4v-1a4 4 0 014-4h10a4 4 0 014 4v1a4 4 0 01-4 4z" />
              <circle cx="12" cy="7" r="3" strokeLinecap="round" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 20v-1a4 4 0 00-3-3.87M3 20v-1a4 4 0 013-3.87" />
            </svg>
          }
        />

        <DashboardMetricCard
          label={t("leaderboard.metrics.bugs_found")}
          compactLabel="Total:"
          value={String(totalBugs)}
          helperText={session.mode === "team" ? t("leaderboard.metrics.bugs_across_teams") : t("leaderboard.metrics.bugs_across_participants")}
          iconBg="#fffbeb"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.5 0-4 2-4 4s1.5 4 4 4 4-2 4-4-1.5-4-4-4z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12H2M22 12h-2M12 4V2M12 22v-2M6 6L4.5 4.5M19.5 19.5 18 18M18 6l1.5-1.5M4.5 19.5 6 18" />
            </svg>
          }
        />

        <DashboardMetricCard
          label={leaderSummary.isMultiple ? t("leaderboard.leaders_title") : t("leaderboard.leader_title")}
          compactLabel="Leader:"
          value={leaderSummary.label}
          helperText={leaderSummary.helperText}
          iconBg="#f0fdf4"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14l-2 8H7L5 3zM7 11v2a5 5 0 0010 0v-2M9 21h6" />
            </svg>
          }
        />

        <DashboardMetricCard
          label={t("leaderboard.metrics.time_elapsed")}
          compactLabel="Time:"
          value={formatTime(session.timer.elapsedSeconds)}
          compactValue={formatTimeHoursMinutes(session.timer.elapsedSeconds)}
          helperText={
            session.timer.status === "not_started"
              ? t("leaderboard.status_not_started")
              : session.timer.status === "running"
              ? t("leaderboard.status_running")
              : t("leaderboard.status_paused")
          }
          iconBg="#eff6ff"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M12 7v5l3 2" />
            </svg>
          }
        />

      </div>

      <div className={styles.tabsWrapper}>
        <AppTabs active={activeTab} onChange={handleTabChange} />
      </div>

      {activeTab === "leaderboard" && (
        <div className={styles.content}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionMeta}>
              <h2 className={styles.sectionTitle}>{t("leaderboard.title")}</h2>
              <p className={styles.sectionHelper}>
                {hasEntries ? t("leaderboard.helper_has_entries") : t("leaderboard.helper_no_entries")}
              </p>
            </div>
            {hasEntries && (
              <div className={styles.visibilityRow}>
                <span className={styles.visibilityLabel}>{t("leaderboard.visibility_label")}</span>
                <VisibilitySelector
                  value={session.visibilityMode}
                  onChange={handleVisibilityChange}
                />
              </div>
            )}
          </div>

          {/* Empty state with shortcuts to configure the session */}
          {!hasEntries && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" width="28" height="28">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.5 0-4 2-4 4s1.5 4 4 4 4-2 4-4-1.5-4-4-4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12H2M22 12h-2M12 4V2M12 22v-2M6 6L4.5 4.5M19.5 19.5 18 18M18 6l1.5-1.5M4.5 19.5 6 18" />
                </svg>
              </div>
              <div>
                <h3 className={styles.emptyTitle}>{t("leaderboard.no_entries")}</h3>
                <p className={styles.emptyBody}>
                  {t("leaderboard.no_entries_body")}
                </p>
              </div>
              <div className={styles.emptyActions}>
                <button
                  className={styles.emptyBtnPrimary}
                  onClick={() => { setMode("individual"); navigateTo("setup"); }}
                  type="button"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                    <path d="M6 4l10 6-10 6V4z" />
                  </svg>
                  {t("leaderboard.setup_individual")}
                </button>
                <button
                  className={styles.emptyBtnSecondary}
                  onClick={() => { setMode("team"); navigateTo("setup"); }}
                  type="button"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 6H7a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2V8a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" d="M10 2v2M10 16v2M4 10H2M18 10h-2" />
                  </svg>
                  {t("leaderboard.setup_team")}
                </button>
              </div>
            </div>
          )}

          {/* Live scoring list */}
          {hasEntries && (
            <div className={styles.entryList} role="list">
              {ranked.map((entry) => {
                const visible = isEntryVisible(entry.rank, session.visibilityMode);
                return (
                  <div key={entry.id} role="listitem">
                    <LeaderboardEntryCard
                      rank={entry.rank}
                      name={entry.name}
                      bugsFound={entry.bugsFound}
                      maxBugs={maxBugs}
                      memberNames={entry.memberNames}
                      isBlurred={!visible}
                      onIncrement={() => incrementBugs(entry.id)}
                      onDecrement={() => decrementBugs(entry.id)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <TimerPanel
            elapsedSeconds={session.timer.elapsedSeconds}
            status={session.timer.status}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetTimer}
          />
        </div>
      )}

      <CloseSessionModal
        isOpen={showCloseConfirm}
        onStayInSession={() => setShowCloseConfirm(false)}
        onExportAndClose={() => { exportSessionAsJSON(session); clearSession(); }}
        onCloseWithoutSaving={clearSession}
      />
    </div>
  );
}
