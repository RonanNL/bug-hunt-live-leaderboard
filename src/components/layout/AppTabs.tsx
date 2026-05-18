/**
 * AppTabs — horizontal tab bar used on the Leaderboard, Setup and Contact pages.
 *
 * The three tabs map 1-to-1 with AppPage values ("leaderboard" | "setup" | "contact").
 * Clicking a tab fires onChange; the parent page is responsible for the navigation.
 *
 * Accessibility: rendered as a real `role="tablist"` / `role="tab"` group with
 * `aria-selected` so screen readers announce the active tab correctly.
 */
import { useTranslation } from "react-i18next";
import styles from "./AppTabs.module.css";

export type TabId = "leaderboard" | "setup" | "contact";

type Props = {
  active: TabId;
  onChange: (tab: TabId) => void;
};

export function AppTabs({ active, onChange }: Props) {
  const { t } = useTranslation();

  const navTabs: { id: TabId; label: string }[] = [
    { id: "leaderboard", label: t("leaderboard.title") },
    { id: "setup", label: t("setup.title") },
    { id: "contact", label: t("contact.title") },
  ];

  return (
    <div className={styles.tabBar} role="tablist" aria-label={t("common.page_sections")}>
      {navTabs.map((tab) => (
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
