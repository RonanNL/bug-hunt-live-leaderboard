/**
 * ModeSelector — dropdown control for choosing the bug hunt competition format.
 *
 * Options:
 *   individual — every person competes independently (deathmatch style)
 *   team       — participants are grouped into teams that share a score
 *
 * Changing the mode updates the session in sessionStore. The parent (SetupPage)
 * is responsible for any downstream side-effects (e.g. resetting teams).
 */
import type { BugHuntMode } from "../../types/session";
import styles from "./ModeSelector.module.css";

type Props = {
  value: BugHuntMode;
  onChange: (mode: BugHuntMode) => void;
};

export function ModeSelector({ value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <span className={styles.label}>Mode</span>
        <div className={styles.selectWrapper}>
          <svg className={styles.icon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="10" cy="7" r="3" />
            <path strokeLinecap="round" d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          </svg>
          <select
            className={styles.select}
            value={value}
            onChange={(e) => onChange(e.target.value as BugHuntMode)}
            aria-label="Select bug hunt mode"
          >
            <option value="individual">Individual (Deathmatch)</option>
            <option value="team">Team-based</option>
          </select>
          <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
          </svg>
        </div>
      </div>
      <p className={styles.hint}>
        {value === "individual"
          ? "Everyone competes individually."
          : "Participants are grouped into teams."}
      </p>
    </div>
  );
}
