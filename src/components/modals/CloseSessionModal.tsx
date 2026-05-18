/**
 * CloseSessionModal — confirmation dialog shown when the user clicks "CLOSE SESSION"
 * in the AppHeader.
 *
 * Presents three choices:
 *   1. STAY IN SESSION  — dismiss the modal and return to the current page
 *   2. EXPORT & CLOSE   — download a JSON snapshot then navigate to the Landing page
 *   3. CLOSE WITHOUT SAVING — discard all data and navigate to the Landing page
 *
 * Accessibility:
 *   - Rendered via React Portal so it sits above all other content in the DOM
 *   - `role="dialog"` + `aria-modal` + labelled/described by IDs
 *   - Focus is trapped inside the modal while it is open
 *   - Body scroll is locked while the modal is open
 *   - ESC key dismisses (same as STAY IN SESSION)
 *   - Click on the overlay also dismisses
 */
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styles from "./CloseSessionModal.module.css";

type Props = {
  isOpen: boolean;
  onStayInSession: () => void;
  onExportAndClose: () => void;
  onCloseWithoutSaving: () => void;
};

export function CloseSessionModal({
  isOpen,
  onStayInSession,
  onExportAndClose,
  onCloseWithoutSaving,
}: Props) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const firstBtn = dialogRef.current?.querySelector<HTMLElement>("button");
    firstBtn?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onStayInSession();
        return;
      }
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
  }, [isOpen, onStayInSession]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onStayInSession(); }}
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="close-modal-title"
        aria-describedby="close-modal-desc"
      >
        <button
          className={styles.xBtn}
          onClick={onStayInSession}
          type="button"
          aria-label={t("modals.close.btn_stay_label")}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="14" height="14">
            <line x1="2" y1="2" x2="14" y2="14" />
            <line x1="14" y1="2" x2="2" y2="14" />
          </svg>
        </button>

        <div className={styles.iconWrap} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
            <path d="M12 3L22 20H2L12 3Z" fill="#f5c518" stroke="#e0b010" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M12 10v4" stroke="#1a1200" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1.1" fill="#1a1200" />
          </svg>
        </div>

        <h2 id="close-modal-title" className={styles.title}>{t("modals.close.title")}</h2>

        <div id="close-modal-desc" className={styles.body}>
          <p className={styles.bodyText}>
            {t("modals.close.body")}
          </p>

          <div className={styles.warningBox} role="alert">
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18" aria-hidden="true" className={styles.warningIcon}>
              <path d="M10 2.5L18.5 17H1.5L10 2.5Z" fill="#f5c518" stroke="#e0b010" strokeWidth="1" strokeLinejoin="round" />
              <path d="M10 8.5v3.5" stroke="#1a1200" strokeWidth="1.7" strokeLinecap="round" />
              <circle cx="10" cy="14.5" r="0.9" fill="#1a1200" />
            </svg>
            <div>
              <p className={styles.warningTitle}>{t("modals.close.warning_title")}</p>
              <p className={styles.warningSubtext}>
                {t("modals.close.warning_subtext")}
              </p>
            </div>
          </div>

          <p className={styles.exportReminder}>
            {t("modals.close.export_reminder")}
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnStay} onClick={onStayInSession} type="button">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18" aria-hidden="true">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
            <span className={styles.btnLabel}>{t("modals.close.btn_stay_label")}</span>
            <span className={styles.btnHelper}>{t("modals.close.btn_stay_helper")}</span>
          </button>

          <button className={styles.btnExport} onClick={onExportAndClose} type="button">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18" aria-hidden="true">
              <path strokeLinejoin="round" d="M10 3v9m0 0l-3-3m3 3l3-3" />
              <path strokeLinejoin="round" d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" />
            </svg>
            <span className={styles.btnLabel}>{t("modals.close.btn_export_label")}</span>
            <span className={styles.btnHelper}>{t("modals.close.btn_export_helper")}</span>
          </button>

          <button className={styles.btnClose} onClick={onCloseWithoutSaving} type="button">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18" aria-hidden="true">
              <circle cx="10" cy="10" r="7" />
              <line x1="7" y1="7" x2="13" y2="13" />
              <line x1="13" y1="7" x2="7" y2="13" />
            </svg>
            <span className={styles.btnLabel}>{t("modals.close.btn_close_label")}</span>
            <span className={styles.btnHelper}>{t("modals.close.btn_close_helper")}</span>
          </button>
        </div>

        <p className={styles.footer}>
          {t("modals.close.footer")}
        </p>
      </div>
    </div>,
    document.body
  );
}
