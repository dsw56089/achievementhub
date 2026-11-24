import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAchievements } from "../../context/AchievementsContext";

export default function AchievementCreatorActions({ achievementId }) {
  const navigate = useNavigate();
  const { deleteAchievement } = useAchievements();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleDelete = () => {
    deleteAchievement(achievementId);
    setConfirmingDelete(false);
  };

  return (
    <div style={styles.actionsWrapper}>
      <button
        type="button"
        onClick={() => navigate(`/edytuj/${achievementId}`)}
        style={styles.editBtn}
      >
        Edytuj
      </button>

      {!confirmingDelete ? (
        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          style={styles.deleteBtn}
        >
          Usuń
        </button>
      ) : (
        <div style={styles.confirmBox}>
          <span style={styles.confirmText}>Usunąć?</span>
          <button type="button" onClick={handleDelete} style={styles.confirmYes}>
            Tak
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            style={styles.confirmNo}
          >
            Nie
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  actionsWrapper: { display: "flex", alignItems: "center", gap: "8px" },
  editBtn: {
    padding: "5px 10px",
    borderRadius: "5px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  deleteBtn: {
    padding: "5px 10px",
    borderRadius: "5px",
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  confirmBox: { display: "flex", alignItems: "center", gap: "4px" },
  confirmText: { fontSize: "0.82rem", color: "#dc2626", fontWeight: 600 },
  confirmYes: {
    padding: "4px 8px",
    borderRadius: "4px",
    border: "none",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  confirmNo: {
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
};
