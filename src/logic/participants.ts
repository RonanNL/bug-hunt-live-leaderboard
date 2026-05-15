/**
 * participants.ts — utilities for managing participant data.
 *
 * parseNames: converts freeform text input (one-per-line or comma-separated)
 * into a clean array of trimmed, non-empty name strings.
 *
 * generateId: produces a unique string ID for new participants and teams.
 * Uses Date.now() + random suffix — no UUID library needed for this use case.
 *
 * DEMO_NAMES: a fixed list used by the "ADD DEMO DATA" button in SetupPage
 * to quickly populate the session for demonstration or testing purposes.
 */

/** Splits freeform text into individual trimmed names, removing empty entries. */
export function parseNames(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Generates a collision-resistant unique ID string. */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Preset names used by the "ADD DEMO DATA" shortcut on the Setup page. */
export const DEMO_NAMES = [
  "Ridha", "Roland", "Michael", "Max",
  "Patrick", "Janina", "Sabrina", "Ronan",
];
