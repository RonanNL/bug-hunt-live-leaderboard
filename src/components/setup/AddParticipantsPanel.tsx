/**
 * AddParticipantsPanel — step 1 of the Setup flow.
 *
 * Lets the facilitator type or paste participant names (one per line or comma-separated),
 * then add them to the session. Duplicate names (case-insensitive) are silently skipped
 * by the sessionStore.
 *
 * Buttons:
 *   ADD PARTICIPANT — parses the textarea and calls onAdd
 *   ADD DEMO DATA   — fills the session with a preset list of names for quick demos
 *   CLEAR ALL       — clears all participants (with inline confirmation to prevent accidents)
 *
 * Ctrl/Cmd + Enter submits the textarea without clicking the button.
 */
import { useState } from "react";
import { parseNames, DEMO_NAMES } from "../../logic/participants";
import styles from "./AddParticipantsPanel.module.css";

type Props = {
  onAdd: (names: string[]) => void;
  onClearAll: () => void;
  onAddDemo: () => void;
};

export function AddParticipantsPanel({ onAdd, onClearAll, onAddDemo }: Props) {
  const [text, setText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAdd = () => {
    const names = parseNames(text);
    if (names.length > 0) {
      onAdd(names);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleAdd();
    }
  };

  const confirmClear = () => {
    setShowConfirm(false);
    onClearAll();
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>1. ADD PARTICIPANTS</h3>
      <p className={styles.helper}>Enter one name per line or separated by commas.</p>

      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={"Elias, Linus, ...\nNelio"}
        aria-label="Participant names"
        rows={8}
      />

      <p className={styles.tip}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12" aria-hidden="true">
          <circle cx="8" cy="8" r="6" />
          <path strokeLinecap="round" d="M8 7v4M8 5.5v.5" />
        </svg>
        You can paste names from spreadsheets or lists.
      </p>

      <div className={styles.buttons}>
        <button className={styles.addBtn} onClick={handleAdd} type="button">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" aria-hidden="true">
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
          ADD PARTICIPANT
        </button>

        <button className={styles.demoBtn} onClick={onAddDemo} type="button">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" width="13" height="13" aria-hidden="true">
            <circle cx="6" cy="5" r="2.5" />
            <path strokeLinecap="round" d="M1 14c0-2.8 2.2-5 5-5" />
            <circle cx="11" cy="5" r="2.5" />
            <path strokeLinecap="round" d="M11 10c2.8 0 5 2.2 5 5" />
          </svg>
          ADD DEMO DATA
        </button>

        {!showConfirm ? (
          <button className={styles.clearBtn} onClick={() => setShowConfirm(true)} type="button">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13" aria-hidden="true">
              <polyline points="2,4 14,4" strokeLinecap="round" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5" />
              <rect x="3" y="4" width="10" height="10" rx="1" />
            </svg>
            CLEAR ALL
          </button>
        ) : (
          <div className={styles.confirmRow}>
            <span className={styles.confirmText}>Are you sure?</span>
            <button className={styles.confirmYes} onClick={confirmClear} type="button">Yes, clear</button>
            <button className={styles.confirmNo} onClick={() => setShowConfirm(false)} type="button">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Re-exported for convenience so consumers don't need a separate import
export { DEMO_NAMES };
