/**
 * VisibilitySelector — dropdown control that filters how many leaderboard entries
 * are shown on screen.
 *
 * Options:
 *   all   — every participant or team is shown
 *   top3  — only rank 1–3 entries are visible (others are blurred)
 *   top10 — only rank 1–10 entries are visible (others are blurred)
 *
 * The actual filtering/blurring is applied by LeaderboardPage via `isEntryVisible`
 * from ranking.ts. This component is a pure controlled input.
 */
import { useTranslation } from "react-i18next";
import type { VisibilityMode } from "../../types/session";
import styles from "./VisibilitySelector.module.css";

type Props = {
  value: VisibilityMode;
  onChange: (mode: VisibilityMode) => void;
};

export function VisibilitySelector({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.eyeIcon}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"
        />
        <circle cx="10" cy="10" r="2.5" />
      </svg>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value as VisibilityMode)}
        aria-label={t("leaderboard.visibility.label")}
      >
        <option value="all">{t("leaderboard.visibility.all")}</option>
        <option value="top3">{t("leaderboard.visibility.top3")}</option>
        <option value="top10">{t("leaderboard.visibility.top10")}</option>
      </select>
      <svg
        className={styles.chevron}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
      </svg>
    </div>
  );
}
