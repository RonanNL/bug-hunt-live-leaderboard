/**
 * ManageTeamsPanel — step 4 of the Setup flow (team mode only).
 *
 * Renders a horizontally scrollable row of TeamEditCard components — one per team.
 * Coordinates drag-and-drop participant moves between cards by tracking which
 * participant is being dragged in local state (DragState), then calling onAddMember
 * on the destination team when a drop event fires.
 *
 * Moving a participant to a new team automatically removes them from their old team
 * via the addMemberToTeam action in sessionStore (which filters the old team's memberIds).
 */
import { useState } from "react";
import type { Team, Participant } from "../../types/session";
import { TeamEditCard } from "./TeamEditCard";
import styles from "./ManageTeamsPanel.module.css";

type Props = {
  teams: Team[];
  allParticipants: Participant[];
  onRenameTeam: (teamId: string, name: string) => void;
  onRemoveMember: (teamId: string, participantId: string) => void;
  onAddMember: (teamId: string, participantId: string) => void;
  onDeleteTeam: (teamId: string) => void;
};

type DragState = { participantId: string; fromTeamId: string } | null;

export function ManageTeamsPanel({
  teams,
  allParticipants,
  onRenameTeam,
  onRemoveMember,
  onAddMember,
  onDeleteTeam,
}: Props) {
  const [drag, setDrag] = useState<DragState>(null);

  const handleDragStart = (participantId: string, fromTeamId: string) => {
    setDrag({ participantId, fromTeamId });
  };

  const handleDrop = (toTeamId: string) => {
    if (!drag) return;
    if (drag.fromTeamId !== toTeamId) {
      onAddMember(toTeamId, drag.participantId);
    }
    setDrag(null);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>4. MANAGE TEAMS ({teams.length})</h3>
          <p className={styles.helper}>
            Review and edit teams. You can change team names and move participants between teams.
          </p>
        </div>
      </div>

      {teams.length === 0 ? (
        <p className={styles.empty}>
          Use "AUTO-SHUFFLE TEAMS" to create teams, or add teams manually.
        </p>
      ) : (
        <>
          <div className={styles.scrollWrapper}>
            <div className={styles.teamsRow}>
              {teams.map((team) => (
                <TeamEditCard
                  key={team.id}
                  team={team}
                  allParticipants={allParticipants}
                  onRename={(name) => onRenameTeam(team.id, name)}
                  onRemoveMember={(pid) => onRemoveMember(team.id, pid)}
                  onAddMember={(pid) => onAddMember(team.id, pid)}
                  onDelete={() => onDeleteTeam(team.id)}
                  onDragStartMember={handleDragStart}
                  onDropMember={handleDrop}
                />
              ))}
            </div>
          </div>

          <div className={styles.dragHint}>
            <svg viewBox="0 0 16 16" fill="none" stroke="#d97706" strokeWidth="1.5" width="14" height="14" aria-hidden="true">
              <circle cx="8" cy="8" r="6" />
              <path strokeLinecap="round" d="M8 7v3M8 5.5v.5" />
            </svg>
            <span>Drag and drop participants to move them between teams.</span>
          </div>
        </>
      )}
    </div>
  );
}
