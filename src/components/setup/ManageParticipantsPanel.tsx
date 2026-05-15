/**
 * ManageParticipantsPanel — shows the full participant list in a table and lets the
 * facilitator inline-edit names or delete participants.
 *
 * Used in both individual mode (step 2) and team mode (step 3) — the `stepNumber`
 * prop controls the heading label.
 *
 * Edit flow: click the pencil icon → name becomes an input → press Enter or click
 * the tick icon to commit, press Escape or blur to cancel.
 *
 * Deleting a participant also removes them from all team memberIds lists
 * (handled in sessionStore.deleteParticipant).
 */
import { useState } from "react";
import type { Participant } from "../../types/session";
import styles from "./ManageParticipantsPanel.module.css";

type Props = {
  participants: Participant[];
  onUpdateName: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  stepNumber?: number;
};

type EditState = { id: string; name: string } | null;

export function ManageParticipantsPanel({ participants, onUpdateName, onDelete, stepNumber = 2 }: Props) {
  const [editing, setEditing] = useState<EditState>(null);

  const startEdit = (p: Participant) => setEditing({ id: p.id, name: p.name });

  const commitEdit = () => {
    if (editing && editing.name.trim()) {
      onUpdateName(editing.id, editing.name.trim());
    }
    setEditing(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditing(null);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>{stepNumber}. MANAGE PARTICIPANTS ({participants.length})</h3>
      </div>
      <p className={styles.helper}>
        Review, edit, or remove participants. This is the list that will be used for the leaderboard.
      </p>

      {participants.length === 0 ? (
        <p className={styles.empty}>No participants added yet.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colNum}>#</th>
                <th className={styles.colName}>PARTICIPANT</th>
                <th className={styles.colActions}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <tr key={p.id} className={styles.row}>
                  <td className={styles.num}>{i + 1}</td>
                  <td className={styles.nameCell}>
                    {editing?.id === p.id ? (
                      <input
                        className={styles.nameInput}
                        value={editing.name}
                        autoFocus
                        onChange={(e) => setEditing({ id: p.id, name: e.target.value })}
                        onBlur={commitEdit}
                        onKeyDown={handleKeyDown}
                        aria-label={`Edit name for participant ${i + 1}`}
                      />
                    ) : (
                      <span className={styles.nameText}>{p.name}</span>
                    )}
                  </td>
                  <td className={styles.actions}>
                    {editing?.id === p.id ? (
                      <button className={styles.saveBtn} onClick={commitEdit} type="button" title="Save">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <polyline points="2,8 6,13 14,3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ) : (
                      <button className={styles.editBtn} onClick={() => startEdit(p)} type="button" title={`Edit ${p.name}`}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 2l3 3-8 8H3v-3L11 2z" />
                        </svg>
                      </button>
                    )}
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDelete(p.id)}
                      type="button"
                      title={`Remove ${p.name}`}
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                        <polyline points="2,4 14,4" strokeLinecap="round" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5" />
                        <rect x="3" y="4" width="10" height="10" rx="1" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
