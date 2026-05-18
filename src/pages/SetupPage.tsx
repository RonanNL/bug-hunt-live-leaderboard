/**
 * SetupPage — configuration screen for a bug hunt session.
 *
 * Reached from the Leaderboard page (SETUP tab) or from the empty-state buttons
 * on the Leaderboard. Changes made here take effect immediately on the Leaderboard.
 *
 * Individual mode layout (left | right):
 *   Left:  1. AddParticipantsPanel
 *   Right: 2. ManageParticipantsPanel
 *
 * Team mode layout (left | right):
 *   Left:  1. AddParticipantsPanel
 *          2. AutoAssignTeamsPanel
 *   Right: 3. ManageParticipantsPanel
 *          4. ManageTeamsPanel
 *
 * Bottom action row:
 *   - RESET SESSION — clears all participants, teams, and timer (with inline confirmation)
 *   - SAVE & GO TO PLAY AREA — validates then navigates; shows an inline error if the
 *     session has no participants (individual) or no teams (team) yet
 *
 * The timer keeps ticking on this page (same useEffect as LeaderboardPage) so the
 * elapsed time metric card stays accurate while the facilitator adjusts the setup.
 */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "../state/sessionStore";
import { AppHeader } from "../components/layout/AppHeader";
import { DashboardMetricCard } from "../components/leaderboard/DashboardMetricCard";
import { AppTabs, type TabId } from "../components/layout/AppTabs";
import { ModeSelector } from "../components/setup/ModeSelector";
import { AddParticipantsPanel } from "../components/setup/AddParticipantsPanel";
import { ManageParticipantsPanel } from "../components/setup/ManageParticipantsPanel";
import { AutoAssignTeamsPanel } from "../components/setup/AutoAssignTeamsPanel";
import { ManageTeamsPanel } from "../components/setup/ManageTeamsPanel";
import { CloseSessionModal } from "../components/modals/CloseSessionModal";
import { exportSessionAsJSON } from "../logic/exportSession";
import {
  getRankedEntries,
  getEntryLabel,
  getCurrentLeaderSummary,
} from "../logic/ranking";
import { formatTime } from "../logic/timer";
import { DEMO_NAMES } from "../logic/participants";
import type { BugHuntMode } from "../types/session";
import styles from "./SetupPage.module.css";

export function SetupPage() {
  const { t } = useTranslation();
  const {
    session,
    navigateTo,
    tickTimer,
    clearSession,
    setMode,
    addParticipants,
    updateParticipantName,
    deleteParticipant,
    clearParticipants,
    autoShuffleTeams,
    updateTeamName,
    addMemberToTeam,
    removeMemberFromTeam,
    resetSessionData,
    deleteTeam,
  } = useSession();

  const [numTeams, setNumTeams] = useState(4);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Keep timer ticking while on this page so the elapsed metric stays accurate
  useEffect(() => {
    if (session?.timer.status !== "running") return;
    const id = setInterval(tickTimer, 1000);
    return () => clearInterval(id);
  }, [session?.timer.status, tickTimer]);

  if (!session) return null;

  const ranked = getRankedEntries(session);
  const totalBugs = ranked.reduce((sum, e) => sum + e.bugsFound, 0);
  const leaderSummary = getCurrentLeaderSummary(ranked);
  const entryLabel = getEntryLabel(session.mode);

  const handleTabChange = (tab: TabId) => {
    if (tab === "leaderboard") navigateTo("leaderboard");
    else if (tab === "contact") navigateTo("contact");
  };

  const handleModeChange = (mode: BugHuntMode) => setMode(mode);

  const handleShuffle = () => {
    const n = Math.min(numTeams, Math.max(session.participants.length, 1));
    autoShuffleTeams(n);
  };

  const subtitle =
    session.mode === "individual"
      ? t("setup.subtitle_individual")
      : t("setup.subtitle_team");

  return (
    <div className={styles.page}>
      <AppHeader
        onExport={() => exportSessionAsJSON(session)}
        onCloseSession={() => setShowCloseConfirm(true)}
      />

      {/* Four summary metric cards — mirrors the Play Area page */}
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
          label={t("leaderboard.metrics.bugs_found")}
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
          value={formatTime(session.timer.elapsedSeconds)}
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
        <AppTabs active="setup" onChange={handleTabChange} />
      </div>

      {/* Setup content */}
      <div className={styles.content}>
        <div className={styles.setupHeader}>
          <div>
            <h2 className={styles.setupTitle}>{t("setup.title")}</h2>
            <p className={styles.setupSubtitle}>{subtitle}</p>
          </div>
          <ModeSelector value={session.mode} onChange={handleModeChange} />
        </div>

        {/* Mode-specific panel layout */}
        {session.mode === "individual" ? (
          <div className={styles.twoCol}>
            <div className={styles.leftNarrow}>
              <AddParticipantsPanel
                onAdd={addParticipants}
                onClearAll={clearParticipants}
                onAddDemo={() => addParticipants(DEMO_NAMES)}
              />
            </div>
            <div className={styles.rightWide}>
              <ManageParticipantsPanel
                participants={session.participants}
                onUpdateName={updateParticipantName}
                onDelete={deleteParticipant}
              />
            </div>
          </div>
        ) : (
          <div className={styles.twoCol}>
            <div className={styles.leftNarrow}>
              <AddParticipantsPanel
                onAdd={addParticipants}
                onClearAll={clearParticipants}
                onAddDemo={() => addParticipants(DEMO_NAMES)}
              />
              <AutoAssignTeamsPanel
                numTeams={numTeams}
                participantCount={session.participants.length}
                onNumTeamsChange={setNumTeams}
                onShuffle={handleShuffle}
              />
            </div>
            <div className={styles.rightWide}>
              <ManageParticipantsPanel
                participants={session.participants}
                onUpdateName={updateParticipantName}
                onDelete={deleteParticipant}
                stepNumber={3}
              />
              <ManageTeamsPanel
                teams={session.teams}
                allParticipants={session.participants}
                onRenameTeam={updateTeamName}
                onRemoveMember={removeMemberFromTeam}
                onAddMember={addMemberToTeam}
                onDeleteTeam={deleteTeam}
              />
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className={styles.bottomActions}>
          {!showResetConfirm ? (
            <button
              className={styles.resetBtn}
              onClick={() => setShowResetConfirm(true)}
              type="button"
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16" aria-hidden="true">
                <path strokeLinecap="round" d="M4 10a6 6 0 1112 0 6 6 0 01-12 0z" />
                <path strokeLinecap="round" d="M4 10V6M4 6H8" />
              </svg>
              {t("setup.reset_session")}
            </button>
          ) : (
            <div className={styles.confirmRow}>
              <span className={styles.confirmText}>{t("setup.confirm_reset")}</span>
              <button
                className={styles.confirmYes}
                onClick={() => { resetSessionData(); setShowResetConfirm(false); }}
                type="button"
              >
                {t("setup.add_participants.yes_clear")}
              </button>
              <button className={styles.confirmNo} onClick={() => setShowResetConfirm(false)} type="button">
                {t("setup.add_participants.cancel")}
              </button>
            </div>
          )}

          <div className={styles.goBtnWrapper}>
            {saveError && <p className={styles.saveError}>{saveError}</p>}
            <button
              className={styles.goBtn}
              onClick={() => {
                if (session.mode === "individual" && session.participants.length === 0) {
                  setSaveError(t("setup.error_no_participants"));
                  return;
                }
                if (session.mode === "team" && session.teams.length === 0) {
                  setSaveError(t("setup.error_no_teams"));
                  return;
                }
                setSaveError(null);
                navigateTo("leaderboard");
              }}
              type="button"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                <path d="M6 4l10 6-10 6V4z" />
              </svg>
              {t("setup.save_go")}
            </button>
          </div>
        </div>
      </div>

      <CloseSessionModal
        isOpen={showCloseConfirm}
        onStayInSession={() => setShowCloseConfirm(false)}
        onExportAndClose={() => { exportSessionAsJSON(session); clearSession(); }}
        onCloseWithoutSaving={clearSession}
      />
    </div>
  );
}
