/**
 * DashboardMetricCard — small summary card shown in the horizontal dashboard row
 * at the top of the Leaderboard and Setup pages.
 *
 * Displays a labelled metric (e.g. "TOTAL BUGS FOUND"), a prominent value, a
 * helper sub-label, and a coloured icon circle. All content is provided via props
 * so the card is fully generic and reusable for any metric.
 */
import styles from "./DashboardMetricCard.module.css";

type Props = {
  label: string;
  value: string;
  helperText: string;
  icon: React.ReactNode;
  iconBg: string;
  compactLabel?: string;
  compactValue?: string;
};

export function DashboardMetricCard({
  label,
  value,
  helperText,
  icon,
  iconBg,
  compactLabel,
  compactValue,
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.iconCircle} style={{ background: iconBg }}>
        {icon}
      </div>
      <div className={styles.content}>
        <span className={styles.label}>
          <span className={styles.defaultText}>{label}</span>
          <span className={styles.compactText}>{compactLabel ?? label}</span>
        </span>
        <span className={styles.value}>
          <span className={styles.defaultText}>{value}</span>
          <span className={styles.compactText}>{compactValue ?? value}</span>
        </span>
        <span className={styles.helper}>{helperText}</span>
      </div>
    </div>
  );
}
