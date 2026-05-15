/**
 * TimerPanel — displays the bug hunt countdown/count-up timer at the bottom
 * of the Leaderboard page.
 *
 * States:
 *   not_started → START button available
 *   running     → PAUSE button + ENDE (stop/reset) button enabled
 *   paused      → RESUME button + ENDE button enabled
 *
 * The actual tick logic lives in LeaderboardPage (useEffect + setInterval calling
 * tickTimer from sessionStore). This component is purely presentational.
 *
 * "ENDE" is the German word for "end" — it resets the timer to 00:00:00.
 */
import type { TimerStatus } from "../../types/session";
import { formatTime } from "../../logic/timer";
import styles from "./TimerPanel.module.css";

type Props = {
  elapsedSeconds: number;
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

const STATUS_LABELS: Record<TimerStatus, string> = {
  not_started: "Not started",
  running: "Running",
  paused: "Paused",
};

export function TimerPanel({ elapsedSeconds, status, onStart, onPause, onReset }: Props) {
  const handlePrimaryAction = () => {
    if (status === "running") {
      onPause();
    } else {
      onStart();
    }
  };

  const primaryLabel = status === "running" ? "PAUSE" : status === "paused" ? "RESUME" : "START";

  return (
    <div className={styles.panel}>
      <div className={styles.timerSection}>
        <svg
          className={styles.clockIcon}
          viewBox="0 0 32 32"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="12" />
          <path strokeLinecap="round" d="M16 9v7l4 3" />
        </svg>

        <div className={styles.timerDisplay}>
          <span className={styles.timerLabel}>BUG HUNT TIMER</span>
          <span className={styles.timerTime}>{formatTime(elapsedSeconds)}</span>
          <span className={`${styles.timerStatus} ${styles[status]}`}>
            {STATUS_LABELS[status]}
            {status === "running" && <span className={styles.dot} aria-hidden="true" />}
          </span>
        </div>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.controls}>
        <button
          className={`${styles.primaryBtn} ${status === "running" ? styles.pauseBtn : styles.startBtn}`}
          onClick={handlePrimaryAction}
          type="button"
          aria-label={primaryLabel}
        >
          {status === "running" ? (
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="18" height="18">
              <rect x="5" y="4" width="4" height="12" rx="1" />
              <rect x="11" y="4" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="18" height="18">
              <path d="M6 4l12 6-12 6V4z" />
            </svg>
          )}
          {primaryLabel}
        </button>

        <div className={styles.endeWrapper}>
          <button
            className={styles.endeBtn}
            onClick={onReset}
            type="button"
            aria-label="Stop and reset timer"
            disabled={status === "not_started"}
          >
            <span className={styles.endeSquare} aria-hidden="true" />
            ENDE
          </button>
        </div>
      </div>
    </div>
  );
}
