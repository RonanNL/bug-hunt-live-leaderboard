/**
 * PrivacyNoticeModal — seven-section privacy notice accessible from the Contact page's
 * "Helpful Links" card.
 *
 * Key points communicated:
 *   - All processing is in-browser only
 *   - No automatic storage of any kind (no cookies, localStorage, etc.)
 *   - No data sharing or third-party transmission
 *   - JSON export is the sole persistence mechanism
 *   - No tracking or analytics scripts
 *
 * Sections are defined in the SECTIONS constant so content can be updated without
 * touching JSX structure.
 *
 * Follows the shared modal pattern: portal, non-scrolling header, scrollable body,
 * focus trap, body scroll lock, ESC to close. Max-width is wider (820 px) than other
 * modals to accommodate the longer content comfortably.
 */
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styles from "./PrivacyNoticeModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function PrivacyNoticeModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  const sections = t("modals.privacy.sections", { returnObjects: true }) as { title: string; text: string }[];

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const firstBtn = dialogRef.current?.querySelector<HTMLElement>("button");
    firstBtn?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pn-title"
        aria-describedby="pn-subtitle"
      >
        {/* Non-scrolling header */}
        <div className={styles.modalHeader}>
          <button className={styles.xBtn} onClick={onClose} type="button" aria-label={t("common.cancel")}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="14" height="14">
              <line x1="2" y1="2" x2="14" y2="14" />
              <line x1="14" y1="2" x2="2" y2="14" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className={styles.scrollBody}>
          <div className={styles.iconWrap} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" width="30" height="30">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v5c0 5.5-3.2 9.5-7 10.5C8.2 19.5 5 15.5 5 10V5l7-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
          </div>

          <h2 id="pn-title" className={styles.title}>{t("modals.privacy.title")}</h2>
          <p id="pn-subtitle" className={styles.subtitle}>
            {t("modals.privacy.subtitle")}
          </p>

          <div className={styles.sectionsScroll}>
            <div className={styles.sectionList} aria-label="Privacy sections">
              {sections.map((section, i) => (
                <div key={i} className={styles.sectionRow}>
                  <span className={styles.sectionIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v5c0 5.5-3.2 9.5-7 10.5C8.2 19.5 5 15.5 5 10V5l7-3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                    </svg>
                  </span>
                  <div className={styles.sectionBody}>
                    <p className={styles.sectionTitle}>{section.title}</p>
                    <p className={styles.sectionText}>{section.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.infoBox} role="note">
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18" style={{ flexShrink: 0 }} aria-hidden="true">
              <circle cx="10" cy="10" r="8" stroke="#d97706" strokeWidth="1.6" />
              <path strokeLinecap="round" d="M10 7v4" stroke="#d97706" strokeWidth="1.8" />
              <circle cx="10" cy="13.5" r="0.9" fill="#d97706" />
            </svg>
            <p className={styles.infoText}>
              {t("modals.privacy.info_box")}
            </p>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              {t("modals.privacy.footer")}
            </p>
            <button className={styles.closeBtn} onClick={onClose} type="button">
              {t("common.cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
