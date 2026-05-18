/**
 * AppHeader — persistent top navigation bar shown on every page after the Landing page.
 *
 * Contains:
 * - App logo + title (left)
 * - Export Session button: triggers a JSON download of the current session (right)
 * - Privacy reminder: reminds users no data is stored server-side (right)
 * - Close Session button: opens the CloseSessionModal confirmation flow (right)
 *
 * All callbacks are passed in from the parent page — this component is stateless.
 */
import { useTranslation } from "react-i18next";
import styles from "./AppHeader.module.css";

type Props = {
  onExport: () => void;
  onCloseSession: () => void;
};

export function AppHeader({ onExport, onCloseSession }: Props) {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <svg
          className={styles.logo}
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="13" stroke="#f5c518" strokeWidth="2" />
          <circle cx="16" cy="16" r="7" stroke="#f5c518" strokeWidth="2" />
          <circle cx="16" cy="16" r="2.5" fill="#f5c518" />
          <line x1="16" y1="1" x2="16" y2="7" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="25" x2="16" y2="31" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" />
          <line x1="1" y1="16" x2="7" y2="16" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" />
          <line x1="25" y1="16" x2="31" y2="16" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h1 className={styles.title}>{t("leaderboard.header_title")}</h1>
      </div>

      <div className={styles.right}>
        <button className={styles.exportButton} onClick={onExport} type="button">
          <svg
            className={styles.exportIcon}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 3v10m0 0l-3-3m3 3l3-3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" />
          </svg>
          {t("common.export_session")}
        </button>

        {/* Inline privacy reminder — no data is stored server-side */}
        <div className={styles.privacyNote}>
          <svg
            className={styles.shieldIcon}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 2l6 2.5V10c0 4-2.5 7-6 8-3.5-1-6-4-6-8V4.5L10 2z"
            />
          </svg>
          <div className={styles.privacyText}>
            <span>{t("leaderboard.privacy_line1")}</span>
            <span>{t("leaderboard.privacy_line2")}</span>
          </div>
        </div>

        <button className={styles.closeButton} onClick={onCloseSession} type="button">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="12" height="12" aria-hidden="true">
            <line x1="2" y1="2" x2="12" y2="12" />
            <line x1="12" y1="2" x2="2" y2="12" />
          </svg>
          {t("common.close_session")}
        </button>
      </div>
    </header>
  );
}
