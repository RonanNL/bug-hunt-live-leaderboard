import { useTranslation } from "react-i18next";
import styles from "./InfoPanel.module.css";

export function InfoPanel() {
  const { t } = useTranslation();

  return (
    <div className={styles.panel}>
      <div className={styles.shieldIcon} aria-hidden="true">
        <svg viewBox="0 0 56 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shield outline */}
          <path
            d="M28 2L4 12v20c0 14 10.5 26 24 30 13.5-4 24-16 24-30V12L28 2z"
            stroke="#f5c518"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Lock body */}
          <rect x="19" y="34" width="18" height="14" rx="2" stroke="#f5c518" strokeWidth="2" />
          {/* Lock shackle */}
          <path
            d="M22 34v-4a6 6 0 0112 0v4"
            stroke="#f5c518"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Keyhole */}
          <circle cx="28" cy="40" r="2" fill="#f5c518" />
          <rect x="27" y="40" width="2" height="4" rx="1" fill="#f5c518" />
        </svg>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{t("landing.privacy_title")}</h3>
        <p className={styles.body}>{t("landing.privacy_desc")}</p>
        <p className={styles.body}>{t("landing.privacy_desc_2")}</p>
        <p className={styles.body}>{t("landing.privacy_desc_3")}</p>
      </div>
    </div>
  );
}
