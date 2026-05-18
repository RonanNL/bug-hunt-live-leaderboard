/**
 * TeamEditCard — an editable card representing a single team in the Manage Teams panel.
 *
 * Features:
 *   - Inline team name editing (click pencil → input → commit on Enter/blur)
 *   - Delete team button (trash icon in header)
 *   - Member list with drag handles and per-member remove (×) button
 *   - "Add participant" dropdown for assigning unassigned participants
 *   - Drop target for drag-and-drop moves between team cards
 *   - "SAVE TEAM" button (commits the current name if still in edit mode)
 *
 * Drag-and-drop:
 *   onDragStartMember — called when a member chip starts being dragged
 *   onDropMember      — called when a dragged participant is dropped onto this card;
 *                       ManageTeamsPanel coordinates which participant is being dragged
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Team, Participant } from "../../types/session";
import styles from "./TeamEditCard.module.css";

type Props = {
  team: Team;
  allParticipants: Participant[];
  onRename: (name: string) => void;
  onRemoveMember: (participantId: string) => void;
  onAddMember: (participantId: string) => void;
  onDelete: () => void;
  onDragStartMember: (participantId: string, fromTeamId: string) => void;
  onDropMember: (toTeamId: string) => void;
};

export function TeamEditCard({
  team,
  allParticipants,
  onRename,
  onRemoveMember,
  onAddMember,
  onDelete,
  onDragStartMember,
  onDropMember,
}: Props) {
  const { t } = useTranslation();
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(team.name);
  const [isDragOver, setIsDragOver] = useState(false);

  const members = team.memberIds
    .map((id) => allParticipants.find((p) => p.id === id))
    .filter(Boolean) as Participant[];

  const available = allParticipants.filter((p) => !team.memberIds.includes(p.id));

  const commitName = () => {
    if (draftName.trim()) onRename(draftName.trim());
    setEditingName(false);
  };

  const startEditName = () => {
    setDraftName(team.name);
    setEditingName(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropMember(team.id);
  };

  return (
    <div
      className={`${styles.card} ${isDragOver ? styles.dragOver : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Team name header */}
      <div className={styles.nameRow}>
        {editingName ? (
          <input
            className={styles.nameInput}
            value={draftName}
            autoFocus
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitName();
              if (e.key === "Escape") setEditingName(false);
            }}
            aria-label={t("setup.teams.edit_team_name_aria")}
          />
        ) : (
          <span className={styles.teamName}>{team.name}</span>
        )}
        <button
          className={styles.editNameBtn}
          onClick={editingName ? commitName : startEditName}
          type="button"
          title={editingName ? t("common.save") : t("setup.teams.edit_team_name_aria")}
        >
          {editingName ? (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <polyline points="2,8 6,13 14,3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 2l3 3-8 8H3v-3L11 2z" />
            </svg>
          )}
        </button>
        <button
          className={styles.deleteTeamBtn}
          onClick={onDelete}
          type="button"
          title={t("setup.teams.delete_team_aria")}
          aria-label={t("setup.teams.delete_team_aria")}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
            <polyline points="2,4 14,4" strokeLinecap="round" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5" />
            <rect x="3" y="4" width="10" height="10" rx="1" />
          </svg>
        </button>
      </div>

      <p className={styles.memberCount}>{t("setup.teams.members")} ({members.length})</p>

      {/* Draggable member chips */}
      <div className={styles.memberList}>
        {members.map((p) => (
          <div
            key={p.id}
            className={styles.memberRow}
            draggable
            onDragStart={() => onDragStartMember(p.id, team.id)}
          >
            <svg className={styles.grip} viewBox="0 0 12 16" fill="none" aria-hidden="true">
              <circle cx="4" cy="4" r="1.2" fill="#9ca3af" />
              <circle cx="8" cy="4" r="1.2" fill="#9ca3af" />
              <circle cx="4" cy="8" r="1.2" fill="#9ca3af" />
              <circle cx="8" cy="8" r="1.2" fill="#9ca3af" />
              <circle cx="4" cy="12" r="1.2" fill="#9ca3af" />
              <circle cx="8" cy="12" r="1.2" fill="#9ca3af" />
            </svg>
            <span className={styles.memberName}>{p.name}</span>
            <button
              className={styles.removeBtn}
              onClick={() => onRemoveMember(p.id)}
              type="button"
              title={t("setup.teams.remove_member_aria")}
              aria-label={t("setup.teams.remove_member_aria")}
            >
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="10" height="10">
                <line x1="2" y1="2" x2="12" y2="12" />
                <line x1="12" y1="2" x2="2" y2="12" />
              </svg>
            </button>
          </div>
        ))}
        {members.length === 0 && (
          <p className={styles.emptyMembers}>{t("setup.participants.empty")}</p>
        )}
      </div>

      {/* Add participant from unassigned pool */}
      <select
        className={styles.addDropdown}
        value=""
        onChange={(e) => {
          if (e.target.value) onAddMember(e.target.value);
        }}
        aria-label={t("setup.teams.add_member_aria")}
        disabled={available.length === 0}
      >
        <option value="">+ {t("setup.teams.add_member")}</option>
        {available.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <button className={styles.saveBtn} onClick={commitName} type="button">
        SAVE TEAM
      </button>
    </div>
  );
}
