/**
 * defaultSession.ts — factory functions for creating BugHuntSession objects.
 *
 * createBlankSession: used by App.tsx when the facilitator clicks "START NEW SESSION".
 * Produces an empty session with no participants or teams — the facilitator then
 * completes setup on the Setup page.
 *
 * createDefaultSession: a pre-populated session with demo participants and teams.
 * Used during development and manual testing. Not exposed in the production UI.
 */
import type { BugHuntSession } from "../types/session";

/** Returns a blank session with no participants or teams. */
export function createBlankSession(): BugHuntSession {
  const now = new Date().toISOString();
  return {
    version: 1,
    createdAt: now,
    updatedAt: now,
    mode: "team",
    participants: [],
    teams: [],
    visibilityMode: "all",
    timer: { elapsedSeconds: 0, status: "not_started" },
  };
}

/** Returns a session pre-populated with demo data (development/testing only). */
export function createDefaultSession(): BugHuntSession {
  const now = new Date().toISOString();
  return {
    version: 1,
    createdAt: now,
    updatedAt: now,
    mode: "team",
    participants: [
      { id: "p1", name: "Ridha",   bugsFound: 0, sortOrder: 0 },
      { id: "p2", name: "Roland",  bugsFound: 0, sortOrder: 1 },
      { id: "p3", name: "Michael", bugsFound: 0, sortOrder: 2 },
      { id: "p4", name: "Max",     bugsFound: 0, sortOrder: 3 },
      { id: "p5", name: "Patrick", bugsFound: 0, sortOrder: 4 },
      { id: "p6", name: "Janina",  bugsFound: 0, sortOrder: 5 },
      { id: "p7", name: "Sabrina", bugsFound: 0, sortOrder: 6 },
      { id: "p8", name: "Ronan",   bugsFound: 0, sortOrder: 7 },
    ],
    teams: [
      { id: "t1", name: "Team 2",      memberIds: ["p1", "p2", "p3"], bugsFound: 0, sortOrder: 0 },
      { id: "t2", name: "Bug Bunnies", memberIds: ["p4", "p5", "p6"], bugsFound: 0, sortOrder: 1 },
      { id: "t3", name: "Team 3",      memberIds: ["p7", "p8"],       bugsFound: 0, sortOrder: 2 },
    ],
    visibilityMode: "all",
    timer: { elapsedSeconds: 0, status: "not_started" },
  };
}
