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
import styles from "./BugHuntSetupTipsModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TIPS = [
  {
    title: "Prepare Access",
    text: "Make sure every participant can access the system under test before the session starts.",
  },
  {
    title: "Clarify Missions",
    text: "Explain the test missions clearly so everyone knows what to explore.",
  },
  {
    title: "Provide Charters",
    text: "Have charters or focus areas ready to guide the bug hunt without over-constraining participants.",
  },
  {
    title: "Set Up Bug Reporting",
    text: "Use a reporting tool such as MS Forms, MS Teams, Power Apps, ServiceNow, Pega, or another agreed system. Make sure everyone knows how to use it.",
  },
  {
    title: "Capture Key Bug Details",
    text: "Record essentials such as summary, steps to reproduce, environment, evidence, severity, and impact.",
  },
  {
    title: "Explain Scoring",
    text: "Make sure it is clear how points are assigned. This tool tracks bug counts and helps manage the session and winner only.",
  },
  {
    title: "Keep It Exploratory",
    text: "Let participants have fun and avoid over-constraining them. Exploration works best with room to think.",
  },
  {
    title: "Plan and Motivate",
    text: "Have a bug hunt strategy, cover the important planning aspects, include prizes or incentives, and keep participants engaged.",
  },
];

export function BugHuntSetupTipsModal({ isOpen, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

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
          <button className={styles.xBtn} onClick={onClose} type="button" aria-label="Close Bug Hunt Setup Tips">
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
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path strokeLinecap="round" d="M8 8h.5M11 8h5M8 12h.5M11 12h5M8 16h.5M11 16h3" />
              <circle cx="8" cy="8" r="0.5" fill="#d97706" />
              <circle cx="8" cy="12" r="0.5" fill="#d97706" />
              <circle cx="8" cy="16" r="0.5" fill="#d97706" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 1v3M17 1l-1.5 1.5M17 1l1.5 1.5" />
            </svg>
          </div>

          <h2 id="bst-title" className={styles.title}>Bug Hunt Setup Tips</h2>
          <p id="bst-subtitle" className={styles.subtitle}>
            Short guidance for planning and running an effective exploratory bug hunt.
          </p>

          <ol className={styles.tipList} aria-label="Setup tips">
            {TIPS.map((tip, i) => (
              <li key={i} className={styles.tipRow}>
                <span className={styles.badge} aria-hidden="true">{i + 1}</span>
                <div className={styles.tipBody}>
                  <p className={styles.tipTitle}>{tip.title}</p>
                  <p className={styles.tipText}>{tip.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className={styles.infoBox} role="note">
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18" style={{ flexShrink: 0 }} aria-hidden="true">
              <circle cx="10" cy="8" r="5" stroke="#d97706" strokeWidth="1.6" />
              <path strokeLinecap="round" d="M8 13.5c0 1 4 1 4 0" stroke="#d97706" strokeWidth="1.4" />
              <path strokeLinecap="round" d="M10 11v2" stroke="#d97706" strokeWidth="1.6" />
            </svg>
            <p className={styles.infoText}>
              Bug hunts can be expensive because they involve many people. However, when done right,
              the return on investment can be significant because product quality is assessed by many
              people in a short timeframe.
            </p>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Need tailored support? Request a consultation or bug hunt session using the Send a
              Message form on this page.
            </p>
            <button className={styles.closeBtn} onClick={onClose} type="button">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
