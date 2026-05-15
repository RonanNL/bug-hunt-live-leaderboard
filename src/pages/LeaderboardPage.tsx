/**
 * LeaderboardPage — the main live scoring screen shown during a bug hunt.
 *
 * Layout (top → bottom):
 *   1. AppHeader          — export + close session controls
 *   2. DashboardMetricCard row — five at-a-glance metrics
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
  getVisibilityLabel,
  getEntryLabel,
  getCurrentLeaderSummary,
} from "../logic/ranking";
import { formatTime } from "../logic/timer";
import type { VisibilityMode } from "../types/session";
import styles from "./LeaderboardPage.module.css";

export function LeaderboardPage() {
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
        <p style={{ padding: "2rem", color: "#6b7280" }}>No active session.</p>
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

      {/* Five summary metric cards */}
      <div className={styles.dashboardRow}>
        <DashboardMetricCard
          label={entryLabel.count}
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
          label="TOTAL BUGS FOUND"
          value={String(totalBugs)}
          helperText={session.mode === "team" ? "Across all teams" : "Across all participants"}
          iconBg="#fffbeb"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.5 0-4 2-4 4s1.5 4 4 4 4-2 4-4-1.5-4-4-4z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12H2M22 12h-2M12 4V2M12 22v-2M6 6L4.5 4.5M19.5 19.5 18 18M18 6l1.5-1.5M4.5 19.5 6 18" />
            </svg>
          }
        />

        <DashboardMetricCard
          label={leaderSummary.isMultiple ? "CURRENT LEADERS" : "CURRENT LEADER"}
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
          label="TIME ELAPSED"
          value={formatTime(session.timer.elapsedSeconds)}
          helperText={
            session.timer.status === "not_started"
              ? "Not started"
              : session.timer.status === "running"
              ? "Running"
              : "Paused"
          }
          iconBg="#eff6ff"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M12 7v5l3 2" />
            </svg>
          }
        />

        <DashboardMetricCard
          label="VISIBLE ENTRIES"
          value={getVisibilityLabel(session.visibilityMode)}
          helperText={
            session.visibilityMode === "all"
              ? `Show all ${session.mode === "team" ? "teams" : "participants"}`
              : `Showing ${getVisibilityLabel(session.visibilityMode)}`
          }
          iconBg="#f5f3ff"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
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
              <h2 className={styles.sectionTitle}>LIVE LEADERBOARD</h2>
              <p className={styles.sectionHelper}>
                {hasEntries
                  ? "Use + to add bugs, − to subtract. Rankings update automatically."
                  : "No participants yet. Go to Setup to add participants."}
              </p>
            </div>
            {hasEntries && (
              <div className={styles.visibilityRow}>
                <span className={styles.visibilityLabel}>Visibility</span>
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
                <h3 className={styles.emptyTitle}>No entries yet</h3>
                <p className={styles.emptyBody}>
                  Add participants in Setup before the hunt begins. Choose individual or team-based competition.
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
                  SETUP INDIVIDUAL BUG HUNT
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
                  SETUP TEAM-BASED BUG HUNT
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
