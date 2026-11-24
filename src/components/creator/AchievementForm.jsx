import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAchievements } from "../../context/AchievementsContext";

export default function AchievementForm({ mode = "create" }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { games, myAchievements, addAchievement, updateAchievement } = useAchievements();

  const existingAchievement =
    mode === "edit" ? myAchievements.find((item) => item.id === id) : null;

  const preselectedGameId = searchParams.get("gameId") || "";

  const [formData, setFormData] = useState({
    gameId: preselectedGameId,
    title: "",
    description: "",
    type: "jednorazowe",
    target: 1,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (mode === "edit" && existingAchievement) {
      setFormData({
        gameId: existingAchievement.gameId,
        title: existingAchievement.title,
        description: existingAchievement.description || "",
        type: existingAchievement.type,
        target: existingAchievement.target,
      });
    } else if (mode === "create" && !formData.gameId && games.length > 0) {
      setFormData((prev) => ({
        ...prev,
        gameId: preselectedGameId || games[0].id,
      }));
    }
  }, [mode, existingAchievement, games, preselectedGameId]);

  const validate = (data) => {
    const newErrors = {};

    if (!data.gameId) {
      newErrors.gameId = "Wybierz grę z listy.";
    }

    const trimmedTitle = data.title.trim();
    if (!trimmedTitle) {
      newErrors.title = "Tytuł osiągnięcia jest wymagany.";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Tytuł musi mieć co najmniej 3 znaki.";
    } else if (trimmedTitle.length > 60) {
      newErrors.title = "Tytuł może mieć maksymalnie 60 znaków.";
    }

    if (data.description.trim().length > 250) {
      newErrors.description = "Opis może mieć maksymalnie 250 znaków.";
    }

    if (data.type === "licznik") {
      const numTarget = Number(data.target);
      if (!Number.isInteger(numTarget) || numTarget < 2) {
        newErrors.target = "Dla osiągnięcia licznikowego cel musi być liczbą całkowitą >= 2.";
      } else if (numTarget > 10000) {
        newErrors.target = "Maksymalna wartość celu to 10 000.";
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "type" && value === "jednorazowe") {
        updated.target = 1;
      }
      if (name === "type" && value === "licznik" && Number(prev.target) < 2) {
        updated.target = 10;
      }
      setErrors(validate(updated));
      return updated;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({
      gameId: true,
      title: true,
      description: true,
      type: true,
      target: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (mode === "edit" && existingAchievement) {
      updateAchievement(existingAchievement.id, formData);
    } else {
      addAchievement(formData);
    }

    navigate("/moje");
  };

  if (mode === "edit" && !existingAchievement) {
    return (
      <div style={styles.container}>
        <h2>Nie znaleziono osiągnięcia</h2>
        <p>Osiągnięcie o podanym ID nie istnieje w Twojej kolekcji.</p>
        <button onClick={() => navigate("/moje")} style={styles.secondaryBtn}>
          Wróć do moich osiągnięć
        </button>
      </div>
    );
  }

  const selectedGame = games.find((g) => g.id === formData.gameId);

  return (
    <div style={styles.container}>
      <h1>{mode === "edit" ? "Edytuj osiągnięcie" : "Kreator nowego osiągnięcia"}</h1>
      <p style={styles.subtitle}>
        {mode === "edit"
          ? "Zmień parametry swojego wyzwania. Jeśli obniżysz cel poniżej aktualnego postępu, osiągnięcie zostanie automatycznie zaliczone."
          : "Stwórz własne wyzwanie do wybranej gry i śledź swój postęp."}
      </p>

      <div style={styles.layout}>
        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          {/* Wybór gry */}
          <div style={styles.fieldGroup}>
            <label htmlFor="gameId" style={styles.label}>
              Gra *
            </label>
            <select
              id="gameId"
              name="gameId"
              value={formData.gameId}
              onChange={handleChange}
              onBlur={handleBlur}
              style={styles.input}
            >
              <option value="">-- Wybierz grę --</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
            {touched.gameId && errors.gameId && (
              <span style={styles.errorText}>{errors.gameId}</span>
            )}
          </div>

          {/* Tytuł osiągnięcia */}
          <div style={styles.fieldGroup}>
            <label htmlFor="title" style={styles.label}>
              Tytuł osiągnięcia * ({formData.title.trim().length}/60)
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="np. Mistrz miecza bez zbroi"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              style={styles.input}
            />
            {touched.title && errors.title && (
              <span style={styles.errorText}>{errors.title}</span>
            )}
          </div>

          {/* Opis osiągnięcia */}
          <div style={styles.fieldGroup}>
            <label htmlFor="description" style={styles.label}>
              Opis wyzwania ({formData.description.trim().length}/250)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Opisz dokładne zasady zaliczenia tego osiągnięcia..."
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              style={styles.textarea}
            />
            {touched.description && errors.description && (
              <span style={styles.errorText}>{errors.description}</span>
            )}
          </div>

          {/* Typ osiągnięcia */}
          <div style={styles.fieldGroup}>
            <span style={styles.label}>Typ osiągnięcia *</span>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="type"
                  value="jednorazowe"
                  checked={formData.type === "jednorazowe"}
                  onChange={handleChange}
                />
                Jednorazowe (odhaczenie 0/1)
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="type"
                  value="licznik"
                  checked={formData.type === "licznik"}
                  onChange={handleChange}
                />
                Licznikowe (postęp krok po kroku, np. 0/10)
              </label>
            </div>
          </div>

          {/* Cel liczbowy (tylko dla typu licznikowego) */}
          {formData.type === "licznik" && (
            <div style={styles.fieldGroup}>
              <label htmlFor="target" style={styles.label}>
                Cel do osiągnięcia (target) *
              </label>
              <input
                id="target"
                name="target"
                type="number"
                min={2}
                max={10000}
                value={formData.target}
                onChange={handleChange}
                onBlur={handleBlur}
                style={styles.input}
              />
              {touched.target && errors.target && (
                <span style={styles.errorText}>{errors.target}</span>
              )}
              {mode === "edit" &&
                existingAchievement &&
                Number(formData.target) <= existingAchievement.progress && (
                  <span style={styles.warningText}>
                    Uwaga: Obecny postęp ({existingAchievement.progress}) jest równy lub wyższy niż nowy cel. Po zapisie osiągnięcie zostanie oznaczone jako zdobyte!
                  </span>
                )}
            </div>
          )}

          {/* Przyciski akcji */}
          <div style={styles.buttonRow}>
            <button type="submit" style={styles.primaryBtn}>
              {mode === "edit" ? "Zapisz zmiany" : "Utwórz osiągnięcie"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.secondaryBtn}
            >
              Anuluj
            </button>
          </div>
        </form>

        {/* Podgląd karty na żywo */}
        <aside style={styles.previewBox}>
          <h3 style={{ marginTop: 0 }}>Podgląd karty</h3>
          <div style={styles.previewCard}>
            <span style={styles.badge}>
              {selectedGame ? selectedGame.name : "Nie wybrano gry"}
            </span>
            <h4 style={{ margin: "8px 0 4px" }}>
              {formData.title.trim() || "Tytuł Twojego osiągnięcia"}
            </h4>
            <p style={{ fontSize: "0.9rem", color: "#555", margin: "0 0 12px" }}>
              {formData.description.trim() || "Brak opisu wyzwania."}
            </p>
            <div style={styles.previewMeta}>
              <span>
                Typ: <strong>{formData.type}</strong>
              </span>
              <span>
                Cel:{" "}
                <strong>
                  0 / {formData.type === "jednorazowe" ? 1 : formData.target || "?"}
                </strong>
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "0 auto", padding: "24px 16px" },
  subtitle: { color: "#555", marginBottom: "24px" },
  layout: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "24px",
    alignItems: "start",
  },
  form: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontWeight: 600, fontSize: "0.92rem" },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
  },
  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
    resize: "vertical",
  },
  radioGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  radioLabel: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },
  errorText: { color: "#d93025", fontSize: "0.84rem", fontWeight: 500 },
  warningText: { color: "#b06000", fontSize: "0.84rem", fontWeight: 500 },
  buttonRow: { display: "flex", gap: "12px", marginTop: "8px" },
  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#f3f4f6",
    color: "#1f2937",
    border: "1px solid #d1d5db",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  previewBox: {
    background: "#f8fafc",
    padding: "18px",
    borderRadius: "10px",
    border: "1px dashed #cbd5e1",
  },
  previewCard: {
    background: "#fff",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  badge: {
    display: "inline-block",
    background: "#e0e7ff",
    color: "#1e40af",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "0.78rem",
    fontWeight: 600,
  },
  previewMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    borderTop: "1px solid #eee",
    paddingTop: "8px",
  },
};
