/**
 * AutoAssignTeamsPanel — step 2 of the Setup flow (team mode only).
 *
 * Lets the facilitator choose how many teams to create, then click "AUTO-SHUFFLE TEAMS"
 * to distribute participants randomly and as evenly as possible.
 *
 * The shuffle is performed by splitIntoTeams (logic/teamSplit.ts) via sessionStore's
 * autoShuffleTeams action. Existing team names and bug counts are preserved by index
 * when re-shuffling so a re-shuffle mid-session doesn't reset scores.
 *
 * Constraints:
 *   - Minimum 1 team
 *   - Maximum equals participant count (so no empty teams forced by the UI)
 */
import styles from "./AutoAssignTeamsPanel.module.css";

type Props = {
  numTeams: number;
  participantCount: number;
  onNumTeamsChange: (n: number) => void;
  onShuffle: () => void;
};

export function AutoAssignTeamsPanel({
  numTeams,
  participantCount,
  onNumTeamsChange,
  onShuffle,
}: Props) {
  const canDecrease = numTeams > 1;
  const canIncrease = numTeams < Math.max(participantCount, 2);

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>2. ASSIGN TEAMS (Auto)</h3>
      <p className={styles.helper}>Automatically distribute participants into teams.</p>

      <div className={styles.controls}>
        <span className={styles.controlLabel}>Number of Teams</span>
        <div className={styles.stepper}>
          <button
            className={styles.stepBtn}
            onClick={() => onNumTeamsChange(numTeams - 1)}
            disabled={!canDecrease}
            type="button"
            aria-label="Decrease team count"
          >
            −
          </button>
          <span className={styles.stepValue}>{numTeams}</span>
          <button
            className={styles.stepBtn}
            onClick={() => onNumTeamsChange(numTeams + 1)}
            disabled={!canIncrease}
            type="button"
            aria-label="Increase team count"
          >
            +
          </button>
        </div>

        <button className={styles.shuffleBtn} onClick={onShuffle} type="button">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h11l-3-3M14 6l3 3-3 3M3 14h11m-3-3l3 3-3 3" />
          </svg>
          AUTO-SHUFFLE TEAMS
        </button>
      </div>

      <div className={styles.note}>
        <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.5" width="14" height="14" aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="#d97706" />
          <path stroke="#d97706" strokeLinecap="round" d="M8 7v3M8 5.5v.5" />
        </svg>
        <span>Participants will be distributed as evenly as possible.</span>
      </div>
    </div>
  );
}
