/**
 * sessionStore.tsx — global application state via React Context.
 *
 * All session data and navigation state lives here. Components read state and
 * dispatch actions through the useSession hook — no prop-drilling required.
 *
 * Design decisions:
 *   - Single useState<SessionState> containing both the current page and the session
 *     object. All mutations go through functional setState to avoid stale closures.
 *   - The `stamp` helper updates updatedAt on every mutation so exported JSON always
 *     reflects the true last-modified time.
 *   - No external state library (Redux/Zustand) — the app is simple enough that
 *     Context + useState handles everything cleanly.
 *   - No persistence (localStorage / sessionStorage / cookies). The only persistence
 *     mechanism is manual JSON export/import.
 *
 * Navigation:
 *   AppPage is a union type used instead of URL routing because the app is deployed
 *   as a static SPA with no server-side routing capability.
 */
import React, { createContext, useContext, useState } from "react";
import type { BugHuntSession, BugHuntMode, VisibilityMode, Team } from "../types/session";
import { generateId } from "../logic/participants";
import { splitIntoTeams } from "../logic/teamSplit";

/** The four screens in the application. Drives rendering in App.tsx / AppRouter. */
export type AppPage = "landing" | "setup" | "leaderboard" | "contact";

type SessionState = {
  currentPage: AppPage;
  session: BugHuntSession | null;
};

type SessionActions = {
  navigateTo: (page: AppPage) => void;
  loadSession: (session: BugHuntSession) => void;
  startSession: (session: BugHuntSession) => void;
  clearSession: () => void;
  // Timer
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  // Leaderboard scoring
  incrementBugs: (id: string) => void;
  decrementBugs: (id: string) => void;
  setVisibilityMode: (mode: VisibilityMode) => void;
  // Setup
  setMode: (mode: BugHuntMode) => void;
  addParticipants: (names: string[]) => void;
  updateParticipantName: (id: string, name: string) => void;
  deleteParticipant: (id: string) => void;
  clearParticipants: () => void;
  autoShuffleTeams: (numTeams: number) => void;
  updateTeamName: (teamId: string, name: string) => void;
  addMemberToTeam: (teamId: string, participantId: string) => void;
  removeMemberFromTeam: (teamId: string, participantId: string) => void;
  resetSessionData: () => void;
  deleteTeam: (teamId: string) => void;
};

type SessionContextValue = SessionState & SessionActions;

const SessionContext = createContext<SessionContextValue | null>(null);

/** Updates the updatedAt timestamp on every mutation. */
function stamp(session: BugHuntSession): BugHuntSession {
  return { ...session, updatedAt: new Date().toISOString() };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>({
    currentPage: "landing",
    session: null,
  });

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigateTo = (page: AppPage) =>
    setState((prev) => ({ ...prev, currentPage: page }));

  /** Load an imported session and jump straight to the playarea. */
  const loadSession = (session: BugHuntSession) =>
    setState({ currentPage: "leaderboard", session });

  /** Start a new blank session and jump straight to the playarea. */
  const startSession = (session: BugHuntSession) =>
    setState({ currentPage: "leaderboard", session });

  /** End the session and return to the landing page. */
  const clearSession = () =>
    setState({ currentPage: "landing", session: null });

  // ── Timer ──────────────────────────────────────────────────────────────────
  const startTimer = () =>
    setState((prev) => {
      if (!prev.session) return prev;
      return { ...prev, session: stamp({ ...prev.session, timer: { ...prev.session.timer, status: "running" } }) };
    });

  const pauseTimer = () =>
    setState((prev) => {
      if (!prev.session) return prev;
      return { ...prev, session: stamp({ ...prev.session, timer: { ...prev.session.timer, status: "paused" } }) };
    });

  /** Resets elapsed time to 0 and status to not_started. */
  const resetTimer = () =>
    setState((prev) => {
      if (!prev.session) return prev;
      return { ...prev, session: stamp({ ...prev.session, timer: { elapsedSeconds: 0, status: "not_started" } }) };
    });

  /** Increments elapsedSeconds by 1. Called every second by a useEffect interval. */
  const tickTimer = () =>
    setState((prev) => {
      if (!prev.session || prev.session.timer.status !== "running") return prev;
      return {
        ...prev,
        session: {
          ...prev.session,
          timer: { ...prev.session.timer, elapsedSeconds: prev.session.timer.elapsedSeconds + 1 },
        },
      };
    });

  // ── Leaderboard scoring ───────────────────────────────────────────────────
  const incrementBugs = (id: string) =>
    setState((prev) => {
      if (!prev.session) return prev;
      const s = prev.session;
      const updated =
        s.mode === "team"
          ? { ...s, teams: s.teams.map((t) => (t.id === id ? { ...t, bugsFound: t.bugsFound + 1 } : t)) }
          : { ...s, participants: s.participants.map((p) => (p.id === id ? { ...p, bugsFound: p.bugsFound + 1 } : p)) };
      return { ...prev, session: stamp(updated) };
    });

  /** Decrements bug count, clamped to 0 (scores cannot go negative). */
  const decrementBugs = (id: string) =>
    setState((prev) => {
      if (!prev.session) return prev;
      const s = prev.session;
      const updated =
        s.mode === "team"
          ? { ...s, teams: s.teams.map((t) => (t.id === id ? { ...t, bugsFound: Math.max(0, t.bugsFound - 1) } : t)) }
          : { ...s, participants: s.participants.map((p) => (p.id === id ? { ...p, bugsFound: Math.max(0, p.bugsFound - 1) } : p)) };
      return { ...prev, session: stamp(updated) };
    });

  const setVisibilityMode = (mode: VisibilityMode) =>
    setState((prev) => {
      if (!prev.session) return prev;
      return { ...prev, session: stamp({ ...prev.session, visibilityMode: mode }) };
    });

  // ── Setup: mode ───────────────────────────────────────────────────────────
  const setMode = (mode: BugHuntMode) =>
    setState((prev) => {
      if (!prev.session) return prev;
      return { ...prev, session: stamp({ ...prev.session, mode }) };
    });

  // ── Setup: participants ───────────────────────────────────────────────────
  /** Adds new participants, silently skipping names already present (case-insensitive). */
  const addParticipants = (names: string[]) =>
    setState((prev) => {
      if (!prev.session) return prev;
      const existing = new Set(prev.session.participants.map((p) => p.name.toLowerCase()));
      const maxOrder = prev.session.participants.reduce((m, p) => Math.max(m, p.sortOrder ?? 0), -1);
      const fresh = names
        .filter((n) => !existing.has(n.toLowerCase()))
        .map((name, i) => ({ id: generateId(), name, bugsFound: 0, sortOrder: maxOrder + 1 + i }));
      if (fresh.length === 0) return prev;
      return { ...prev, session: stamp({ ...prev.session, participants: [...prev.session.participants, ...fresh] }) };
    });

  const updateParticipantName = (id: string, name: string) =>
    setState((prev) => {
      if (!prev.session) return prev;
      return {
        ...prev,
        session: stamp({
          ...prev.session,
          participants: prev.session.participants.map((p) => (p.id === id ? { ...p, name } : p)),
        }),
      };
    });

  /** Also removes the participant from all team memberIds lists. */
  const deleteParticipant = (id: string) =>
    setState((prev) => {
      if (!prev.session) return prev;
      return {
        ...prev,
        session: stamp({
          ...prev.session,
          participants: prev.session.participants.filter((p) => p.id !== id),
          teams: prev.session.teams.map((t) => ({ ...t, memberIds: t.memberIds.filter((mid) => mid !== id) })),
        }),
      };
    });

  const clearParticipants = () =>
    setState((prev) => {
      if (!prev.session) return prev;
      return { ...prev, session: stamp({ ...prev.session, participants: [], teams: [] }) };
    });

  // ── Setup: teams ──────────────────────────────────────────────────────────
  /**
   * Randomly redistributes participants into numTeams teams.
   * Existing team IDs, names, and bug scores are preserved by index so a re-shuffle
   * mid-session doesn't reset scores or rename teams the facilitator already edited.
   */
  const autoShuffleTeams = (numTeams: number) =>
    setState((prev) => {
      if (!prev.session) return prev;
      const groups = splitIntoTeams(
        prev.session.participants.map((p) => p.id),
        numTeams
      );
      const existing = prev.session.teams;
      const teams: Team[] = groups.map((memberIds, i) => ({
        id: existing[i]?.id ?? generateId(),
        name: existing[i]?.name ?? `Team ${i + 1}`,
        memberIds,
        bugsFound: existing[i]?.bugsFound ?? 0,
        sortOrder: existing[i]?.sortOrder ?? i,
      }));
      return { ...prev, session: stamp({ ...prev.session, teams }) };
    });

  const updateTeamName = (teamId: string, name: string) =>
    setState((prev) => {
      if (!prev.session) return prev;
      return {
        ...prev,
        session: stamp({
          ...prev.session,
          teams: prev.session.teams.map((t) => (t.id === teamId ? { ...t, name } : t)),
        }),
      };
    });

  /**
   * Adds a participant to a team and simultaneously removes them from any other
   * team they were previously in (enforces single-team membership).
   */
  const addMemberToTeam = (teamId: string, participantId: string) =>
    setState((prev) => {
      if (!prev.session) return prev;
      const teams = prev.session.teams.map((t) => {
        if (t.id === teamId) {
          if (t.memberIds.includes(participantId)) return t;
          return { ...t, memberIds: [...t.memberIds, participantId] };
        }
        return { ...t, memberIds: t.memberIds.filter((id) => id !== participantId) };
      });
      return { ...prev, session: stamp({ ...prev.session, teams }) };
    });

  const removeMemberFromTeam = (teamId: string, participantId: string) =>
    setState((prev) => {
      if (!prev.session) return prev;
      const teams = prev.session.teams.map((t) =>
        t.id === teamId ? { ...t, memberIds: t.memberIds.filter((id) => id !== participantId) } : t
      );
      return { ...prev, session: stamp({ ...prev.session, teams }) };
    });

  const deleteTeam = (teamId: string) =>
    setState((prev) => {
      if (!prev.session) return prev;
      return {
        ...prev,
        session: stamp({
          ...prev.session,
          teams: prev.session.teams.filter((t) => t.id !== teamId),
        }),
      };
    });

  /** Clears participants, teams, and resets the timer — keeps mode and visibility. */
  const resetSessionData = () =>
    setState((prev) => {
      if (!prev.session) return prev;
      return {
        ...prev,
        session: stamp({
          ...prev.session,
          participants: [],
          teams: [],
          timer: { elapsedSeconds: 0, status: "not_started" },
        }),
      };
    });

  return (
    <SessionContext.Provider
      value={{
        ...state,
        navigateTo,
        loadSession,
        startSession,
        clearSession,
        startTimer,
        pauseTimer,
        resetTimer,
        tickTimer,
        incrementBugs,
        decrementBugs,
        setVisibilityMode,
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
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

/** Typed hook for consuming session state and actions. Must be used inside SessionProvider. */
export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
