/**
 * teamSplit.ts — randomised team distribution algorithm.
 *
 * splitIntoTeams: shuffles the participant ID array using Fisher-Yates, then
 * distributes IDs round-robin across `numTeams` buckets. This ensures teams are
 * as evenly sized as possible (sizes differ by at most 1) and the distribution
 * is random each call.
 *
 * The shuffle is intentionally not seeded, so each AUTO-SHUFFLE produces a
 * different grouping — that is the expected UX behaviour.
 */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Distributes participantIds randomly into numTeams groups.
 * Returns an array of arrays (one inner array per team).
 */
export function splitIntoTeams(participantIds: string[], numTeams: number): string[][] {
  const shuffled = shuffle(participantIds);
  const groups: string[][] = Array.from({ length: numTeams }, () => []);
  shuffled.forEach((id, i) => groups[i % numTeams].push(id));
  return groups;
}
