import styles from "./StartSessionCard.module.css";

type Props = {
  onStartNewSession: () => void;
};

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

export function StartSessionCard({ onStartNewSession }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.iconCircle} aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 6h13l7 7v21H10V6z"
            stroke="#1a1200"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M23 6v7h7"
            stroke="#1a1200"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="27" r="5" fill="#1a1200" opacity="0.1" />
          <line x1="20" y1="24" x2="20" y2="30" stroke="#1a1200" strokeWidth="2" strokeLinecap="round" />
          <line x1="17" y1="27" x2="23" y2="27" stroke="#1a1200" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className={styles.textHeader}>
        <h2 className={styles.title}>START NEW BUG HUNT</h2>
        <p className={styles.description}>Create a new leaderboard from scratch.</p>
      </div>

      <hr className={styles.divider} aria-hidden="true" />

      <ul className={styles.features}>
        <CheckItem text="Set up teams or participants" />
        <CheckItem text="Track bugs in real time" />
        <CheckItem text="Export your session as JSON" />
      </ul>

      <button
        className={styles.primaryButton}
        onClick={onStartNewSession}
        type="button"
      >
        START NEW SESSION
      </button>
    </div>
  );
}
