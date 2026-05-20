/**
 * ranking.ts — leaderboard ranking logic.
 *
 * Dense ranking algorithm:
 *   Scores are sorted descending. The rank assigned to each score is
 *   (1 + number of distinct score levels above it). This produces:
 *     scores [8,8,4,3,3,2] → ranks [1,1,2,3,3,4]   (no gaps)
 *   Standard competition ranking would produce [1,1,3,4,4,6] (with gaps) which
 *   the product owner explicitly rejected — see session history.
 *
 * Tie-breaking:
 *   Entries with equal scores are ordered by sortOrder ascending (insertion order),
 *   so the display order is stable and predictable within a rank.
 */
import type { BugHuntSession, BugHuntMode, VisibilityMode } from "../types/session";
import i18n from "../i18n";

/** A participant or team enriched with its computed rank. */
export type RankedEntry = {
  id: string;
  name: string;
  bugsFound: number;
  sortOrder: number;
  rank: number;
  memberNames?: string[];
};

/** Result type for getCurrentLeaderSummary. */
export type LeaderSummary = {
  label: string;
  helperText: string;
  isMultiple: boolean;
};

/**
 * Returns all participants or teams sorted by score descending, with dense ranks assigned.
 * Team entries include the resolved member names for display on the leaderboard card.
 */
export function getRankedEntries(session: BugHuntSession): RankedEntry[] {
  const raw: Omit<RankedEntry, "rank">[] =
    session.mode === "team"
      ? session.teams.map((t) => ({
          id: t.id,
          name: t.name,
          bugsFound: t.bugsFound,
          sortOrder: t.sortOrder ?? 0,
          memberNames: t.memberIds
            .map((mid) => session.participants.find((p) => p.id === mid)?.name ?? "")
            .filter(Boolean),
        }))
      : session.participants.map((p) => ({
          id: p.id,
          name: p.name,
          bugsFound: p.bugsFound,
          sortOrder: p.sortOrder ?? 0,
        }));

  const sorted = [...raw].sort(
    (a, b) => b.bugsFound - a.bugsFound || a.sortOrder - b.sortOrder
  );

  // Build rank lookup: each unique score level → its dense rank (1-indexed)
  const distinctScores = [...new Set(sorted.map((e) => e.bugsFound))].sort((a, b) => b - a);
  const rankByScore = new Map(distinctScores.map((score, i) => [score, i + 1]));

  return sorted.map((entry) => ({
    ...entry,
    rank: rankByScore.get(entry.bugsFound)!,
  }));
}

/** Returns the highest bug count in the ranked list, or 0 if the list is empty. */
export function getMaxBugs(entries: RankedEntry[]): number {
  return entries.reduce((max, e) => Math.max(max, e.bugsFound), 0);
}

/** Returns true when an entry should be fully visible given the current visibility mode. */
export function isEntryVisible(rank: number, mode: VisibilityMode): boolean {
  if (mode === "all") return true;
  if (mode === "top3") return rank <= 3;
  if (mode === "top10") return rank <= 10;
  return true;
}

/** Human-readable label for the current visibility mode setting. */
export function getVisibilityLabel(mode: VisibilityMode): string {
  if (mode === "top3") return i18n.t("leaderboard.visibility.top3");
  if (mode === "top10") return i18n.t("leaderboard.visibility.top10");
  return i18n.t("leaderboard.visibility.all");
}

/** Returns the metric card labels appropriate for the current competition mode. */
export function getEntryLabel(mode: BugHuntMode): { count: string; helper: string } {
  return mode === "team"
    ? { count: i18n.t("setup.review.teams_label"), helper: i18n.t("setup.review.teams_label") }
    : { count: i18n.t("setup.review.participants_label"), helper: i18n.t("setup.review.participants_label") };
}

/**
 * Computes the "Current Leader" metric card summary.
 *   - No bugs found yet → placeholder dash
 *   - Single leader     → leader's name + bug count
 *   - Tied leaders      → "Multiple Leaders" + tie details
 */
export function getCurrentLeaderSummary(ranked: RankedEntry[]): LeaderSummary {
  const leaders = ranked.filter((e) => e.rank === 1 && e.bugsFound > 0);

  if (leaders.length === 0) {
    return { label: "—", helperText: i18n.t("leaderboard.empty"), isMultiple: false };
  }

  if (leaders.length === 1) {
    const l = leaders[0];
    return {
      label: l.name,
      helperText: i18n.t("leaderboard.bug_count", { count: l.bugsFound }),
      isMultiple: false,
    };
  }

  return {
    label: i18n.t("leaderboard.multiple_leaders"),
    helperText: i18n.t("leaderboard.tie_summary", { count: leaders.length, bugs: leaders[0].bugsFound }),
    isMultiple: true,
  };
}
