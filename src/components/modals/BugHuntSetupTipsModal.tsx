/**
 * BugHuntSetupTipsModal — eight practical tips for planning and running an
 * effective bug hunt session. Accessible from the Contact page's "Helpful Links" card.
 *
 * Tips are defined in the TIPS constant and rendered as a numbered list.
 * Includes a ROI info box at the bottom to set expectations on cost vs. value.
 *
 * Follows the shared modal pattern: portal, non-scrolling header, scrollable body,
 * focus trap, body scroll lock, ESC to close.
 */
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styles from "./BugHuntSetupTipsModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function BugHuntSetupTipsModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  const tips = t("modals.tips.items", { returnObjects: true }) as { title: string; text: string }[];

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
        aria-labelledby="bst-title"
        aria-describedby="bst-subtitle"
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
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-strong)" strokeWidth="1.8" width="30" height="30">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path strokeLinecap="round" d="M8 8h.5M11 8h5M8 12h.5M11 12h5M8 16h.5M11 16h3" />
              <circle cx="8" cy="8" r="0.5" fill="var(--color-accent-strong)" />
              <circle cx="8" cy="12" r="0.5" fill="var(--color-accent-strong)" />
              <circle cx="8" cy="16" r="0.5" fill="var(--color-accent-strong)" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 1v3M17 1l-1.5 1.5M17 1l1.5 1.5" />
            </svg>
          </div>

          <h2 id="bst-title" className={styles.title}>{t("modals.tips.title")}</h2>
          <p id="bst-subtitle" className={styles.subtitle}>
            {t("modals.tips.subtitle")}
          </p>

          <div className={styles.tipsScroll}>
            <ol className={styles.tipList} aria-label="Setup tips">
              {tips.map((tip, i) => (
                <li key={i} className={styles.tipRow}>
                  <span className={styles.badge} aria-hidden="true">{i + 1}</span>
                  <div className={styles.tipBody}>
                    <p className={styles.tipTitle}>{tip.title}</p>
                    <p className={styles.tipText}>{tip.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              {t("modals.tips.footer_text")}
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
