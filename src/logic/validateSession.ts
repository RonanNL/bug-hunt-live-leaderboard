/**
 * validateSession.ts — strict runtime validation of an unknown JSON value against
 * the BugHuntSession schema.
 *
 * Called after JSON.parse in importSession.ts. Every required field is checked
 * individually so the error message points to the exact problem, making it easy
 * for the user to identify a corrupt or incompatible file.
 *
 * Returns a discriminated union:
 *   { ok: true;  session: BugHuntSession } — safe to load into state
 *   { ok: false; error: string }           — human-readable error for the UI
 *
 * Schema version handling:
 *   Only version: 1 is accepted. Any other value produces a clear error so users
 *   know the file is from an incompatible version of the application.
 */
import type { BugHuntSession, BugHuntMode, VisibilityMode, TimerStatus } from "../types/session";

const BUG_HUNT_MODES: BugHuntMode[] = ["team", "individual"];
const VISIBILITY_MODES: VisibilityMode[] = ["all", "top3", "top10"];
const TIMER_STATUSES: TimerStatus[] = ["not_started", "running", "paused"];

export type ValidationResult =
  | { ok: true; session: BugHuntSession }
  | { ok: false; error: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateSession(raw: unknown): ValidationResult {
  if (!isObject(raw)) {
    return { ok: false, error: "Invalid format: expected a JSON object." };
  }

  if (raw["version"] !== 1) {
    return {
      ok: false,
      error: `Unsupported session version. Expected version 1, got: ${String(raw["version"])}.`,
    };
  }

  if (typeof raw["createdAt"] !== "string" || raw["createdAt"] === "") {
    return { ok: false, error: "Missing required field: createdAt." };
  }

  if (typeof raw["updatedAt"] !== "string" || raw["updatedAt"] === "") {
    return { ok: false, error: "Missing required field: updatedAt." };
  }

  if (!BUG_HUNT_MODES.includes(raw["mode"] as BugHuntMode)) {
    return {
      ok: false,
      error: `Invalid mode: "${String(raw["mode"])}". Expected "team" or "individual".`,
    };
  }

  if (!Array.isArray(raw["participants"])) {
    return { ok: false, error: "Missing required field: participants (must be an array)." };
  }

  for (const [i, p] of (raw["participants"] as unknown[]).entries()) {
    if (!isObject(p)) {
      return { ok: false, error: `Invalid participant at index ${i}: not an object.` };
    }
    if (typeof p["id"] !== "string" || typeof p["name"] !== "string" || typeof p["bugsFound"] !== "number") {
      return { ok: false, error: `Invalid participant at index ${i}: missing or invalid fields.` };
    }
  }

  if (!Array.isArray(raw["teams"])) {
    return { ok: false, error: "Missing required field: teams (must be an array)." };
  }

  for (const [i, t] of (raw["teams"] as unknown[]).entries()) {
    if (!isObject(t)) {
      return { ok: false, error: `Invalid team at index ${i}: not an object.` };
    }
    if (
      typeof t["id"] !== "string" ||
      typeof t["name"] !== "string" ||
      !Array.isArray(t["memberIds"]) ||
      typeof t["bugsFound"] !== "number"
    ) {
      return { ok: false, error: `Invalid team at index ${i}: missing or invalid fields.` };
    }
  }

  if (!VISIBILITY_MODES.includes(raw["visibilityMode"] as VisibilityMode)) {
    return {
      ok: false,
      error: `Invalid visibilityMode: "${String(raw["visibilityMode"])}". Expected "all", "top3", or "top10".`,
    };
  }

  if (!isObject(raw["timer"])) {
    return { ok: false, error: "Missing required field: timer." };
  }

  const timer = raw["timer"];
  if (typeof timer["elapsedSeconds"] !== "number") {
    return { ok: false, error: "Invalid timer: elapsedSeconds must be a number." };
  }

  if (!TIMER_STATUSES.includes(timer["status"] as TimerStatus)) {
    return {
      ok: false,
      error: `Invalid timer status: "${String(timer["status"])}".`,
    };
  }

  return { ok: true, session: raw as unknown as BugHuntSession };
}
