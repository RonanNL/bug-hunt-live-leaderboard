/**
 * UserGuideModal — six-step quick-start guide, accessible from the Contact page's
 * "Helpful Links" card.
 *
 * Content is defined in the STEPS constant so it can be updated without touching JSX.
 * Follows the shared modal pattern: React Portal, non-scrolling header with X button,
 * scrollable body, focus trap, body scroll lock, ESC to close.
 */
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styles from "./UserGuideModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function UserGuideModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  const steps = t("modals.guide.steps", { returnObjects: true }) as { title: string; text: string }[];

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
        aria-labelledby="ug-title"
        aria-describedby="ug-subtitle"
      >
        {/* Non-scrolling header: X button only */}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              <path strokeLinecap="round" d="M9 7h6M9 11h6M9 15h4" />
            </svg>
          </div>

          <h2 id="ug-title" className={styles.title}>{t("modals.guide.title")}</h2>
          <p id="ug-subtitle" className={styles.subtitle}>{t("modals.guide.subtitle")}</p>

          <div className={styles.stepsScroll}>
            <ol className={styles.stepList} aria-label="Guide steps">
              {steps.map((step, i) => (
                <li key={i} className={styles.stepRow}>
                  <span className={styles.badge} aria-hidden="true">{i + 1}</span>
                  <div className={styles.stepBody}>
                    <p className={styles.stepTitle}>{step.title}</p>
                    <p className={styles.stepText}>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.tip} role="note">
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18" style={{ flexShrink: 0 }} aria-hidden="true">
              <circle cx="10" cy="8" r="5" stroke="#d97706" strokeWidth="1.6" />
              <path strokeLinecap="round" d="M8 13.5c0 1 4 1 4 0" stroke="#d97706" strokeWidth="1.4" />
              <path strokeLinecap="round" d="M10 11v2" stroke="#d97706" strokeWidth="1.6" />
            </svg>
            <p className={styles.tipText}>
              <strong>{t("modals.guide.tip_label")}</strong> {t("modals.guide.tip_text")}
            </p>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              {t("modals.guide.footer_text")}
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
