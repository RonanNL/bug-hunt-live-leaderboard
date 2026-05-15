/**
 * timer.ts — timer display utilities.
 *
 * formatTime: converts a raw elapsed-seconds integer into a HH:MM:SS string
 * suitable for display in the TimerPanel and DashboardMetricCard.
 * Hours are included so the display works correctly for sessions longer than 59 minutes.
 */

/** Formats totalSeconds as "HH:MM:SS" with zero-padded segments. */
export function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}
