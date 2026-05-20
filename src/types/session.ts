/**
 * session.ts — shared TypeScript types for the Bug Hunt Live Leaderboard.
 *
 * BugHuntSession is the canonical data model. It is the structure that gets
 * serialised to JSON on export and deserialised / validated on import.
 *
 * Schema versioning:
 *   version: 1 is the current and only supported schema version.
 *   validateSession (logic/validateSession.ts) rejects files with any other version
 *   so forward/backward compatibility is explicit and controlled.
 */

/** Competition format: every person for themselves vs. grouped teams. */
export type BugHuntMode = "team" | "individual";

/**
 * Controls how many playarea entries are shown on screen.
 *   all   — every entry visible
 *   top3  — only rank 1–3 visible; others are blurred
 *   top10 — only rank 1–10 visible; others are blurred
 */
export type VisibilityMode = "all" | "top3" | "top10";

/** Three-state timer lifecycle. */
export type TimerStatus = "not_started" | "running" | "paused";

/**
 * A single person competing in the bug hunt.
 * sortOrder provides stable tie-breaking (preserves insertion order when scores are equal).
 */
export type Participant = {
  id: string;
  name: string;
  bugsFound: number;
  sortOrder: number;
};

/**
 * A group of participants that share a single bug count in team mode.
 * sortOrder provides stable tie-breaking (preserves creation order when scores are equal).
 */
export type Team = {
  id: string;
  name: string;
  memberIds: string[];
  bugsFound: number;
  sortOrder: number;
};

/**
 * The complete session data model — everything needed to resume a bug hunt.
 * This is the exact shape written to and read from exported JSON files.
 */
export type BugHuntSession = {
  /** Schema version — must be 1. Increment if the shape changes in a breaking way. */
  version: 1;
  createdAt: string;
  updatedAt: string;
  mode: BugHuntMode;
  participants: Participant[];
  teams: Team[];
  visibilityMode: VisibilityMode;
  timer: {
    elapsedSeconds: number;
    status: TimerStatus;
  };
};
