/**
 * UsageDisclaimerModal — legal/usage disclaimer shown on the Landing page before
 * a user can start a new session or load an existing one.
 *
 * The user must tick the acknowledgement checkbox before the "ACKNOWLEDGE & CONTINUE"
 * button becomes enabled. This ensures deliberate consent before the session begins.
 *
 * Props:
 *   isAcknowledged / onAcknowledgedChange — checkbox state lifted to LandingPage
 *   onCancel                              — close modal without proceeding
 *   onAcknowledgeAndContinue             — proceed with the pending action
 *
 * Accessibility: portal, focus trap, body scroll lock, ESC to cancel.
 */
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./UsageDisclaimerModal.module.css";

type Props = {
  isOpen: boolean;
  isAcknowledged: boolean;
  onAcknowledgedChange: (checked: boolean) => void;
  onCancel: () => void;
  onAcknowledgeAndContinue: () => void;
};

export function UsageDisclaimerModal({
  isOpen,
  isAcknowledged,
  onAcknowledgedChange,
  onCancel,
  onAcknowledgeAndContinue,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, input[type="checkbox"], [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onCancel(); return; }
      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input[type="checkbox"], [tabindex]:not([tabindex="-1"])'
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
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        ref={dialogRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ud-title"
        aria-describedby="ud-body"
      >
        {/* Non-scrolling header */}
        <div className={styles.modalHeader}>
          <button className={styles.xBtn} onClick={onCancel} type="button" aria-label="Cancel and close">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="14" height="14">
              <line x1="2" y1="2" x2="14" y2="14" />
              <line x1="14" y1="2" x2="2" y2="14" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className={styles.scrollBody}>
          <div className={styles.iconWrap} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
              <path
                d="M12 2l7 3v5c0 5.5-3.2 9.5-7 10.5C8.2 19.5 5 15.5 5 10V5l7-3z"
                fill="#fde68a"
                stroke="#d97706"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M12 9v4" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="15.5" r="1.1" fill="#92400e" />
            </svg>
          </div>

          <h2 id="ud-title" className={styles.title}>Usage Disclaimer</h2>

          <div id="ud-body" className={styles.body}>
            <p>
              This application is provided free of charge on an &quot;as is&quot; and &quot;as available&quot; basis,
              without warranties of any kind.
            </p>
            <p>
              To the maximum extent permitted by law, the owner is not responsible for any direct,
              indirect, incidental, consequential, special, business, data-loss, or other damages
              arising from the use of, inability to use, malfunction, interruption, error, crash,
              depreciation, or unavailability of this application.
            </p>
            <p>
              No bug hunt session data is automatically stored by this service. If session data is
              lost, unsaved, overwritten, corrupted, or unavailable, it cannot be recovered by the
              owner or the application.
            </p>
            <p>
              You are responsible for using the Bug Hunt Live Leaderboard appropriately, for
              complying with applicable laws and organizational policies, and for exporting any
              session data as JSON if you want to save or continue it later.
            </p>
            <p>
              By continuing, you acknowledge that you use this application at your own risk and
              that you are responsible for the correct use of the application and for saving any
              data you want to keep.
            </p>
          </div>

          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isAcknowledged}
              onChange={(e) => onAcknowledgedChange(e.target.checked)}
            />
            <span className={styles.checkText}>
              I acknowledge that I use this application at my own risk and that I am responsible
              for saving any data I want to keep.
            </span>
          </label>

          <div className={styles.actions}>
            <button
              className={styles.confirmBtn}
              onClick={onAcknowledgeAndContinue}
              disabled={!isAcknowledged}
              aria-disabled={!isAcknowledged}
              type="button"
            >
              ACKNOWLEDGE &amp; CONTINUE
            </button>
            <button className={styles.cancelBtn} onClick={onCancel} type="button">
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
