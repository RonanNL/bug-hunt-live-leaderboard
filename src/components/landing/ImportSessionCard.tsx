import { useState } from "react";
import type { BugHuntSession } from "../../types/session";
import { parseAndValidateFile } from "../../logic/importSession";
import { FileDropzone } from "./FileDropzone";
import styles from "./ImportSessionCard.module.css";

type Props = {
  onImportSession: (session: BugHuntSession) => void;
};

type ImportState =
  | { status: "idle" }
  | { status: "loading"; fileName: string }
  | { status: "error"; message: string; fileName: string }
  | { status: "ready"; session: BugHuntSession; fileName: string };

function CheckItem({ text }: { text: string }) {
  return (
    <li className={styles.featureItem}>
      <svg
        className={styles.checkIcon}
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="10" fill="#f5c518" />
        <path
          d="M6 10.5l2.5 2.5 5-5"
          stroke="#1a1200"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {text}
    </li>
  );
}

export function ImportSessionCard({ onImportSession }: Props) {
  const [importState, setImportState] = useState<ImportState>({ status: "idle" });

  const handleFile = async (file: File) => {
    setImportState({ status: "loading", fileName: file.name });
    const result = await parseAndValidateFile(file);
    if (result.ok) {
      setImportState({ status: "ready", session: result.session, fileName: file.name });
    } else {
      setImportState({ status: "error", message: result.error, fileName: file.name });
    }
  };

  const handleLoad = () => {
    if (importState.status === "ready") {
      onImportSession(importState.session);
    }
  };

  const handleReset = () => {
    setImportState({ status: "idle" });
  };

  const isReady = importState.status === "ready";
  const isLoading = importState.status === "loading";

  return (
    <div className={styles.card}>
      <div className={styles.iconCircle} aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 16h10l4-4h14v22H6V16z"
            stroke="#555"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="20" y1="22" x2="20" y2="30" stroke="#555" strokeWidth="2" strokeLinecap="round" />
          <polyline points="16,25 20,21 24,25" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className={styles.textHeader}>
        <h2 className={styles.title}>LOAD EXISTING BUG HUNT</h2>
        <p className={styles.description}>Import a previously exported JSON file.</p>
      </div>

      <hr className={styles.divider} aria-hidden="true" />

      <ul className={styles.features}>
        <CheckItem text="Continue where you left off" />
        <CheckItem text="All data will be restored" />
        <CheckItem text="No data is stored automatically" />
      </ul>

      <FileDropzone onFile={handleFile} />

      {importState.status === "loading" && (
        <p className={styles.statusLoading} role="status">
          Validating {importState.fileName}…
        </p>
      )}

      {importState.status === "error" && (
        <div className={styles.errorBox} role="alert">
          <span className={styles.errorIcon} aria-hidden="true">✕</span>
          <div>
            <p className={styles.errorTitle}>Could not load session</p>
            <p className={styles.errorMessage}>{importState.message}</p>
          </div>
        </div>
      )}

      {importState.status === "ready" && (
        <div className={styles.successBox} role="status">
          <span className={styles.successIcon} aria-hidden="true">✓</span>
          <p className={styles.successText}>
            <strong>{importState.fileName}</strong> validated successfully.
          </p>
        </div>
      )}

      <div className={styles.buttonRow}>
        {(importState.status === "error" || importState.status === "ready") && (
          <button
            className={styles.secondaryButton}
            onClick={handleReset}
            type="button"
          >
            Choose another file
          </button>
        )}
        <button
          className={styles.primaryButton}
          onClick={handleLoad}
          disabled={!isReady || isLoading}
          type="button"
          aria-disabled={!isReady || isLoading}
        >
          LOAD SESSION
        </button>
      </div>
    </div>
  );
}
