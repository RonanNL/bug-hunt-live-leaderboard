/**
 * teams.ts — utilities for team membership queries.
 *
 * getUnassignedParticipantIds: returns participant IDs that do not appear in
 * any team's memberIds list. Used by the Setup page to show which participants
 * still need to be placed into a team.
 */
import type { Team } from "../types/session";

/** Returns IDs of participants not yet assigned to any team. */
export function getUnassignedParticipantIds(
  participantIds: string[],
  teams: Team[]
): string[] {
  const assigned = new Set(teams.flatMap((t) => t.memberIds));
  return participantIds.filter((id) => !assigned.has(id));
}
