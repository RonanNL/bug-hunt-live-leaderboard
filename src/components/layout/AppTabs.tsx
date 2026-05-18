/**
 * AppTabs — horizontal tab bar used on the Leaderboard, Setup and Contact pages.
 *
 * The three tabs map 1-to-1 with AppPage values ("leaderboard" | "setup" | "contact").
 * Clicking a tab fires onChange; the parent page is responsible for the navigation.
 *
 * Accessibility: rendered as a real `role="tablist"` / `role="tab"` group with
 * `aria-selected` so screen readers announce the active tab correctly.
 */
import styles from "./AppTabs.module.css";

export type TabId = "leaderboard" | "setup" | "contact";

type Props = {
  active: TabId;
  onChange: (tab: TabId) => void;
};

const TABS: { id: TabId; label: string }[] = [
  { id: "leaderboard", label: "LEADERBOARD" },
  { id: "setup", label: "SETUP" },
  { id: "contact", label: "SUPPORT" },
];

export function AppTabs({ active, onChange }: Props) {
  return (
    <div className={styles.tabBar} role="tablist" aria-label="Page sections">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          className={`${styles.tab} ${active === tab.id ? styles.active : ""}`}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
