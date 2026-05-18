/**
 * exportSession.ts — serialises the current session to a JSON file and triggers
 * a browser download.
 *
 * The download is initiated by creating a hidden <a> element with a Blob URL,
 * clicking it programmatically, then immediately cleaning up. This approach works
 * in all modern browsers without requiring a backend.
 *
 * Filename format: bug-hunt-play-area-YYYY-MM-DD.json
 * The updatedAt timestamp is refreshed to the moment of export before serialising.
 *
 * No data is sent to any server — the file is saved directly to the user's device.
 */
import type { BugHuntSession } from "../types/session";

export function exportSessionAsJSON(session: BugHuntSession): void {
  const payload: BugHuntSession = {
    ...session,
    updatedAt: new Date().toISOString(),
  };

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split("T")[0];
  const a = document.createElement("a");
  a.href = url;
  a.download = `bug-hunt-play-area-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
