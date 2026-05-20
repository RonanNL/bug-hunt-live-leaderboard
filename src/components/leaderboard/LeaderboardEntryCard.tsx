/**
 * LeaderboardEntryCard — a single row on the live leaderboard representing
 * one participant (individual mode) or one team (team mode).
 *
 * Features:
 * - Rank badge (gold highlight for rank 1)
 * - Name + optional member list (team mode only)
 * - Progress bar relative to the current max score
 * - Bug count display
 * - + / − buttons to increment or decrement the score
 * - Blur overlay when the entry is hidden by the visibility filter
 *
 * The card is intentionally stateless — all data flows in through props and
 * all interactions bubble up through callbacks.
 */
import { useTranslation } from "react-i18next";
import styles from "./LeaderboardEntryCard.module.css";

type Props = {
  rank: number;
  name: string;
  bugsFound: number;
  maxBugs: number;
  memberNames?: string[];
  isBlurred: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function LeaderboardEntryCard({
  rank,
  name,
  bugsFound,
  maxBugs,
  memberNames,
  isBlurred,
  onIncrement,
  onDecrement,
}: Props) {
  const { t } = useTranslation();
  const isFirst = rank === 1;
  const progressPct = maxBugs > 0 ? (bugsFound / maxBugs) * 100 : 0;

  return (
    <div
      className={`${styles.card} ${isFirst ? styles.first : ""} ${isBlurred ? styles.blurred : ""}`}
    >
      <span className={`${styles.rank} ${isFirst ? styles.rankFirst : ""}`}>
        {rank}
      </span>

      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        {memberNames !== undefined && (
          <>
            <span className={styles.memberCount}>{t("leaderboard.member_count", { count: memberNames.length })}</span>
            {memberNames.length > 0 && (
              <span className={styles.memberList}>
                <strong>{t("leaderboard.members_label")}</strong> {memberNames.join(", ")}
              </span>
            )}
          </>
        )}
      </div>

      {/* Progress bar: width is proportional to bugsFound vs the current leader */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressTrack}>
          <div
            className={`${styles.progressFill} ${isFirst ? styles.progressFirst : ""}`}
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={bugsFound}
            aria-valuemin={0}
            aria-valuemax={maxBugs}
          />
        </div>
      </div>

      <div className={styles.bugCount}>
        <span className={styles.bugNumber}>{bugsFound}</span>
        <span className={styles.bugLabel}>{bugsFound === 1 ? t("leaderboard.bugs_singular") : t("leaderboard.bugs")}</span>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.minusBtn}
          onClick={onDecrement}
          disabled={bugsFound === 0}
          type="button"
          aria-label={t("leaderboard.remove_bug_aria", { name })}
        >
          −
        </button>
        <button
          className={styles.plusBtn}
          onClick={onIncrement}
          type="button"
          aria-label={t("leaderboard.add_bug_aria", { name })}
        >
          +
        </button>
      </div>
    </div>
  );
}
