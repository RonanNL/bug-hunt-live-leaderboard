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
import styles from "./PrivacyNoticeModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SECTIONS = [
  {
    title: "In-Browser Operation",
    text: "This application runs entirely within your web browser. All session data, participant information, and bug counts are processed locally on your device and are never sent to any external server or third party.",
  },
  {
    title: "No Automatic Data Storage",
    text: "This application does not use cookies, local storage, session storage, or any other browser persistence mechanism. When you close or refresh the browser tab, all session data is permanently lost unless you have exported it manually.",
  },
  {
    title: "No Data Sharing",
    text: "No personal data, session data, or usage information is transmitted to or shared with any third party, including the application developer. There is no backend, no database, and no network communication of any kind.",
  },
  {
    title: "Local JSON Export",
    text: "The only data persistence mechanism available is the manual JSON export feature. Exported files are saved directly to your local device. You are responsible for the storage, handling, and security of any exported files.",
  },
  {
    title: "No Tracking or Analytics",
    text: "This application does not include any tracking scripts, analytics tools, advertising pixels, or telemetry of any kind. Your usage of the application is entirely private.",
  },
  {
    title: "Important Disclaimers",
    text: "This application is provided as-is for internal use in bug hunt sessions. It is not intended to process sensitive personal data. If your bug hunt session involves personal data of participants, ensure that your use complies with applicable data protection laws and your organisation's data governance policies.",
  },
  {
    title: "User Responsibility",
    text: "You are responsible for ensuring that the data entered into this application is handled in accordance with your organisation's policies. Participant names and bug counts entered into this tool are your responsibility to manage appropriately.",
  },
];

export function PrivacyNoticeModal({ isOpen, onClose }: Props) {
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
        aria-labelledby="pn-title"
        aria-describedby="pn-subtitle"
      >
        {/* Non-scrolling header */}
        <div className={styles.modalHeader}>
          <button className={styles.xBtn} onClick={onClose} type="button" aria-label="Close Privacy Notice">
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

          <h2 id="pn-title" className={styles.title}>Privacy Notice</h2>
          <p id="pn-subtitle" className={styles.subtitle}>
            Your privacy is important. This application is designed with privacy by design.
          </p>

          <div className={styles.sectionsScroll}>
            <div className={styles.sectionList} aria-label="Privacy sections">
              {SECTIONS.map((section, i) => (
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
              This application does not automatically collect, store, or transmit any personal data.
              All information entered remains on your device for the duration of your browser session only.
            </p>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              By using this application, you acknowledge that this privacy notice is informational and does not replace legal, compliance, or security review.
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
